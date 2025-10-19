const Joi = require("joi")
const customError = require("../utils/customError")

const userRoleSchema = Joi.object({
    userName: Joi.string().trim().required(),
    role: Joi.string().regex(/^[0-9a-fA-F]{24}$/).trim().messages({
        "string.pattern": "Invalid role id"
    }).required(),
    email: Joi.string().trim().email().pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)).messages({
        "string.email": "Invalid email address",
        "string.pattern.base": "Invalid email address"
    }),
    phone: Joi.string().trim().pattern(new RegExp(/^\+?[0-9]{10,15}$/)).messages({
        "string.pattern.base": "Invalid phone number"
    }),
    password: Joi.string().trim().required().min(8).messages({
        "string.min": "Password must be at least 8 characters",
    }),
    image: Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().trim().required()
    })
}).options({
    abortEarly: false,
    allowUnknown: true,
});
const roleSchema = Joi.object({
    name: Joi.string().trim().required(),
    permissions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).trim().messages({
        "string.pattern": "Invalid permission id"
    })).required(),
    description: Joi.string().trim().allow(''),
    image: Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().trim().required()
    }).required(),
    isActive: Joi.boolean()
}).options({
    abortEarly: false,
    allowUnknown: true,
});

const permissionSchema = Joi.object({
    resource: Joi.string().trim().required(),
    action: Joi.string().valid("create", "update", "delete", "read").required(),
    description: Joi.string().trim().allow(''),
    conditions: Joi.object().pattern(Joi.string(), Joi.any())
}).options({
    abortEarly: false,
    allowUnknown: true,
});
exports.userRoleValidation = async (req) => {
    try {
        const result = await userRoleSchema.validateAsync(req.body)
        if (!req.files || !req.files.image || req.files.image.length <= 0) throw new customError("Image is" +
            " required", 400)
        //     check image mime type
        const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        const hasInvalidImage = req.files.images.some(img => !validMimeTypes.includes(img.mimetype))
        if (hasInvalidImage) throw new customError("Image must be a jpeg, jpg, png or webp", 400)
        return {...result, image: req.files.image[0]}
    } catch (error) {
        throw new customError(error.details.map(e => e.message).join(", "), 400)
    }
}
exports.roleValidation = async (req) => {
    try {
        return await roleSchema.validateAsync(req.body)
    } catch (error) {
        throw new customError(error.details.map(e => e.message).join(", "), 400)
    }
}

exports.permissionValidation = async (req) => {
    try {
        return await permissionSchema.validateAsync(req.body)
    } catch (error) {
        throw new customError(error.details.map(e => e.message).join(", "), 400)
    }
}