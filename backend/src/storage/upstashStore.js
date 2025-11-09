import { Redis } from '@upstash/redis';
import { config } from '../config.js';

let redisClient;

function getClient() {
  if (!redisClient) {
    redisClient = new Redis({
      url: config.upstash.url,
      token: config.upstash.token,
    });
  }
  return redisClient;
}

export async function saveSession(sessionId, data, ttlSeconds = config.sessionTtlSeconds) {
  const client = getClient();
  await client.set(sessionId, JSON.stringify(data), { ex: ttlSeconds });
}

export async function loadSession(sessionId) {
  const client = getClient();
  const value = await client.get(sessionId);
  return value ? JSON.parse(value) : null;
}

export async function deleteSession(sessionId) {
  const client = getClient();
  await client.del(sessionId);
}

