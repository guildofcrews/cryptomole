import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCoinBySlug, getApprovedPostsByCoin } from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { CoinLinks } from "@/components/CoinCard";
import { MarketData } from "@/components/MarketData";
import { FollowButton } from "@/components/FollowButton";
import { CoinLogo } from "@/components/CoinLogo";

export const dynamic = "force-dynamic";
export const revalidate = 180;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coin = await getCoinBySlug(slug);
  if (!coin) return { title: "Coin Not Found | cryptomole" };

  return {
    title: `${coin.name} (${coin.ticker}) News | cryptomole`,
    description: `Latest official news and updates for ${coin.name} (${coin.ticker}). Direct from the team's official sources.`,
  };
}

async function CoinFeed({ slug }: { slug: string }) {
  const posts = await getApprovedPostsByCoin(slug, 50);

  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center">
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg text-white mb-2">
          No news yet for this coin
        </h3>
        <p className="text-ui-muted text-sm">
          The mole is watching official channels. Check back soon for updates!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-fade-in"
        >
          <PostCard post={post} showCoin={false} />
        </div>
      ))}
    </div>
  );
}

export default async function CoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coin = await getCoinBySlug(slug);

  if (!coin) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ui-muted hover:text-white mb-6 transition-colors group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to all news
      </Link>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <CoinLogo slug={coin.slug} ticker={coin.ticker} size="xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                {coin.name}
              </h1>
              <span className="ticker-badge text-xs mt-1">{coin.ticker}</span>
            </div>
          </div>
          <FollowButton slug={coin.slug} showLabel />
        </div>

        {coin.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {coin.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.05] text-ui-muted hover:bg-white/[0.08] hover:text-white transition-all border border-white/10"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {coin.description && (
          <p className="text-ui-muted mb-4 leading-relaxed">
            {coin.description}
          </p>
        )}
        <CoinLinks coin={coin} />
      </header>

      <Suspense fallback={null}>
        <MarketData coingeckoId={coin.coingeckoId} />
      </Suspense>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Latest Updates
        </h2>
        <Suspense
          fallback={
            <div className="card p-8 text-center">
              <div className="spinner mx-auto mb-3" />
              <p className="text-ui-muted text-sm">Loading posts...</p>
            </div>
          }
        >
          <CoinFeed slug={slug} />
        </Suspense>
      </section>
    </div>
  );
}
