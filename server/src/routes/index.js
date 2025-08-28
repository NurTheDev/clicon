const express = require("express");
const router = express.Router();
const authApi = require("./api/auth.api");
const categoryApi = require("./api/category.api");
const subCategoryApi = require("./api/subCategory.api");
const brandApi = require("./api/brand.api");
router.use("/auth", authApi)
router.use("/category", categoryApi)
router.use("/subCategory", subCategoryApi)
router.use("/brand", brandApi)
module.exports = router;
