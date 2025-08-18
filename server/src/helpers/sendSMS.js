require("dotenv").config();
const axios = require("axios");
const sendSMS = async (number, message)=>{
    try {
        await axios.post(process.env.SMS_URL, {
            "api_key" : process.env.SMS_API_KEY,
            "senderid" : process.env.SMS_SENDER_ID,
            "number" : Array.isArray(number)? number.join(",") : number,
            "message" : message
        })
    } catch (error) {
        console.error(error);
    }
}
module.exports = sendSMS