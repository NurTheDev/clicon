const express = require("express");
const userController = require("../../controllers/user.controller");
const router = express.Router();

router.route("/register").post(userController.register);
router.route("/sign_in").post(userController.login)
router.route("/verify").post(userController.emailVerify)

module.exports = router;