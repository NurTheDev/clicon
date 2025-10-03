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
    // Check if cart already exists for user
    const existingCart = await cartSchema.findOne({
        isActive: true,
        $or: [
            { userId: result.userId },
            { guestId: result.guestId }
        ]
    }).lean();
    if (!existingCart) {
        let price = 0;
        let totalPrice = 0;
        let totalQuantity = 0;
        let product = {}
        if (result.variant) {
            product = await variantSchema.findById(result.variant)
        } else {
            product = await productSchema.findById(result.product)
        }
        if (!product) throw new customError("Product not found", 400);
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
            finalPrice: totalPrice
        }]
        result.totalPrice = totalPrice;
        result.totalQuantity = totalQuantity;
        const cart = new cartSchema(result);
        await cart.save();
        return success(res, 201, "Cart created successfully", cart);
    }
})