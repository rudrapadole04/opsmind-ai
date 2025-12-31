const fs = require("fs");
const pdf = require("pdf-parse");

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pages = [];

  await pdf(dataBuffer, {
    pagerender: (pageData) => {
      return pageData.getTextContent().then((content) => {
        const text = content.items.map((i) => i.str).join(" ");
        pages.push({
          pageNumber: pageData.pageIndex + 1,
          text,
        });
        return text;
      });
    },
  });

  return pages; // ✅ ARRAY
}

module.exports = parsePDF;
