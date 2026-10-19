import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { PostWithCoin } from "@/lib/queries";

const sourceLabels: Record<string, string> = {
  x: "X",
  inbox: "Inbox",
  blog: "Blog",
  call: "Call",
  announcement: "Announcement",
  other: "Other",
};

interface PostCardProps {
  post: PostWithCoin;
  showCoin?: boolean;
  compact?: boolean;
}

export function PostCard({
  post,
  showCoin = true,
  compact = false,
}: PostCardProps) {
  const timeAgo = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: false })
    : "Recently";

  if (compact) {
    return (
      <article className="card p-4 flex flex-col gap-3 animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {showCoin && (
              <Link
                href={`/coin/${post.coin.slug}`}
                className="flex-shrink-0"
              >
                <div className="coin-logo w-8 h-8 text-xs">
                  {post.coin.ticker.slice(0, 2)}
                </div>
              </Link>
            )}
            <div className="flex-1 min-w-0">
              <Link href={`/post/${post.id}`}>
                <h3 className="font-medium text-sm text-white hover:text-ui-accent transition-colors line-clamp-1">
                  {post.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge-official text-[9px] px-1.5 py-0.5">
                  Official
                </span>
                <span className="text-xs text-ui-muted">
                  {sourceLabels[post.sourceType]} · {timeAgo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card p-5 sm:p-6 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {showCoin && (
            <Link
              href={`/coin/${post.coin.slug}`}
              className="flex items-center gap-3 group"
            >
              <div className="coin-logo">{post.coin.ticker.slice(0, 2)}</div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-white group-hover:text-ui-accent transition-colors">
                  {post.coin.name}
                </span>
                <span className="ticker-badge mt-0.5">{post.coin.ticker}</span>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="badge-official">Official</span>
        </div>
      </div>

      <div className="flex-1">
        <Link href={`/post/${post.id}`}>
          <h3 className="font-semibold text-lg text-white hover:text-ui-accent transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        {post.summary && (
          <p className="text-ui-muted text-sm leading-relaxed line-clamp-2">
            {post.summary}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-chat-border">
        <div className="flex items-center gap-3 text-xs text-ui-muted">
          <span className="source-badge">{sourceLabels[post.sourceType]}</span>
          <span>{timeAgo}</span>
        </div>
        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ui-accent hover:text-ui-primary flex items-center gap-1 transition-colors"
          >
            View source
            <svg
              className="w-3 h-3"
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
        )}
      </div>
    </article>
  );
}
