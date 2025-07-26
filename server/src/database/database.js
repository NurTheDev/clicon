const {dbName} = require("../constants/constant");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI + dbName;
    try{
        const connect = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    }catch (error){
        console.error(error);
        process.exit(1);
    }
}
module.exports = connectDB;
