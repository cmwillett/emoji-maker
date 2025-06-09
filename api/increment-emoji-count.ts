import { incrRedisValue } from '../src/lib/redisApi';

export const config = {
  runtime: 'edge',
};

/**
 * Edge API handler to increment the emoji creation count in Upstash Redis.
 * Increments the "emoji-counter" key and returns the new value as JSON: { count: number }
 */
export default async function handler(request: Request) {
  const data = await incrRedisValue('emoji-counter');
  return new Response(JSON.stringify({ count: data.result }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}