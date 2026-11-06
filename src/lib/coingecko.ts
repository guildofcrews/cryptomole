const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

/**
 * Prices may be reused only while this window is still fresh. Expired entries
 * are never returned: the caller waits for a new CoinGecko response.
 * This is intentionally not stale-while-revalidate.
 */
export const PRICE_FRESH_MS = 15_000;

/** Keep price payloads off the browser cache and the Vercel CDN. */
export const PRICE_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
} as const;

export interface MarketData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  rank: number | null;
}

type FreshEntry<T> = { value: T; fetchedAt: number };

export function createFreshCache(ttlMs: number, now: () => number = Date.now) {
  const entries = new Map<string, FreshEntry<unknown>>();
  const inflight = new Map<string, Promise<FreshEntry<unknown>>>();

  return {
    async get<T>(key: string, load: () => Promise<T>): Promise<FreshEntry<T>> {
      const hit = entries.get(key);
      if (hit && now() - hit.fetchedAt < ttlMs) {
        return hit as FreshEntry<T>;
      }

      const pending = inflight.get(key);
      if (pending) return pending as Promise<FreshEntry<T>>;

      const promise = load()
        .then((value) => {
          const entry = { value, fetchedAt: now() };
          entries.set(key, entry);
          return entry;
        })
        .finally(() => {
          if (inflight.get(key) === promise) inflight.delete(key);
        });

      inflight.set(key, promise);
      return promise as Promise<FreshEntry<T>>;
    },
  };
}

const coinGeckoCache = createFreshCache(PRICE_FRESH_MS);

export function parseCoinIds(
  raw: string | null
): { ids: string[] } | { error: string; status: number } {
  if (!raw) return { error: "ids parameter required", status: 400 };
  const ids = [
    ...new Set(
      raw
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ].sort();
  if (ids.length > 100) {
    return { error: "Maximum 100 coins per request", status: 400 };
  }
  return { ids };
}

/**
 * Fetch CoinGecko without Next.js' persistent fetch cache.
 * `next: { revalidate }` serves the previous body and refreshes in the
 * background, which is the wrong model for prices.
 */
export async function fetchCoinGecko<T>(
  path: string
): Promise<FreshEntry<T>> {
  const url = `${COINGECKO_API_BASE}${path}`;
  return coinGeckoCache.get(url, async () => {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`CoinGecko ${response.status}`);
    }
    return (await response.json()) as T;
  });
}

export async function getMarketData(
  coingeckoId: string
): Promise<MarketData | null> {
  try {
    const { value: data } = await fetchCoinGecko<{
      market_data?: {
        current_price?: { usd?: number };
        price_change_percentage_24h?: number;
        market_cap?: { usd?: number };
        total_volume?: { usd?: number };
      };
      market_cap_rank?: number | null;
    }>(
      `/coins/${encodeURIComponent(coingeckoId)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
    );

    return {
      price: data.market_data?.current_price?.usd ?? 0,
      priceChange24h: data.market_data?.price_change_percentage_24h ?? 0,
      marketCap: data.market_data?.market_cap?.usd ?? 0,
      volume24h: data.market_data?.total_volume?.usd ?? 0,
      rank: data.market_cap_rank ?? null,
    };
  } catch (error) {
    console.error(`Failed to fetch market data for ${coingeckoId}:`, error);
    return null;
  }
}

export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 0.01) {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 6,
    maximumFractionDigits: 8,
  });
}

export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatPercentage(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}
