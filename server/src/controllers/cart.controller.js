const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const cartSchema = require('../models/cart.model');
const {validateCreateCart, validateUpdateCart} = require('../validators/cart.validator');
const asyncHandler = require("../helpers/asyncHandler");
const productSchema = require("../models/product.model");
const variantSchema = require("../models/variant.model");

/**
 * @description Create or update a cart
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
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
            existingCart.items[itemIndex].discount += discount;
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

/**
 * @description Get cart by userId or guestId
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getCart = asyncHandler(async (req, res) => {
    const {userId, guestId} = req.query;
    if (!userId && !guestId) throw new customError("userId or guestId is required", 400);
    const query = {isActive: true};
    if (userId) query.userId = userId;
    if (guestId) query.guestId = guestId;
    const cart = await cartSchema.findOne(query).populate('items.product').populate('items.variant');
    if (!cart) throw new customError("Cart not found", 404);
    return success(res, "Cart fetched successfully", cart, 200);
})

//update cart quntity
/**
 * @description Update cart item quantity
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateCart = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    const quantity = parseInt(req.body.quantity, 10);
    const {productId, variantId} = req.body;
    if(!userId) throw new customError("userId is required", 400);
    if (!productId && !variantId) throw new customError("productId or variantId is required", 400);
    if (isNaN(quantity)) throw new customError("Valid quantity is required", 400);
    const cart = await cartSchema.findById(userId);
    if (!cart) throw new customError("Cart not found", 404);
    const findIndex = cart.items.findIndex(item => item.product.toString() === productId ? productId : true && (variantId ? item.variant && item.variant.toString() === variantId : true));
    if (findIndex === -1) throw new customError("Item not found in cart", 404);
    if (quantity <= 0) {
        // Remove item from cart
        const itemTotal = cart.items[findIndex].finalPrice;
        cart.totalPrice -= itemTotal;
        cart.totalQuantity -= cart.items[findIndex].quantity;
        cart.items.splice(findIndex, 1);
        await cart.save();
        return success(res, "Item removed from cart", cart, 200);
    } else {
        // Update item quantity
        const item = cart.items[findIndex];
        let product = {};
        if(item.variant){
            product = await variantSchema.findById(item.variant);
        } else {
            product = await productSchema.findById(item.product).populate("discount");
        }
        if (!product) throw new customError("Product not found", 404);
        if (product.stock < quantity) throw new customError(`Only ${product.stock} items in stock`, 400);
        const oldFinalPrice = item.finalPrice;
        const oldQuantity = item.quantity;
        item.quantity = quantity;
        item.total = item.price * quantity;
        // Recalculate discount
        let discount = 0;
        let discountObject = null;
        if(product.discount) discountObject = product.discount;
        if (discountObject) {
            const now = new Date();
            if (discountObject.startAt <= now && discountObject.endAt >= now) {
                if (discountObject.discountType === "percentage") {
                    discount = ((product.salePrice || product.price) * quantity) * (discountObject.discountValue / 100);
                } else if (discountObject.discountType === "fixed") {
                    discount = discountObject.discountValue * quantity;
                }
            }
        }
        item.discount = discount;
        item.finalPrice = item.total - discount;
        // Update cart totals
        cart.totalPrice = cart.totalPrice - oldFinalPrice + item.finalPrice;
        cart.totalQuantity = cart.totalQuantity - oldQuantity + quantity;
        await cart.save();
        return success(res, "Cart updated successfully", cart, 200);
    }
})

//increament cart item quantity
/**
 * @description Increment cart item quantity
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.incrementCartItem = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    const {productId, variantId} = req.body;
    if(!userId) throw new customError("userId is required", 400);
    if (!productId && !variantId) throw new customError("productId or variantId is required", 400);
    const cart = await cartSchema.findById(userId);
    if (!cart) throw new customError("Cart not found", 404);
    const findIndex = cart.items.findIndex(item => item.product.toString() === productId ? productId : true && (variantId ? item.variant && item.variant.toString() === variantId : true));
    if (findIndex === -1) throw new customError("Item not found in cart", 404);
    const item = cart.items[findIndex];
    let product = {};
    if(item.variant){
        product = await variantSchema.findById(item.variant);
    } else {
        product = await productSchema.findById(item.product).populate("discount");
    }
    if (!product) throw new customError("Product not found", 404);
    if (product.stock < item.quantity + 1) throw new customError(`Only ${product.stock} items in stock`, 400);
    const oldFinalPrice = item.finalPrice;
    const oldQuantity = item.quantity;
    item.quantity += 1;
    item.total = item.price * item.quantity;
    // Recalculate discount
    let discount = 0;
    let discountObject = null;
    if(product.discount) discountObject = product.discount;
    if (discountObject) {
        const now = new Date();
        if (discountObject.startAt <= now && discountObject.endAt >= now) {
            if (discountObject.discountType === "percentage") {
                discount = ((product.salePrice || product.price) * item.quantity) * (discountObject.discountValue / 100);
            } else if (discountObject.discountType === "fixed") {
                discount = discountObject.discountValue * item.quantity;
            }
        }
    }
    item.discount = discount;
    item.finalPrice = item.total - discount;
    // Update cart totals
    cart.totalPrice = cart.totalPrice - oldFinalPrice + item.finalPrice;
    cart.totalQuantity = cart.totalQuantity - oldQuantity + item.quantity;
    await cart.save();
    return success(res, "Cart item quantity incremented successfully", cart, 200);
})

//decreament cart item quantity
/**
 * @description Decrement cart item quantity
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.decrementCartItem = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    const {productId, variantId} = req.body;
    if(!userId) throw new customError("userId is required", 400);
    if (!productId && !variantId) throw new customError("productId or variantId is required", 400);
    const cart = await cartSchema.findById(userId);
    if (!cart) throw new customError("Cart not found", 404);
    const findIndex = cart.items.findIndex(item => item.product.toString() === productId ? productId : true && (variantId ? item.variant && item.variant.toString() === variantId : true));
    if (findIndex === -1) throw new customError("Item not found in cart", 404);
    const item = cart.items[findIndex];
    if (item.quantity <= 1) {
        // Remove item from cart
        const itemTotal = item.finalPrice;
        cart.totalPrice -= itemTotal;
        cart.totalQuantity -= item.quantity;
        cart.items.splice(findIndex, 1);
        await cart.save();
        return success(res, "Item removed from cart", cart, 200);
    } else {
        let product = {};
        if(item.variant){
            product = await variantSchema.findById(item.variant);
        } else {
            product = await productSchema.findById(item.product).populate("discount");
        }
        if (!product) throw new customError("Product not found", 404);
        const oldFinalPrice = item.finalPrice;
        const oldQuantity = item.quantity;
        item.quantity -= 1;
        item.total = item.price * item.quantity;
        // Recalculate discount
        let discount = 0;
        let discountObject = null;
        if(product.discount) discountObject = product.discount;
        if (discountObject) {
            const now = new Date();
            if (discountObject.startAt <= now && discountObject.endAt >= now) {
                if (discountObject.discountType === "percentage") {
                    discount = ((product.salePrice || product.price) * item.quantity) * (discountObject.discountValue / 100);
                } else if (discountObject.discountType === "fixed") {
                    discount = discountObject.discountValue * item.quantity;
                }
            }
        }
        item.discount = discount;
        item.finalPrice = item.total - discount;
        // Update cart totals
        cart.totalPrice = cart.totalPrice - oldFinalPrice + item.finalPrice;
        cart.totalQuantity = cart.totalQuantity - oldQuantity + item.quantity;
        await cart.save();
        return success(res, "Cart item quantity decremented successfully", cart, 200);
    }
})

//Delete cart Item
/**
 * @description Delete a cart
    * @type {(function(*, *, *): Promise<void>)|*}
    * @param {Object} req - The request object
    * @param {Object} res - The response object
    * @returns {Promise<void>}
    */
exports.deleteCartItem = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    const {productId, variantId} = req.body;
    if (!productId && !variantId) throw new customError("productId or variantId is required", 400);
    const cart = await cartSchema.findById(userId);
    if (!cart) throw new customError("Cart not found", 404);
    const findIndex = cart.items.findIndex(item => item.product.toString() === productId ? productId : true && (variantId ? item.variant && item.variant.toString() === variantId : true));
    if (findIndex === -1) throw new customError("Item not found in cart", 404);
    // Remove item from cart
    const itemTotal = cart.items[findIndex].finalPrice;
    cart.totalPrice -= itemTotal;
    cart.totalQuantity -= cart.items[findIndex].quantity;
    cart.items.splice(findIndex, 1);
    await cart.save();
    if(cart.items.length === 0){
        // If cart is empty, delete the cart
        await cartSchema.findByIdAndDelete(userId);
        return success(res, "Cart is empty now, so cart deleted", null, 200);
    }
    return success(res, "Item removed from cart", cart, 200);

})