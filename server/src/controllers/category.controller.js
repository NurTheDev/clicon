const categorySchema = require("../models/category.model")
const customError = require("../utils/customError")
const {success} = require("../utils/apiResponse")
const asyncHandler = require("../helpers/asyncHandler")
const {categoryValidation, updateCategoryValidation} = require("../validators/category.validator");
const {uploadImage, deleteImage} = require("../helpers/claudinary");

/**
 * @description Create a new category
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createCategory = asyncHandler(async (req, res) => {
    const {name, image} = await categoryValidation(req)
    const imgResult = await uploadImage(image.path)
    const category = await categorySchema.create({
        name,
        image: {url: imgResult.secure_url, public_id: imgResult.public_id}
    })
    if (!category) {
        throw new customError("Category creation failed", 400)
    }
    success(res, "category created successfully", category, 201)
})

/**
 * @description Get all categories
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categorySchema.find()
    if (!categories) {
        throw new customError("Categories not found", 400)
    }
    success(res, "Categories found successfully", categories, 200)
})

/**
 * @description Get a single category
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getCategory = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const category = await categorySchema.findOne({slug})
    if (!category) {
        throw new customError("Category not found", 400)
    }
    success(res, "Category found successfully", category, 200)
})

/**
 * @description Update a category
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateCategory = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const {name, image} = await updateCategoryValidation(req)
    const category = await categorySchema.findOne({slug})
    if (!category) throw new customError("Category not found", 400)
    if (name) category.name = name
    if (image) category.image = await uploadImage(image.path)
    await category.save()
    success(res, "Category updated successfully", category, 200)
})
/**
 * @description Delete a category
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const category = await categorySchema.findOneAndDelete({slug})
    if (!category) throw new customError("Category not found", 400)
    await deleteImage(category.image.public_id)
    success(res, "Category deleted successfully", category, 200)
})