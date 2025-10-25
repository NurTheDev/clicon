const Joi = require("joi");
const customError = require("../utils/customError"); // adjust path if needed

/**
 * Reusable 24‑hex ObjectId validator
 */
const objectId = Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .message("Invalid ID format (must be a 24-character hex string)");

/**
 * Address & Contact schemas.
 * Your Mongoose schema just uses generic Objects; we allow extra keys via .unknown(true).
 */
const addressSchema = Joi.object({
    line1: Joi.string().trim().allow("", null),
    line2: Joi.string().trim().allow("", null),
    city: Joi.string().trim().allow("", null),
    state: Joi.string().trim().allow("", null),
    postalCode: Joi.string().trim().allow("", null),
    country: Joi.string().trim().allow("", null)
})
    .unknown(true)
    .min(1)
    .messages({
        "object.min": "Address must have at least one field",
        "object.base": "Address must be an object"
    });

const contactSchema = Joi.object({
    person: Joi.string().trim().allow("", null),
    phone: Joi.string().trim().allow("", null),
    email: Joi.string().trim().email().allow("", null).messages({
        "string.email": "Contact email must be a valid email"
    })
})
    .unknown(true)
    .messages({
        "object.base": "Contact must be an object"
    });

/**
 * Base field definitions (slug removed)
 */
const baseFields = {
    name: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters"
    }),
    location: Joi.string().trim().min(2).max(150).required().messages({
        "any.required": "Location is required",
        "string.empty": "Location is required",
        "string.min": "Location must be at least 2 characters",
        "string.max": "Location cannot exceed 150 characters"
    }),
    isActive: Joi.boolean().default(true),
    products: Joi.array()
        .items(
            objectId.messages({
                "string.pattern.base": "Each product ID must be a valid 24-character hex string"
            })
        )
        .unique()
        .messages({
            "array.unique": "Duplicate product IDs are not allowed",
            "array.base": "Products must be an array"
        }),
    address: addressSchema.required().messages({
        "any.required": "Address is required"
    }),
    contact: contactSchema.optional(),
    notes: Joi.string().trim().max(500).allow("", null).messages({
        "string.max": "Notes cannot exceed 500 characters",
        "string.trim": "Notes contains leading or trailing spaces"
    }),
    alertStock: Joi.number().integer().min(0).default(5).messages({
        "number.base": "alertStock must be a number",
        "number.min": "alertStock cannot be negative",
        "number.integer": "alertStock must be an integer"
    }),
    isDefault: Joi.boolean().default(false)
};

/**
 * Create schema (slug removed)
 */
const createWarehouseSchema = Joi.object({
    name: baseFields.name,
    location: baseFields.location,
    isActive: baseFields.isActive,
    products: baseFields.products.optional(),
    address: baseFields.address,
    contact: baseFields.contact,
    notes: baseFields.notes,
    alertStock: baseFields.alertStock,
    isDefault: baseFields.isDefault
});

/**
 * Update schema (slug removed)
 */
const updateWarehouseSchema = Joi.object({
    name: baseFields.name.optional(),
    location: baseFields.location.optional(),
    isActive: baseFields.isActive.optional(),
    products: baseFields.products.optional(),
    address: baseFields.address.optional(),
    contact: baseFields.contact.optional(),
    notes: baseFields.notes.optional(),
    alertStock: baseFields.alertStock.optional(),
    isDefault: baseFields.isDefault.optional()
})
    .min(1)
    .messages({
        "object.min": "At least one field must be provided to update warehouse"
    });

/**
 * Helper functions
 */
function validateCreateWarehouse(req) {
    const {error, value} = createWarehouseSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true // strips slug if someone sends it
    });
    if (error) {
        throw new customError(error.details.map(d => d.message).join("; "), 400);
    }
    return value;
}

function validateUpdateWarehouse(req) {
    const {error, value} = updateWarehouseSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true // strips slug if included
    });
    if (error) {
        throw new customError(error.details.map(d => d.message).join("; "), 400);
    }
    return value;
}

module.exports = {
    validateCreateWarehouse,
    validateUpdateWarehouse
};