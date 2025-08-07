const userSchema = require("../models/user.model")
const customError = require("../utils/customError")
const asyncHandler = require("../helpers/asyncHandler")
const {success} = require("../utils/apiResponse")
const {userValidation} = require("../validators/user.validator")
const {generateOTP} = require("../utils/otp")
const {verifyEmail} = require("../templet/emailTemplet")
const {sendEmail} = require("../helpers/sendEmail")
/**
 * Register user
 * @type {(function(*, *, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.register = asyncHandler(async (req, res) => {
    const {name, email, phone, password} = await userValidation(req)
    const user = await userSchema.create({name, email, phone, password})
    if(!user){
        throw new customError("User registration failed", 400)
    }
    // Get OTP
    const {otp, expiry} = generateOTP()
    const verifyLink = `http://localhost:3000/verify?email=${email}&otp=${otp}`
    // Send OTP to user through email
    const emailVerifyTemplate = verifyEmail(name, otp, expiry, verifyLink)
    await sendEmail(email, emailVerifyTemplate)
    success(res, "User registered successfully", user, 201)
})