const Joi = require('joi');
const customError = require("../utils/customError");

const categoryValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    })
}).options({
    abortEarly: true, allowUnknown: true  // allow unknown fields like image, isActive, slug
})
const updateCategoryValidationSchema = Joi.object({
    name: Joi.string().trim().messages({
        "string.empty": "Name is required", "string.trim": "Name filled with extra spaces",
    })
}).options({
    abortEarly: true, allowUnknown: true  // allow unknown fields like image, isActive, slug
});
exports.categoryValidation = async (req) => {
    try {
        const result = await categoryValidationSchema.validateAsync(req.body)
        // Check if image exists
        if (!req.files || !req.files.image || !req.files.image[0]) {
            throw new customError("Image is required", 400)
        }
        //     Check image type
        const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

        if (!validMimeTypes.includes(req.files.image[0].mimetype)) {
            throw new customError("Image must be a jpeg, jpg, png or webp", 400)
        }
        return {
            ...result, image: req.files.image[0]
        }

    } catch (error) {
        if (error.details) {
            console.log("error from category validator", error.details[0].message)
            throw new customError(error.details[0].message, 400)
        } else {
            console.log("error from category validator", error)
            throw new customError(error, 400)
        }
    }
};

exports.updateCategoryValidation = async (req) => {
    try {
        const result = await updateCategoryValidationSchema.validateAsync(req.body);

        if (req.files && req.files.image && req.files.image[0]) {
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            if (!validMimeTypes.includes(req.files.image[0].mimetype)) {
                throw new customError("Image must be a jpeg, jpg, png or webp", 400)
            }
            return {
                ...result, image: req.files.image[0]
            };
        }
        return result;
    } catch (error) {
        if (error.details) {
            console.log("error from category validator", error.details[0].message)
            throw new customError(error.details[0].message, 400)
        } else {
            throw error;
        }
    }
};