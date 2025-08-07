const mongoose = require("mongoose");
require("dotenv").config();
const {dbName} = require("../constants/constant");

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI + dbName;
        if (dbURI) {
            const connection = await mongoose.connect(dbURI);
            console.log("Connected to the database", connection.connection.host);
        } else {
            console.error("No database URI found");
            console.log(dbURI, dbName, "No database URI found");
        }
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
}
module.exports = connectDB
