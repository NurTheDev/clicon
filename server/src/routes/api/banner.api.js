const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/banner.controller");
const authGuard = require("../../middleware/authGard.middleware");
const upload = require("../../middleware/multer.middleware");
const multerErrorHandler = require("../../middleware/multerErrorHandler.middleware");
const checkAuthorization = require("../../middleware/checkAuthorization.middleware");

router.use(multerErrorHandler);
router.route("/create_banner").post(
  // authGuard,
  // checkAuthorization("Banner", "create"),
  upload.single("image"),
  bannerController.createBanner
);

router.route("/get_all_banners").get(
  // authGuard,
  // checkAuthorization("Banner", "read"),
  bannerController.getAllBanners
);

router.route("/get_banner/:bannerId").get(
  // authGuard,
  // checkAuthorization("Banner", "read"),
  bannerController.getSingleBanner
);

router.route("/update_banner/:bannerId").patch(
  // authGuard,
  // checkAuthorization("Banner", "update"),
  upload.single("image"),
  bannerController.updateBanner
);

router.route("/delete_banner/:bannerId").delete(
  // authGuard,
  // checkAuthorization("Banner", "delete"),
  bannerController.deleteBanner
);

module.exports = router;
