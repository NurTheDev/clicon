const axios = require("axios");
require("dotenv").config();
const axiosInstance = axios.create({
    baseURL: process.env.STEADFAST_BASE_URL,
    timeout: 5000, // example timeout
    headers: {
        'Api-Key': process.env.STEADFAST_API_KEY,
        "Secret-Key": process.env.STEADFAST_SECRET_KEY,
        'Content-Type': 'application/json'
    }
});
module.exports = axiosInstance;