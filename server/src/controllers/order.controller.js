const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const orderSchema = require('../models/order.model');
const {orderValidation} = require('../validators/order.validator');
const asyncHandler = require("../helpers/asyncHandler");
const cartSchema = require('../models/cart.model');
const productSchema = require('../models/product.model');
const variantSchema = require('../models/variant.model');
const {DeliveryCharge} = require('../models/delivery.model');
const couponSchema = require('../models/coupon.model');
const crypto = require('crypto');
const invoice = require("../models/invoice.model");
// Create Order
exports.createOrder = asyncHandler(async (req, res) => {
    // Check if cart exists for user or guest
    const result = await orderValidation(req); // Validate request body
    const query = result.user ? {userId: result.user} : {guestId: result.guestId};
    const cart = await cartSchema.findOne(query).populate('items.product').populate('items.variant');
    if (!cart) {
        throw new customError('Cart not found', 404);
    }
    try {
        // Generate unique order number
        result.orderNumber = `ORD-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        result.orderDate = new Date();
//     Reduce stock for each product in line items
        for (const item of cart.items) {
            const product = await productSchema.findById(item.product);
            if (!product) {
                throw new customError(`Product with ID ${item.productId} not found`, 404);
            }
            if (item.variant) {
                const variant = await variantSchema.findById(item.variant);
                if (!variant) {
                    throw new customError(`Variant with ID ${item.variant} not found`, 404);
                }
                if (variant.stock < item.quantity) {
                    throw new customError(`Insufficient stock for variant ${variant.slug}`, 400);
                }
                variant.stock -= item.quantity;
                variant.totalSales += item.quantity;
                // Update isBestSelling flag
                if (variant.totalSales >= 100) { // Example threshold for best-selling
                    variant.isBestSelling = true;
                }
                await variant.save();
            } else {
                if (product.stock < item.quantity) {
                    throw new customError(`Insufficient stock for product ${product.name}`, 400);
                }
                product.stock -= item.quantity;
                product.totalSales += item.quantity;
                // Update isBestSelling flag
                if (product.totalSales >= 100) { // Example threshold for best selling
                    product.isBestSelling = true;
                }
                await product.save();
            }
        }
        let discountAmount = 0;
        if (result.coupon) {
            const couponObj = await couponSchema.findOne({code: result.coupon, isActive: true});
            // check coupon validity
            if (couponObj) {
                const now = new Date();
                if (couponObj.startDate && couponObj.startDate > now) {
                    throw new customError('Coupon is not valid yet', 400);
                }
                if (couponObj.endDate && couponObj.endDate < now) {
                    throw new customError('Coupon has expired', 400);
                }
                // Check minimum purchase amount
                if (couponObj.minPurchaseAmount && cart.totalPrice < couponObj.minPurchaseAmount) {
                    throw new customError(`Minimum purchase amount for this coupon is ${couponObj.minPurchaseAmount}`, 400);
                }
                // Check usage limits
                if (couponObj.usageLimitTotal && couponObj.totalUsed >= couponObj.usageLimitTotal) {
                    throw new customError('Coupon usage limit has been reached', 400);
                }
                if ((result.user || result.guestId) && couponObj.usageLimitPerUser && couponObj.usersUsed.includes(result.user)) {
                    throw new customError('You have already used this coupon', 400);
                }
                // Check applicable products, categories, brands
                let isApplicable = false;
                if (couponObj.applicableProducts && couponObj.applicableProducts.length > 0) {
                    for (const item of cart.items) {
                        if (couponObj.applicableProducts.includes(item.product)) {
                            isApplicable = true;
                            break;
                        }
                    }
                } else if (couponObj.applicableCategories && couponObj.applicableCategories.length > 0) {
                    for (const item of cart.items) {
                        const product = await productSchema.findById(item.product);
                        if (product && couponObj.applicableCategories.includes(product.category)) {
                            isApplicable = true;
                            break;
                        }
                    }
                } else if (couponObj.applicableSubCategories && couponObj.applicableSubCategories.length > 0) {
                    for (const item of cart.items) {
                        const product = await productSchema.findById(item.product);
                        if (product && couponObj.applicableSubCategories.includes(product.subCategory)) {
                            isApplicable = true;
                            break;
                        }
                    }
                } else if (couponObj.applicableBrands && couponObj.applicableBrands.length > 0) {
                    for (const item of cart.items) {
                        const product = await productSchema.findById(item.product);
                        if (product && couponObj.applicableBrands.includes(product.brand)) {
                            isApplicable = true;
                            break;
                        }
                    }
                } else {
                    isApplicable = true; // If no specific products, it's applicable to all
                }
                if (!isApplicable) {
                    throw new customError('Coupon is not applicable to the products in your cart', 400);
                }
                // check max usage limit
                if (couponObj.usageLimitTotal && couponObj.totalUsed >= couponObj.usageLimitTotal) {
                    throw new customError('Coupon max usage limit has been reached', 400);
                }
                // check total applicable discount

                if (couponObj.discountType === 'PERCENTAGE') {
                    discountAmount = (cart.totalPrice * couponObj.discountValue) / 100;
                    if (couponObj.maxDiscountAmount && discountAmount > couponObj.maxDiscountAmount) {
                        discountAmount = couponObj.maxDiscountAmount;
                    }
                } else if (couponObj.discountType === 'FIXED') {
                    discountAmount = couponObj.discountValue;
                }
                if (discountAmount > cart.totalPrice) {
                    discountAmount = cart.totalPrice;
                }
                result.coupon = couponObj._id;
                result.discountAmount = discountAmount;
                //     now update coupon usage
                couponObj.totalUsed += 1;
                if (result.user) {
                    couponObj.usersUsed.push(result.user);
                }
                await couponObj.save();
            } else {
                throw new customError('Invalid coupon code', 400);
            }
        }
        if (result.paymentMethod === 'COD') {
            result.paymentStatus = 'PENDING';
            //     Check product delivery charge
            if (!result.deliveryCharge) {
                throw new customError('Delivery Zone is required', 400);
            }
            const deliveryCharge = await DeliveryCharge.findById(result.deliveryCharge);
            if (!deliveryCharge) {
                throw new customError('Delivery Charge not found', 404);
            }
            result.shippingAmount = deliveryCharge.amount;
            result.finalAmount = cart.totalPrice - discountAmount + deliveryCharge.amount;
            //     Now save the order
            result.lineItems = cart.items.map(item => ({
                product: item.product,
                variant: item.variant || null,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.total * item.quantity,
                taxAmount: 0, // Assuming no tax for simplicity
                discountAmount: item.discount || 0,
                sku: item.sku || '',
                name: item.name || item.product.name || item.variant.name || '',
                description: item.description || '',
                attributes: item.attributes || {}
            }))
            result.totalAmount = cart.totalPrice;
            result.totalQuantity = cart.totalQuantity;
            result.taxAmount = 0; // Assuming no tax for simplicity
            // generate transaction id
            result.transactionId = `TXN-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
            // Now save the order
            const newOrder = new orderSchema.Order(result);
            await newOrder.save();
            // Clear the cart
            await cartSchema.findByIdAndDelete(cart._id);
            // create an invoice
            const newInvoice = new invoice({
                invoiceNumber: `INV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
                orderId: newOrder._id,
                userId: result.user || result.guestId || null,
                billingAddress: result.billingAddress,
                shippingAddress: result.shippingAddress,
                items: newOrder.lineItems.map(item => ({
                    productId: item.product,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.unitPrice,
                    total: item.totalPrice
                })),
                subtotal: newOrder.totalAmount,
                taxAmount: newOrder.taxAmount,
                shippingAmount: newOrder.shippingAmount,
                totalAmount: newOrder.finalAmount,
                currency: newOrder.currency,
                issueDate: new Date(),
                dueDate: null,
                status: result.paymentStatus === 'COMPLETED' ? 'PAID' : 'UNPAID',
                notes: result.notes || ''
            });
            await newInvoice.save();
            return success(res, 'Order created successfully', newOrder, 201);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        //       rollback stock changes if any error occurs
        if (cart && cart.items) {
            for (const item of cart.items) {
                const product = await productSchema.findById(item.product);
                if (product) {
                    if (item.variant) {
                        const variant = await variantSchema.findById(item.variant);
                        if (variant) {
                            variant.stock += item.quantity;
                            variant.totalSales -= item.quantity;
                            // Update isBestSelling flag
                            if (variant.totalSales < 100) { // Example threshold for best-selling
                                variant.isBestSelling = false;
                            }
                            await variant.save();
                        }
                    } else {
                        product.stock += item.quantity;
                        product.totalSales -= item.quantity;
                        // Update isBestSelling flag
                        if (product.totalSales < 100) { // Example threshold for best selling
                            product.isBestSelling = false;
                        }
                        await product.save();
                    }
                }
            }
        }
        throw new customError(error.message || 'Server Error', error.statusCode || 500);
    }
})