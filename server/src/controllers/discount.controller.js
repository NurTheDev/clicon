const {validateDiscount, updateDiscountValidation} = require("../validators/discount.validator")
const customError = require("../utils/customError")
const Discount = require("../models/discount.model")
const asyncHandler = require("../helpers/asyncHandler")
const {success} = require("../utils/apiResponse")
const categorySchema = require("../models/category.model")
const subCategorySchema = require("../models/subCategory.model")
const brandSchema = require("../models/brand.model")
/**
 * @description Create a new discount
 * @type {(function(*, *, *): Promise<void>)|*}
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
    if (discountFor === "category" && category.length > 0) {
        const categories = await categorySchema.updateMany({_id: {$in: category}}, {$push: {discount: discount._id}})
        if (!categories) throw new customError("Category not found", 400)
    }
    if (discountFor === "subCategory" && subCategory.length > 0) {
        const subCategories = await subCategorySchema.updateMany({_id: {$in: subCategory}}, {$push: {discount: discount._id}})
        if (!subCategories) throw new customError("SubCategory not found", 400)
    }
    if (discountFor === "brand" && brand.length > 0) {
        const brands = await brandSchema.updateMany({_id: {$in: brand}}, {$push: {discount: discount._id}})
        if (!brands) throw new customError("Brand not found", 400)
    }
    if (discountFor === "product" && product.length > 0) {
        const products = await productSchema.updateMany({_id: {$in: product}}, {$push: {discount: discount._id}})
        if (!products) throw new customError("Product not found", 400)
    }
    return success(res, "Discount Created successfully", discount, 201)
})
/**
 * @description Update a discount
 * @type {(function(*, *, *): Promise<void>)|*}
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