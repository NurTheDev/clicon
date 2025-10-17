const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const asyncHandler = require("../helpers/asyncHandler");
const orderSchema = require("../models/order.model");
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = process.env.SSL_COMMERZE_STORE_ID;
const store_passwd = process.env.SSL_COMMERZE_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production';
exports.paymentSuccess = asyncHandler(async (req, res) => {
    console.log("Payment success payload:", req.body);
    const {val_id} = req.body;
    if (!val_id) throw new customError("Validation ID (vali_id) is required", 400);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    const validation = await sslcz.validate({val_id});
    if (!validation || validation.status !== "VALID") {
        throw new customError("Transaction validation failed", 400);
    }
    const updateOrder = await orderSchema.findOneAndUpdate(
        {transactionId: validation.tran_id},
        {
            paymentStatus: validation.status === "VALID" ? "COMPLETED" : "FAILED",
            paymentDetails: validation
        },
        {new: true}
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.redirect("localhost:5173/payment/success");
});

exports.paymentFailure = asyncHandler(async (req, res) => {
    const {val_id} = req.body;
    if (!val_id) throw new customError("Validation ID (vali_id) is required", 400);
    console.log("Payment failure payload:", req.body);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    const validation = await sslcz.validate({val_id});
    if (!validation || validation.status !== "FAILED") {
        throw new customError("Transaction validation failed", 400);
    }
    const updateOrder = await orderSchema.findOneAndUpdate(
        {transactionId: validation.tran_id},
        {
            paymentStatus: "FAILED",
            paymentDetails: validation
        },
        {new: true}
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.redirect("localhost:5173/payment/fail");
})
exports.paymentCancel = asyncHandler(async (req, res) => {
    const {val_id} = req.body;
    if (!val_id) throw new customError("Validation ID (vali_id) is required", 400);
    console.log("Payment cancel payload:", req.body);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    const validation = await sslcz.validate({val_id});
    if (!validation || validation.status !== "CANCELLED") {
        throw new customError("Transaction validation failed", 400);
    }
    const updateOrder = await orderSchema.findOneAndUpdate(
        {transactionId: validation.tran_id},
        {
            paymentStatus: "FAILED",
            paymentDetails: validation
        },
        {new: true}
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.redirect("localhost:5173/payment/cancel");
})
exports.ipnHandler = asyncHandler(async (req, res) => {
    console.log("IPN payload:", req.body);
    const {val_id} = req.body;
    if (!val_id) throw new customError("Validation ID (vali_id) is required", 400);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    const validation = await sslcz.validate({val_id});
    if (!validation) {
        throw new customError("Transaction validation failed", 400);
    }
    const paymentStatus = validation.status === "VALID" ? "COMPLETED" : (validation.status === "FAILED" ? "FAILED" : "PENDING");
    const updateOrder = await orderSchema.findOneAndUpdate(
        {transactionId: validation.tran_id},
        {
            paymentStatus: paymentStatus,
            paymentDetails: validation
        },
        {new: true}
    );
    if (!updateOrder) {
        throw new customError("Order not found for the given transaction ID", 404);
    }
    res.status(200).json({success: true, message: "IPN processed successfully"});
})