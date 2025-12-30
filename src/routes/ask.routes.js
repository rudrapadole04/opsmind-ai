const express = require("express");
const { askStream } = require("../controllers/askStream.controller");

const router = express.Router();

router.get("/stream", askStream);

module.exports = router;
