const asyncHandler = require("express-async-handler");
const Banner = require("../models/banner.model");
const {
  bannerValidation,
  updateBannerValidation,
} = require("../validators/banner.validator");
const customError = require("../utils/customError");
const { success } = require("../utils/apiResponse");
const { uploadImage, deleteImage } = require("../helpers/claudinary");

// Create a new banner
exports.createBanner = asyncHandler(async (req, res) => {
    const validatedData = await bannerValidation(req);
    if (!validatedData) throw new customError("Banner validation failed", 400);
  const image = await uploadImage(req.file);
  const newBanner = await Banner.create({ ...validatedData, image });
  success(res, 201, "Banner created successfully", newBanner);
});
