export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL!;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const response = await fetch(`${redisUrl}/incr/emoji-counter`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify({ count: data.result }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
