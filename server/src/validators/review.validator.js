const Joi = require("joi");
const customError = require("../utils/customError");
const userSchema = require("../models/user.model");
const productSchema = require("../models/product.model");
/**
 * Simple reusable ObjectId validator (24 hex characters)
 */
const objectId = Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .message("Invalid ID format (must be a 24-character hex string)");

/**
 * Base field validators
 */
const reviewSchema = Joi.object({
        product: objectId.required().messages({
            "any.required": "Product is required",
            "string.empty": "Product is required"
        }),
        user: objectId.required().messages({
            "any.required": "User is required",
            "string.empty": "User is required"
        }),
        rating: Joi.number().integer().min(1).max(5).required().messages({
            "any.required": "Rating is required",
            "number.base": "Rating must be a number",
            "number.min": "Rating must be at least 1",
            "number.max": "Rating must be at most 5",
            "number.integer": "Rating must be an integer"
        }),
        comment: Joi.string().trim().min(3).required().messages({
            "any.required": "Comment is required",
            "string.empty": "Comment is required",
            "string.min": "Comment must be at least 3 characters",
            "string.trim": "Comment contains leading/trailing spaces"
        }),
        isActive: Joi.boolean().default(true),
    }, {
        abortEarly: true,
        allowUnknown: true
    }
);

const updateReviewSchema = reviewSchema.fork(["rating", "comment", "isActive"], schema => schema.optional())

const createReviewValidate = async (req) => {

    try {
        const result = await reviewSchema.validateAsync(req.body);
        // check user and product exists
        const userExists = await userSchema.findById(req.body.user)
        const productExists = await productSchema.findById(req.body.product)
        if (!userExists) {
            throw new customError("User not found", 404)
        }
        if (!productExists) {
            throw new customError("Product not found", 404)
        }
        if (req.files && req.files.images && req.files.images.length > 0) {
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            for (let i = 0; i < req.files.images.length; i++) {
                if (!validMimeTypes.includes(req.files.images[i].mimetype)) {
                    throw new customError("Image must be a jpeg, jpg, png or webp", 400)
                }
            }
            return {
                ...result, images: req.files.images
            }
        } else {
            return result;
        }
    } catch (error) {
        console.error(error);
    }
}
const updateReviewValidate = async (req) => {
    try {
        console.log(req.files)
        const result = await updateReviewSchema.validateAsync(req.body);
        if (req.files && req.files.images && req.files.images.length > 0) {
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            for (let i = 0; i < req.files.images.length; i++) {
                if (!validMimeTypes.includes(req.files.images[i].mimetype)) {
                    throw new customError("Image must be a jpeg, jpg, png or webp", 400)
                }
            }
            return {
                ...result, images: req.files.images
            }
        }
        return result;
    } catch (error) {
        console.error(error);
        throw new customError(error.details[0].message, 400)
    }
}
module.exports = {
    createReviewValidate, updateReviewValidate
}