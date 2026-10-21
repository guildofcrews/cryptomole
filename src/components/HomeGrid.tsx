"use client";

import { useEffect, useState } from "react";
import { useFollowedCoins } from "@/hooks/useFollowedCoins";
import { CoinIntelCard } from "./CoinIntelCard";
import { ManageCoins } from "./ManageCoins";
import Link from "next/link";

interface Category {
  slug: string;
  name: string;
}

interface Coin {
  slug: string;
  name: string;
  ticker: string;
  coingeckoId: string | null;
  categories: string[];
}

interface MarketData {
  id: string;
  price: number;
  priceChange24h: number;
  sparkline: number[];
}

interface Headline {
  id: string;
  title: string;
  sourceType: string;
  publishedAt: string | null;
  coinSlug: string;
}

interface HomeGridProps {
  allCoins: Coin[];
  categories: Category[];
}

export function HomeGrid({ allCoins, categories }: HomeGridProps) {
  const { followedSlugs, isLoaded } = useFollowedCoins();
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [headlines, setHeadlines] = useState<Record<string, Headline[]>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const followedCoins = allCoins.filter((c) => followedSlugs.includes(c.slug));

  useEffect(() => {
    if (!isLoaded || followedSlugs.length === 0) return;

    const fetchData = async () => {
      const coingeckoIds = followedCoins
        .filter((c) => c.coingeckoId)
        .map((c) => c.coingeckoId)
        .join(",");

      const [marketRes, headlinesRes] = await Promise.all([
        coingeckoIds
          ? fetch(`/api/market?ids=${coingeckoIds}`).then((r) =>
              r.ok ? r.json() : { coins: [] }
            )
          : Promise.resolve({ coins: [] }),
        fetch(`/api/headlines?slugs=${followedSlugs.join(",")}&limit=5`).then(
          (r) => (r.ok ? r.json() : { headlines: {} })
        ),
      ]);

      const marketMap: Record<string, MarketData> = {};
      for (const m of marketRes.coins || []) {
        marketMap[m.id] = m;
      }
      setMarketData(marketMap);
      setHeadlines(headlinesRes.headlines || {});
      setIsDataLoaded(true);
    };

    fetchData();
  }, [isLoaded, followedSlugs, followedCoins]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 animate-pulse">
          <div className="h-5 bg-white/10 rounded w-32 mb-2" />
          <div className="h-4 bg-white/10 rounded w-48" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-24" />
                  <div className="h-3 bg-white/10 rounded w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const categoriesWithSlug = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  const coinsForManager = allCoins.map((c) => ({
    slug: c.slug,
    name: c.name,
    ticker: c.ticker,
    categories: c.categories,
  }));

  return (
    <div className="space-y-6">
      <ManageCoins coins={coinsForManager} categories={categoriesWithSlug} />

      {followedCoins.length === 0 ? (
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-ui-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">
            No coins followed yet
          </h3>
          <p className="text-ui-muted text-sm mb-4">
            Follow coins to see their latest intel and market data here.
          </p>
          <Link
            href="/coins"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ui-primary text-white text-sm font-medium hover:bg-ui-primary/90 transition-colors"
          >
            Browse coins
          </Link>
        </div>
      ) : !isDataLoaded ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followedCoins.map((coin) => (
            <div
              key={coin.slug}
              className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-24" />
                  <div className="h-3 bg-white/10 rounded w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followedCoins.map((coin) => (
            <CoinIntelCard
              key={coin.slug}
              coin={coin}
              market={coin.coingeckoId ? marketData[coin.coingeckoId] : null}
              headlines={headlines[coin.slug] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
