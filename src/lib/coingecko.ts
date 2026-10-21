const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export interface MarketData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  rank: number | null;
}

export async function getMarketData(
  coingeckoId: string
): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${coingeckoId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      {
        next: { revalidate: 300 },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `CoinGecko API error for ${coingeckoId}: ${response.status}`
      );
      return null;
    }

    const data = await response.json();

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
