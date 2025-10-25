const express = require('express');
const router = express.Router();
const variantController = require('../../controllers/variant.controller');
const authGard = require('../../middleware/authGard.middleware');
const upload = require('../../middleware/multer.middleware');
const multerErrorHandler = require('../../middleware/multerErrorHandler.middleware');
router.use(multerErrorHandler);

// Create a new product
router.route("/create-variant").post(authGard, upload.fields([{
    name: 'images',
    maxCount: 10
}, {
    name: 'thumbnail',
    maxCount: 1
}]), variantController.createProduct);

// get all variants
router.route("/all-variants").get(variantController.getAllVariants);

// get single variant
router.route("/single-variant/:slug").get(variantController.getSingleVariant);

// update variant
router.route("/update-variant/:slug").put(authGard, upload.fields([{
    name: 'images',
    maxCount: 10
}, {
    name: 'thumbnail',
    maxCount: 1
}]), variantController.updateVariant);

// delete variant
router.route("/delete-variant/:slug").delete(authGard, variantController.deleteVariant);


// delete image from variant
router.route("/delete-image/:slug").put(authGard, variantController.deleteImage);

module.exports = router;