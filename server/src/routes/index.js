const express = require("express");
const router = express.Router();
const authApi = require("./api/auth.api");
const categoryApi = require("./api/category.api");
const subCategoryApi = require("./api/subCategory.api");
const brandApi = require("./api/brand.api");
const discountApi = require("./api/discount.api");
const productApi = require("./api/product.api");
const variantApi = require("./api/variant.api");
const couponApi = require("./api/coupon.api");
const reviewApi = require("./api/review.api");
const warehouseApi = require("./api/warehouse.api");
router.use("/auth", authApi)
router.use("/category", categoryApi)
router.use("/subCategory", subCategoryApi)
router.use("/brand", brandApi)
router.use("/discount", discountApi)
router.use("/product", productApi)
router.use("/variant", variantApi)
router.use("/coupon", couponApi)
router.use("/review", reviewApi)
router.use("/warehouse", warehouseApi)
module.exports = router;
