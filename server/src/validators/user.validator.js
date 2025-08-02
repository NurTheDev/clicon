const Joi = require('joi');
const {customError} = require("../utils/customError");

const registerSchema = Joi.object({
    name: Joi.string().required().trim().empty().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required"
    }),
    email: Joi.string().required().trim().empty().email().pattern().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().trim().empty().min(8).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "any.required": "Password is required"
    }),

})