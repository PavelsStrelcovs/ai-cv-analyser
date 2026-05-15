export function downloadReviewReport({ analysis, meta, match }) {
  const sections = [
    `CV Builder by PS - Review Report`,
    ``,
    `File: ${meta.fileName}`,
    `Words extracted: ${meta.wordCount}`,
    `ATS score: ${analysis.atsScore}/100`,
    match ? `Local job match: ${match.matchScore}/100` : "",
    ``,
    `Strengths`,
    ...formatList(analysis.strengths),
    ``,
    `Weaknesses`,
    ...formatList(analysis.weaknesses),
    ``,
    `Missing keywords`,
    ...formatList(analysis.missingKeywords),
    ``,
    `Suggestions`,
    ...formatList(analysis.suggestions)
  ].filter(line => line !== null);

  const blob = new Blob([sections.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${meta.fileName.replace(/\.pdf$/i, "")}-cv-review.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatList(items) {
  return items.length ? items.map(item => `- ${item}`) : ["- None returned"];
}
