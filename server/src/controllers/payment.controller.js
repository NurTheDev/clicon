const customError = require("../utils/customError");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const orderSchema = require("../models/order.model");
const cartSchema = require("../models/cart.model");
const invoice = require("../models/invoice.model");
const { sendSMS } = require("../helpers/sendSMS");
const SSLCommerzPayment = require("sslcommerz-lts");
const { orderConfirmation } = require("../templet/emailTemplet");
const { sendEmail } = require("../helpers/sendEmail");
const store_id = process.env.SSL_COMMERZE_STORE_ID;
const store_passwd = process.env.SSL_COMMERZE_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === "production";
exports.paymentSuccess = asyncHandler(async (req, res) => {
  console.log("Payment success payload:", req.body);
  const { val_id } = req.body;
  if (!val_id)
    throw new customError("Validation ID (vali_id) is required", 400);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });
  if (!validation || validation.status !== "VALID") {
    throw new customError("Transaction validation failed", 400);
  }
  const updateOrder = await orderSchema.findOneAndUpdate(
    { transactionId: validation.tran_id },
    {
      paymentStatus: "COMPLETED",
      status: "CONFIRMED",
      paymentDetails: validation,
      sslCommerzValidationId: val_id,
    },
    { new: true }
  );
  if (!updateOrder) {
    throw new customError("Order not found for the given transaction ID", 404);
  }
  // Update invoice status
  await invoice.findOneAndUpdate(
    { orderId: updateOrder._id },
    { status: "PAID" }
  );
  // Clear the cart
  const query = updateOrder.user
    ? { userId: updateOrder.user }
    : { guestId: updateOrder.guestId };
  await cartSchema.findOneAndDelete(query);
  // Send confirmation email
  if (updateOrder.shippingAddress?.email) {
    try {
      const emailContent = orderConfirmation({
        orderNumber: updateOrder.orderNumber,
        customerName: updateOrder.shippingAddress.fullName,
        orderDate: updateOrder.orderDate,
        lineItems: updateOrder.lineItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
        subtotal: updateOrder.totalAmount,
        shippingAmount: updateOrder.shippingAmount,
        taxAmount: updateOrder.taxAmount,
        totalAmount: updateOrder.finalAmount,
        currency: updateOrder.currency,
        shippingAddress: updateOrder.shippingAddress,
        paymentMethod: updateOrder.paymentMethod,
        estimatedDelivery: "Within 5-7 business days",
      });
      await sendEmail(
        updateOrder.shippingAddress.email,
        emailContent,
        "Payment Successful - Order Confirmed"
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't throw error - payment was successful
    }
  }
  // Send SMS if no email
  else if (updateOrder.shippingAddress?.phoneNumber) {
    try {
      const message = `Payment successful! Your order ${updateOrder.orderNumber} is confirmed. Total: ${updateOrder.finalAmount} ${updateOrder.currency}. Thank you!`;
      await sendSMS(updateOrder.shippingAddress.phoneNumber, message);
    } catch (smsError) {
      console.error("Failed to send SMS:", smsError);
      // Don't throw error - payment was successful
    }
  }

  res.redirect("localhost:5173/payment/success");
});

exports.paymentFailure = asyncHandler(async (req, res) => {
  const { val_id } = req.body;
  if (!val_id)
    throw new customError("Validation ID (vali_id) is required", 400);
  console.log("Payment failure payload:", req.body);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });
  if (!validation || validation.status !== "FAILED") {
    throw new customError("Transaction validation failed", 400);
  }
  const updateOrder = await orderSchema.findOneAndUpdate(
    { transactionId: validation.tran_id },
    {
      paymentStatus: "FAILED",
      status: "CANCELLED",
      paymentDetails: validation,
    },
    { new: true }
  );
  if (!updateOrder) {
    throw new customError("Order not found for the given transaction ID", 404);
  }
  // Update invoice status
  await invoice.findOneAndUpdate(
    { orderId: updateOrder._id },
    { status: "CANCELLED" }
  );
  res.redirect("localhost:5173/payment/fail");
});
exports.paymentCancel = asyncHandler(async (req, res) => {
  const { val_id } = req.body;
  if (!val_id)
    throw new customError("Validation ID (vali_id) is required", 400);
  console.log("Payment cancel payload:", req.body);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });
  if (!validation || validation.status !== "CANCELLED") {
    throw new customError("Transaction validation failed", 400);
  }
  const updateOrder = await orderSchema.findOneAndUpdate(
    { transactionId: validation.tran_id },
    {
      paymentStatus: "CANCELLED",
      status: "CANCELLED",
      paymentDetails: validation,
    },
    { new: true }
  );
  if (!updateOrder) {
    throw new customError("Order not found for the given transaction ID", 404);
  }
  // Update invoice status
  await invoice.findOneAndUpdate(
    { orderId: updateOrder._id },
    { status: "CANCELLED" }
  );

  res.redirect("localhost:5173/payment/cancel");
});
exports.ipnHandler = asyncHandler(async (req, res) => {
  console.log("IPN payload:", req.body);
  const { val_id } = req.body;
  if (!val_id)
    throw new customError("Validation ID (vali_id) is required", 400);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });
  if (!validation) {
    throw new customError("Transaction validation failed", 400);
  }
  const paymentStatus =
    validation.status === "VALID"
      ? "COMPLETED"
      : validation.status === "FAILED"
      ? "FAILED"
      : "PENDING";
  const orderStatus =
    validation.status === "VALID"
      ? "CONFIRMED"
      : validation.status === "FAILED"
      ? "CANCELLED"
      : "PENDING";

  const updateOrder = await orderSchema.findOneAndUpdate(
    { transactionId: validation.tran_id },
    {
      paymentStatus: paymentStatus,
      status: orderStatus,
      paymentDetails: validation,
    },
    { new: true }
  );
  if (!updateOrder) {
    throw new customError("Order not found for the given transaction ID", 404);
  }
  const invoiceStatus = validation.status === "VALID" ? "PAID" : "UNPAID";
  await invoice.findOneAndUpdate(
    { orderId: updateOrder._id },
    { status: invoiceStatus }
  );
  // If payment successful, clear cart and send notifications
  if (validation.status === "VALID") {
    // Clear cart
    const query = updateOrder.user
      ? { userId: updateOrder.user }
      : { guestId: updateOrder.guestId };
    await cartSchema.findOneAndDelete(query);

    // Send notifications (same as in paymentSuccess)
    if (updateOrder.shippingAddress?.email) {
      try {
        const emailContent = orderConfirmation({
          orderNumber: updateOrder.orderNumber,
          customerName: updateOrder.shippingAddress.fullName,
          orderDate: updateOrder.orderDate,
          lineItems: updateOrder.lineItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
          subtotal: updateOrder.totalAmount,
          shippingAmount: updateOrder.shippingAmount,
          taxAmount: updateOrder.taxAmount,
          totalAmount: updateOrder.finalAmount,
          currency: updateOrder.currency,
          shippingAddress: updateOrder.shippingAddress,
          paymentMethod: updateOrder.paymentMethod,
          estimatedDelivery: "Within 5-7 business days",
        });
        await sendEmail(
          updateOrder.shippingAddress.email,
          emailContent,
          "Payment Successful - Order Confirmed"
        );
      } catch (error) {
        console.error("Failed to send email in IPN:", error);
      }
    } else if (updateOrder.shippingAddress?.phoneNumber) {
      try {
        const message = `Payment successful! Your order ${updateOrder.orderNumber} is confirmed. Total: ${updateOrder.finalAmount} ${updateOrder.currency}. Thank you!`;
        await sendSMS(updateOrder.shippingAddress.phoneNumber, message);
      } catch (error) {
        console.error("Failed to send SMS in IPN:", error);
      }
    }
  }
  res
    .status(200)
    .json({ success: true, message: "IPN processed successfully" });
});
