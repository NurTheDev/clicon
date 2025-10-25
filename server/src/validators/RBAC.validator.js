const Joi = require("joi")
const customError = require("../utils/customError")

const roleSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(''),
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