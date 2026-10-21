import { Suspense } from "react";
import Link from "next/link";
import {
  getCoins,
  getCategories,
  getApprovedPosts,
  getApprovedPostsByCategory,
  getApprovedPostsWithTopics,
} from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { CoinCard } from "@/components/CoinCard";

export const dynamic = "force-dynamic";
export const revalidate = 180;

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

async function CategoryChips({ activeCategory }: { activeCategory?: string }) {
  const categories = await getCategories();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="/"
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          !activeCategory
            ? "bg-gradient-to-r from-ui-primary to-purple-500 text-white"
            : "bg-white/[0.05] text-ui-muted hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        All
      </Link>
      <Link
        href="/?category=regulation"
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          activeCategory === "regulation"
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
        }`}
      >
        Regulation
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/?category=${cat.slug}`}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.slug
              ? "bg-gradient-to-r from-ui-primary to-purple-500 text-white"
              : "bg-white/[0.05] text-ui-muted hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

async function PostsFeed({ categorySlug }: { categorySlug?: string }) {
  let posts;
  if (categorySlug === "regulation") {
    posts = await getApprovedPostsWithTopics(30);
  } else if (categorySlug) {
    posts = await getApprovedPostsByCategory(categorySlug, 30);
  } else {
    posts = await getApprovedPosts(30);
  }

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
          {categorySlug ? "No news in this category yet" : "No news yet"}
        </h3>
        <p className="text-ui-muted text-sm">
          The mole is digging for the latest updates from official sources.
          Check back soon!
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
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}

async function CoinsSidebar() {
  const allCoins = await getCoins();
  const displayCoins = allCoins.slice(0, 12);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Tracked Coins</h2>
        {allCoins.length > 12 && (
          <Link href="/coins" className="text-xs text-ui-accent hover:text-ui-primary transition-colors">
            View all {allCoins.length} →
          </Link>
        )}
      </div>
      {displayCoins.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {displayCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} variant="chip" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ui-muted">
          Coins will appear here once the database is set up.
        </p>
      )}
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-semibold gradient-text">
            Today&apos;s dig
          </h1>
          <span className="badge-official w-fit">Official sources only</span>
        </div>
        <p className="text-ui-muted text-sm sm:text-base mb-4">
          Verified announcements and updates from official AI crypto project
          teams. No rumors, no speculation.
        </p>
        <Suspense fallback={<div className="h-10" />}>
          <CategoryChips activeCategory={category} />
        </Suspense>
      </section>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
        <section>
          <Suspense
            fallback={
              <div className="card p-8 text-center">
                <div className="spinner mx-auto mb-3" />
                <p className="text-ui-muted text-sm">Loading posts...</p>
              </div>
            }
          >
            <PostsFeed categorySlug={category} />
          </Suspense>
        </section>

        <aside className="space-y-6">
          <Suspense
            fallback={
              <div className="card p-5">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-24 mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-white/10 rounded-xl w-16" />
                    <div className="h-8 bg-white/10 rounded-xl w-20" />
                    <div className="h-8 bg-white/10 rounded-xl w-14" />
                  </div>
                </div>
              </div>
            }
          >
            <CoinsSidebar />
          </Suspense>

          <div className="card p-5">
            <h2 className="section-title mb-3">About</h2>
            <p className="text-sm text-ui-muted mb-3">
              We aggregate news directly from official project sources: team X
              accounts, blogs, and community calls.
            </p>
            <Link href="/about" className="link text-sm">
              Learn more →
            </Link>
          </div>

          <div className="card card-cta p-5">
            <h2 className="section-title text-ui-accent mb-3">
              Sponsor cryptomole
            </h2>
            <p className="text-sm text-ui-muted mb-4">
              Support independent, source-verified crypto journalism.
            </p>
            <Link href="/sponsor" className="btn-primary text-sm py-2.5 px-5">
              Become a Sponsor
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
