const Embedding = require("../models/Embedding");
const createEmbedding = require("../services/localEmbeddings");
const generateAnswerStream = require("../services/geminiStream");
const cleanText = require("../utils/textCleaner");

const CONFIDENCE_THRESHOLD = 0.65;

function cosineSimilarity(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

exports.askStream = async (req, res) => {
  const { question } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const queryEmbedding = await createEmbedding(question);
  const docs = await Embedding.find();

  const ranked = docs
    .map((doc) => ({
      text: doc.text,
      source: doc.source,
      page: doc.page,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Confidence guardrail
  if (!ranked.length || ranked[0].score < CONFIDENCE_THRESHOLD) {
    res.write(`data: I don’t know based on the provided documents.\n\n`);
    res.end();
    return;
  }

  const contexts = ranked.map((r) => r.text);

  // Stream answer
  await generateAnswerStream(question, contexts, (token) => {
    res.write(`data: ${cleanText(token)}\n\n`);
  });

  // Deduplicated citations
  const sources = [
    ...new Map(
      ranked.map((r) => [
        `${r.source}-${r.page}`,
        { document: r.source, page: r.page },
      ])
    ).values(),
  ];

  res.write(`event: sources\ndata: ${JSON.stringify(sources)}\n\n`);
  res.write(`event: end\ndata: done\n\n`);
  res.end();
};
