const Joi = require("joi")
const customError = require("../utils/customError")

const brandValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    image: Joi.string().trim().messages({
        "string.empty": "Image is required",
        "string.trim": "Image filled with extra spaces",
    })
}).options({
    abortEarly: true,
    allowUnknown: true
})

const updateBrandValidationSchema = Joi.object({
    name: Joi.string().trim().messages({
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    image: Joi.string().trim().messages({
        "string.empty": "Image is required",
        "string.trim": "Image filled with extra spaces",
    })
}).options({
    abortEarly: true,
    allowUnknown: true
})

exports.brandValidation = async (req) => {
    try {
        const result = brandValidationSchema.validate(req.body)
        //     check if image is exits
        if (!req.files || !req.files.image || !req.files.image[0]) {
            throw new customError("Image is required", 400)
        }
        const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        if (!validMimeTypes.includes(req.files.image[0].mimetype)) {
            throw new customError("Image must be a jpeg, jpg, png or webp", 400)
        }
        return {
            ...result.value, image: req.files.image[0]
        }
    } catch (error) {
        console.error(error);
        if (error.details) {
            console.log("error from brand validator", error.details[0].message)
            throw new customError(error.details[0].message, 400)
        } else {
            console.log("error from brand validator", error)
            throw new customError(error, 400)
        }
    }
}
exports.updateValidation = async (req) => {
    try {
        const result = brandValidationSchema.validate(req.body)
        // Check if image exists and validate it
        if (req.files && req.files.image && req.files.image[0]) {
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            if (!validMimeTypes.includes(req.files.image[0].mimetype)) {
                throw new customError("Image must be a jpeg, jpg, png or webp", 400)
            }
            return {
                ...result.value, image: req.files.image[0]
            };
        }
        return result.value;
    } catch (error) {
        console.error(error);
        if (error.details) {
            console.log("error from brand validator", error.details[0].message)
            throw new customError(error.details[0].message, 400)
        } else {
            console.log("error from brand validator", error)
            throw new customError(error, 400)
        }
    }
}