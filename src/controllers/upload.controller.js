const parsePDF = require("../services/pdfParser");
const chunkText = require("../services/chunker");
const createEmbedding = require("../services/localEmbeddings");
const Embedding = require("../models/Embedding");
const { text } = require("express");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1️⃣ Parse PDF → pages with page numbers
    const pages = await parsePDF(req.file.path);

    let totalChunks = 0;

    // 2️⃣ Loop through pages
    for (const page of pages) {
      const chunks = chunkText(page.text);

      // 3️⃣ Loop through chunks of each page
      for (const chunk of chunks) {
        const embedding = await createEmbedding(chunk, text);

        await Embedding.create({
          text: chunk.text,
          embedding,
          source: req.file.originalname,
          page: chunk.page, // ✅ PAGE NUMBER STORED
        });

        totalChunks++;
      }
    }

    // 4️⃣ Success response
    res.status(201).json({
      message: "PDF processed successfully",
      chunksStored: totalChunks,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      error: "Internal server error during PDF ingestion",
    });
  }
};
