import { askGemini, setModelFactory } from '../src/services/llmClient.js';

function createStubModel(output) {
  return {
    async generateContent() {
      return {
        response: {
          text: () => output,
        },
      };
    },
  };
}

describe('llmClient', () => {
  beforeAll(() => {
    setModelFactory(() => createStubModel('無法判斷'));
  });

  afterAll(() => {
    setModelFactory(() => createStubModel('無法判斷'));
  });

  test('returns allowed answer as-is', async () => {
    setModelFactory(() => createStubModel('是'));
    await expect(
      askGemini({ paragraph: 'content', index: 0, question: 'question' }),
    ).resolves.toBe('是');
  });

  test('normalizes unexpected output to 無法判斷', async () => {
    setModelFactory(() => createStubModel('也許'));
    await expect(
      askGemini({ paragraph: 'content', index: 0, question: 'question' }),
    ).resolves.toBe('無法判斷');
  });
});

