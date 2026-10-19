import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getCoinsByCategory,
  getCoinsBySubcategory,
  getApprovedPostsByCategory,
  getApprovedPostsBySubcategory,
  getSubcategoryBySlug,
} from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { CoinCard } from "@/components/CoinCard";

export const dynamic = "force-dynamic";
export const revalidate = 180;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | cryptomole" };
  }

  return {
    title: `${category.name} News | cryptomole`,
    description: category.description || `Latest ${category.name} crypto news from official sources.`,
  };
}

async function SubcategoryChips({
  categorySlug,
  subcategories,
  activeSubcategory,
}: {
  categorySlug: string;
  subcategories: { slug: string; name: string }[];
  activeSubcategory?: string;
}) {
  if (subcategories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href={`/category/${categorySlug}`}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          !activeSubcategory
            ? "bg-gradient-to-r from-ui-primary to-purple-500 text-white"
            : "bg-white/[0.05] text-ui-muted hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        All
      </Link>
      {subcategories.map((sub) => (
        <Link
          key={sub.slug}
          href={`/category/${categorySlug}?sub=${sub.slug}`}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeSubcategory === sub.slug
              ? "bg-gradient-to-r from-ui-primary to-purple-500 text-white"
              : "bg-white/[0.05] text-ui-muted hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          {sub.name}
        </Link>
      ))}
    </div>
  );
}

async function CategoryFeed({
  categorySlug,
  subcategorySlug,
}: {
  categorySlug: string;
  subcategorySlug?: string;
}) {
  const posts = subcategorySlug
    ? await getApprovedPostsBySubcategory(subcategorySlug, 50)
    : await getApprovedPostsByCategory(categorySlug, 50);

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
          No news in this category yet
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
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}

async function CategoryCoins({
  categorySlug,
  subcategorySlug,
}: {
  categorySlug: string;
  subcategorySlug?: string;
}) {
  const coinsList = subcategorySlug
    ? await getCoinsBySubcategory(subcategorySlug)
    : await getCoinsByCategory(categorySlug);

  if (coinsList.length === 0) return null;

  return (
    <div className="card p-5 mb-6">
      <h2 className="section-title mb-4">
        {coinsList.length} coin{coinsList.length !== 1 ? "s" : ""} in this category
      </h2>
      <div className="flex flex-wrap gap-2">
        {coinsList.map((coin) => (
          <CoinCard key={coin.id} coin={coin} variant="chip" />
        ))}
      </div>
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const activeSubcategory = sub || undefined;

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
        Back to feed
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-ui-muted">{category.description}</p>
        )}
      </header>

      <SubcategoryChips
        categorySlug={slug}
        subcategories={category.subcategories}
        activeSubcategory={activeSubcategory}
      />

      <Suspense
        fallback={
          <div className="card p-5 mb-6">
            <div className="animate-pulse flex flex-wrap gap-2">
              <div className="h-8 bg-white/10 rounded-xl w-20" />
              <div className="h-8 bg-white/10 rounded-xl w-24" />
              <div className="h-8 bg-white/10 rounded-xl w-16" />
            </div>
          </div>
        }
      >
        <CategoryCoins categorySlug={slug} subcategorySlug={activeSubcategory} />
      </Suspense>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Latest Updates</h2>
        <Suspense
          fallback={
            <div className="card p-8 text-center">
              <div className="spinner mx-auto mb-3" />
              <p className="text-ui-muted text-sm">Loading posts...</p>
            </div>
          }
        >
          <CategoryFeed categorySlug={slug} subcategorySlug={activeSubcategory} />
        </Suspense>
      </section>
    </div>
  );
}
