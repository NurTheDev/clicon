const express = require("express");
const router = express.Router();
const RBAC_controller = require("../../controllers/RBAC.controller")
router.route("/create_user").post(RBAC_controller.createUser)
router.route("/get_all_users").get(RBAC_controller.getAllUsers)

module.exports = router;