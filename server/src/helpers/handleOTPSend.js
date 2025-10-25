const {customError} = require("../utils/customError")
const {sendEmail} = require("../helpers/sendEmail")
const {sendSMS} = require("../helpers/sendSMS")
const {verifyEmail} = require("../templet/emailTemplet")
const emailOTPSend = async (user, email, otp, expiry) => {
    if (user.emailVerificationExpire && user.emailVerificationExpire > new Date()) {
        const waitTime = Math.ceil(user.emailVerificationExpire - new Date()) / 1000 / 60
        throw new customError(`Please wait ${waitTime} minutes before sending another email`, 400)
    }
    const verifyLink = `http://localhost:3000/verify?email=${email}&otp=${otp}`
    const emailVerifyTemplate = verifyEmail(user.name, otp, expiry, verifyLink)
    await sendEmail(email, emailVerifyTemplate, "Email verification")
    user.emailVerificationToken = otp
    user.emailVerificationExpire = expiry
    user.save()
}
const phoneOTPSend = async (user, phone, otp, expiry) => {
    if (user.phoneVerificationExpire && user.phoneVerificationExpire > new Date()) {
        const waitTime = Math.ceil(user.phoneVerificationExpire - new Date()) / 1000 / 60
        throw new customError(`Please wait ${waitTime} minutes before sending another email`, 400)
    }
    const smsTemplate = `Your Clicon OTP is ${otp}. It will expire on ${expiry.toLocaleString()}. Do not share this code with anyone.`
    await sendSMS(phone, smsTemplate)
    user.phoneVerificationToken = otp
    user.phoneVerificationExpire = expiry
    user.save()
}

module.exports = {
    emailOTPSend,
    phoneOTPSend
}