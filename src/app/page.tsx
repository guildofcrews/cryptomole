import { Suspense } from "react";
import Link from "next/link";
import { getCoins, getApprovedPosts } from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { CoinCard } from "@/components/CoinCard";

export const dynamic = "force-dynamic";
export const revalidate = 180;

async function PostsFeed() {
  const posts = await getApprovedPosts(30);

  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🕵️</div>
        <h3 className="font-semibold text-lg mb-2">No news yet</h3>
        <p className="text-muted text-sm">
          CryptoMole is digging for the latest updates from official sources.
          Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

async function CoinsSidebar() {
  const coins = await getCoins();

  return (
    <div className="card p-4">
      <h2 className="font-semibold mb-4 text-sm text-muted uppercase tracking-wider">
        Tracked Coins
      </h2>
      {coins.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {coins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} variant="chip" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Coins will appear here once the database is set up.
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">Latest News</h1>
          <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
            Direct from teams
          </span>
        </div>
        <p className="text-muted">
          Verified announcements and updates from official AI crypto project
          sources. No rumors, no speculation.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <section>
          <Suspense
            fallback={
              <div className="card p-8 text-center">
                <div className="animate-pulse text-muted">Loading posts...</div>
              </div>
            }
          >
            <PostsFeed />
          </Suspense>
        </section>

        <aside className="space-y-6">
          <Suspense
            fallback={
              <div className="card p-4">
                <div className="animate-pulse text-muted">Loading coins...</div>
              </div>
            }
          >
            <CoinsSidebar />
          </Suspense>

          <div className="card p-4">
            <h2 className="font-semibold mb-3 text-sm text-muted uppercase tracking-wider">
              About CryptoMole
            </h2>
            <p className="text-sm text-muted mb-3">
              We aggregate news directly from official project sources: team X
              accounts, blogs, and community calls.
            </p>
            <Link href="/about" className="text-sm link">
              Learn more →
            </Link>
          </div>

          <div className="card p-4 border-accent/30">
            <h2 className="font-semibold mb-3 text-sm text-accent uppercase tracking-wider">
              Sponsor CryptoMole
            </h2>
            <p className="text-sm text-muted mb-3">
              Support independent, source-verified crypto journalism.
            </p>
            <Link href="/sponsor" className="btn-primary inline-block text-sm">
              Become a Sponsor
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
