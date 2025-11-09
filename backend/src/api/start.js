import { randomUUID } from 'node:crypto';
import { fetchArticleByTitle, fetchRandomArticle } from '../services/wikiClient.js';
import { splitParagraphs } from '../services/textSplitter.js';
import { saveSession } from '../storage/upstashStore.js';
import { config } from '../config.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { logger } from '../logger.js';

export async function startHandler(req, res) {
  try {
    const { title } = req.body ?? {};
    const cleanedTitle = title ? sanitizeInput(String(title)) : null;

    const article = cleanedTitle ? await fetchArticleByTitle(cleanedTitle) : await fetchRandomArticle();
    const paragraphs = splitParagraphs(article.extract);
    const sessionId = randomUUID();

    await saveSession(sessionId, {
      title: article.title,
      paragraphs,
      createdAt: Date.now(),
    }, config.sessionTtlSeconds);

    res.json({
      session_id: sessionId,
      title: article.title,
      paragraph_count: paragraphs.length,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start session');
    res.status(500).json({ error: 'failed_to_start_session' });
  }
}

