const cleanText = require("../utils/textCleaner");

function generateAnswer(question, contexts) {
  const keywords = question.toLowerCase().split(" ");

  for (const rawText of contexts) {
    const text = cleanText(rawText); // ✅ CLEAN FIRST

    for (const word of keywords) {
      if (text.toLowerCase().includes(word)) {
        return text.slice(0, 400) + "..."; // ✅ RETURN CLEAN TEXT
      }
    }
  }

  return "The information is not explicitly available in the provided documents.";
}

module.exports = generateAnswer;
