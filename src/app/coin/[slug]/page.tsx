import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCoinBySlug, getApprovedPostsByCoin } from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { CoinLinks } from "@/components/CoinCard";

export const dynamic = "force-dynamic";
export const revalidate = 180;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coin = await getCoinBySlug(slug);
  if (!coin) return { title: "Coin Not Found | CryptoMole" };

  return {
    title: `${coin.name} (${coin.ticker}) News | CryptoMole`,
    description: `Latest official news and updates for ${coin.name} (${coin.ticker}). Direct from the team's official sources.`,
  };
}

async function CoinFeed({ slug }: { slug: string }) {
  const posts = await getApprovedPostsByCoin(slug, 50);

  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🕵️</div>
        <h3 className="font-semibold text-lg mb-2">No news yet for this coin</h3>
        <p className="text-muted text-sm">
          CryptoMole is watching official channels. Check back soon for updates!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showCoin={false} />
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to all news
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="coin-logo w-16 h-16 text-2xl">
            {coin.ticker.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <span className="ticker-badge text-base">{coin.ticker}</span>
          </div>
        </div>
        {coin.description && (
          <p className="text-muted mb-4">{coin.description}</p>
        )}
        <CoinLinks coin={coin} />
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
        <Suspense
          fallback={
            <div className="card p-8 text-center">
              <div className="animate-pulse text-muted">Loading posts...</div>
            </div>
          }
        >
          <CoinFeed slug={slug} />
        </Suspense>
      </section>
    </div>
  );
}
