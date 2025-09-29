const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/coupon.controller');
const authGard = require('../../middleware/authGard.middleware');

router.route("/create-coupon").post(authGard, couponController.createCoupon);

module.exports = router;