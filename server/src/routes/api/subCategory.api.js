const express = require("express");
const router = express.Router();
const subCategoryController = require("../../controllers/subCategory.controller")
router.route("/create-subCategory").post(subCategoryController.createSubCategory)


module.exports = router