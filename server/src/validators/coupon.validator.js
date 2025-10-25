const Joi = require("joi");
const customError = require("../utils/customError");
const categorySchema = require("../models/category.model")
const subCategorySchema = require("../models/subCategory.model")
const brandSchema = require("../models/brand.model")
const productSchema = require("../models/product.model")
/**
 * Reusable ObjectId validator (24 hex characters)
 */
const objectId = Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .message("Invalid ID format");

/**
 * Base fields shared between create & update (where applicable)
 */
const baseFields = {
    code: Joi.string().trim().uppercase().required().messages({
        "any.required": "Code is required",
        "string.empty": "Code is required",
        "string.trim": "Code filled with extra spaces",
    }),
    description: Joi.string().trim().allow("", null).messages({
        "string.trim": "Description filled with extra spaces",
    }),
    discountType: Joi.string()
        .valid("percentage", "fixed")
        .required()
        .messages({
            "any.required": "Discount type is required",
            "string.empty": "Discount type is required",
            "any.only": "Discount type must be either percentage or fixed",
        }),
    discountValue: Joi.number().min(0).required().messages({
        "any.required": "Discount value is required",
        "number.base": "Discount value must be a number",
        "number.min": "Discount value cannot be negative",
    }),
    maxDiscountAmount: Joi.when("discountType", {
        is: "percentage", then: Joi.number()
            .min(0)
            .required()
            .messages({
                "any.required": "Max discount amount is required when discount type is percentage",
                "number.min": "Max discount amount cannot be negative",
            }), otherwise: Joi.number()
            .min(0)
            .optional()
            .messages({
                "number.min": "Max discount amount cannot be negative",
            }),
    }),
    minPurchaseAmount: Joi.number().min(0).default(0).messages({
        "number.min": "Minimum purchase amount cannot be negative",
    }),
    startDate: Joi.date().required().messages({
        "any.required": "Start date is required", "date.base": "Start date must be a valid date",
    }),
    endDate: Joi.date().required().messages({
        "any.required": "End date is required", "date.base": "End date must be a valid date",
    }),
    usageLimitPerUser: Joi.number().integer().min(1).default(1).messages({
        "number.base": "Usage limit per user must be a number", "number.min": "Usage limit per user must be at least 1",
    }),
    usageLimitTotal: Joi.number().integer().min(1).messages({
        "number.base": "Total usage limit must be a number", "number.min": "Total usage limit must be at least 1",
    }),
    isActive: Joi.boolean().default(true),
    applicableProducts: Joi.array()
        .items(objectId.messages({"string.pattern.base": "Invalid product ID"}))
        .unique()
        .messages({
            "array.unique": "Duplicate product IDs are not allowed",
        }),
    applicableCategories: Joi.array()
        .items(objectId.messages({
            "string.pattern.base": "Invalid category ID",
        }))
        .unique()
        .messages({
            "array.unique": "Duplicate category IDs are not allowed",
        }),
    applicableSubCategories: Joi.array().items(Joi.string().length(24).hex()),
    applicableBrands: Joi.array().items(Joi.string().length(24).hex()),
    usersUsed: Joi.array()
        .items(objectId.messages({
            "string.pattern.base": "Invalid user ID inside usersUsed",
        }))
        .messages({
            "array.base": "usersUsed must be an array of user IDs",
        }),
    slug: Joi.string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
            "string.pattern.base": "Slug must be lowercase, alphanumeric, and may contain hyphens (no leading/trailing hyphen)",
            "string.trim": "Slug filled with extra spaces",
        }), // totalUsed should generally be controlled internally, but allow optional validation
    totalUsed: Joi.number().integer().min(0).messages({
        "number.base": "Total used must be a number", "number.min": "Total used cannot be negative",
    }),
};

/**
 * Create (POST) schema
 * All required fields enforced
 */
const createCouponValidationSchema = Joi.object(baseFields)
    .custom((value, helpers) => {
        // Ensure endDate > startDate
        if (value.startDate && value.endDate) {
            const start = new Date(value.startDate);
            const end = new Date(value.endDate);
            if (end <= start) {
                return helpers.error("any.invalid", {
                    message: "End date must be after start date",
                });
            }
        }
        //check if applicableProducts, applicableCategories, usersUsed are valid or not
        const isProductValid = value.applicableProducts.every(async (product) => {
            const productData = await productSchema.findById(product)
            if (!productData) {
                return false;
            }
            return true;
        })
        const isCategoryValid = value.applicableCategories.every(async (category) => {
            const categoryData = await categorySchema.findById(category)
            if (!categoryData) {
                return false;
            }
            return true;
        })
        const isBrandValid = value.applicableCategories.every(async (brand) => {
            const brandData = await brandSchema.findById(brand)
            if (!brandData) {
                return false;
            }
            return true;
        })
        isSubCategoryValid = value.applicableCategories.every(async (subCategory) => {
            const subCategoryData = await subCategorySchema.findById(subCategory)
            if (!subCategoryData) {
                return false;
            }
            return true;
        })
        if (!isProductValid) {
            return helpers.error("any.invalid", {
                message: "Invalid product ID",
            });
        }
        if (!isCategoryValid) {
            return helpers.error("any.invalid", {
                message: "Invalid category ID",
            });
        }
        if (!isBrandValid) {
            return helpers.error("any.invalid", {
                message: "Invalid brand ID",
            });
        }
        if (!isSubCategoryValid) {
            return helpers.error("any.invalid", {
                message: "Invalid subCategory ID",
            });
        }
        // If discountType = percentage, discountValue should be 0 < value <= 100
        if (value.discountType === "percentage") {
            if (value.discountValue <= 0 || value.discountValue > 100) {
                return helpers.error("any.invalid", {
                    message: "For percentage discount type, discount value must be between 1 and 100",
                });
            }
        }

        // If discountType = fixed, maxDiscountAmount is irrelevant (may be allowed but not required)
        if (value.discountType === "fixed" && value.maxDiscountAmount !== undefined) {
            // You could choose to strip it:
            // delete value.maxDiscountAmount;
        }

        // usageLimitTotal >= usageLimitPerUser if both provided
        if (value.usageLimitTotal !== undefined && value.usageLimitPerUser !== undefined && value.usageLimitTotal < value.usageLimitPerUser) {
            return helpers.error("any.invalid", {
                message: "Total usage limit must be greater than or equal to usage limit per user",
            });
        }

        return value;
    })
    .messages({
        "any.invalid": "{{#message}}",
    });

/**
 * Update (PATCH) schema
 * All fields optional, but still validated
 */
const updateCouponValidationSchema = Joi.object({
    ...Object.fromEntries(Object.entries(baseFields).map(([k, v]) => [k, v.optional()])),
})
    .min(1)
    .custom((value, helpers) => {
        // Only apply cross-field validations if fields are present
        if (value.startDate && value.endDate) {
            const start = new Date(value.startDate);
            const end = new Date(value.endDate);
            if (end <= start) {
                return helpers.error("any.invalid", {
                    message: "End date must be after start date",
                });
            }
        }

        if (value.discountType === "percentage" && value.discountValue !== undefined) {
            if (value.discountValue <= 0 || value.discountValue > 100) {
                return helpers.error("any.invalid", {
                    message: "For percentage discount type, discount value must be between 1 and 100",
                });
            }
            if (value.maxDiscountAmount === undefined) {
                return helpers.error("any.invalid", {
                    message: "Max discount amount is required when discount type is percentage",
                });
            }
        }

        if (value.usageLimitTotal !== undefined && value.usageLimitPerUser !== undefined && value.usageLimitTotal < value.usageLimitPerUser) {
            return helpers.error("any.invalid", {
                message: "Total usage limit must be greater than or equal to usage limit per user",
            });
        }

        return value;
    })
    .messages({
        "object.min": "At least one field must be provided to update", "any.invalid": "{{#message}}",
    });

/**
 * Helper functions to validate and throw your custom error
 */

function validateCreateCoupon(payload) {
    const {error, value} = createCouponValidationSchema.validate(payload.body, {
        abortEarly: false, stripUnknown: true,
    });
    if (error) {
        throw new customError(error.details.map((d) => d.message).join("; "), 400);
    }
    return value;
}

function validateUpdateCoupon(payload) {
    const {error, value} = updateCouponValidationSchema.validate(payload.body, {
        abortEarly: false, stripUnknown: true,
    });
    if (error) {
        throw customError(error.details.map((d) => d.message).join("; "), 400);
    }
    return value;
}

module.exports = {
    createCouponValidationSchema, updateCouponValidationSchema, validateCreateCoupon, validateUpdateCoupon,
};