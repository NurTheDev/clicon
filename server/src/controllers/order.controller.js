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
const sendSMS = require("../helpers/sendSMS");
const {orderConfirmation} = require("../templet/emailTemplet");
const {sendEmail} = require("../helpers/sendEmail")
require('dotenv').config();
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = process.env.SSL_COMMERZE_STORE_ID;
const store_passwd = process.env.SSL_COMMERZE_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production';
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
        const invoiceCode = `INV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
        const transitionCode = `TRANS-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
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
            result.transactionId = transitionCode;
            // Now save the order
            const newOrder = new orderSchema.Order(result);
            await newOrder.save();
            // Clear the cart
            await cartSchema.findByIdAndDelete(cart._id);
            // create an invoice
            const newInvoice = new invoice({
                invoiceNumber: invoiceCode,
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
            // send order confirmation email
            if (result.user || result.guestId && result.shippingAddress && result.shippingAddress.email) {
                const emailContent = orderConfirmation({
                    orderNumber: newOrder.orderNumber,
                    customerName: result.shippingAddress.fullName,
                    orderDate: newOrder.orderDate,
                    lineItems: newOrder.lineItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        image: item.product.thumbnail?.url
                    })),
                    subtotal: newOrder.totalAmount,
                    shippingAmount: newOrder.shippingAmount,
                    taxAmount: newOrder.taxAmount,
                    totalAmount: newOrder.finalAmount,
                    currency: newOrder.currency,
                    shippingAddress: result.shippingAddress,
                    paymentMethod: result.paymentMethod,
                    estimatedDelivery: 'Within 5-7 business days'
                });
                await sendEmail(result.shippingAddress.email, emailContent, "Order Confirmed Successfully");
            } else if (resul.user || result.guestId && result.shippingAddress && result.shippingAddress.phoneNumber) {
                // send order confirmation sms
                const message = `Dear ${result.shippingAddress.fullName}, your order ${newOrder.orderNumber} has been placed successfully. Total amount: ${newOrder.finalAmount} ${newOrder.currency}. Thank you for shopping with us!`;
                await sendSMS(result.shippingAddress.phoneNumber, message);
            }
            return success(res, 'Order created successfully', newOrder, 201);
        } else if (result.paymentMethod === 'SSL_COMMERZ') {
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
            result.taxAmount = 0;
            result.paymentMethod = 'SSL_COMMERZ';
            // generate transaction id
            result.transactionId = transitionCode;
            // Now save the order
            const newOrder = new orderSchema.Order(result);
            // create an invoice
            const newInvoice = new invoice({
                invoiceNumber: invoiceCode,
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
            const data = {
                total_amount: newOrder.finalAmount,
                currency: newOrder.currency || 'BDT',
                tran_id: transitionCode, // use order id or transaction id from your database
                success_url: `${process.env.SSL_COMMERZE_SUCCESS_URL}${process.env.API_VERSION}/payment/success`,
                fail_url: `${process.env.SSL_COMMERZE_FAIL_URL}${process.env.API_VERSION}/payment/fail`,
                cancel_url: `${process.env.SSL_COMMERZE_CANCEL_URL}${process.env.API_VERSION}/payment/cancel`,
                ipn_url: `${process.env.SSL_COMMERZE_IPN_URL}${process.env.API_VERSION}/payment/ipn`,
                shipping_method: 'NO',
                product_name: newOrder.lineItems.length > 0 ? newOrder.lineItems[0].name : 'Product',
                product_category: 'General',
                product_profile: 'general',
                cus_name: result.shippingAddress ? result.shippingAddress.fullName : 'Customer',
                cus_email: result.shippingAddress ? result.shippingAddress.email : '',
                cus_add1: result.shippingAddress ? result.shippingAddress.addressLine1 : 'Address',
                cus_add2: result.shippingAddress ? result.shippingAddress.addressLine2 : '',
                cus_city: result.shippingAddress ? result.shippingAddress.city : 'City',
                cus_state: result.shippingAddress ? result.shippingAddress.state : 'State',
                cus_postcode: result.shippingAddress ? result.shippingAddress.postalCode : '0000',
                cus_country: result.shippingAddress ? result.shippingAddress.country : 'Country',
                cus_phone: result.shippingAddress ? result.shippingAddress.phoneNumber : '01700000000',
                cus_fax: '',
                ship_name: result.shippingAddress ? result.shippingAddress.fullName : 'Customer',
                ship_add1: result.shippingAddress ? result.shippingAddress.addressLine1 : 'Address',
                ship_add2: result.shippingAddress ? result.shippingAddress.addressLine2 : '',
                ship_city: result.shippingAddress ? result.shippingAddress.city : 'City',
                ship_state: result.shippingAddress ? result.shippingAddress.state : 'State',
                ship_postcode: result.shippingAddress ? result.shippingAddress.postalCode : '0000',
                ship_country: result.shippingAddress ? result.shippingAddress.country : 'Country',
            };
            const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live)
            sslcommerz.init(data).then(async apiResponse => {
                // Redirect the user to payment gateway
                let GatewayPageURL = apiResponse.GatewayPageURL
                console.log(GatewayPageURL, "Redirecting to SSLCommerz");
                if (!GatewayPageURL) throw new customError('SSLCommerz Gateway URL not found', 500);
                await newOrder.save();
                // await cartSchema.findByIdAndDelete(cart._id);
                return success(res, 'Order created successfully', {order: newOrder, redirectURL: GatewayPageURL}, 201);
            }).catch(error => {
                console.error('SSLCommerz Payment Initialization Error:', error);
                throw new customError('SSLCommerz Payment Initialization Failed', 500);
            });
            if (result.user || result.guestId && result.shippingAddress && result.shippingAddress.email) {
                // send order confirmation email
                const emailContent = orderConfirmation({
                    orderNumber: newOrder.orderNumber,
                    customerName: result.shippingAddress.fullName,
                    orderDate: newOrder.orderDate,
                    lineItems: newOrder.lineItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        image: item.product.thumbnail?.url
                    })),
                    subtotal: newOrder.totalAmount,
                    shippingAmount: newOrder.shippingAmount,
                    taxAmount: newOrder.taxAmount,
                    totalAmount: newOrder.finalAmount,
                    currency: newOrder.currency,
                    shippingAddress: result.shippingAddress,
                    paymentMethod: result.paymentMethod,
                    estimatedDelivery: 'Within 5-7 business days'
                });
                await sendEmail(result.shippingAddress.email, emailContent, "Order Confirmed Successfully");
            } else if (result.user || result.guestId && result.shippingAddress && result.shippingAddress.phoneNumber) {
                console.log(true)
                // send order confirmation sms
                const message = `Dear ${result.shippingAddress.fullName}, your order ${newOrder.orderNumber} has been placed successfully. Total amount: ${newOrder.finalAmount} ${newOrder.currency}. Thank you for shopping with us!`;
                await sendSMS(result.shippingAddress.phoneNumber, message);
            }
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