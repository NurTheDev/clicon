const subCategoryModel = require("../models/subCategory.model");
const {subCategoryValidation, updateSubCategoryValidation} = require("../validators/subCategory.validator");
const {success} = require("../utils/apiResponse")
const asyncHandler = require("../helpers/asyncHandler")
const customError = require("../utils/customError")
const categorySchema = require("../models/category.model")

/**
 * @description Create a subCategory
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createSubCategory = asyncHandler(async (req, res) => {
    const {name, categoryId} = await subCategoryValidation(req)
    const subCategory = await subCategoryModel.create({name, category: categoryId})
    if (!subCategory) throw new customError("SubCategory creation failed", 400)
    const updateCategory = await categorySchema.findOneAndUpdate({_id: categoryId}, {
        $push: {subCategories: subCategory._id}
    }, {new: true})
    if (!updateCategory) {
        await subCategoryModel.findByIdAndDelete(subCategory._id)
        throw new customError("Faild to link subCategory to category", 400)
    }
    success(res, "SubCategory created successfully", subCategory, 201)
})

/**
 * @description Get all subCategories
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllSubCategories = asyncHandler(async (req, res) => {
    const subCategories = await subCategoryModel.find()
    if (!subCategories) throw new customError("SubCategories not found", 400)
    success(res, "SubCategories fetched successfully", subCategories, 200)
})

/**
 * @description Get a subCategory by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getSubCategory = asyncHandler(async (req, res) => {
    const {slug} = req.params
    const subCategory = await subCategoryModel.findOne({slug})
    if (!subCategory) throw new customError("SubCategory not found", 400)
    success(res, "SubCategory fetched successfully", subCategory, 200)
})

exports.updateSubCategory = asyncHandler(async (req, res)=>{
    const {slug} = req.params
    const currentSubCategory = await subCategoryModel.findOne({slug})
    if(!currentSubCategory) throw new customError("SubCategory not found", 400)
    const {name, categoryId} = await updateSubCategoryValidation(req)
    const updatedSubCategory = await subCategoryModel.findOneAndUpdate({slug}, {name, category: categoryId}, {new: true})
    if(!updatedSubCategory) throw new customError("SubCategory update failed", 400)
    if(categoryId && categoryId !== currentSubCategory.category.toString()){
        //remove from old category
        await categorySchema.findOneAndUpdate({_id: currentSubCategory.category}, {$pull: {subCategories: currentSubCategory._id}}, {new: true})
        //add to new category
        await categorySchema.findOneAndUpdate({_id: categoryId}, {$push: {subCategories: updatedSubCategory._id}}, {new: true})
    }
    success(res, "SubCategory updated successfully", updatedSubCategory, 200)
})