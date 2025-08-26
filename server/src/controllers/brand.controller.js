const {brandValidation, updateValidation} = require("../validators/brand.validator")
const brandSchema = require("../models/brand.model")
const asyncHandler = require("../helpers/asyncHandler")
const customError = require("../utils/customError")
const {success} = require("../utils/apiResponse")
const {uploadImage} = require("../helpers/claudinary");

const createBrand = asyncHandler(asyncHandler(async (req, res) => {
    const {name, image} = await brandValidation(req)
    const imgResult = await uploadImage(image.path)
    const brand = await brandSchema.create({
        name, image: {url: imgResult.secure_url, public_id: imgResult.public_id}
    })
    if(!brand) throw new customError("Brand creation failed", 400)
    success(res, "Brand created successfully", brand, 201)
}))