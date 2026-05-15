const stopWords = new Set([
  "and", "the", "for", "with", "you", "your", "our", "are", "will", "this", "that",
  "from", "have", "has", "role", "work", "team", "teams", "within", "across", "using",
  "job", "candidate", "skills", "experience", "ability", "able", "new", "all", "can"
]);

export function calculateLocalJobMatch(cvText, jobDescription, aiMissingKeywords = []) {
  const jobKeywords = topKeywords(jobDescription, 18);
  if (!jobKeywords.length) return null;

  const cvWords = new Set(words(cvText));
  const matchedKeywords = jobKeywords.filter(keyword => cvWords.has(keyword));
  const missingKeywords = unique([
    ...jobKeywords.filter(keyword => !cvWords.has(keyword)),
    ...aiMissingKeywords.map(keyword => keyword.toLowerCase())
  ]).slice(0, 14);

  return {
    matchScore: Math.round((matchedKeywords.length / jobKeywords.length) * 100),
    matchedKeywords,
    missingKeywords
  };
}

function topKeywords(text, limit) {
  const counts = new Map();
  for (const word of words(text)) {
    if (stopWords.has(word) || word.length < 3) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function words(text) {
  return String(text || "").toLowerCase().match(/[a-z][a-z+#.-]{2,}/g) || [];
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
