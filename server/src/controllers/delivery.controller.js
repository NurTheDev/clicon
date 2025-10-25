const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const {DeliveryCharge} = require('../models/delivery.model');
const {deliveryChargeValidation} = require('../validators/delivery.validator');
const asyncHandler = require("../helpers/asyncHandler");

exports.createDelivery = asyncHandler(async (req, res) => {
    const result = await deliveryChargeValidation(req);
    const deliveryCharge = await DeliveryCharge.create(result);
    if (!deliveryCharge) {
        throw new customError("Failed to create delivery charge", 400);
    }
    success(res, "Delivery charge created successfully", deliveryCharge, 201);
})

// You can add more controller functions here for handling deliveries