const customError = require('../utils/customError');
const ProductSchema = require('../models/product.model');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const {productValidation, updateValidation} = require('../validators/product.validator');
const {uploadImage, deleteImage} = require('../helpers/claudinary');
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
const NodeCache = require("node-cache");
const myCache = new NodeCache({stdTTL: 100, checkperiod: 120});

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
    if (!product){
        await deleteImage(thumbnailUrl.public_id);
        for (const img of images) {
            await deleteImage(img.public_id);
        }
        throw new customError('Product creation failed', 400)
    } ;
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
    if (Number.isNaN(page) || page < 1) {
        page = DEFAULT.page
    }
    limit = parseInt(limit, 10)
    if (Number.isNaN(limit) || limit < 1) {
        limit = DEFAULT.limit
    }
    limit = Math.min(limit, DEFAULT.maxLimit)
    if (!sortBy || !ALLOWED_SORT_FIELDS.includes(sortBy)) {
        sortBy = DEFAULT.sortBy
    }
    order = String(order || DEFAULT.order).toLowerCase()
    const sortOrder = order === "desc" ? -1 : 1
    if (search && String(search).length > DEFAULT.maxSearchLength) throw new customError(`Search term is too long. Maximum length is ${DEFAULT.maxSearchLength}`, 400)
    const skip = (page - 1) * limit
    const sortOptions = {[sortBy]: sortOrder}
    const query = {}
    if (search && String(search).trim().length > 0) {
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
/** * @description Update a product by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateProduct = asyncHandler(async (req, res) => {
    const {slug} = req.params;
    const Oldproduct = await ProductSchema.findOne({slug});
    if (!Oldproduct) throw new customError('Product not found', 404);
    const value = await updateValidation(req);
    const product = await ProductSchema.findOneAndUpdate({slug}, value, {new: true});
    if (!product) throw new customError('Product update failed', 400);
    if (value.images && value.images.length > 0) {
        const images = [];
        // delete old images from cloudinary
        if (Oldproduct.images && Oldproduct.images.length > 0) {
            for (const img of Oldproduct.images) {
                await deleteImage(img.public_id);
            }
        }
        // upload new images to cloudinary
        for (const image of value.images) {
            const imageURL = await uploadImage(image.path);
            images.push({
                url: imageURL.secure_url,
                public_id: imageURL.public_id
            })
        }
        product.images = images;
    }
    if (value.thumbnail) {
        const thumbnailUrl = await uploadImage(value.thumbnail.path);
        product.thumbnail = {
            url: thumbnailUrl.secure_url,
            public_id: thumbnailUrl.public_id
        }
    }
    await product.save();
    if (value.category && value.category.toString() !== Oldproduct.category.toString()) {
        await CategorySchema.findByIdAndUpdate(Oldproduct.category, {$pull: {products: Oldproduct._id}});
        await CategorySchema.findByIdAndUpdate(value.category, {$push: {products: product._id}});
    }
    if (value.subCategory && value.subCategory.toString() !== Oldproduct.subCategory.toString()) {
        await SubCategorySchema.findByIdAndUpdate(Oldproduct.subCategory, {$pull: {products: Oldproduct._id}});
        await SubCategorySchema.findByIdAndUpdate(value.subCategory, {$push: {products: product._id}});
    }
    if (value.brand && value.brand.toString() !== Oldproduct.brand.toString()) {
        await BrandSchema.findByIdAndUpdate(Oldproduct.brand, {$pull: {products: Oldproduct._id}});
        await BrandSchema.findByIdAndUpdate(value.brand, {$push: {products: product._id}});
    }

    success(res, 'Product updated successfully', product, 200);
})
/**
 * @description Delete a product by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
    const {slug} = req.params;
    const product = await ProductSchema.findOneAndDelete({slug});
    if (!product) throw new customError('Product not found', 404);
    // remove the product _id from the category , subCategory , brand collection
    await CategorySchema.findByIdAndUpdate(product.category, {$pull: {products: product._id}});
    await SubCategorySchema.findByIdAndUpdate(product.subCategory, {$pull: {products: product._id}});
    await BrandSchema.findByIdAndUpdate(product.brand, {$pull: {products: product._id}});
    success(res, 'Product deleted successfully', null, 200);
})

/**
 * @description Get filtered products by category, subCategory, brand, price range
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getFilteredProducts = asyncHandler(async (req, res) => {
    let {page, limit, sortBy, order, category, subCategory, brand, minPrice, maxPrice, tag} = req.query;
    page = parseInt(page, 10) || 1;
    if (Number.isNaN(page) || page < 1) {
        page = DEFAULT.page
    }
    limit = parseInt(limit, 10)
    if (Number.isNaN(limit) || limit < 1) {
        limit = DEFAULT.limit
    }
    limit = Math.min(limit, DEFAULT.maxLimit)
    if (!sortBy || !ALLOWED_SORT_FIELDS.includes(sortBy)) {
        sortBy = DEFAULT.sortBy
    }
    order = String(order || DEFAULT.order).toLowerCase()
    const sortOrder = order === "desc" ? -1 : 1
    const skip = (page - 1) * limit
    const sortOptions = {[sortBy]: sortOrder}
    const query = {}
    if (category) {
        query.category = category
    }
    if (subCategory) {
        query.subCategory = subCategory
    }
    if (brand) {
        query.brand = brand
    }
    if (tag) {
        const safeTag = escapeRegex(String(tag).trim().toLowerCase())
        query.tags = new RegExp(safeTag, "i")
    }
    if (minPrice && !maxPrice) {
        minPrice = parseFloat(minPrice)
        if (!Number.isNaN(minPrice) && minPrice >= 0) {
            query.price = {$gte: minPrice}
        }
    }
    if (!minPrice && maxPrice) {
        maxPrice = parseFloat(maxPrice)
        if (!Number.isNaN(maxPrice) && maxPrice > 0) {
            query.price = {$lte: maxPrice}
        }
    }
    if (minPrice && maxPrice) {
        minPrice = parseFloat(minPrice)
        maxPrice = parseFloat(maxPrice)
        if (!Number.isNaN(minPrice) && !Number.isNaN(maxPrice) && minPrice >= 0 && maxPrice > 0 && maxPrice >= minPrice) {
            query.price = {$gte: minPrice, $lte: maxPrice}
        }
    }
    const [products, total] = await Promise.all([
        ProductSchema.find(query).populate("category").populate("subCategory").populate("brand").sort(sortOptions).skip(skip).limit(limit).lean(),
        ProductSchema.countDocuments(query)
    ])
    const totalPages = Math.ceil(total / limit)
    const pagination = {total, totalPages, page, limit}
    success(res, "Filtered products fetched successfully", {products, pagination}, 200)
})
/** * @description Get total number of products
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getTotalProducts = asyncHandler(async (req, res) => {
    const cacheKey = 'totalProducts';
    let total = myCache.get(cacheKey);
    if (total === undefined) {
        total = await ProductSchema.countDocuments();
        myCache.set(cacheKey, total);
    }
    success(res, "Total products fetched successfully", {total}, 200);
})
/**
 * @description Get total number of products in a category
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getTotalProductsInCategory = asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    const cacheKey = `totalProductsInCategory_${categoryId}`;
    let total = myCache.get(cacheKey);
    if (total === undefined) {
        total = await ProductSchema.countDocuments({category: categoryId});
        myCache.set(cacheKey, total);
    }
    success(res, "Total products in category fetched successfully", {total}, 200);
})
/**
 * @description Get total number of products in a subCategory
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getTotalProductsInSubCategory = asyncHandler(async (req, res) => {
    const {subCategoryId} = req.params;
    const cacheKey = `totalProductsInSubCategory_${subCategoryId}`;
    let total = myCache.get(cacheKey);
    if (total === undefined) {
        total = await ProductSchema.countDocuments({subCategory: subCategoryId});
        myCache.set(cacheKey, total);
    }
    success(res, "Total products in subCategory fetched successfully", {total}, 200);
})
/**
 * @description Get total number of products in a brand
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getTotalProductsInBrand = asyncHandler(async (req, res) => {
    const {brandId} = req.params;
    const cacheKey = `totalProductsInBrand_${brandId}`;
    let total = myCache.get(cacheKey);
    if (total === undefined) {
        total = await ProductSchema.countDocuments({brand: brandId});
        myCache.set(cacheKey, total);
    }
    success(res, "Total products in brand fetched successfully", {total}, 200);
})
/** * @description Get all products with low stock
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getLowStockProducts = asyncHandler(async (req, res) => {
    const products = await ProductSchema.find({$expr: {$lte: ["$stock", "$alertQuantity"]}}).populate("category").populate("subCategory").populate("brand").lean();
    success(res, "Low stock products fetched successfully", {products}, 200);
})
/**
 * @description Get all products with a specific tag
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getProductsByTag = asyncHandler(async (req, res) => {
    const {tag} = req.params;
    if (!tag || String(tag).trim().length === 0) throw new customError("Tag is required", 400)
    if (String(tag).length > DEFAULT.maxSearchLength) throw new customError(`Tag is too long. Maximum length is ${DEFAULT.maxSearchLength}`, 400)
    const safeTag = escapeRegex(String(tag).trim().toLowerCase())
    const tagRegex = new RegExp(safeTag, "i")
    const products = await ProductSchema.find({tags: tagRegex}).populate("category").populate("subCategory").populate("brand").lean();
    success(res, "Products by tag fetched successfully", {products}, 200);
})
/** * @description Get related products by category and subCategory
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getRelatedProducts = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    const product = await ProductSchema.findById(productId).lean();
    if (!product) throw new customError('Product not found', 404);
    const products = await ProductSchema.find({
        _id: {$ne: product._id},
        $or: [
            {category: product.category},
            {subCategory: product.subCategory}
        ]
    }).limit(10).populate("category").populate("subCategory").populate("brand").lean();
    success(res, "Related products fetched successfully", {products}, 200);
})
/** * @description Get all products that are on discount
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getDiscountedProducts = asyncHandler(async (req, res) => {
    const products = await ProductSchema.find({discount: {$ne: null}}).populate("category").populate("subCategory").populate("brand").lean();
    success(res, "Discounted products fetched successfully", {products}, 200);
})
