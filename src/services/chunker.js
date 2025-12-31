module.exports = function chunkText(text, size = 800, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push({
      text: text.slice(start, start + size),
    });
    start += size - overlap;
  }

  return chunks;
};
