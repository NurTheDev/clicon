const customError = require("../utils/customError")
/**
 * verify OTP for user
 * @param {Object} user - User document from database
 * @param otp - OTP to be verified
 * @param tokenField - OTP token field
 * @param expiry - OTP expiry
 * @returns {Promise<void>}
 * @throws {customError}
 */
const verifyOTP = (otp, user, tokenField, expiry) => {
    console.log("user:", user[tokenField], "otp:", otp)
    if (user[tokenField] !== otp) {
        throw new customError("Invalid OTP", 400)
    }
    if (user[expiry] < Date.now()) {
        throw new customError("OTP expired", 400)
    }
}

const clearOTPField = (user, tokenField, expiry, verificationField) => {
    user[verificationField] = true
    user[tokenField] = null
    user[expiry] = null
}

module.exports = {
    verifyOTP,
    clearOTPField
}