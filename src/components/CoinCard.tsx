import Link from "next/link";
import type { Coin } from "@/db";

interface CoinCardProps {
  coin: Coin;
  variant?: "card" | "chip" | "row";
}

export function CoinCard({ coin, variant = "card" }: CoinCardProps) {
  if (variant === "chip") {
    return (
      <Link
        href={`/coin/${coin.slug}`}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-chat-border hover:bg-white/[0.06] hover:border-ui-primary/30 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center text-[10px] font-bold text-ui-accent">
          {coin.ticker.slice(0, 2)}
        </div>
        <span className="font-medium text-sm text-white">{coin.ticker}</span>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={`/coin/${coin.slug}`}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:ring-1 hover:ring-white/10 transition-all group"
      >
        <div className="coin-logo w-8 h-8 text-xs">
          {coin.ticker.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-white group-hover:text-ui-accent transition-colors">
            {coin.name}
          </span>
        </div>
        <span className="ticker-badge">{coin.ticker}</span>
      </Link>
    );
  }

  return (
    <Link href={`/coin/${coin.slug}`} className="card p-5 block group">
      <div className="flex items-center gap-3 mb-3">
        <div className="coin-logo">{coin.ticker.slice(0, 2)}</div>
        <div>
          <h3 className="font-semibold text-white group-hover:text-ui-accent transition-colors">
            {coin.name}
          </h3>
          <span className="ticker-badge mt-1">{coin.ticker}</span>
        </div>
      </div>
      {coin.description && (
        <p className="text-sm text-ui-muted line-clamp-2 mb-3">
          {coin.description}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-ui-muted">
        {coin.website && (
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Website
          </span>
        )}
        {coin.xHandle && (
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
            </svg>
            @{coin.xHandle}
          </span>
        )}
      </div>
    </Link>
  );
}

export function CoinLinks({ coin }: { coin: Coin }) {
  const links = [
    {
      url: coin.website,
      label: "Website",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      url: coin.xHandle ? `https://x.com/${coin.xHandle}` : null,
      label: `@${coin.xHandle}`,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
        </svg>
      ),
    },
    {
      url: coin.discordUrl,
      label: "Discord",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      url: coin.telegramUrl,
      label: "Telegram",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
    },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-chat-border hover:bg-white/[0.06] hover:border-ui-primary/30 transition-all text-sm text-white"
        >
          <span className="text-ui-accent">{link.icon}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}
