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
        const categories = await categorySchema.find({_id: {$in: category}}, {$push: {discount: discount._id}})
    }
    if (discountFor === "subCategory" && subCategory.length > 0) {
        const subCategories = await subCategorySchema.find({_id: {$in: subCategory}}, {$push: {discount: discount._id}})
    }
    if (discountFor === "brand" && brand.length > 0) {
        const brands = await brandSchema.find({_id: {$in: brand}}, {$push: {discount: discount._id}})
    }
    if (discountFor === "product" && product.length > 0) {
        const products = await productSchema.find({_id: {$in: product}}, {$push: {discount: discount._id}})
    }
    return success(201, discount, "Discount created successfully")
})