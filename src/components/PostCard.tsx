import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, AtSign, Mail, Mic, FileText, Globe } from "lucide-react";
import type { PostWithCoin } from "@/lib/queries";

const sourceIcons: Record<string, React.ReactNode> = {
  x: <AtSign className="w-3 h-3" />,
  inbox: <Mail className="w-3 h-3" />,
  blog: <FileText className="w-3 h-3" />,
  call: <Mic className="w-3 h-3" />,
  announcement: <Globe className="w-3 h-3" />,
  other: <Globe className="w-3 h-3" />,
};

const sourceLabels: Record<string, string> = {
  x: "X/Twitter",
  inbox: "Inbox",
  blog: "Blog",
  call: "Community Call",
  announcement: "Announcement",
  other: "Other",
};

interface PostCardProps {
  post: PostWithCoin;
  showCoin?: boolean;
}

export function PostCard({ post, showCoin = true }: PostCardProps) {
  const timeAgo = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : "Recently";

  return (
    <article className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {showCoin && (
            <Link href={`/coin/${post.coin.slug}`} className="flex items-center gap-2 group">
              <div className="coin-logo">{post.coin.ticker.slice(0, 2)}</div>
              <div className="flex flex-col">
                <span className="font-medium text-sm group-hover:text-accent transition-colors">
                  {post.coin.name}
                </span>
                <span className="ticker-badge">{post.coin.ticker}</span>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="source-badge flex items-center gap-1">
            {sourceIcons[post.sourceType]}
            {sourceLabels[post.sourceType]}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <Link href={`/post/${post.id}`}>
          <h3 className="font-semibold text-lg text-foreground hover:text-accent transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        {post.summary && (
          <p className="text-muted text-sm line-clamp-2">{post.summary}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted">{timeAgo}</span>
        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
          >
            View source <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
}
