const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const authGard = require('../../middleware/authGard.middleware');
const upload = require('../../middleware/multer.middleware');
const multerErrorHandler = require('../../middleware/multerErrorHandler.middleware');
router.use(multerErrorHandler);
// Create a new product
router.route("/create-product").post(authGard, upload.fields([{
    name: 'images',
    maxCount: 10
}, {
    name: 'thumbnail',
    maxCount: 1
}]), productController.createProduct);



module.exports = router;