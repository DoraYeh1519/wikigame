import { tryRuleAnswer } from '../src/rules/engine.js';

describe('rules engine', () => {
  test('returns 是 when year matches birth question', () => {
    const question = '他是 1879 年出生的嗎？';
    const paragraphs = [
      'Albert Einstein was born in Ulm, in the Kingdom of Württemberg in the German Empire, on 14 March 1879.',
    ];
    const result = tryRuleAnswer(question, paragraphs);
    expect(result).not.toBeNull();
    expect(result.answer).toBe('是');
    expect(result.evidenceIndex).toBe(0);
  });

  test('returns null when no matching year', () => {
    const question = '他是 1990 年出生的嗎？';
    const paragraphs = [
      'Albert Einstein was born in Ulm, in the Kingdom of Württemberg in the German Empire, on 14 March 1879.',
    ];
    const result = tryRuleAnswer(question, paragraphs);
    expect(result).toBeNull();
  });
});

