const express = require("express");
const router = express.Router();
const testApi = require("./api/test.api");
const authApi = require("./api/auth.api");
const categoryApi = require("./api/category.api");
router.use("/test", testApi);
router.use("/auth", authApi)
router.use("/category", categoryApi)
module.exports = router;
