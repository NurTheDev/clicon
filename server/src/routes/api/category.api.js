const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category.controller");
const authGard = require("../../middleware/authGard.middleware");
const upload = require("../../middleware/multer.middleware");

router.route("/create-category").post(authGard, categoryController.createCategory)

module.exports = router