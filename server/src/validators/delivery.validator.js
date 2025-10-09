const Joi = require('joi');

// Keep it simple: use string for ObjectId-like fields
const objectId = Joi.string();

const deliveryChargeSchema = Joi.object({
    name: Joi.string().trim().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().trim().default('BDT'),
    description: Joi.string().trim(),
    isActive: Joi.boolean().default(true),
    createdBy: objectId,
    updatedBy: objectId
});

const followUpSchema = Joi.object({
    followUpAt: Joi.date(),
    notes: Joi.string().trim(),
    createdBy: objectId
});

const deliverySchema = Joi.object({
    order: objectId.required(),
    courier: objectId.required(),
    trackingNumber: Joi.string().trim().required(),
    status: Joi.string().valid(
        'PENDING',
        'SHIPPED',
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'FAILED_ATTEMPT',
        'RETURNED',
        'CANCELLED'
    ),
    shippedAt: Joi.date(),
    deliveredAt: Joi.date(),
    estimatedDelivery: Joi.date(),
    deliveryAttempts: Joi.number().min(0).default(0),
    lastAttemptAt: Joi.date(),
    recipientSignature: Joi.string().trim(),
    notes: Joi.string().trim(),
    isActive: Joi.boolean().default(true),
    createdBy: objectId,
    updatedBy: objectId,
    meta: Joi.object().pattern(Joi.string(), Joi.string()),
    followUps: Joi.array().items(followUpSchema)
});
const deliveryChargeValidation = async (req) => {
    try {
        return await deliveryChargeSchema.validateAsync(req.body, {abortEarly: true, allowUnknown: true});
    } catch (error) {
        console.error(error);
        throw new Error(error.details[0].message);
    }
}

const deliveryValidation = async (req) => {
    try {
        return await deliverySchema.validateAsync(req.body, {abortEarly: true, allowUnknown: true});
    } catch (error) {
        console.error(error);
        throw new Error(error.details[0].message);
    }
}

module.exports = {
    deliveryChargeValidation, deliveryValidation
};