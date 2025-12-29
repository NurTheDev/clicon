const customError = require('../utils/customError');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const {variantValidation, updateVariantValidation} = require('../validators/variant.validator');
const {uploadImage, deleteImage} = require('../helpers/claudinary');
const variantSchema = require('../models/variant.model');
const productSchema = require('../models/product.model');
const QRCode = require('qrcode');
const bwipjs = require('bwip-js');
const path = require("path");
const fs = require("fs");
require('dotenv').config();

/**
 * Create a new product variant
 * @route POST /api/v1/variants
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Created variant object
 */
exports.createProduct = asyncHandler(async (req, res) => {
    const result = await variantValidation(req)
    const product = await productSchema.findById(result.product)
    if (!product) throw new customError("Product not found", 404)
    // upload images to cloudinary
    const imageUploadPromises = result.images.map(img => uploadImage(img.path))
    const imageResponses = await Promise.all(imageUploadPromises)
    const images = imageResponses.map(img => ({
        url: img.secure_url,
        public_id: img.public_id
    }))
    // generate QR code
    const qrCodeData = `${process.env.FRONTEND_URL}/product/${product.slug}`
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData)
    // generate barcode
    const barcodeData = `${product._id}-${Date.now()}`
    const pngBuffer = await bwipjs.toBuffer({
        bcid: 'code128',       // Barcode type
        text: barcodeData,    // Text to encode
        scale: 3,             // 3x scaling factor
        height: 10,           // Bar height, in millimeters
        includetext: true,    // Show human-readable text
        textxalign: 'center', // Always good to set this
    });
    const barCodePath = path.join(__dirname, "../../public/temp", `${product._id}.png`)
    fs.writeFileSync(barCodePath, pngBuffer);
    const barcodeUploadResponse = await uploadImage(barCodePath)
    const barcodeUrl = {
        url: barcodeUploadResponse.secure_url,
        public_id: barcodeUploadResponse.public_id
    }
    const variantData = {
        ...result,
        images,
        QRCode: qrCodeUrl,
        barCode: barcodeUrl
    }
    const variant = await variantSchema.create(variantData)
    if (!variant) {
        // delete newly uploaded images from cloudinary in case of failure
        const deletePromises = images.map(img => deleteImage(img.public_id))
        await Promise.all(deletePromises)
        // delete barcode from cloudinary
        await deleteImage(barcodeUrl.public_id)
        throw new customError("Variant creation failed", 400)
    }
    await productSchema.findByIdAndUpdate(result.product, {
        $push: {variant: variant._id}
    })
    success(res, "Variant created successfully", variant, 201)
})

/**
 * Get all variants with pagination, sorting, and filtering
 * @route GET /api/v1/variants
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - List of variants with pagination info
 */
exports.getAllVariants = asyncHandler(async (req, res) => {
    let {page, limit, sortBy, order, ...filters} = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const skip = (page - 1) * limit
    sortBy = sortBy || 'createdAt'
    order = order === 'desc' ? -1 : 1
    // build filter object
    const filterOptions = {}
    for (const key in filters) {
        if (['size', 'color'].includes(key)) {
            filterOptions[key] = {$in: filters[key].split(',')}
        } else if (key === 'price') {
            const [min, max] = filters[key].split(',')
            filterOptions[key] = {$gte: parseFloat(min), $lte: parseFloat(max)}
        } else if (key === 'isActive') {
            filterOptions[key] = filters[key] === 'true'
        } else {
            filterOptions[key] = filters[key]
        }
    }
    const total = await variantSchema.countDocuments(filterOptions)
    const variants = await variantSchema.find(filterOptions).populate("product")
        .sort({[sortBy]: order})
        .skip(skip)
        .limit(limit)
    const totalPages = Math.ceil(total / limit)
    success(res, "Variants retrieved successfully", {
        variants,
        pagination: {
            total,
            page,
            totalPages,
            limit
        }
    }, 200)
})

/**
 * Get a single variant by slug
 * @route GET /api/v1/variants/:slug
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Variant object
 */
exports.getSingleVariant = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const variant = await variantSchema.findOne({slug}).populate("product")
    if (!variant) throw new customError("Variant not found", 404)
    success(res, "Variant retrieved successfully", variant, 200)
})
/**
 * Update a variant by slug
 * @route PUT /api/v1/variants/:slug
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Updated variant object
 */
exports.updateVariant = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const existingVariant = await variantSchema.findOne({slug})
    if (!existingVariant) throw new customError("Variant not found", 404)
    const result = await updateVariantValidation(req)
    const product = await productSchema.findById(result.product)
    if (!product) throw new customError("Product not found", 404)
    // upload new images to cloudinary
    let images = existingVariant.images
    if (result.images && result.images.length > 0) {
        const imageUploadPromises = result.images.map(img => uploadImage(img.path))
        const imageResponses = await Promise.all(imageUploadPromises)
        const newImages = imageResponses.map(img => ({
            url: img.secure_url,
            public_id: img.public_id
        }))
        images = images.concat(newImages)
    }
    const variantData = {
        ...result,
        images
    }
    const updatedVariant = await variantSchema.findOneAndUpdate(existingVariant._id, variantData, {
        new: true,
        runValidators: true
    })
    if (!updatedVariant) {
        // delete newly uploaded images from cloudinary in case of failure
        if (result.images && result.images.length > 0) {
            const deletePromises = images.slice(-result.images.length).map(img => deleteImage(img.public_id))
            await Promise.all(deletePromises)
        }
        throw new customError("Variant update failed", 400)
    }
    success(res, "Variant updated successfully", updatedVariant, 200)
})

/**
 * Delete an image from a variant
 * types {(function(*, *, *): Promise<void>)|*}
 * @route DELETE /api/v1/variants/:slug/images
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Updated variant object
 */
exports.deleteImage = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const {public_id} = req.body
    const existingVariant = await variantSchema.findOne({slug})
    if (!existingVariant) throw new customError("Variant not found", 404)
    if (!public_id) throw new customError("Image public_id is required", 400)
    // delete image from cloudinary
    await deleteImage(public_id)
    // remove image from variant
    existingVariant.images = existingVariant.images.filter(img => img.public_id !== public_id)
    await existingVariant.save()
    success(res, "Image deleted successfully", existingVariant, 200)
})

/**
 * Delete a variant by slug
 * @route DELETE /api/v1/variants/:slug
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Success message
 */

exports.deleteVariant = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const existingVariant = await variantSchema.findOne({slug})
    if (!existingVariant) throw new customError("Variant not found", 404)
    // delete images from cloudinary
    const imageDeletePromises = existingVariant.images.map(img => deleteImage(img.public_id))
    await Promise.all(imageDeletePromises)
    // delete barcode from cloudinary
    if (existingVariant.barCode && existingVariant.barCode.public_id) {
        await deleteImage(existingVariant.barCode.public_id)
    }
    // remove variant from product
    await productSchema.findByIdAndUpdate(existingVariant.product, {
        $pull: {variant: existingVariant._id}
    })
    // delete variant
    await variantSchema.findByIdAndDelete(existingVariant._id)
    success(res, "Variant deleted successfully", null, 200)
})