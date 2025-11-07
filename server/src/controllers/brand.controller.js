const {
  brandValidation,
  updateValidation,
} = require("../validators/brand.validator");
const brandSchema = require("../models/brand.model");
const asyncHandler = require("../helpers/asyncHandler");
const customError = require("../utils/customError");
const { success } = require("../utils/apiResponse");
const { uploadImage, deleteImage } = require("../helpers/claudinary");

/**
 * @description Create a new brand
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createBrand = asyncHandler(async (req, res) => {
  const { name, image, isActive } = await brandValidation(req);
  const imgResult = await uploadImage(image.path);
  const brand = await brandSchema
    .create({
      name,
      image: { url: imgResult.secure_url, public_id: imgResult.public_id },
      isActive,
    })
    .populate("discount")
    .populate("products");
  if (!brand) {
    await deleteImage(imgResult.public_id);
    throw new customError("Brand creation failed", 400);
  }
  success(res, "Brand created successfully", brand, 201);
});

/**
 * @description Get all brands
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllBrand = asyncHandler(async (req, res) => {
  const brands = await brandSchema
    .find()
    .populate("discount")
    .populate("products");
  if (!brands) throw new customError("Brands not found", 400);
  success(res, "Brands fetched successfully", brands, 200);
});
/**
 * @description Get a brand by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const brand = await brandSchema
    .findOne({ slug })
    .populate("discount")
    .populate("products");
  if (!brand) throw new customError("Brand not found", 400);
  success(res, "Brand fetched successfully", brand, 200);
});

/**
 * @description Update a brand by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */

exports.updateBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, image, isActive } = await updateValidation(req);
  const brand = await brandSchema
    .findOneAndUpdate({ slug }, { name, image, isActive }, { new: true })
    .populate("discount")
    .populate("products");
  if (!brand) throw new customError("Brand not found", 400);
  success(res, "Brand updated successfully", brand, 200);
});
/**
 * @description Delete a brand by slug
 * @type {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const brand = await brandSchema.findOneAndDelete({ slug });
  if (!brand) throw new customError("Brand not found", 400);
  success(res, "Brand deleted successfully", brand, 200);
});
