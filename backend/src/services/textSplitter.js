const paragraphSplitter = /\n\s*\n/g;
const stopWords = new Set([
  'the',
  'of',
  'and',
  'a',
  'to',
  'in',
  'is',
  'that',
  'for',
  'on',
  'with',
  'as',
  'by',
  'an',
  'be',
  'are',
  'was',
  'were',
  'it',
  'from',
  'at',
]);

const wordRegex = /[\p{L}\p{N}]+/gu;

export function splitParagraphs(text) {
  if (!text) return [];
  return text
    .split(paragraphSplitter)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function tokenize(text) {
  if (!text) return [];
  const lowercase = text.toLowerCase();
  const matches = lowercase.match(wordRegex);
  if (!matches) return [];
  return matches.filter((token) => !stopWords.has(token));
}

