const Joi = require("joi")
const customError = require("../utils/customError")
const categorySchema = require("../models/category.model")
const subCategorySchema = require("../models/subCategory.model")
const brandSchema = require("../models/brand.model")
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).trim().messages({
    "string.pattern": "Invalid object id"
})

const singleProductValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    brand: objectId,
    category: objectId,
    subCategory: objectId,
    images: Joi.array().items(Joi.string().trim()).min(1),
    thumbnail: Joi.string().trim(),
    description: Joi.string().trim().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    tags: Joi.array().items(Joi.string().trim()).required(),
    variantType: Joi.string().valid("single").trim().required(),
    size: Joi.string().valid("xs", "s", "m", "l", "xl", "xxl"),
    color: Joi.string().valid("red", "blue", "green", "yellow", "black", "white", "gray", "brown", "purple", "orange", "custom"),
    customColor: Joi.string().trim(),
    minimumOrderQuantity: Joi.number().required().default(1),
    groupQuantity: Joi.number().required().default(1),
    unit: Joi.string().valid("piece", "kg", "gram", "litre", "ml", "other"),
    alertQuantity: Joi.number().min(5).required().default(5),
    warranty: Joi.string().trim(),
    shipping: Joi.string().trim(),
    returnPolicy: Joi.string().trim(),
}).options({
    abortEarly: false,
    allowUnknown: true,
});
const updateSingleProductValidationSchema = singleProductValidationSchema.fork([
    "name", "brand", "category", "subCategory", "description", "price", "stock", "tags", "variantType", "size", "color", "customColor", "minimumOrderQuantity", "groupQuantity", "unit", "alertQuantity", "warranty", "shipping", "returnPolicy", "images", "thumbnail"
], schema => schema.optional())
const multiProductValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    brand: objectId.required(),
    category: objectId.required(),
    subCategory: objectId.required(),
    thumbnail: Joi.string().trim(),
    description: Joi.string().trim().required(),
    tags: Joi.array().items(Joi.string().trim()),
    variantType: Joi.string().valid("multiple").required(),
}).options({
    abortEarly: false,
    allowUnknown: true,
});

exports.productValidation = async (req) => {
    try {
        if (req.body.variantType === "single") {
            const result = await singleProductValidationSchema.validateAsync(req.body)
            if (!req.files || !req.files.images || req.files.images.length <= 0) throw new customError("Image is" +
                " required", 400)
            //     check image mime type
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
            const hasInvalidImage = req.files.images.some(img => !validMimeTypes.includes(img.mimetype))
            if (hasInvalidImage) throw new customError("Image must be a jpeg, jpg, png or webp", 400)
            // Check if image exists
            if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
                throw new customError("Image is required", 400)
            }
            if (!validMimeTypes.includes(req.files.thumbnail[0].mimetype)) {
                throw new customError("Thumbnail must be a jpeg, jpg, png or webp", 400)
            }
            // Check given category, subCategory and brand are valid or not
            if (!result.category) throw new customError("Category is required", 400)
            if (!result.subCategory) throw new customError("Sub category is required", 400)
            if (!result.brand) throw new customError("Brand is required", 400)
            const categoryExits = await categorySchema.findById(result.category)
            if (!categoryExits) throw new customError("Category not found", 404)
            const subCategoryExits = await subCategorySchema.findById(result.subCategory)
            if (!subCategoryExits) throw new customError("Sub category not found", 404)
            const brandExits = await brandSchema.findById(result.brand)
            if (!brandExits) throw new customError("Brand not found", 404)
            return {
                ...result, images: req.files.images, thumbnail: req.files.thumbnail[0]
            }
        } else {
            const result = await multiProductValidationSchema.validateAsync(req.body)
            if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
                throw new customError("Thumbnail is required", 400)
            }
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
            if (!validMimeTypes.includes(req.files.thumbnail[0].mimetype)) {
                throw new customError("Thumbnail must be a jpeg, jpg, png or webp", 400)
            }
            // Check given category, subCategory and brand are valid or not
            if (!result.category) throw new customError("Category is required", 400)
            if (!result.subCategory) throw new customError("Sub category is required", 400)
            if (!result.brand) throw new customError("Brand is required", 400)
            const categoryExits = await categorySchema.findById(result.category)
            if (!categoryExits) throw new customError("Category not found", 404)
            const subCategoryExits = await subCategorySchema.findById(result.subCategory)
            if (!subCategoryExits) throw new customError("Sub category not found", 404)
            const brandExits = await brandSchema.findById(result.brand)
            if (!brandExits) throw new customError("Brand not found", 404)
            return {
                ...result, thumbnail: req.files.thumbnail[0]
            }
        }
    } catch (error) {
        console.error(error);
        throw new customError(error.details ? error.details[0].message : error.message, 400)
    }
}
exports.updateValidation = async (req) => {
    try {
        if (req.body.variantType) throw new customError("You can't change variant type", 400)
        const result = await updateSingleProductValidationSchema.validateAsync(req.body)
        if (req.files && req.files.images && req.files.images.length > 0) {
            //     check image mime type
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
            const hasInvalidImage = req.files.images.some(img => !validMimeTypes.includes(img.mimetype))
            if (hasInvalidImage) throw new customError("Image must be a jpeg, jpg, png or webp", 400)
            result.images = req.files.images
        }
        if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
            if (!validMimeTypes.includes(req.files.thumbnail[0].mimetype)) {
                throw new customError("Thumbnail must be a jpeg, jpg, png or webp", 400)
            }
            result.thumbnail = req.files.thumbnail[0]
        }
        // Check given category, subCategory and brand are valid or not
        if (result.category) {
            const categoryExits = await categorySchema.findById(result.category)
            if (!categoryExits) throw new customError("Category not found", 404)
        }
        if (result.subCategory) {
            const subCategoryExits = await subCategorySchema.findById(result.subCategory)
            if (!subCategoryExits) throw new customError("Sub category not found", 404)
        }
        if (result.brand) {
            const brandExits = await brandSchema.findById(result.brand)
            if (!brandExits) throw new customError("Brand not found", 404)
        }
        return result
    } catch (error) {
        console.error(error);
        throw new customError(error.details ? error.details[0].message : error.message, 400)
    }
}