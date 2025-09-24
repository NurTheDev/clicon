const customError = require('../utils/customError');
const ProductSchema = require('../models/product.model');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const {variantValidation} = require('../validators/variant.validator');
const {uploadImage, deleteImage} = require('../helpers/claudinary');
const CategorySchema = require('../models/category.model');
const SubCategorySchema = require('../models/subCategory.model');
const BrandSchema = require('../models/brand.model');
const QRCode = require('qrcode');
const bwipjs = require('bwip-js');
require('dotenv').config();

exports.createProduct = asyncHandler(async (req, res)=>{
    const result = await variantValidation(req)
    console.log(result);
})