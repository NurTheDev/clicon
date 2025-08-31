const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const authGard = require('../../middleware/authGard.middleware');
const upload = require('../../middleware/multer.middleware');
const multerErrorHandler = require('../../middleware/multerErrorHandler.middleware');
router.use(multerErrorHandler);
// Create a new product
router.route("/create-product").post((req, res)=>{
    console.log("from route", req.body)});



module.exports = router;