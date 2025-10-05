const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const cartSchema = require('../models/cart.model');
const {validateCreateCart, validateUpdateCart} = require('../validators/cart.validator');
const asyncHandler = require("../helpers/asyncHandler");
const productSchema = require("../models/product.model");
const variantSchema = require("../models/variant.model");

// Create a new cart
exports.createCart = asyncHandler(async (req, res) => {
    const result = await validateCreateCart(req)
    let discountObject = null;

    // Check if cart already exists for user
    const existingCart = await cartSchema.findOne({
        isActive: true,
        $or: [
            {userId: result.userId},
            {guestId: result.guestId}
        ]
    });

    let product = {}
    if (result.variant) {
        product = await variantSchema.findById(result.variant)
    } else {
        product = await productSchema.findById(result.product).populate("discount")
        discountObject = product.discount || null
        if (!product) throw new customError("Product not found", 400);
    }
    if (!product) throw new customError("Product not found", 400);
    // Check stock availability
    if (product.stock < result.quantity) {
        throw new customError(`Only ${product.stock} items in stock`, 400);
    }

    let price = 0;
    let totalPrice = 0;
    let totalQuantity = 0;
    let discount = 0
    // First calcute the discount if any
    if (discountObject) {
        const now = new Date();
        if (discountObject.startAt <= now && discountObject.endAt >= now) {
            if (discountObject.discountType === "percentage") {
                discount = ((product.salePrice || product.price) * result.quantity) * (discountObject.discountValue / 100);
                console.log(discount)
            } else if (discountObject.discountType === "fixed") {
                discount = discountObject.discountValue * result.quantity;
            }
        }
    }

    if (!existingCart) {
        price = product.salePrice || product.price;
        totalPrice = price * result.quantity;
        totalQuantity = result.quantity;
        result.items = [{
            product: result.product,
            variant: result.variant,
            color: result.color,
            size: result.size,
            quantity: result.quantity,
            price: price,
            total: totalPrice,
            discount: discount,
            finalPrice: totalPrice - discount
        }]
        result.totalPrice = totalPrice;
        result.totalQuantity = totalQuantity;
        const cart = new cartSchema(result);
        await cart.save();
        return success(res, "Cart created successfully", cart, 201);
    }
    if (existingCart) {
        // If cart exists, update the existing cart

        const itemIndex = existingCart.items.findIndex(item => {
            if (item.product.toString() !== result.product) return false;
            if (result.variant) {
                if (!item.variant) return false;
                if (item.variant.toString() !== result.variant.toString()) return false
            }
            if (result.color && item.color !== result.color) return false;
            if (result.size && item.size !== result.size) return false;
            return true;
        })
        price = product.salePrice || product.price;
        totalPrice = price * result.quantity;
        totalQuantity = result.quantity;
        if (itemIndex > -1) {
            // If product exists in cart, update the quantity and total
            existingCart.items[itemIndex].quantity += result.quantity;
            existingCart.items[itemIndex].total += totalPrice;
            existingCart.items[itemIndex].finalPrice += (totalPrice - discount);
        } else {
            // If product does not exist in cart, add new item
            existingCart.items.push({
                product: result.product,
                variant: result.variant,
                color: result.color,
                size: result.size,
                quantity: result.quantity,
                price: price,
                total: totalPrice,
                discount: discount,
                finalPrice: totalPrice - discount,
            });
        }
        // Update cart totals
        existingCart.totalQuantity += totalQuantity;
        existingCart.totalPrice += totalPrice;
        console.log(discount)
        await existingCart.save();
        return success(res, "Cart updated successfully", existingCart, 200);
    }
})