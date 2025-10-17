const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order.controller');

router.route("/create-order").post(orderController.createOrder);
router.route("/get-order/:orderNumber").get(orderController.getOrderById);
router.route("/get-all-orders").get(orderController.getAllOrders);
router.route("/update-order/:id").put(orderController.updateOrder);
router.route("/delete-order/:orderNumber").delete(orderController.deleteOrder);
router.route("/get-ordersMatrix").get(orderController.orderMatrix);

module.exports = router;