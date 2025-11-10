const userSchema = require("../models/user.model");
const customError = require("../utils/customError");
const asyncHandler = require("../helpers/asyncHandler");
const { success } = require("../utils/apiResponse");
const {
  userValidation,
  emailOTPValidation,
  phoneOTPValidation,
  verifyAccount,
  resendOTPValidation,
} = require("../validators/user.validator");
const { generateOTP } = require("../utils/otp");
const { verifyEmail, forgetPassword } = require("../templet/emailTemplet");
const { sendEmail } = require("../helpers/sendEmail");
const { verify } = require("jsonwebtoken");
const sendSMS = require("../helpers/sendSMS");
const sanitizeUser = require("../utils/sanitizeUser");
const { verifyOTP, clearOTPField } = require("../utils/otpVerification");
const { emailOTPSend, phoneOTPSend } = require("../helpers/handleOTPSend");
/**
 * Register user
 * @type {(function(*, *, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = await userValidation(req);
  const user = await userSchema.create({ name, email, phone, password });
  if (!user) {
    throw new customError("User registration failed", 400);
  }
  // Get OTP
  const { otp, expiry } = generateOTP();
  // if user create account via email send otp to email
  if (email) {
    const verifyLink = `http://localhost:3000/verify?email=${email}&otp=${otp}`;
    const emailVerifyTemplate = verifyEmail(name, otp, expiry, verifyLink);
    await sendEmail(email, emailVerifyTemplate, "Email verification");
    user.emailVerificationToken = otp;
    user.emailVerificationExpire = expiry;
    await user.save();
  }
  // if user create account via phone send otp to phone
  if (phone) {
    const smsTemplate = `Your Clicon OTP is ${otp}. It will expire on ${expiry.toLocaleString()}. Do not share this code with anyone.`;
    await sendSMS(phone, smsTemplate);
    user.phoneVerificationToken = otp;
    user.phoneVerificationExpire = expiry;
    await user.save();
  }
  success(res, "User registered successfully", sanitizeUser(user), 201);
});
/**
 * Verify email
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.emailVerify = asyncHandler(async (req, res) => {
  const { email, otp } = await emailOTPValidation(req);
  const user = await userSchema.findOne({ email });
  if (!user) {
    throw new customError("User not found", 400);
  }
  await verifyOTP(
    user,
    otp,
    "emailVerificationToken",
    "emailVerificationExpire"
  );
  await clearOTPField(
    otp,
    user,
    "emailVerificationToken",
    "emailVerificationExpire"
  );
  await user.save();
  success(res, "Email verified successfully", sanitizeUser(user), 200);
});
/**
 * Verify phone
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.phoneVerify = asyncHandler(async (req, res) => {
  const { phone, otp } = await phoneOTPValidation(req);
  const user = await userSchema.findOne({ phone });
  if (!user) {
    throw new customError("User not found", 400);
  }
  await verifyOTP(
    user,
    otp,
    "phoneVerificationToken",
    "phoneVerificationExpire"
  );
  await clearOTPField(
    otp,
    user,
    "phoneVerificationToken",
    "phoneVerificationExpire"
  );
  await user.save();
  success(res, "Phone verified successfully", user, 200);
});
/**
 * Login user
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, phone, password } = await userValidation(req);
  const query = [];
  if (email) {
    query.push({ email });
  }
  if (phone) {
    query.push({ phone });
  }
  if (query.length === 0) {
    throw new customError("Email or phone is required", 400);
  }
  const user = await userSchema.findOne({ $or: query });
  if (!user) {
    throw new customError("User not found", 400);
  }
  if (!user.isEmailVerified && !user.isPhoneVerified) {
    throw new customError("User not verified", 400);
  }
  const isMatch = await user.checkPassword(password);
  if (!isMatch) {
    throw new customError("Invalid password", 400);
  }

  // Make an access token and refresh token
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken; // save refresh token
  await user.save();
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  success(
    res,
    "User logged in successfully",
    {
      accessToken,
      name: user.name,
      email: user.email,
    },
    200
  );
});
/**
 * Verify account
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.verifyAccount = asyncHandler(async (req, res) => {
  const { email, phone, otp } = await verifyAccount(req);
  if (phone) {
    const user = await userSchema.findOne({ phone });
    if (!user) {
      throw new customError("User not found", 400);
    }
    await verifyOTP(
      otp,
      user,
      "phoneVerificationToken",
      "phoneVerificationExpire"
    );
    await clearOTPField(
      otp,
      user,
      "phoneVerificationToken",
      "phoneVerificationExpire"
    );
    await user.save();
    success(res, "Phone verified successfully", sanitizeUser(user), 200);
  }
  if (email) {
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw new customError("User not found", 400);
    }
    await verifyOTP(
      otp,
      user,
      "emailVerificationToken",
      "emailVerificationExpire"
    );
    await clearOTPField(
      user,
      "emailVerificationToken",
      "emailVerificationExpire",
      "isEmailVerified"
    );
    await user.save();
    success(res, "Email verified successfully", sanitizeUser(user), 200);
  }
});
/**
 * Resend OTP
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.resendOTP = asyncHandler(async (req, res) => {
  const { email, phone } = await resendOTPValidation(req);
  const query = [];
  if (email) {
    query.push({ email });
  }
  if (phone) {
    query.push({ phone });
  }
  if (query.length === 0) {
    throw new customError("Email or phone is required", 400);
  }
  const user = await userSchema.findOne({ $or: query });
  if (!user) {
    throw new customError("User not found", 400);
  }
  const { otp, expiry } = generateOTP();
  if (email) {
    //Check if enough time has passed
    await emailOTPSend(user, email, otp, expiry);
    success(res, "Email sent successfully", null, 200);
  }
  if (phone) {
    //Check if enough time has passed
    await phoneOTPSend(user, phone, otp, expiry);
    success(res, "OTP for Phone sent successfully", null, 200);
  }
});
/**
 * Forgot password
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) {
    throw new customError("Email or phone is required", 400);
  }
  if (phone) {
    const user = await userSchema.findOne({ phone });
    if (!user) {
      throw new customError("User not found", 400);
    }
    const { otp, expiry } = generateOTP();
    const smsTemplate = `Your Clicon OTP is ${otp}. It will expire on ${expiry.toLocaleString()}. Do not share this code with anyone.`;
    await sendSMS(phone, smsTemplate);
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = expiry;
    await user.save();
    return success(res, "OTP sent to phone successfully", null, 200);
  }
  if (email) {
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw new customError("User not found", 400);
    }
    const { otp, expiry } = generateOTP();
    const verifyLink = `http://localhost:3000/reset-password?email=${email}&otp=${otp}`;
    const emailVerifyTemplate = forgetPassword(otp, expiry, verifyLink);
    await sendEmail(email, emailVerifyTemplate, "Reset password email");
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = expiry;
    await user.save();
    success(res, "Email sent successfully", null, 200);
  }
});
/**
 * Reset password
 * @type {(function(*, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, phone, otp, newPassword, confirmPassword } =
    resendOTPValidation(req);
  if (email) {
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw new customError("User not found", 400);
    }
    await verifyOTP(user, otp, "resetPasswordToken", "resetPasswordExpire");
    if (newPassword !== confirmPassword) {
      throw new customError("Passwords do not match", 400);
    }
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    success(res, "Password reset successfully", null, 200);
  }
  if (phone) {
    const user = await userSchema.findOne({ phone });
    if (!user) {
      throw new customError("User not found", 400);
    }
    await verifyOTP(user, otp, "resetPasswordToken", "resetPasswordExpire");
    if (newPassword !== confirmPassword) {
      throw new customError("Passwords do not match", 400);
    }
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    success(res, "Password reset successfully", null, 200);
  }
});

/**
 * Logout user
 * @type {(function(*, *, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.logout = asyncHandler(async (req, res) => {
  const user = await userSchema.findById(req.user.id);
  if (!user) {
    throw new customError("User not found", 400);
  }
  //Clear cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  user.refreshToken = null;
  await user.save();
  success(res, "User logged out successfully", null, 200);
});

/**
 * Get use
 * @type {(function(*, *, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.getUser = asyncHandler(async (req, res) => {
  const user = await userSchema.findById(req.user.id);
  if (!user) {
    throw new customError("User not found", 400);
  }
  success(res, "User found successfully", sanitizeUser(user), 200);
});

/**
 * Get refresh token
 * @type {(function(*, *, *): Promise<void>)|*}
 * @returns {Promise<void>}
 * @throws {customError}
 */
exports.getRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new customError("Refresh token is required", 401);
  }
  const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  const user = await userSchema.findById(payload.id);
  if (!user) {
    throw new customError("User not found", 401);
  }
  const accessToken = await user.generateAccessToken();
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  success(
    res,
    "Refresh token found successfully",
    {
      accessToken,
      role: user.role,
    },
    200
  );
});
