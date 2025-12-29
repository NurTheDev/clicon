const customError = require("../utils/customError");
const asyncHandler = require("../helpers/asyncHandler");
const { success } = require("../utils/apiResponse");
const {
  validateCreateCoupon,
  validateUpdateCoupon,
} = require("../validators/coupon.validator");
const CouponSchema = require("../models/coupon.model");

/**
 * @description Create a new coupon
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createCoupon = asyncHandler(async (req, res) => {
  const result = await validateCreateCoupon(req);
  const coupon = await CouponSchema.create(result);
  if (!coupon) throw new customError("Coupon creation failed", 400);
  success(res, "Coupon created successfully", coupon, 201);
});
/**
 * @description Get all coupons
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await CouponSchema.find();
  if (!coupons) throw new customError("Coupons not found", 400);
  success(res, "Coupons fetched successfully", coupons, 200);
});
/**
 * @description Get a coupon by slug
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getCoupon = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const coupon = await CouponSchema.findOne({ slug });
  if (!coupon) throw new customError("Coupon not found", 400);
  success(res, "Coupon fetched successfully", coupon, 200);
});
/**
 * @description Update a coupon by slug
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateCoupon = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(req.body);
  const result = await validateUpdateCoupon(req);
  const coupon = await CouponSchema.findOneAndUpdate({ slug }, result, {
    new: true,
  });
  if (!coupon) throw new customError("Coupon not found", 400);
  success(res, "Coupon updated successfully", coupon, 200);
});
/**
 * @description Delete a coupon by slug
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const coupon = await CouponSchema.findOneAndDelete({ slug });
  if (!coupon) throw new customError("Coupon not found", 400);
  success(res, "Coupon deleted successfully", coupon, 200);
});
