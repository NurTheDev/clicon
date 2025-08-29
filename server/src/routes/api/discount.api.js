const express = require("express")
const {createDiscount} = require("../../controllers/discount.controller");
const router = express.Router()
const authGard = require("../../middleware/authGard.middleware")

router.route("/create-discount").post(authGard, createDiscount)
module.exports = router