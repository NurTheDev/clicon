const categorySchema = require("../models/category.model")
const {customError} = require("../utils/customError")
const {success} = require("../utils/apiResponse")
const asyncHandler = require("../helpers/asyncHandler")
const {categoryValidation} = require("../validators/category.validator");
const {uploadImage} = require("../helpers/claudinary");

exports.createCategory = asyncHandler(async (req, res) => {
    const {name, image} = await categoryValidation(req)
    const imgUrl = await uploadImage(image.path)
    console.log(imgUrl)
})