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
    if (!user) {
        throw new customError("User registration failed", 400)
    }
    // Get OTP
    const {otp, expiry} = generateOTP()
    const verifyLink = `http://localhost:3000/verify?email=${email}&otp=${otp}`
    // Send OTP to user through email
    const emailVerifyTemplate = verifyEmail(name, otp, expiry, verifyLink)
    await sendEmail(email, emailVerifyTemplate)
    user.emailVerificationToken = otp
    user.emailVerificationExpire = expiry
    await user.save()
    success(res, "User registered successfully", user, 201)
})
exports.emailVerify = asyncHandler(async (req, res) => {
    const {email, otp} = req.body
    if (!email || !otp) {
        throw new customError("Email or OTP is required", 400)
    }

    const user = await userSchema.findOne({email})
    if(!user){
        throw new customError("User not found", 400)
    } if(user.emailVerificationToken !== otp){
        throw new customError("Invalid OTP", 400)
    }if(user.emailVerificationExpire<Date.now()){
        throw new customError("OTP expired", 400)
    }
    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpire = null
    await user.save()
    success(res, "Email verified successfully", user, 200)
})

exports.login = asyncHandler(async (req, res) => {
    console.log(req.body)
    const {email, phone, password} = await userValidation(req)
    const user = await userSchema.findOne({$or: [{email}, {phone}]})
    if (!user) {
        throw new customError("User not found", 400)
    }
    const isMatch = await user.checkPassword(password)
    if (!isMatch) {
        throw new customError("Invalid password", 400)
    }

    // Make an access token and refresh token
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken // save refresh token
    await user.save()
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
    success(res, "User logged in successfully", {
        accessToken,
        name: user.name,
        email: user.email
    }, 200)
})