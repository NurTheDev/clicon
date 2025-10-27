const express = require("express");
const router = express.Router();
const authGuard = require("../../middleware/authGard.middleware");
const RBAC_controller = require("../../controllers/RBAC.controller");
const userSchema = require("../../models/user.model");
const upload = require("../../middleware/multer.middleware");
const multerErrorHandler = require("../../middleware/multerErrorHandler.middleware");
const checkAuthorization = require("../../middleware/checkAuthorization.middleware");
router.use(multerErrorHandler);
router
  .route("/create_user")
  .post(authGuard, upload.single("image"), RBAC_controller.createUser);
router.route("/get_all_users").get(authGuard, RBAC_controller.getAllUsers);
router
  .route("/set_permission_to_user")
  .post(
    authGuard,
    checkAuthorization("RBAC", "update"),
    RBAC_controller.setPermissionToUser
  );
router
  .route("/get_permissions/:userId")
  .get(
    authGuard,
    checkAuthorization("RBAC", "read"),
    RBAC_controller.getUserPermissions
  );

module.exports = router;
