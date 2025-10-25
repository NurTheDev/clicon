const express = require("express")
const {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getDiscount,
    getAllDiscount
} = require("../../controllers/discount.controller");
const router = express.Router()
const authGard = require("../../middleware/authGard.middleware")

router.route("/create-discount").post(authGard, createDiscount)
router.route("/update-discount/:slug").put(authGard, updateDiscount)
router.route("/delete-discount/:slug").delete(authGard, deleteDiscount)
router.route("/get-discount/:slug").get(getDiscount)
router.route("/get-all-discount").get(getAllDiscount)
module.exports = router