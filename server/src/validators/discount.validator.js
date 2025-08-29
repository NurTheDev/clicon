const Joi = require("joi")
const customError = require("../utils/customError")
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern": "Invalid object id"
})
const discountValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    startAt: Joi.date().required().messages({
        "any.required": "Start at is required",
        "date.empty": "Start at is required",
        "date.format": "Start at must be a valid date",
    }),
    endAt: Joi.date().required().messages({
        "any.required": "End at is required",
        "date.empty": "End at is required",
        "date.format": "End at must be a valid date",
    }),
    discountFor: Joi.string().trim().required().messages({
        "any.required": "Discount for is required",
        "string.empty": "Discount for is required",
        "string.trim": "Discount for filled with extra spaces",
    }).valid("all", "category", "subCategory", "brand", "product"),
    discountType: Joi.string().trim().required().messages({
        "any.required": "Discount type is required",
        "string.empty": "Discount type is required",
        "string.trim": "Discount type filled with extra spaces",
    }).valid("percentage", "fixed"),
    discountValue: Joi.number().required().messages({
        "any.required": "Discount value is required",
        "number.empty": "Discount value is required",
        "number.min": "Discount value must be at least 1",
    }),
    category: Joi.array().items(objectId),
    subCategory: Joi.array().items(objectId),
    brand: Joi.array().items(objectId),
    product: Joi.array().items(objectId),
}).or("category", "subCategory", "brand", "product").messages({
    "any.required": "Please select at least one of the following: category, subCategory, brand, product"
}).options({
    abortEarly: true,
    allowUnknown: true
})

const updateDiscountValidationSchema = discountValidationSchema.fork(["name", "startAt", "endAt", "discountFor", "discountType", "discountValue", "category", "subCategory", "brand", "product"], schema => schema.optional())

const validateDiscount = async (req) => {
    try {
        return await discountValidationSchema.validate(req.body)
    } catch (error) {
        console.error(error);
        throw new customError(error.details[0].message, 400)
    }
}
const updateDiscountValidation = async (req) => {
    try {
        return await updateDiscountValidationSchema.validate(req.body)
    } catch (error) {
        console.error(error);
        throw new customError(error.details[0].message, 400)
    }
}
module.exports = {
    validateDiscount,
    updateDiscountValidation
}