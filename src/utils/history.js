export const HISTORY_KEY = "resumeiq.reviewHistory.v1";

export function loadReviewHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.slice(0, 5).map(review => ({
        ...review,
        atsScore: review.atsScore ?? review.score ?? 0,
        missingKeywordsCount: review.missingKeywordsCount ?? review.missingSkillsCount ?? 0
      }))
      : [];
  } catch {
    return [];
  }
}

export function buildReviewSummary(analysis) {
  if (analysis.suggestions.length) return analysis.suggestions[0];
  if (analysis.weaknesses.length) return analysis.weaknesses[0];
  return "CV analysed successfully.";
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}
