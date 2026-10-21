import {
  getMarketData,
  formatPrice,
  formatLargeNumber,
  formatPercentage,
} from "@/lib/coingecko";

interface MarketDataProps {
  coingeckoId: string | null;
}

export async function MarketData({ coingeckoId }: MarketDataProps) {
  if (!coingeckoId) {
    return null;
  }

  const data = await getMarketData(coingeckoId);

  if (!data) {
    return null;
  }

  const isPositive = data.priceChange24h >= 0;

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-ui-muted mb-1">Price</div>
          <div className="text-lg font-semibold text-white">
            {formatPrice(data.price)}
          </div>
          <div
            className={`text-sm font-medium ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatPercentage(data.priceChange24h)}
          </div>
        </div>

        <div>
          <div className="text-xs text-ui-muted mb-1">Market Cap</div>
          <div className="text-lg font-semibold text-white">
            {formatLargeNumber(data.marketCap)}
          </div>
          {data.rank && (
            <div className="text-sm text-ui-muted">Rank #{data.rank}</div>
          )}
        </div>

        <div>
          <div className="text-xs text-ui-muted mb-1">24h Volume</div>
          <div className="text-lg font-semibold text-white">
            {formatLargeNumber(data.volume24h)}
          </div>
        </div>

        <div className="flex items-end justify-end sm:justify-start">
          <a
            href={`https://www.coingecko.com/en/coins/${coingeckoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ui-muted hover:text-ui-accent transition-colors"
          >
            Market data via CoinGecko →
          </a>
        </div>
      </div>
    </div>
  );
}
