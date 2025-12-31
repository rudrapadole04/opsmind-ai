const parsePDF = require("../services/pdfParser");
const chunkText = require("../services/chunker");
const createEmbedding = require("../services/localEmbeddings");
const Embedding = require("../models/Embedding");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pages = await parsePDF(req.file.path);

    let stored = 0;

    for (const page of pages) {
      // 🔒 ENSURE STRING
      if (typeof page.text !== "string") continue;

      const chunks = chunkText(page.text);

      for (const chunk of chunks) {
        // 🔒 ENSURE STRING AGAIN
        if (typeof chunk.text !== "string") continue;

        const embedding = await createEmbedding(chunk.text);

        await Embedding.create({
          text: chunk.text,
          embedding,
          source: req.file.originalname,
          page: page.pageNumber,
        });

        stored++;
      }
    }

    res.status(201).json({
      message: "PDF processed successfully",
      chunksStored: stored,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
