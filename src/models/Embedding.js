const mongoose = require("mongoose");

const EmbeddingSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  source: String,
  page: Number,
});

module.exports = mongoose.model("Embedding", EmbeddingSchema);
