const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');

// router.route("/success").post(paymentController.paymentSuccess);
router.route("/fail").post(paymentController.paymentFailure);
router.route("/cancel").post(paymentController.paymentCancel);
router.route("/ipn").post(paymentController.ipnHandler);
module.exports = router;