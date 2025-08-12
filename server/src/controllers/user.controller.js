const userSchema = require("../models/user.model")
const customError = require("../utils/customError")
const asyncHandler = require("../helpers/asyncHandler")
const {success} = require("../utils/apiResponse")
const {userValidation} = require("../validators/user.validator")
const {generateOTP} = require("../utils/otp")
const {verifyEmail, forgetPassword} = require("../templet/emailTemplet")
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
    await sendEmail(email, emailVerifyTemplate, "Email verification")
    user.emailVerificationToken = otp
    user.emailVerificationExpire = expiry
    await user.save()
    success(res, "User registered successfully", user, 201)
})
/**
 * Verify email
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.emailVerify = asyncHandler(async (req, res) => {
    const {email, otp} = req.body
    if (!email || !otp) {
        throw new customError("Email or OTP is required", 400)
    }

    const user = await userSchema.findOne({email})
    if (!user) {
        throw new customError("User not found", 400)
    }
    if (user.emailVerificationToken !== otp) {
        throw new customError("Invalid OTP", 400)
    }
    if (user.emailVerificationExpire < Date.now()) {
        throw new customError("OTP expired", 400)
    }
    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpire = null
    await user.save()
    success(res, "Email verified successfully", user, 200)
})
/**
 * Login user
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.login = asyncHandler(async (req, res) => {
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
/**
 * Forgot password
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    if (!email) {
        throw new customError("Email is required", 400)
    }
    const user = await userSchema.findOne({email})
    if (!user) {
        throw new customError("User not found", 400)
    }
    const {otp, expiry} = generateOTP()
    const verifyLink = `http://localhost:3000/reset-password?email=${email}&otp=${otp}`
    const emailVerifyTemplate = forgetPassword(otp, expiry, verifyLink)
    await sendEmail(email, emailVerifyTemplate, "Reset password email")
    user.resetPasswordToken = otp
    user.resetPasswordExpire = expiry
    await user.save()
    success(res, "Email sent successfully", null, 200)
})
/**
 * Reset password
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.resetPassword = asyncHandler(async (req, res) => {
    const {email, otp, newPassword, confirmPassword} = req.body
    if (!email || !otp || !newPassword || !confirmPassword) {
        throw new customError("All fields are required", 400)
    }
    const user = await userSchema.findOne({email})
    if (!user) {
        throw new customError("User not found", 400)
    }
    if (user.resetPasswordToken !== otp) {
        throw new customError("Invalid OTP", 400)
    }
    if (user.resetPasswordExpire < Date.now()) {
        throw new customError("OTP expired", 400)
    }
    if (newPassword !== confirmPassword) {
        throw new customError("Passwords do not match", 400)
    }
    user.password = newPassword
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save()
    success(res, "Password reset successfully", null, 200)
})

/**
 * Logout user
 * @type {(function(*, *, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.logout = asyncHandler(async (req, res) => {
    const user = await userSchema.findById(req.user.id)
    if (!user) {
        throw new customError("User not found", 400)
    }
    //Clear cookie
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
    user.refreshToken = null
    await user.save()
    success(res, "User logged out successfully", null, 200)
})

exports.getUser = asyncHandler(async (req, res) => {
    const user = await userSchema.findById(req.user.id)
    if (!user) {
        throw new customError("User not found", 400)
    }
    success(res, "User found successfully", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country
    }, 200)
})