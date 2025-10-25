const Joi = require('joi');
const customError = require("../utils/customError");

const emailSchema = Joi.string().trim().email().pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)).messages({
    "string.email": "Invalid email address",
    "string.pattern.base": "Invalid email address"
});
const phoneSchema = Joi.string().trim().pattern(new RegExp(/^\+?[0-9]{10,15}$/)).messages({
    "string.pattern.base": "Invalid phone number"
});
const otpSchema = Joi.string().trim().empty().pattern(new RegExp(/^[0-9]{6}$/)).messages({
    "string.pattern.base": "Invalid OTP",
    "string.empty": "OTP is required"
});

// Existing user validation
const userValidation = Joi.object({
    name: Joi.string().trim().empty().messages({
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    }),
    email: emailSchema,
    phone: phoneSchema,
    password: Joi.string().empty().min(8).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
    }),

}).or('email', 'phone').messages({
    'object.missing': "Email or phone number is required",
}).options({
    abortEarly: true,
    allowUnknown: true
});

const emailOTPValidation = Joi.object({
    email: emailSchema,
    otp: otpSchema,
})
const phoneOTPValidation = Joi.object({
    phone: phoneSchema,
    otp: otpSchema,
})
const verifyAccountValidation = Joi.object({
    email: emailSchema,
    otp: otpSchema,
    phone: phoneSchema
}).or('email', 'phone').messages({
    'object.missing': "Email or phone number is required",
})
const passwordResetValidation = Joi.object({
    email: emailSchema.required(),
    otp: otpSchema.required(),
    newPassword: Joi.string().empty().min(8).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
    }),
    confirmPassword: Joi.string().empty().valid(Joi.ref("newPassword")).messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required",
    })
})
const resendOTPValidation = Joi.object({
    email: emailSchema,
    phone: phoneSchema,
}).or('email', 'phone').messages({
    'object.missing': "Email or phone number is required",
})
// Generic validation function
const validate = async (schema, req) => {
    try {
        return await schema.validateAsync(req.body);
    } catch (error) {
        throw new customError(error.details[0].message, 400)
    }
}
exports.userValidation = async (req) => validate(userValidation, req)
exports.emailOTPValidation = async (req) => validate(emailOTPValidation, req)
exports.phoneOTPValidation = async (req) => validate(phoneOTPValidation, req)
exports.passwordResetValidation = async (req) => validate(passwordResetValidation, req)
exports.verifyAccount = async (req) => validate(verifyAccountValidation, req)
exports.resendOTPValidation = async (req) => validate(resendOTPValidation, req)
