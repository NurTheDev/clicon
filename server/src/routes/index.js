const express = require("express");
const router = express.Router();
const testApi = require("./api/test.api");

router.use("/test", testApi);

module.exports = router;
