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

exports.getAllProducts = asyncHandler(async (req, res) => {
    let {page, limit, sortBy, order, search} = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || 'createdAt';
    order = order === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = order;
    const query = {};
    if (search) {
        query.$or = [
            {name: {$regex: search, $options: 'i'}},
            {description: {$regex: search, $options: 'i'}}
        ];
    }
    const products = await ProductSchema.find(query)
        .populate('category', 'name slug')
        .populate('subCategory', 'name slug')
        .populate('brand', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    const total = await ProductSchema.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    success(res, 'Products retrieved successfully', {
        products,
        page,
        totalPages,
        total
    });
})