const Embedding = require("../models/Embedding");
const createEmbedding = require("../services/localEmbeddings");

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

exports.search = async (req, res) => {
  const { query } = req.body;

  const queryEmbedding = await createEmbedding(query);
  const docs = await Embedding.find();

  const results = docs
    .map((doc) => ({
      text: doc.text,
      source: doc.source,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json({ query, results });
};
