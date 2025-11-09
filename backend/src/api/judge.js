import { loadSession } from '../storage/upstashStore.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { rankParagraphs } from '../services/retriever.js';
import { askGemini } from '../services/llmClient.js';
import { logger } from '../logger.js';

const allowedAnswers = new Set(['是', '否', '無關', '無法判斷']);

export async function judgeHandler(req, res) {
  try {
    const { session_id: sessionId, question } = req.body ?? {};
    if (!sessionId || !question) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }

    const sanitizedQuestion = sanitizeInput(String(question));
    if (!sanitizedQuestion) {
      res.status(400).json({ error: 'empty_question' });
      return;
    }

    const session = await loadSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'session_not_found' });
      return;
    }

    const paragraphs = session.paragraphs ?? [];
    if (!paragraphs.length) {
      res.status(500).json({ error: 'session_corrupted' });
      return;
    }

    const { best } = rankParagraphs(sanitizedQuestion, paragraphs);

    if (!best) {
      res.json({
        session_id: sessionId,
        answer: '無法判斷',
      });
      return;
    }

    let answer = await askGemini({
      paragraph: best.paragraph,
      index: best.index,
      question: sanitizedQuestion,
    });

    if (!allowedAnswers.has(answer)) {
      answer = '無法判斷';
    }

    res.json({
      session_id: sessionId,
      answer,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to judge question');
    res.status(500).json({ error: 'judge_failed' });
  }
}

