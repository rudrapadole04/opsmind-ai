const mongoose = require("mongoose");

const EmbeddingSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  source: String,
});

module.exports = mongoose.model("Embedding", EmbeddingSchema);
