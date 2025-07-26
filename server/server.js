const connectDB = require("./src/database/database");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000; // Use PORT environment variable if available, otherwise default to 5000
connectDB().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}, address: http://localhost:${PORT}`);
})
}).catch((err)=>{
    console.error(err);
})

