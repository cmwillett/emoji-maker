/**
 * Fetch a value from Upstash Redis by key.
 * @param {string} key - The Redis key to get.
 * @returns {Promise<any>} - The value from Redis.
 */
export async function getRedisValue(key: string): Promise<any> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL!;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const response = await fetch(`${redisUrl}/get/${key}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
  });

  return response.json();
}

/**
 * Increment a Redis key in Upstash.
 * @param {string} key - The Redis key to increment.
 * @returns {Promise<any>} - The new value after increment.
 */
export async function incrRedisValue(key: string): Promise<any> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL!;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const response = await fetch(`${redisUrl}/incr/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
  });

  return response.json();
}