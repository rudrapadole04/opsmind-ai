const CONFIDENCE_THRESHOLD = 0.65;
const Embedding = require("../models/Embedding");
const createEmbedding = require("../services/localEmbeddings");
const generateAnswer = require("../services/answerGenerator");
const cleanText = require("../utils/textCleaner");

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

// ✅ NAMED EXPORT (this is what router expects)
exports.search = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

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

    if (!ranked.length || ranked[0].score < CONFIDENCE_THRESHOLD) {
      return res.json({
        question,
        answer: "I don’t know based on the provided documents.",
        sources: [],
        confidence: ranked[0]?.score || 0,
      });
    }

    const contexts = ranked.map((r) => r.text);
    const answer = generateAnswer(question, contexts);

    // ✅ Deduplicate sources
    const uniqueSources = [
      ...new Map(
        ranked.map((r) => [
          `${r.source}-${r.page}`,
          { document: r.source, page: r.page },
        ])
      ).values(),
    ];

    res.json({
      question,
      answer: cleanText(answer),
      sources: uniqueSources,
      confidence: ranked[0].score,
    });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
