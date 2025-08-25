const express = require("express");
const router = express.Router();
const authApi = require("./api/auth.api");
const categoryApi = require("./api/category.api");
const subCategoryApi = require("./api/subCategory.api");
router.use("/auth", authApi)
router.use("/category", categoryApi)
router.use("/subCategory", subCategoryApi)
module.exports = router;
