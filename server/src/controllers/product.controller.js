const customError = require('../utils/customError');
const ProductSchema = require('../models/product.model');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const {productValidation, updateValidation} = require('../validators/product.validator');
const {uploadImage} = require('../helpers/claudinary');
const CategorySchema = require('../models/category.model');
const SubCategorySchema = require('../models/subCategory.model');
const BrandSchema = require('../models/brand.model');
const QRCode = require('qrcode');
const bwipjs = require('bwip-js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {DEFAULT, ALLOWED_SORT_FIELDS} = require("../constants/constant");
const {escapeRegex} = require("../utils");

/**
 * @description Create a new product
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createProduct = asyncHandler(async (req, res) => {
    const value = await productValidation(req);
    const images = [];
    if (value.images && value.images.length > 0) {
        for (const image of value.images) {
            const imageURL = await uploadImage(image.path);
            images.push({
                url: imageURL.secure_url,
                public_id: imageURL.public_id
            })
        }
    }
    const thumbnailUrl = await uploadImage(value.thumbnail.path);
    const qrCode = await QRCode.toDataURL(process.env.FRONTEND_URL + '/product/' + value.slug);
    if (!qrCode) throw new customError('QRCode generation failed', 500);
    const product = await ProductSchema.create({
        ...value,
        images,
        thumbnail: {
            url: thumbnailUrl.secure_url,
            public_id: thumbnailUrl.public_id
        },
        QRCode: {
            url: qrCode,
            public_id: value.name + qrCode.substring(11, 20) + Date.now()
        }
    });
    if (!product) throw new customError('Product creation failed', 400);
    const barCode = await bwipjs.toBuffer({
        bcid: 'code128',       // Barcode type
        text: product._id.toString(),    // Text to encode
        scale: 3,               // 3x scaling factor
        height: 10,             // Bar height, in millimeters
        includetext: true,      // Show human-readable text
        textxalign: 'center',   // Always good to set this
    });
    if (!barCode) throw new customError('BarCode generation failed', 500);
    // save the barCode to the product
    // first convert the barCode to png
    const barCodePath = path.join(__dirname, "../../public/temp", `${product._id}.png`);
    fs.writeFileSync(barCodePath, barCode);
    // upload the barCode to cloudinary
    const barCodeURL = await uploadImage(barCodePath);
    if (!barCodeURL) throw new customError('BarCode upload failed', 500);
    product.barCode = {
        url: barCodeURL.secure_url,
        public_id: value.name + barCodeURL.public_id + Date.now()
    };
    await product.save();
    // now add the prodect _id to the category , subCategory , brand collection
    await CategorySchema.findByIdAndUpdate(value.category, {$push: {products: product._id}});
    await SubCategorySchema.findByIdAndUpdate(value.subCategory, {$push: {products: product._id}});
    await BrandSchema.findByIdAndUpdate(value.brand, {$push: {products: product._id}});
    success(res, 'Product created successfully', product, 201);
})
/**
 * @description Get all products with pagination, sorting and searching
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllProducts = asyncHandler(async (req, res) => {
    let {page, limit, sortBy, order, search} = req.query;
    page = parseInt(page, 10) || 1;
    if(Number.isNaN(page) || page < 1) {
        page = DEFAULT.page
    }
    limit = parseInt(limit, 10)
    if(Number.isNaN(limit) || limit < 1) {
        limit = DEFAULT.limit
    }
    limit = Math.min(limit, DEFAULT.maxLimit)
    if(!sortBy || !ALLOWED_SORT_FIELDS.includes(sortBy)){
        sortBy = DEFAULT.sortBy
    }
    order = String(order || DEFAULT.order).toLowerCase()
    const sortOrder = order === "desc"? -1 : 1
    if(search && String(search).length > DEFAULT.maxSearchLength) throw new customError(`Search term is too long. Maximum length is ${DEFAULT.maxSearchLength}`, 400)
    const skip = (page - 1) * limit
    const sortOptions = {[sortBy]: sortOrder}
    const query = {}
    if(search && String(search).trim().length > 0) {
        const safeSearch = escapeRegex(String(search).trim().toLowerCase())
        const searchRegex = new RegExp(safeSearch, "i")
        query.$or = [
            {name: searchRegex},
            {description: searchRegex},
            {tags: searchRegex}
        ]
    }
    const [products, total] = await Promise.all([
        ProductSchema.find(query).populate("category").populate("subCategory").populate("brand").sort(sortOptions).skip(skip).limit(limit).lean(),
        ProductSchema.countDocuments(query)
    ])
    const totalPages = Math.ceil(total / limit)
    const pagination = {total, totalPages, page, limit}
    success(res, "Products fetched successfully", {products, pagination}, 200)
})
/**
 * @description Get a single product by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getSingleProduct = asyncHandler(async (req, res) => {
    const {slug} = req.params;
    const product = await ProductSchema.findOne({slug}).populate("category").populate("subCategory").populate("brand").lean();
    if (!product) throw new customError('Product not found', 404);
    success(res, 'Product fetched successfully', product, 200);
})