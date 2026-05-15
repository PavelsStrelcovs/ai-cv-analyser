export async function downloadReviewReport({ analysis, meta, match }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 54;

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 86, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CV Builder by PS", margin, 42);
  doc.setFontSize(11);
  doc.text("AI CV Review Report", margin, 64);

  y = 120;
  doc.setTextColor(22, 32, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`File: ${meta.fileName}`, margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.text(`Words extracted: ${meta.wordCount}`, margin, y);
  y += 22;
  doc.text(`ATS score: ${analysis.atsScore}/100`, margin, y);
  if (match) {
    y += 22;
    doc.text(`Local job match: ${match.matchScore}/100`, margin, y);
  }

  y += 34;
  y = addSection(doc, "Strengths", analysis.strengths, margin, y);
  y = addSection(doc, "Weaknesses", analysis.weaknesses, margin, y);
  y = addSection(doc, "Missing keywords", analysis.missingKeywords, margin, y);
  y = addSection(doc, "Suggestions", analysis.suggestions, margin, y);

  doc.save(`${meta.fileName.replace(/\.pdf$/i, "")}-cv-review.pdf`);
}

function addSection(doc, title, items, margin, y) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

  if (y > pageHeight - 100) {
    doc.addPage();
    y = margin;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 118, 110);
  doc.text(title, margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);

  for (const item of items.length ? items : ["None returned"]) {
    const lines = doc.splitTextToSize(`- ${item}`, maxWidth);
    if (y + lines.length * 14 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines, margin, y);
    y += lines.length * 14 + 8;
  }

  return y + 10;
}
