const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// Routes
app.use("/", require("./routes/index"));
// Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message);
    res.status(statusCode).send(err.message);
});
module.exports = app
