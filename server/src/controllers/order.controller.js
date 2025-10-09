const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const orderSchema = require('../models/order.model');
const {orderValidation} = require('../validators/order.validator');
const asyncHandler = require("../helpers/asyncHandler");

exports.createOrder = asyncHandler(async (req, res) => {
    const result = await orderValidation(req);
    console.log(result)
})