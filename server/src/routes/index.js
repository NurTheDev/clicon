const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from server");
    console.log("Hello from server");
});

module.exports = router;
