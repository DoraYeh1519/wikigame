import express from 'express';
import { router } from './api/routes.js';
import { logger } from './logger.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api', router);

export default app;

if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  app.listen(port, () => {
    logger.info({ port }, 'Backend listening');
  });
}

