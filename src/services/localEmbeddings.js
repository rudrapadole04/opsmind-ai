const { pipeline } = require("@xenova/transformers");

let embedder;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

module.exports = async function createEmbedding(text) {
  // 🔒 HARD GUARD
  if (typeof text !== "string") {
    throw new Error(`Embedding input must be a string. Got: ${typeof text}`);
  }

  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
};
