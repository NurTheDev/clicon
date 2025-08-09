const Joi = require('joi');
const customError = require("../utils/customError");

const userValidation = Joi.object({
    name: Joi.string().trim().empty().messages({
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    email: Joi.string().trim().email().pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)).messages({
        "string.email": "Invalid email address",
        "string.pattern.base": "Invalid email address"
    }),
    phone: Joi.string().trim().pattern(new RegExp(/^\+?[0-9]{10,15}$/)).messages({
        "string.pattern.base": "Invalid phone number"
    }),
    password: Joi.string().required().empty().min(8).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "any.required": "Password is required"
    }),

}).or('email', 'phone').messages({
    'object.missing': "Email or phone number is required",
}).options({
    abortEarly: true,
    allowUnknown: true
});

exports.userValidation = async (req, next) => {
    try{
       return await userValidation.validateAsync(req.body);
    } catch (error){
        throw new customError(error, 400)
    }
}