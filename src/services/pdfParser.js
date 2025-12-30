const fs = require("fs");
const pdfParse = require("pdf-parse");

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);

  const pages = [];

  const data = await pdfParse(dataBuffer, {
    pagerender: (pageData) => {
      return pageData.getTextContent().then((content) => {
        const text = content.items.map((item) => item.str).join(" ");

        pages.push({
          pageNumber: pageData.pageIndex + 1,
          text,
        });

        return text;
      });
    },
  });

  return {
    fullText: data.text, // ✅ combined text (optional)
    pages, // ✅ [{ pageNumber, text }]
    totalPages: data.numpages, // ✅ page count
  };
}

module.exports = parsePDF;
