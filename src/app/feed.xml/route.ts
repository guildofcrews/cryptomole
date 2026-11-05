import { buildRss, loadApprovedFeedPosts } from "@/lib/feed";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const posts = await loadApprovedFeedPosts(50);
  const xml = buildRss(posts);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
