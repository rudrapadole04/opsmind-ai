const express = require("express");
const upload = require("../config/multer");
const { uploadPDF } = require("../controllers/upload.controller");

const router = express.Router();
router.post("/", upload.single("file"), uploadPDF);

module.exports = router;
