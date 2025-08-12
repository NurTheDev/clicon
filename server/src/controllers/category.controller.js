const categorySchema = require("../models/category.model")
const {customError} = require("../utils/customError")
const {success} = require("../utils/apiResponse")
const asyncHandler = require("../helpers/asyncHandler")

exports.createCategory = asyncHandler(async (req, res)=>{
    // const {name} = req.body
    console.log(req.file)
})