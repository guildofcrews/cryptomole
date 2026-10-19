import { Suspense } from "react";
import Link from "next/link";
import { getCoins, getCategories, getCoinsByCategory } from "@/lib/queries";
import { CoinCard } from "@/components/CoinCard";

export const dynamic = "force-dynamic";
export const revalidate = 180;

interface CoinsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export const metadata = {
  title: "All Coins | cryptomole",
  description:
    "Browse all 50 crypto projects tracked by cryptomole. Official news from AI, DeFi, Gaming, NFTs, and more.",
};

async function CategoryChips({ activeCategory }: { activeCategory?: string }) {
  const categories = await getCategories();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="/coins"
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          !activeCategory
            ? "bg-gradient-to-r from-ui-primary to-purple-500 text-white"
            : "bg-white/[0.05] text-ui-muted hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/coins?category=${cat.slug}`}
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

async function CoinsGrid({ categorySlug }: { categorySlug?: string }) {
  const coinsList = categorySlug
    ? await getCoinsByCategory(categorySlug)
    : await getCoins();

  if (coinsList.length === 0) {
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
          {categorySlug ? "No coins in this category" : "No coins tracked yet"}
        </h3>
        <p className="text-ui-muted text-sm">
          {categorySlug
            ? "Try selecting a different category."
            : "Coins will appear here once the database is set up with project data."}
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-ui-muted mb-4">
        {coinsList.length} coin{coinsList.length !== 1 ? "s" : ""}
        {categorySlug ? " in this category" : " tracked"}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coinsList.map((coin, index) => (
          <div
            key={coin.id}
            style={{ animationDelay: `${index * 30}ms` }}
            className="animate-fade-in"
          >
            <CoinCard coin={coin} variant="card" />
          </div>
        ))}
      </div>
    </>
  );
}

export default async function CoinsPage({ searchParams }: CoinsPageProps) {
  const { category } = await searchParams;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Tracked Coins
        </h1>
        <p className="text-ui-muted">
          Crypto projects with official news coverage. Click any coin to see
          their latest updates.
        </p>
      </header>

      <Suspense fallback={<div className="h-10" />}>
        <CategoryChips activeCategory={category} />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-24" />
                    <div className="h-3 bg-white/10 rounded w-12" />
                  </div>
                </div>
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        }
      >
        <CoinsGrid categorySlug={category} />
      </Suspense>
    </div>
  );
}
