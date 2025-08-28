const express = require("express")
const router = express.Router()
const brandController = require("../../controllers/brand.controller")
const upload = require("../../middleware/multer.middleware")
const multerErrorHandler = require("../../middleware/multerErrorHandler.middleware")
const authGard = require("../../middleware/authGard.middleware");
router.route("/create-brand").post(authGard, upload.fields([{
    name: "image",
    maxCount: 1
}]), brandController.createBrand)
router.route("/all-brand").get(brandController.getAllBrand)
router.route("/single-brand/:slug").get(brandController.getBrand)
router.route("/update-brand/:slug").put(authGard, upload.fields([
    {
        name: "image",
        maxCount: 1
    }
]), brandController.updateBrand)

router.use(multerErrorHandler)
module.exports = router
