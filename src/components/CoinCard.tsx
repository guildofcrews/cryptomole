import Link from "next/link";
import { AtSign, Globe, MessageCircle, Send } from "lucide-react";
import type { Coin } from "@/db";

interface CoinCardProps {
  coin: Coin;
  variant?: "card" | "chip";
}

export function CoinCard({ coin, variant = "card" }: CoinCardProps) {
  if (variant === "chip") {
    return (
      <Link
        href={`/coin/${coin.slug}`}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-card-hover hover:border-accent/30 transition-all"
      >
        <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-bold text-accent">
          {coin.ticker.slice(0, 2)}
        </div>
        <span className="font-medium text-sm">{coin.ticker}</span>
      </Link>
    );
  }

  return (
    <Link href={`/coin/${coin.slug}`} className="card p-4 block group">
      <div className="flex items-center gap-3 mb-3">
        <div className="coin-logo">{coin.ticker.slice(0, 2)}</div>
        <div>
          <h3 className="font-semibold group-hover:text-accent transition-colors">
            {coin.name}
          </h3>
          <span className="ticker-badge">{coin.ticker}</span>
        </div>
      </div>
      {coin.description && (
        <p className="text-sm text-muted line-clamp-2 mb-3">{coin.description}</p>
      )}
      <div className="flex items-center gap-3">
        {coin.website && (
          <span className="text-xs text-muted flex items-center gap-1">
            <Globe className="w-3 h-3" /> Website
          </span>
        )}
        {coin.xHandle && (
          <span className="text-xs text-muted flex items-center gap-1">
            <AtSign className="w-3 h-3" /> @{coin.xHandle}
          </span>
        )}
      </div>
    </Link>
  );
}

export function CoinLinks({ coin }: { coin: Coin }) {
  return (
    <div className="flex flex-wrap gap-3">
      {coin.website && (
        <a
          href={coin.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-card-hover hover:border-accent/30 transition-all text-sm"
        >
          <Globe className="w-4 h-4 text-accent" />
          Website
        </a>
      )}
      {coin.xHandle && (
        <a
          href={`https://x.com/${coin.xHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-card-hover hover:border-accent/30 transition-all text-sm"
        >
          <AtSign className="w-4 h-4 text-accent" />
          @{coin.xHandle}
        </a>
      )}
      {coin.discordUrl && (
        <a
          href={coin.discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-card-hover hover:border-accent/30 transition-all text-sm"
        >
          <MessageCircle className="w-4 h-4 text-accent" />
          Discord
        </a>
      )}
      {coin.telegramUrl && (
        <a
          href={coin.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-card-hover hover:border-accent/30 transition-all text-sm"
        >
          <Send className="w-4 h-4 text-accent" />
          Telegram
        </a>
      )}
    </div>
  );
}
