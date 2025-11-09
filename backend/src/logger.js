import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  enabled: process.env.DISABLE_LOGS !== 'true',
  base: undefined,
});

