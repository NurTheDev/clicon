const express = require("express");
const userController = require("../../controllers/user.controller");
const router = express.Router();

router.route("/register").post(userController.register);
router.route("/sign_in").post(userController.login)
router.route("/verify-email").post(userController.emailVerify)
router.route("/forgot-password").post(userController.forgotPassword)
router.route("/reset-password").post(userController.resetPassword)

module.exports = router;