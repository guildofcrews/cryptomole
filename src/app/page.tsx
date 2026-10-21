import { Suspense } from "react";
import Link from "next/link";
import { getCoins, getCategories } from "@/lib/queries";
import { HomeGrid } from "@/components/HomeGrid";

export const dynamic = "force-dynamic";
export const revalidate = 180;

async function HomeContent() {
  const [allCoins, categories] = await Promise.all([
    getCoins(),
    getCategories(),
  ]);

  const coinsWithCategories = allCoins.map((coin) => ({
    slug: coin.slug,
    name: coin.name,
    ticker: coin.ticker,
    coingeckoId: coin.coingeckoId,
    categories: [],
  }));

  const categoryList = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  return <HomeGrid allCoins={coinsWithCategories} categories={categoryList} />;
}

export default async function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
        <section>
          <Suspense
            fallback={
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
            }
          >
            <HomeContent />
          </Suspense>
        </section>

        <aside className="space-y-6">
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
