const customError = require('../utils/customError');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const {validateCreateCoupon, updateCouponValidation} = require('../validators/coupon.validator');
const CouponSchema = require('../models/coupon.model');

exports.createCoupon = asyncHandler(async (req, res) => {
    const result = await validateCreateCoupon(req)
    return
    const coupon = await CouponSchema.create(result)
    if (!coupon) throw new customError("Coupon creation failed", 400)
    success(res, "Coupon created successfully", coupon, 201)
})