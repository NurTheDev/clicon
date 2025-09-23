const Joi = require("joi")
const customError = require("../utils/customError")

const variantValidationSchema = Joi.object({
    product: objectId.required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    sku: Joi.string().trim(),
    size: Joi.string().valid("xs", "s", "m", "l", "xl", "xxl"),
    color: Joi.string().valid("red", "blue", "green", "yellow", "black", "white", "gray", "brown", "purple", "orange", "custom"),
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
        throw new customError(error.details.map(e => e.message).join(", "), 400)
    }
}