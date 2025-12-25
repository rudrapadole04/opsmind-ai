const { pipeline } = require("@xenova/transformers");

let embedder;

// Load once (important)
async function loadModel() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

const createEmbedding = async (text) => {
  const model = await loadModel();
  const output = await model(text, { pooling: "mean", normalize: true });

  // output.data is a Float32Array
  return Array.from(output.data);
};

module.exports = createEmbedding;
