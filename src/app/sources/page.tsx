import { Suspense } from "react";
import Link from "next/link";
import { getCoins } from "@/lib/queries";
import { CoinLogo } from "@/components/CoinLogo";

export const dynamic = "force-dynamic";
export const revalidate = 180;

export const metadata = {
  title: "Official Sources | cryptomole",
  description:
    "The official accounts and channels we monitor for each tracked crypto project.",
};

async function SourcesList() {
  const coins = await getCoins();

  if (coins.length === 0) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-ui-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg text-white mb-2">
          No sources yet
        </h3>
        <p className="text-ui-muted text-sm">
          Source data will appear here once coins are added to the database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {coins.map((coin, index) => {
        type SourceItem = {
          type: string;
          handle: string;
          url: string;
          icon: React.ReactNode;
        };

        const sourceItems: (SourceItem | null)[] = [
          coin.xHandle
            ? {
                type: "X/Twitter",
                handle: `@${coin.xHandle}`,
                url: `https://x.com/${coin.xHandle}`,
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
              }
            : null,
          coin.website
            ? {
                type: "Website",
                handle: new URL(coin.website).hostname,
                url: coin.website,
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
              }
            : null,
          coin.discordUrl
            ? {
                type: "Discord",
                handle: "Community Server",
                url: coin.discordUrl,
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
              }
            : null,
          coin.telegramUrl
            ? {
                type: "Telegram",
                handle: "Channel",
                url: coin.telegramUrl,
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
              }
            : null,
        ];

        const sources = sourceItems.filter(
          (item): item is SourceItem => item !== null
        );

        return (
          <div
            key={coin.id}
            className="card p-5 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Link href={`/coin/${coin.slug}`}>
                <CoinLogo slug={coin.slug} ticker={coin.ticker} size="md" />
              </Link>
              <div>
                <Link
                  href={`/coin/${coin.slug}`}
                  className="font-semibold text-white hover:text-ui-accent transition-colors"
                >
                  {coin.name}
                </Link>
                <span className="ticker-badge ml-2">{coin.ticker}</span>
              </div>
            </div>

            {sources.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-2">
                {sources.map((source) => (
                  <a
                    key={source.type}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:ring-1 hover:ring-white/10 transition-all group"
                  >
                    <span className="text-ui-accent">{source.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-ui-muted block">
                        {source.type}
                      </span>
                      <span className="text-sm text-white group-hover:text-ui-accent transition-colors truncate block">
                        {source.handle}
                      </span>
                    </div>
                    <svg
                      className="w-3.5 h-3.5 text-ui-muted group-hover:text-ui-accent transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ui-muted">
                No official sources configured for this coin yet.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Official Sources
        </h1>
        <p className="text-ui-muted">
          The official accounts and channels we monitor for each tracked
          project. All news on cryptomole comes directly from these verified
          sources.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-32" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="h-14 bg-white/10 rounded-lg" />
                  <div className="h-14 bg-white/10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <SourcesList />
      </Suspense>
    </div>
  );
}
