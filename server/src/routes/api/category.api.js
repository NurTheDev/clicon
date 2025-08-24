const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category.controller");
const authGard = require("../../middleware/authGard.middleware");
const upload = require("../../middleware/multer.middleware");
const multerErrorHandler = require("../../middleware/multerErrorHandler.middleware");

router.route("/create-category").post(authGard, upload.fields([{
    name: "image",
    maxCount: 1
}]), multerErrorHandler, categoryController.createCategory)
router.route("/get-allCategory").get(categoryController.getAllCategories)
router.route("/get-category/:slug").get(categoryController.getCategory)
router.route("/update-category/:slug").put(authGard, upload.fields(
    [{
        name: "image",
        maxCount: 1
    }]
), multerErrorHandler, categoryController.updateCategory)

module.exports = router