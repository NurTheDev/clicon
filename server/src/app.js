const express = require('express');
const app = express();
const cors = require('cors');
const globalError = require("./utils/globalError")
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

require("dotenv").config();
// All middleware goes here
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Hello from server");
    console.log("Hello from server");
})

// All routes go here
app.use(process.env.API_VERSION, require("./routes/index"))

// Error handler middleware
app.use(globalError)
module.exports = app;
