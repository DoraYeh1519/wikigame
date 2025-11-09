import { rankParagraphs } from '../src/services/retriever.js';

describe('rankParagraphs', () => {
  const paragraphs = [
    'Albert Einstein was a German-born theoretical physicist.',
    'He developed the theory of relativity, one of the two pillars of modern physics.',
    'Einstein was awarded the 1921 Nobel Prize in Physics for his services to theoretical physics.',
  ];

  test('returns best paragraph with sufficient overlap', () => {
    const { best } = rankParagraphs('Einstein won the Nobel Prize in Physics?', paragraphs, {
      threshold: 0.1,
      minTokenOverlap: 2,
      topK: 2,
    });
    expect(best).not.toBeNull();
    expect(best.index).toBe(2);
  });

  test('returns null when overlap too low', () => {
    const { best } = rankParagraphs('Did he play basketball professionally?', paragraphs, {
      threshold: 0.3,
      minTokenOverlap: 2,
      topK: 1,
    });
    expect(best).toBeNull();
  });
});

