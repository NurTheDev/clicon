const express = require("express");
const app = express();
const connectDB = require("./database/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// Routes

// Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message);
    res.status(statusCode).send(err.message);
});
module.exports = app
