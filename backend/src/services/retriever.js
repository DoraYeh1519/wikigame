import { tokenize } from './textSplitter.js';
import { normalizeToken } from '../rules/synonyms.js';
import { config } from '../config.js';

function normalizeTokens(tokens) {
  return tokens.map((token) => normalizeToken(token.toLowerCase()));
}

function unique(tokens) {
  return [...new Set(tokens)];
}

function computeOverlap(questionTokens, paragraphTokens) {
  const questionSet = new Set(unique(questionTokens));
  const paragraphSet = new Set(unique(paragraphTokens));
  let overlapCount = 0;
  for (const token of questionSet) {
    if (paragraphSet.has(token)) {
      overlapCount += 1;
    }
  }
  const score = questionSet.size === 0 ? 0 : overlapCount / questionSet.size;
  return { score, overlapCount };
}

export function rankParagraphs(question, paragraphs, options = {}) {
  const topK = options.topK ?? config.retrieverTopK;
  const threshold = options.threshold ?? config.overlapThreshold;
  const minTokenOverlap = options.minTokenOverlap ?? config.minTokenOverlap;

  const questionTokens = normalizeTokens(tokenize(question));

  const scored = paragraphs
    .map((paragraph, index) => {
      const paragraphTokens = normalizeTokens(tokenize(paragraph));
      const { score, overlapCount } = computeOverlap(questionTokens, paragraphTokens);
      return { index, score, overlapCount, paragraph };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, topK);
  const best = top[0];

  if (!best || best.score < threshold || best.overlapCount < minTokenOverlap) {
    return { top: [], best: null };
  }

  return { top, best };
}

