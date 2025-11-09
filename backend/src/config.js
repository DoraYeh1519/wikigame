import 'dotenv/config';

const requiredVars = ['GEMINI_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV !== 'test') {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  upstash: {
    url: process.env.UPSTASH_REDIS_REST_URL ?? '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  },
  sessionTtlSeconds: Number.parseInt(process.env.SESSION_TTL ?? '600', 10),
  retrieverTopK: Number.parseInt(process.env.TOP_K ?? '1', 10),
  overlapThreshold: Number.parseFloat(process.env.OVERLAP_THRESHOLD ?? '0.15'),
  minTokenOverlap: Number.parseInt(process.env.MIN_TOKEN_OVERLAP ?? '1', 10),
};

