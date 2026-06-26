const VISITOR_COUNT_KEY = 'portfolio:visitors:total';

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

async function upstashRequest<T>(command: string[], cache: RequestCache = 'no-store'): Promise<T | null> {
  const config = getRedisConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/${command.map(encodeURIComponent).join('/')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache,
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed with status ${response.status}`);
  }

  const data = await response.json();
  return (data.result ?? null) as T | null;
}

export async function getVisitorCount(): Promise<number> {
  try {
    const result = await upstashRequest<string>(['get', VISITOR_COUNT_KEY]);
    return Number(result || 0);
  } catch (error) {
    console.error('Failed to fetch visitor count:', error);
    return 0;
  }
}

export async function incrementVisitorCount(): Promise<number> {
  const result = await upstashRequest<number>(['incr', VISITOR_COUNT_KEY]);
  return Number(result || 0);
}

export function isVisitorCounterConfigured() {
  return Boolean(getRedisConfig());
}
