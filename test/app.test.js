import assert from "node:assert/strict";
import test from "node:test";
import { cleanText, clampScore, normalizeList, parseJsonAnalysis, prepareCvText } from "../server/app.js";

test("cleanText removes repeated spacing and blank lines", () => {
  assert.equal(cleanText("  Hello    world\n\n\nCV  "), "Hello world\n\nCV");
});

test("prepareCvText caps long CV text", () => {
  const text = "a".repeat(12000);
  assert.equal(prepareCvText(text).length, 10000);
});

test("parseJsonAnalysis returns normalized structured feedback", () => {
  const analysis = parseJsonAnalysis(`{
    "atsScore": 87,
    "strengths": ["Clear structure"],
    "weaknesses": ["Needs metrics"],
    "missingKeywords": ["React"],
    "suggestions": ["Add quantified impact"]
  }`);

  assert.equal(analysis.atsScore, 87);
  assert.deepEqual(analysis.missingKeywords, ["React"]);
});

test("parseJsonAnalysis rejects invalid AI JSON shape", () => {
  assert.throws(() => parseJsonAnalysis(`{"atsScore": 90, "strengths": []}`), /weaknesses/);
});

test("score and list helpers normalize unsafe values", () => {
  assert.equal(clampScore(140), 100);
  assert.equal(clampScore(-4), 0);
  assert.deepEqual(normalizeList(["a", "", 7]), ["a", "7"]);
});
