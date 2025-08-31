const customError = require('../utils/customError');
const ProductSchema = require('../models/product.model');
const asyncHandler = require('../helpers/asyncHandler');
const { success } = require('../utils/apiResponse');
const { productValidation, updateValidation } = require('../validators/product.validator');
const { uploadImage } = require('../helpers/claudinary');

exports.createProduct = asyncHandler(async (req, res) => {
    console.log("from controller",req.body);
    const value = await productValidation(req);
    console.log(value)
})