const asyncHandler = require("../helpers/asyncHandler");
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

  const image = await uploadImage(validatedData.image);
  if (!image) throw new customError("Image upload failed", 500);
  const newBanner = await Banner.create({
    ...validatedData,
    image: { url: image.secure_url, public_id: image.public_id },
  });
  if (!newBanner) {
    // Delete uploaded image if banner creation fails
    await deleteImage(image.public_id);
    throw new customError("Failed to create banner", 500);
  }
  success(res, "Banner created successfully", newBanner, 201);
});

exports.getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ priority: 1, createdAt: -1 });
  success(res, "Banners retrieved successfully", banners, 200);
});

exports.updateBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const existingBanner = await Banner.findById(bannerId);
  if (!existingBanner) throw new customError("Banner not found", 404);

  const validatedData = await updateBannerValidation(req);
  if (!validatedData) throw new customError("Banner validation failed", 400);

  let updatedImage = existingBanner.image;
  if (validatedData && validatedData.image) {
    // Delete old image from Cloudinary
    await deleteImage(existingBanner.image.public_id);
    // Upload new image to Cloudinary
    const image = await uploadImage(validatedData.image);
    if (!image) throw new customError("Image upload failed", 500);
    updatedImage = { url: image.secure_url, public_id: image.public_id };
  }

  const updatedBanner = await Banner.findByIdAndUpdate(
    bannerId,
    { ...validatedData, image: updatedImage },
    { new: true }
  );
  if (!updatedBanner) throw new customError("Failed to update banner", 500);
  success(res, "Banner updated successfully", updatedBanner, 200);
});

exports.deleteBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const existingBanner = await Banner.findById(bannerId);
  if (!existingBanner) throw new customError("Banner not found", 404);

  // Delete image from Cloudinary
  await deleteImage(existingBanner.image.public_id);

  await Banner.findByIdAndDelete(bannerId);
  success(res, "Banner deleted successfully", null, 200);
});
