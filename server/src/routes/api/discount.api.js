const express = require("express")
const {createDiscount, updateDiscount} = require("../../controllers/discount.controller");
const router = express.Router()
const authGard = require("../../middleware/authGard.middleware")

router.route("/create-discount").post(authGard, createDiscount)
router.route("/update-discount/:slug").put(authGard, updateDiscount)
module.exports = router