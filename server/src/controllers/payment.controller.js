const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const asyncHandler = require("../helpers/asyncHandler");

exports.paymentSuccess = asyncHandler(async (req, res) => {
    console.log("Payment success payload:", req.body);
    res.redirect("https://temp-mail.org/en");
})