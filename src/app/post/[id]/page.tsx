import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink, AtSign, Mail, Mic, FileText, Globe, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getPostById } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 180;

const sourceIcons: Record<string, React.ReactNode> = {
  x: <AtSign className="w-4 h-4" />,
  inbox: <Mail className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
  call: <Mic className="w-4 h-4" />,
  announcement: <Globe className="w-4 h-4" />,
  other: <Globe className="w-4 h-4" />,
};

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
  if (!post) return { title: "Post Not Found | CryptoMole" };

  return {
    title: `${post.title} | ${post.coin.ticker} News | CryptoMole`,
    description: post.summary || `News about ${post.coin.name} from official sources.`,
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to all news
      </Link>

      <article>
        <header className="mb-8">
          <Link
            href={`/coin/${post.coin.slug}`}
            className="inline-flex items-center gap-2 mb-4 group"
          >
            <div className="coin-logo w-8 h-8 text-sm">
              {post.coin.ticker.slice(0, 2)}
            </div>
            <span className="font-medium group-hover:text-accent transition-colors">
              {post.coin.name}
            </span>
            <span className="ticker-badge">{post.coin.ticker}</span>
          </Link>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-card rounded">
              {sourceIcons[post.sourceType]}
              {sourceLabels[post.sourceType]}
            </span>
          </div>
        </header>

        {post.summary && (
          <p className="text-lg text-muted mb-6 border-l-4 border-accent pl-4">
            {post.summary}
          </p>
        )}

        {post.body && (
          <div className="prose prose-invert max-w-none mb-8">
            {post.body.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {post.sourceUrl && (
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Original Source</p>
              <p className="text-sm font-medium">
                View this content at its original location
              </p>
            </div>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              View Source <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </article>

      <hr className="my-8 border-border" />

      <div className="flex items-center justify-between">
        <Link
          href={`/coin/${post.coin.slug}`}
          className="link text-sm"
        >
          More {post.coin.name} news →
        </Link>
        <Link href="/" className="link text-sm">
          All news →
        </Link>
      </div>
    </div>
  );
}
