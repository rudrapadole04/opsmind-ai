module.exports = function chunkText(
  text,
  pageNumber,
  chunkSize = 1000,
  overlap = 200
) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push({
      text: text.slice(start, start + chunkSize),
      page: pageNumber, // ✅ correct page citation
    });

    start += chunkSize - overlap;
  }

  return chunks;
};
