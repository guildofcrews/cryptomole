"use client";

import { useState, useMemo } from "react";
import { useFollowedCoins } from "@/hooks/useFollowedCoins";

interface Category {
  slug: string;
  name: string;
}

interface Coin {
  slug: string;
  name: string;
  ticker: string;
  categories: string[];
}

interface ManageCoinsProps {
  coins: Coin[];
  categories: Category[];
}

export function ManageCoins({ coins, categories }: ManageCoinsProps) {
  const { followedSlugs, isLoaded, toggle, isFollowing } = useFollowedCoins();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      const matchesSearch =
        !search ||
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.ticker.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !categoryFilter || coin.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [coins, search, categoryFilter]);

  if (!isLoaded) {
    return (
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 animate-pulse">
        <div className="h-5 bg-white/10 rounded w-32 mb-3" />
        <div className="h-10 bg-white/10 rounded mb-3" />
        <div className="flex gap-2">
          <div className="h-8 bg-white/10 rounded w-16" />
          <div className="h-8 bg-white/10 rounded w-20" />
          <div className="h-8 bg-white/10 rounded w-14" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="font-semibold text-white">Manage Coins</h3>
          <p className="text-xs text-ui-muted">
            Following {followedSlugs.length} of {coins.length} coins
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-ui-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[#30363d] text-white placeholder:text-ui-muted focus:outline-none focus:border-ui-primary/50 text-sm"
          />

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                !categoryFilter
                  ? "bg-ui-primary text-white"
                  : "bg-white/5 text-ui-muted hover:bg-white/10"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategoryFilter(cat.slug)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  categoryFilter === cat.slug
                    ? "bg-ui-primary text-white"
                    : "bg-white/5 text-ui-muted hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {filteredCoins.map((coin) => {
              const following = isFollowing(coin.slug);
              return (
                <button
                  key={coin.slug}
                  onClick={() => toggle(coin.slug)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    following
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-white/5 border border-transparent hover:bg-white/10"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center text-[10px] font-bold text-ui-accent">
                    {coin.ticker.slice(0, 2)}
                  </div>
                  <span className="text-sm text-white flex-1 text-left truncate">
                    {coin.name}
                  </span>
                  <span className="text-xs text-ui-muted">{coin.ticker}</span>
                  <svg
                    className={`w-4 h-4 ${
                      following ? "text-amber-400" : "text-ui-muted"
                    }`}
                    fill={following ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              );
            })}
            {filteredCoins.length === 0 && (
              <p className="text-sm text-ui-muted text-center py-4">
                No coins match your search
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
