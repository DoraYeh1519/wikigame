import { loadSession } from '../storage/upstashStore.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { tryRuleAnswer } from '../rules/engine.js';
import { rankParagraphs } from '../services/retriever.js';
import { askGemini } from '../services/llmClient.js';
import { validateAnswer } from '../services/evidenceChecker.js';
import { logger } from '../logger.js';

const allowedAnswers = new Set(['是', '否', '無關', '無法回答']);

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

    const ruleAnswer = tryRuleAnswer(sanitizedQuestion, paragraphs);
    if (ruleAnswer) {
      const evidenceParagraph = paragraphs[ruleAnswer.evidenceIndex];
      res.json({
        session_id: sessionId,
        answer: ruleAnswer.answer,
        evidence: evidenceParagraph,
        evidence_index: ruleAnswer.evidenceIndex,
      });
      return;
    }

    const { best } = rankParagraphs(sanitizedQuestion, paragraphs);

    if (!best) {
      res.json({
        session_id: sessionId,
        answer: '無法回答',
        evidence: null,
        evidence_index: null,
      });
      return;
    }

    const evidenceParagraph = best.paragraph;
    const evidenceIndex = best.index;

    let answer = await askGemini({
      paragraph: evidenceParagraph,
      index: evidenceIndex,
      question: sanitizedQuestion,
    });

    if (!allowedAnswers.has(answer)) {
      answer = '無法回答';
    }

    if (!validateAnswer(answer, sanitizedQuestion, evidenceParagraph)) {
      answer = '無法回答';
    }

    res.json({
      session_id: sessionId,
      answer,
      evidence: evidenceParagraph,
      evidence_index: evidenceIndex,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to judge question');
    res.status(500).json({ error: 'judge_failed' });
  }
}

