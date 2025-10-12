const Joi = require('joi');
const customError = require("../utils/customError");
const orderLineItemSchema = Joi.object({
    product: Joi.string().required(),
    variant: Joi.string(),
    quantity: Joi.number().min(1).required(),
    unitPrice: Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0).required(),
    taxAmount: Joi.number().min(0).required(),
    discountAmount: Joi.number().min(0),
    sku: Joi.string().trim(),
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
    attributes: Joi.object().pattern(Joi.string(), Joi.string())
});

const addressSchema = Joi.object({
    fullName: Joi.string().trim(),
    addressLine1: Joi.string().trim(),
    addressLine2: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    postalCode: Joi.string().trim(),
    country: Joi.string().trim(),
    phoneNumber: Joi.string().trim().pattern(new RegExp(/^\+?[0-9]{10,15}$/)).messages({
        "string.pattern.base": "Invalid phone number"
    }),
    email: Joi.string().trim().email()
});

const orderSchema = Joi.object({
    orderNumber: Joi.string().trim(),
    user: Joi.string(),
    guestId: Joi.string().trim(),
    status: Joi.string().valid(
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
        'REFUNDED'
    ),
    orderDate: Joi.date(),
    totalAmount: Joi.number().min(0),
    totalQuantity: Joi.number().min(0),
    taxAmount: Joi.number().min(0),
    discountAmount: Joi.number().min(0),
    shippingAmount: Joi.number().min(0),
    finalAmount: Joi.number().min(0),
    currency: Joi.string().trim().default('BDT'),
    lineItems: Joi.array().items(orderLineItemSchema),
    productWeight: Joi.number().min(0),
    productWeightUnit: Joi.string().trim().default('kg'),
    coupon: Joi.string().allow(null),
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    paymentMethod: Joi.string().valid('COD', 'SSL_COMMERZ').required(),
    paymentStatus: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
    transactionId: Joi.string().trim(),
    verificationToken: Joi.string().trim().allow(null),
    paymentDetails: Joi.any(),
    notes: Joi.string().trim(),
    isActive: Joi.boolean().default(true),
    createdBy: Joi.string(),
    updatedBy: Joi.string(),
    meta: Joi.object().pattern(Joi.string(), Joi.string()),
    deliveryInfo: Joi.string(),
    deliveryCharge: Joi.string().required()
});
const orderValidation = async (req) => {
    try {
        const result = await orderSchema.validateAsync(req.body, {abortEarly: true, allowUnknown: true});
        return result;
    } catch (error) {
        console.error(error);
        throw new customError(error.details[0].message, 400)
    }
}

module.exports = {
    orderValidation
};