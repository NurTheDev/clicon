const express = require("express");
const router = express.Router();
const subCategoryController = require("../../controllers/subCategory.controller");
router
  .route("/create-subCategory")
  .post(subCategoryController.createSubCategory);
router
  .route("/get-allSubCategory")
  .get(subCategoryController.getAllSubCategories);
router
  .route("/get-subCategory/:slug")
  .get(subCategoryController.getSubCategory);
router
  .route("/update-subCategory/:slug")
  .patch(subCategoryController.updateSubCategory);
router
  .route("/delete-subCategory/:slug")
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
