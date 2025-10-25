const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/coupon.controller');
const authGard = require('../../middleware/authGard.middleware');

router.route("/create-coupon").post(authGard, couponController.createCoupon);
router.route("/get-all-coupons").get(couponController.getAllCoupons);
router.route("/get-coupon/:slug").get(couponController.getCoupon);
router.route("/update-coupon/:slug").put(authGard, couponController.updateCoupon);

module.exports = router;