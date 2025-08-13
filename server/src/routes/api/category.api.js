const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category.controller");
const authGard = require("../../middleware/authGard.middleware");
const upload = require("../../middleware/multer.middleware");
const multerErrorHandler = require("../../middleware/multerErrorHandler.middleware");

router.route("/create-category").post(upload.fields([{
    name: "image",
    maxCount: 1
}]), multerErrorHandler, authGard, categoryController.createCategory)

module.exports = router