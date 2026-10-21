"use client";

import Link from "next/link";
import { Sparkline } from "./Sparkline";
import { SourceIcon } from "./SourceIcon";
import { FollowButton } from "./FollowButton";
import { formatPrice, formatPercentage } from "@/lib/coingecko";

interface Headline {
  id: string;
  title: string;
  sourceType: string;
  publishedAt: string | null;
}

interface MarketData {
  price: number;
  priceChange24h: number;
  sparkline: number[];
}

interface CoinIntelCardProps {
  coin: {
    slug: string;
    name: string;
    ticker: string;
    coingeckoId: string | null;
  };
  market?: MarketData | null;
  headlines: Headline[];
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CoinIntelCard({ coin, market, headlines }: CoinIntelCardProps) {
  const isPositive = (market?.priceChange24h ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 hover:border-ui-primary/40 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <Link href={`/coin/${coin.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center text-xs font-bold text-ui-accent flex-shrink-0">
            {coin.ticker.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white group-hover:text-ui-accent transition-colors truncate">
              {coin.name}
            </h3>
            <span className="text-xs text-ui-muted">{coin.ticker}</span>
          </div>
        </Link>
        <FollowButton slug={coin.slug} size="sm" />
      </div>

      {market && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#30363d]">
          <div>
            <div className="text-lg font-semibold text-white">
              {formatPrice(market.price)}
            </div>
            <div
              className={`text-sm font-medium ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatPercentage(market.priceChange24h)}
            </div>
          </div>
          {market.sparkline.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-ui-muted">7d</span>
              <Sparkline
                data={market.sparkline}
                width={60}
                height={20}
                positive={isPositive}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {headlines.length > 0 ? (
          <>
            {headlines.slice(0, 5).map((headline) => (
              <Link
                key={headline.id}
                href={`/post/${headline.id}`}
                className="flex items-start gap-2 group/headline"
              >
                <SourceIcon
                  type={headline.sourceType}
                  className="w-3.5 h-3.5 text-ui-muted mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-ui-muted group-hover/headline:text-white transition-colors line-clamp-2 flex-1">
                  {headline.title}
                </span>
                <span className="text-xs text-ui-muted flex-shrink-0">
                  {relativeTime(headline.publishedAt)}
                </span>
              </Link>
            ))}
            <Link
              href={`/coin/${coin.slug}`}
              className="block text-xs text-ui-accent hover:text-ui-primary transition-colors pt-1"
            >
              View all →
            </Link>
          </>
        ) : (
          <p className="text-sm text-ui-muted italic">No recent intel yet</p>
        )}
      </div>
    </div>
  );
}
