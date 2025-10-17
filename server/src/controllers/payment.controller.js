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
    res.redirect("localhost:5173/payment/success");
});

exports.paymentFailure = asyncHandler(async (req, res) => {
    console.log("Payment failure payload:", req.body);
    const {tran_id, status } = req.body;
    const updateOrder = await orderSchema.findOneAndUpdate(
        { transactionId: tran_id },
        {
            paymentStatus: "FAILED",
            paymentDetails: req.body
        },
        { new: true }
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.redirect("localhost:5173/payment/fail");
})
exports.paymentCancel = asyncHandler(async (req, res) => {
    console.log("Payment cancel payload:", req.body);
    const {tran_id, status } = req.body;
    const updateOrder = await orderSchema.findOneAndUpdate(
        { transactionId: tran_id },
        {
            paymentStatus: "FAILED",
            paymentDetails: req.body
        },
        { new: true }
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.redirect("localhost:5173/payment/cancel");
})
exports.ipnHandler = asyncHandler(async (req, res) => {
    console.log("IPN payload:", req.body);
    const {tran_id, status } = req.body;
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
    res.status(200).send('IPN received');
})