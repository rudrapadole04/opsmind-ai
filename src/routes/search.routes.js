const express = require("express");
const router = express.Router();

// 👇 IMPORTANT: destructuring import
const { search } = require("../controllers/search.controller");

// 👇 MUST pass a function reference (NOT search(), NOT object)
router.post("/search", search);

module.exports = router;
