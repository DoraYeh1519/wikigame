import { splitParagraphs, tokenize } from '../src/services/textSplitter.js';

describe('textSplitter', () => {
  test('splitParagraphs removes empty lines', () => {
    const input = 'First paragraph.\n\nSecond paragraph.\n\n\nThird.';
    const paragraphs = splitParagraphs(input);
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toBe('First paragraph.');
    expect(paragraphs[1]).toBe('Second paragraph.');
  });

  test('tokenize filters stop words and preserves letters', () => {
    const tokens = tokenize('The quick brown fox jumps over the lazy dog in 1990.');
    expect(tokens).toContain('quick');
    expect(tokens).toContain('1990');
    expect(tokens).not.toContain('the');
  });
});

