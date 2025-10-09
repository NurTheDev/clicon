const express = require('express');
const router = express.Router();
const deliveryController = require('../../controllers/delivery.controller');

router.route("/create-delivery").post(deliveryController.createDelivery);

module.exports = router;