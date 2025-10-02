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
    // const product
    console.log(result)
})