const Joi = require("joi");
const customError = require("../utils/customError");
const categorySchema = require("../models/category.model");

const subCategoryValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    categoryId: Joi.string().trim().required().messages({
        "any.required": "Category is required",
        "string.empty": "Category is required",
        "string.trim": "Category filled with extra spaces",
    })
}).options({
    abortEarly: true,
    allowUnknown: true
})
const updateSubCategoryValidationSchema = Joi.object({
    name: Joi.string().trim().messages({
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    categoryId: Joi.string().trim().messages({
        "string.empty": "Category is required",
        "string.trim": "Category filled with extra spaces",
    })
}).options({
    abortEarly: true,
    allowUnknown: true
})

exports.subCategoryValidation = async (req) => {
    try {
        const categoryId = req.body.categoryId
        const categoryExits = await categorySchema.findById(categoryId)
        console.log(categoryExits)
        if (!categoryExits) {
            throw new customError("Category not found", 404)
        }
        return await subCategoryValidationSchema.validateAsync(req.body);
    } catch (error) {
        console.error(error);
        throw new customError(error.details[0].message, 400)
    }
}
exports.updateSubCategoryValidation = async (req) => {
    try {
        if (req.body.categoryId) {
            const categoryId = req.body.categoryId
            const categoryExits = await categorySchema.findById(categoryId)
            if (!categoryExits) {
                throw new customError("Category not found", 404)
            }
        }
        return await updateSubCategoryValidationSchema.validateAsync(req.body);
    } catch (error) {
        console.error(error);
    }
}