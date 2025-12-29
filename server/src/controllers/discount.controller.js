const {validateDiscount, updateDiscountValidation} = require("../validators/discount.validator")
const customError = require("../utils/customError")
const Discount = require("../models/discount.model")
const asyncHandler = require("../helpers/asyncHandler")
const {success} = require("../utils/apiResponse")
const categorySchema = require("../models/category.model")
const subCategorySchema = require("../models/subCategory.model")
const brandSchema = require("../models/brand.model")
const productSchema = require("../models/product.model")
/**
 * @description Create a new discount
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createDiscount = asyncHandler(async (req, res) => {
    const {
        name,
        startAt,
        endAt,
        discountFor,
        discountType,
        discountValue,
        category,
        subCategory,
        brand,
        product
    } = await validateDiscount(req)
    const discount = await Discount.create({
        name,
        startAt,
        endAt,
        discountFor,
        discountType,
        discountValue,
        category,
        subCategory,
        brand,
        product
    })
    if (!discount) throw new customError("Discount creation failed", 400)
    const modelMap = {
        category: {model: categorySchema, ids: category},
        subCategory: {model: subCategorySchema, ids: subCategory},
        brand: {model: brandSchema, ids: brand},
        product: {model: productSchema, ids: product},
    }

    async function updateRelatedModels(discountFor, discountId) {
        const entry = modelMap[discountFor];
        if (!entry) return;
        const {model, ids} = entry;
        if (!Array.isArray(ids) || ids.length === 0) return;
        const result = await model.updateMany({_id: {$in: ids}}, {$addToSet: {discount: discountId}});
        if ((result.matchedCount ?? result.n) === 0) {
            throw new customError(`No valid ${discountFor} found for the provided IDs`, 400);
        }
    }

    await updateRelatedModels(discountFor, discount._id);
    return success(res, "Discount Created successfully", discount, 201)
})
/**
 * @description Update a discount
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateDiscount = asyncHandler(async (req, res) => {
    // to update discount user must provide discountFor and category, subCategory, brand, product
    const {slug} = req.params
    const {
        name,
        startAt,
        endAt,
        discountFor,
        discountType,
        discountValue,
        category,
        subCategory,
        brand,
        product
    } = await updateDiscountValidation(req)
    const oldDiscount = await Discount.findOne({slug})
    if (!oldDiscount) throw new customError("Discount not found", 400)
    // Now update the related models to remove the discount from old associations
    if (oldDiscount.category.length > 0) {
        await categorySchema.updateMany({_id: {$in: oldDiscount.category}}, {$pull: {discount: oldDiscount._id}})
    }
    if (oldDiscount.subCategory.length > 0) {
        await subCategorySchema.updateMany({_id: {$in: oldDiscount.subCategory}}, {$pull: {discount: oldDiscount._id}})
    }
    if (oldDiscount.brand.length > 0) {
        await brandSchema.updateMany({_id: {$in: oldDiscount.brand}}, {$pull: {discount: oldDiscount._id}})
    }
    if (oldDiscount.product.length > 0) {
        await productSchema.updateMany({_id: {$in: oldDiscount.product}}, {$pull: {discount: oldDiscount._id}})
    }
    // Now update the discountS
    const discount = await Discount.findOneAndUpdate({slug}, {
        name,
        startAt,
        endAt,
        discountFor,
        discountType,
        discountValue,
        category,
        subCategory,
        brand,
        product
    }, {new: true})
    if (!discount) throw new customError("Discount update failed", 400)
    if (discountFor === "category" && category.length > 0) {
        await categorySchema.updateMany({_id: {$in: category}}, {$push: {discount: discount._id}})
    }
    if (discountFor === "subCategory" && subCategory.length > 0) {
        await subCategorySchema.updateMany({_id: {$in: subCategory}}, {$push: {discount: discount._id}})
    }
    if (discountFor === "brand" && brand.length > 0) {
        await brandSchema.updateMany({_id: {$in: brand}}, {$push: {discount: discount._id}})
    }
    if (discountFor === "product" && product.length > 0) {
        await productSchema.updateMany({_id: {$in: product}}, {$push: {discount: discount._id}})
    }
    return success(res, "Discount updated successfully", discount, 200)
})

/**
 * @description Delete a discount
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteDiscount = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const discount = await Discount.findOneAndDelete({slug})
    if (!discount) throw new customError("Discount not found", 400)
    if (discount.category.length > 0) {
        await categorySchema.updateMany({_id: {$in: discount.category}}, {$pull: {discount: discount._id}})
    }
    if (discount.subCategory.length > 0) {
        await subCategorySchema.updateMany({_id: {$in: discount.subCategory}}, {$pull: {discount: discount._id}})
    }
    if (discount.brand.length > 0) {
        await brandSchema.updateMany({_id: {$in: discount.brand}}, {$pull: {discount: discount._id}})
    }
    if (discount.product.length > 0) {
        await productSchema.updateMany({_id: {$in: discount.product}}, {$pull: {discount: discount._id}})
    }
    return success(res, "Discount deleted successfully", discount, 200)
})
/**
 * @description Get a discount
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getDiscount = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const discount = await Discount.findOne({slug})
    if (!discount) throw new customError("Discount not found", 400)
    return success(res, "Discount fetched successfully", discount, 200)
})
/**
 * @description Get all discounts
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllDiscount = asyncHandler(async (req, res) => {
    const discounts = await Discount.find()
    if (!discounts) throw new customError("Discount not found", 400)
    return success(res, "Discount fetched successfully", discounts, 200)
})