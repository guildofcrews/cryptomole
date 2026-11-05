import { getApprovedPosts, type PostWithCoin } from "@/lib/queries";
import { SITE_NAME, SITE_URL, NEWS_EMAIL } from "@/lib/site";

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function loadApprovedFeedPosts(limit = 50): Promise<PostWithCoin[]> {
  return getApprovedPosts(limit);
}

export function postLink(id: string): string {
  return `${SITE_URL}/post/${id}`;
}

export function postTimestamp(post: PostWithCoin): Date {
  const raw = post.publishedAt ?? post.updatedAt ?? post.createdAt;
  const date = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function buildRss(posts: PostWithCoin[]): string {
  const items = posts
    .map((post) => {
      const link = postLink(post.id);
      const when = postTimestamp(post).toUTCString();
      const summary = post.summary || post.title;
      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${when}</pubDate>
      <description>${xmlEscape(summary)}</description>
      <category>${xmlEscape(post.coin.ticker)}</category>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Source-verified crypto news from official project teams.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${NEWS_EMAIL} (${SITE_NAME})</managingEditor>
${items}
  </channel>
</rss>
`;
}

export function buildAtom(posts: PostWithCoin[]): string {
  const updated = posts[0] ? postTimestamp(posts[0]).toISOString() : new Date().toISOString();
  const entries = posts
    .map((post) => {
      const link = postLink(post.id);
      const when = postTimestamp(post).toISOString();
      const summary = post.summary || post.title;
      return `  <entry>
    <title>${xmlEscape(post.title)}</title>
    <link href="${link}" rel="alternate"/>
    <id>${link}</id>
    <updated>${when}</updated>
    <summary>${xmlEscape(summary)}</summary>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_NAME}</title>
  <subtitle>Source-verified crypto news from official project teams.</subtitle>
  <link href="${SITE_URL}/" rel="alternate"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author>
    <name>${SITE_NAME}</name>
    <email>${NEWS_EMAIL}</email>
  </author>
${entries}
</feed>
`;
}
