function cleanText(text) {
  if (!text) return "";

  return text
    .replace(/\\n/g, " ") // ✅ remove escaped \n
    .replace(/\n/g, " ") // ✅ remove real newlines
    .replace(/\\t/g, " ") // escaped tabs
    .replace(/\t/g, " ") // real tabs
    .replace(/\s+/g, " ") // extra spaces
    .trim();
}

module.exports = cleanText;
