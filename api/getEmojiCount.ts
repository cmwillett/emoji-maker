import { getRedisValue } from '../src/lib/redisApi';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const data = await getRedisValue('emoji-counter');
  return new Response(JSON.stringify({ count: parseInt(data.result || '0', 10) }), {
    headers: { 'Content-Type': 'application/json' },
  });
}