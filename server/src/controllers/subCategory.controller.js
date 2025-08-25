const subCategoryModel = require("../models/subCategory.model");
const {subCategoryValidation} = require("../validators/subCategory.validator");
const {success} = require("../utils/apiResponse")
const asyncHandler = require("../helpers/asyncHandler")
const customError = require("../utils/customError")

exports.createSubCategory = asyncHandler(async (req, res) => {
    const {name, categoryId} = await subCategoryValidation(req)
    const subCategory = await subCategoryModel.create({name, category : categoryId})
    if (!subCategory) throw new customError("SubCategory creation failed", 400)
    success(res, "SubCategory created successfully", subCategory, 201)
})