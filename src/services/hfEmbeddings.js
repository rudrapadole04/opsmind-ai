const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY;

// Official router endpoint
const HF_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2";

const createEmbedding = async (text) => {
  if (!HF_API_KEY) {
    throw new Error("HF_API_KEY is missing in .env");
  }

  const response = await axios.post(
    HF_URL,
    {
      inputs: {
        sentences: [text], // ✅ CORRECT PAYLOAD
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // HF returns embeddings as array of arrays
  return response.data[0];
};

module.exports = createEmbedding;
