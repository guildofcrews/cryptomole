import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getPostById } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 180;

const sourceLabels: Record<string, string> = {
  x: "X/Twitter",
  inbox: "Team Inbox",
  blog: "Official Blog",
  call: "Community Call",
  announcement: "Announcement",
  other: "Other Source",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return { title: "Post Not Found | cryptomole" };

  return {
    title: `${post.title} | ${post.coin.ticker} News | cryptomole`,
    description:
      post.summary || `News about ${post.coin.name} from official sources.`,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post || post.status !== "approved") {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "MMMM d, yyyy 'at' h:mm a")
    : "Recently";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
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

      <article className="animate-fade-in">
        <header className="mb-8">
          <Link
            href={`/coin/${post.coin.slug}`}
            className="inline-flex items-center gap-2 mb-4 group"
          >
            <div className="coin-logo w-8 h-8 text-sm">
              {post.coin.ticker.slice(0, 2)}
            </div>
            <span className="font-medium text-white group-hover:text-ui-accent transition-colors">
              {post.coin.name}
            </span>
            <span className="ticker-badge">{post.coin.ticker}</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-ui-muted">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {publishedDate}
            </span>
            <span className="source-badge">
              {sourceLabels[post.sourceType]}
            </span>
            <span className="badge-official">Official</span>
          </div>
        </header>

        {post.summary && (
          <p className="text-lg text-ui-muted mb-6 border-l-4 border-ui-primary pl-4 leading-relaxed">
            {post.summary}
          </p>
        )}

        {post.body && (
          <div className="mb-8 space-y-4">
            {post.body.split("\n").map((paragraph, i) => (
              <p key={i} className="text-gray-200 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {post.sourceUrl && (
          <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-ui-muted uppercase tracking-wider mb-1">
                Original Source
              </p>
              <p className="text-sm text-white">
                View this content at its original location
              </p>
            </div>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              View Source
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        )}
      </article>

      <hr className="my-8 border-chat-border" />

      <div className="flex items-center justify-between text-sm">
        <Link href={`/coin/${post.coin.slug}`} className="link">
          More {post.coin.name} news →
        </Link>
        <Link href="/" className="link">
          All news →
        </Link>
      </div>
    </div>
  );
}
