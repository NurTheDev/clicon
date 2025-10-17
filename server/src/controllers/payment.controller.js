const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const asyncHandler = require("../helpers/asyncHandler");
const orderSchema = require("../models/order.model");
exports.paymentSuccess = asyncHandler(async (req, res) => {
    console.log("Payment success payload:", req.body);
    const {tran_id, vali_id, status } = req.body;
    const updateOrder = await orderSchema.findOneAndUpdate(
        { transactionId: tran_id },
        {
            paymentStatus: status === "VALID" ? "COMPLETED" : "FAILED",
            paymentDetails: req.body
        },
        { new: true }
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.redirect("https://temp-mail.org/en");
});