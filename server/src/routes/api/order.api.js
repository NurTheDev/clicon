const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order.controller');

router.route("/create-order").post(orderController.createOrder);

module.exports = router;