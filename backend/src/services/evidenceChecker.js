import { tokenize } from './textSplitter.js';
import { normalizeToken, negativeWords, synonymMap } from '../rules/synonyms.js';
import { config } from '../config.js';

const negativeSet = new Set(negativeWords.map((word) => word.toLowerCase()));

function buildTokenSet(text) {
  const normalizedTokens = tokenize(text).map((token) => normalizeToken(token.toLowerCase()));
  const bag = new Set(normalizedTokens);

  for (const [key, value] of synonymMap.entries()) {
    if (text.includes(key)) {
      bag.add(value);
    }
  }

  return bag;
}

export function validateAnswer(answer, question, paragraph) {
  if (answer === '無關' || answer === '無法回答') return true;

  const questionTokens = buildTokenSet(question);
  const paragraphTokens = buildTokenSet(paragraph);
  let overlapCount = 0;

  for (const token of questionTokens) {
    if (paragraphTokens.has(token)) {
      overlapCount += 1;
    }
  }

  if (answer === '是') {
    return overlapCount >= config.minTokenOverlap;
  }

  if (answer === '否') {
    const hasNegative = [...paragraphTokens].some((token) => negativeSet.has(token));
    return hasNegative && overlapCount >= 1;
  }

  return false;
}

