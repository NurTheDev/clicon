const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');

router.route("/create-cart").post(cartController.createCart);
router.route("/get-cart").get(cartController.getCart);
router.route("/update-cart/:userId").put(cartController.updateCart);
router.route("/increment-item/:userId").put(cartController.incrementCartItem);
router.route("/decrement-item/:userId").put(cartController.decrementCartItem);
router.route("/delete-item/:userId").delete(cartController.deleteCartItem);

module.exports = router;