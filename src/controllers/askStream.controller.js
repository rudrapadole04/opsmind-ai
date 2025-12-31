const generateStreamedAnswer = require("../services/groqClient");
const Embedding = require("../models/Embedding");
const createEmbedding = require("../services/localEmbeddings");

function cosineSimilarity(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

exports.askStream = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 🔥 THIS LINE IS CRITICAL
  res.flushHeaders();

  const question = req.query.q;

  if (!question) {
    res.write("data: Question missing\n\n");
    res.end();
    return;
  }

  const queryEmbedding = await createEmbedding(question);
  const docs = await Embedding.find();

  const ranked = docs
    .map((d) => ({
      text: d.text,
      source: d.source,
      page: d.page,
      score: cosineSimilarity(queryEmbedding, d.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const CONFIDENCE_THRESHOLD = 0.65;
  if (!ranked.length || ranked[0].score < CONFIDENCE_THRESHOLD) {
    res.write(`data: I don’t know based on the provided documents.\n\n`);
    res.end();
    return;
  }

  const context = ranked.map((r) => r.text).join("\n\n");
  const prompt = `
Answer the question using ONLY the context below.
Context:
${context}

Question:
${question}
`;
  console.log(
    ranked.map((r) => ({
      score: r.score,
      preview: r.text.slice(0, 80),
    }))
  );

  await generateStreamedAnswer(prompt, (token) => {
    if (token) {
      res.write(`data: ${token}\n\n`);
    }
  });

  // Send citations at the end
  res.write(`event: citations\ndata: ${JSON.stringify(ranked)}\n\n`);
  res.end();
};
