import { validateAnswer } from '../src/services/evidenceChecker.js';

describe('evidenceChecker', () => {
  const question = '愛因斯坦是在德國出生的嗎？';
  const paragraph = 'Albert Einstein was born in Ulm, in the Kingdom of Württemberg in the German Empire, on 14 March 1879.';

  test('accepts affirmative answer with sufficient overlap', () => {
    const result = validateAnswer('是', question, paragraph);
    expect(result).toBe(true);
  });

  test('rejects affirmative answer when overlap missing', () => {
    const result = validateAnswer('是', '他是職業籃球員嗎？', paragraph);
    expect(result).toBe(false);
  });

  test('validates negative answers when negation found', () => {
    const result = validateAnswer('否', '他是否不是德國人？', 'He was not a German citizen after 1896.');
    expect(result).toBe(true);
  });
});

