const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const authGard = require("../../middleware/authGard.middleware");
const upload = require("../../middleware/multer.middleware");
const multerErrorHandler = require("../../middleware/multerErrorHandler.middleware");
router.use(multerErrorHandler);
// Create a new product
router.route("/create-product").post(
  authGard,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  productController.createProduct
);

router.route("/products").get(productController.getAllProducts);
router.route("/product/:slug").get(productController.getSingleProduct);
router.route("/update-product/:slug").patch(
  authGard,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  productController.updateProduct
);
router
  .route("/delete-product/:slug")
  .delete(authGard, productController.deleteProduct);
router.route("/filtered-products").get(productController.getFilteredProducts);
router.route("/get-total-products").get(productController.getTotalProducts);
router
  .route("/related-products/:slug")
  .get(productController.getRelatedProducts);
router
  .route("/get-total-products-by-category/:categoryId")
  .get(productController.getTotalProductsInCategory);
router
  .route("/get-total-products-by-sub-category/:subCategoryId")
  .get(productController.getTotalProductsInSubCategory);
router
  .route("/get-total-products-by-brand/:brandId")
  .get(productController.getTotalProductsInBrand);
router
  .route("/get-low-stock-products")
  .get(authGard, productController.getLowStockProducts);
router
  .route("get-products-by-tag/:tag")
  .get(productController.getProductsByTag);
router
  .route("/get-relevant-products")
  .post(productController.getRelatedProducts);
router
  .route("/get-discounted-products")
  .get(productController.getDiscountedProducts);

module.exports = router;
