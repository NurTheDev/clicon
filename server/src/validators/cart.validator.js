const Joi = require("joi");
const userSchema = require("../models/user.model");
const productSchema = require("../models/product.model");
const variantSchema = require("../models/variant.model");
// Simple reusable ObjectId (24 hex chars) – light check
const objectId = Joi.string().regex(/^[a-fA-F0-9]{24}$/).message("Invalid ID format");

// --- Item (embedded) ---
const createCartSchema = Joi.object({
    userId: objectId.messages({
        "any.required": "User ID is required"
    }),
    guestId: Joi.string().trim().allow("", null),
    totalQuantity: Joi.number().integer().min(0).default(0),
    totalPrice: Joi.number().min(0).default(0),
    isActive: Joi.boolean().default(true),
    notes: Joi.string().trim().allow("", null),
    createdBy: objectId.optional(),
    updatedBy: objectId.optional(),
    product: objectId.required().messages({
        "any.required": "Product ID is required"
    }),
    variant: objectId.optional(),
    color: Joi.string().trim().allow("", null),
    size: Joi.string().trim().allow("", null),
    quantity: Joi.number().integer().min(1).default(1).messages({
        "number.min": "Quantity must be at least 1",
        "number.integer": "Quantity must be an integer"
    }),
    price: Joi.number().min(0).required().messages({
        "any.required": "Price is required",
        "number.min": "Price cannot be negative"
    }),
    total: Joi.number().min(0).messages({
        "any.required": "Total is required",
        "number.min": "Total cannot be negative"
    }),
    discount: Joi.number().min(0).messages({
        "any.required": "Discount is required",
        "number.min": "Discount cannot be negative"
    }),
    finalPrice: Joi.number().min(0).messages({
        "any.required": "Final price is required",
        "number.min": "Final price cannot be negative"
    })
}).xor("userId", "guestId")
    .messages({
        "object.xor": "Provide either userId or guestId (not both)",
        "object.missing": "Either userId or guestId is required"
    });

// --- Update Cart ---
// All optional; at least one field must be sent.
const updateCartSchema = Joi.object({
    totalQuantity: Joi.number().integer().min(0),
    totalPrice: Joi.number().min(0),
    isActive: Joi.boolean(),
    notes: Joi.string().trim().allow("", null),
    createdBy: objectId.optional(),
    updatedBy: objectId.optional()
}).min(1).messages({
    "object.min": "Provide at least one field to update"
});

async function validateCreateCart(req) {
    // 1. Validate body first
    const { error, value } = createCartSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        throw new Error(error.details.map(d => d.message).join("; "));
    }

    // // 2. If userId present, verify user existence (skip for guest carts)
    // if (value.userId) {
    //     const userExists = await userSchema.exists({ _id: value.userId });
    //     if (!userExists) {
    //         throw new Error("Invalid userId: no such user");
    //     }
    // }
    //
    // // 3. Validate products (batch)
    // if (value.items && value.items.length > 0) {
    //     const productIds = [...new Set(value.items.map(i => i.product))];
    //     const foundProducts = await productSchema.find(
    //         { _id: { $in: productIds } },
    //         { _id: 1 }
    //     ).lean();
    //     if (foundProducts.length !== productIds.length) {
    //         throw new Error("One or more items have invalid product IDs");
    //     }
    //
    //     // 4. Validate variants (only those provided)
    //     const variantIds = [...new Set(value.items.filter(i => i.variant).map(i => i.variant))];
    //     if (variantIds.length > 0) {
    //         const foundVariants = await variantSchema.find(
    //             { _id: { $in: variantIds } },
    //             { _id: 1 }
    //         ).lean();
    //         if (foundVariants.length !== variantIds.length) {
    //             throw new Error("One or more items have invalid variant IDs");
    //         }
    //     }
    // }

    return value;
}

function validateUpdateCart(req) {
    const {error, value} = updateCartSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        throw new Error(error.details.map(d => d.message).join("; "));
    }
    return value;
}

module.exports = {
    validateCreateCart,
    validateUpdateCart
};