const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();
// All middleware goes here
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello from server");
    console.log("Hello from server");
})

// All routes go here
app.use(process.env.API_VERSION, require("./routes/index"))

// Error handler middleware
app.use((error, req, res, next)=>{
    const statusCode = error.statusCode || 500;
    console.error(error.message);
    res.status(statusCode).send(error.message);
})
module.exports = app;
