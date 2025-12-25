const parsePDF = require("../services/pdfParser");
const chunkText = require("../services/chunker");
const createEmbedding = require("../services/localEmbeddings");

const Embedding = require("../models/Embedding");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await parsePDF(req.file.path);
    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);
      await Embedding.create({
        text: chunk,
        embedding,
        source: req.file.originalname,
      });
    }

    res.status(201).json({
      message: "PDF processed successfully",
      chunksStored: chunks.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
