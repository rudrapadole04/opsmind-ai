const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Streams answer token-by-token
 * @param {string} prompt
 * @param {(token: string) => void} onToken
 */
async function generateStreamedAnswer(prompt, onToken) {
  const stream = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // ⭐ best quality
    // alternative (faster, smaller):
    // model: "mixtral-8x7b-32768",
    messages: [
      {
        role: "system",
        content:
          "You are an enterprise knowledge assistant. Answer ONLY from the provided context. If unsure, say you don’t know.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    temperature: 0.2,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) onToken(token);
  }
}

module.exports = generateStreamedAnswer;
