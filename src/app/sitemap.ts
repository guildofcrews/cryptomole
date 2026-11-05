import type { MetadataRoute } from "next";
import { getApprovedPosts, getCategories, getCoins } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/advertise`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/coins`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/sources`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/sponsor`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [coins, categories, posts] = await Promise.all([
    getCoins(),
    getCategories(),
    getApprovedPosts(500),
  ]);

  const coinRoutes: MetadataRoute.Sitemap = coins.map((coin) => ({
    url: `${SITE_URL}/coin/${coin.slug}`,
    lastModified: coin.updatedAt ?? now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: category.updatedAt ?? now,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.id}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...coinRoutes, ...postRoutes];
}
