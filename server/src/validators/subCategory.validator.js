const Joi = require("joi");
const customError = require("../utils/customError");

const subCategoryValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    })
}).options({
    abortEarly: true,
    allowUnknown: true
})

exports.subCategoryValidation = async (req) => {
    try {
        return await subCategoryValidationSchema.validateAsync(req.body);
    } catch (error) {
        console.error(error);
        throw new customError(error.details[0].message, 400)
    }
}