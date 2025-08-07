const express = require("express");
const router = express.Router();
const testApi = require("./api/test.api");
const authApi = require("./api/auth.api");
router.use("/test", testApi);
router.use("/auth", authApi)
module.exports = router;
