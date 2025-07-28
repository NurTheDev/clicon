const asyncHandler = require("../helpers/asyncHandler");
const customError = require("../utils/customError");
const {success} = require("../utils/apiResponse");

exports.test = asyncHandler(async (req, res)=>{
    console.log("test")
})
