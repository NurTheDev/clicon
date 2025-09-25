const Joi = require("joi")
const customError = require("../utils/customError")
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message("Invalid ObjectId");
const productSchema = require("../models/product.model")
const variantSchema = require("../models/variant.model")
const variantValidationSchema = Joi.object({
    product: objectId.required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    sku: Joi.string().trim(),
    size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'),
    color: Joi.string().valid('Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Gray', 'Pink', "custom"),
    customColor: Joi.string().trim(),
    images: Joi.array().items(Joi.object(
        {
            url: Joi.string().trim().uri().required(),
            public_id: Joi.string().trim().required()
        }
    )),
    barCode: Joi.string().trim(),
    QRCode: Joi.string().trim(),
    alertQuantity: Joi.number().min(5),
}).options({
    abortEarly: false,
    allowUnknown: true,
});

exports.variantValidation = async (req) => {
    try {
        const result = await variantValidationSchema.validateAsync(req.body)
        const product = await productSchema.findById(result.product)
        if (!product) throw new customError("Product not found", 404)
        if(product.variantType === "single") throw new customError("Cannot add variant to a single variant product", 400)
        // check if product already has variant with same size and color
        const existingVariant = await variantSchema.findOne({
            product: result.product,
            size: result.size,
            color: result.color === "custom" ? result.customColor : result.color
        })
        if (existingVariant) throw new customError("Variant with same size and color already exists for this product", 400)
        if (!req.files || !req.files.images || req.files.images.length <= 0) throw new customError("Image is" +
            " required", 400)
        //     check image mime type
        const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        const hasInvalidImage = req.files.images.some(img => !validMimeTypes.includes(img.mimetype))
        if (hasInvalidImage) throw new customError("Image must be a jpeg, jpg, png or webp", 400)
        return {
            ...result, images: req.files.images
        }
    } catch (error) {
        if (error && error.details) {
            throw new customError(error.details.map(e => e.message).join(", "), 400)
        }
        throw error
    }
}