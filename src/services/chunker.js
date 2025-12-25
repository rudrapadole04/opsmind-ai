const chunkText = (text, size = 1000, overlap = 200) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }

  return chunks;
};

module.exports = chunkText;
