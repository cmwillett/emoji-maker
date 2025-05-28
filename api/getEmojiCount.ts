export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL!;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const response = await fetch(`${redisUrl}/get/emoji-counter`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify({ count: parseInt(data.result || '0', 10) }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
