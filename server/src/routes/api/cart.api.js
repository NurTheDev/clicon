const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');

router.route("/create-cart").post(cartController.createCart);
// router.route("/get-all-carts").get(cartController.getAllCarts);
// router.route("/update-cart/:cartId").put(cartController.updateCart);
// router.route("/delete-cart/:cartId").delete(cartController.deleteCart);
// router.route("/getCartByID/:cartId").get(cartController.getCartById)

module.exports = router;