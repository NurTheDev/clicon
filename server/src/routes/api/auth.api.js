const express = require("express");
const userController = require("../../controllers/user.controller");
const router = express.Router();
const authGard = require("../../middleware/authGard.middleware")
router.route("/register").post(userController.register);
router.route("/sign_in").post(userController.login)
router.route("/verify-email").post(userController.emailVerify)
router.route("/forgot-password").post(userController.forgotPassword)
router.route("/reset-password").post(userController.resetPassword)
router.route("/sign_out").post(authGard, userController.logout)
router.route("/profile").get(authGard, userController.getUser)

module.exports = router;