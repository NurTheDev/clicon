const express = require("express");
const {test} = require("../../controllers/test.controller");
const router = express.Router();

router.route("/").get(test);

module.exports = router;
