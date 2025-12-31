const express = require("express");
const multer = require("multer");
const { uploadPDF } = require("../controllers/upload.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadPDF);

module.exports = router;
