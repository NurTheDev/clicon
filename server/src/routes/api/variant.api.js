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

module.exports = router;