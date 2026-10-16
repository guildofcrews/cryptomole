import Link from "next/link";
import { Shield, AtSign, Mail, Mic, FileText, CheckCircle, XCircle } from "lucide-react";

export const metadata = {
  title: "About | CryptoMole",
  description:
    "Learn how CryptoMole delivers verified crypto news directly from official project sources.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl">
            🕵️
          </div>
          <div>
            <h1 className="text-3xl font-bold">About CryptoMole</h1>
            <p className="text-muted">Direct from the source, always.</p>
          </div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          CryptoMole is a coin-specific news platform that delivers updates
          directly from official project sources. In a space filled with rumors,
          speculation, and misleading headlines, we focus on what actually
          matters: verified information from the teams building these projects.
        </p>
        <p className="text-foreground/90 leading-relaxed">
          Every post on CryptoMole links back to its original source, whether
          that&apos;s an official X post, a blog announcement, or a community call
          transcript. We don&apos;t add spin or speculation—just the facts, straight
          from the source.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <AtSign className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">Official X/Twitter</h3>
            </div>
            <p className="text-sm text-muted">
              We monitor official project X accounts for announcements,
              partnerships, and updates posted by the team.
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">Official Blogs</h3>
            </div>
            <p className="text-sm text-muted">
              Long-form announcements, technical updates, and roadmap posts from
              official project blogs and documentation.
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">Community Calls</h3>
            </div>
            <p className="text-sm text-muted">
              Key announcements and updates from official community calls, AMAs,
              and live streams hosted by project teams.
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">Direct Inbox</h3>
            </div>
            <p className="text-sm text-muted">
              Some projects send announcements directly to our dedicated inbox
              for timely coverage of important updates.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What We Are (and Aren&apos;t)</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-semibold">What We Are</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              <li>• Source-verified news aggregation</li>
              <li>• Coin-specific coverage</li>
              <li>• Direct links to original sources</li>
              <li>• Focus on AI crypto projects</li>
              <li>• Community-driven curation</li>
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <XCircle className="w-5 h-5" />
              <h3 className="font-semibold">What We Aren&apos;t</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              <li>• Price predictions or trading advice</li>
              <li>• Rumors or speculation</li>
              <li>• Insider information</li>
              <li>• General crypto market news</li>
              <li>• Paid promotions disguised as news</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Principles</h2>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg">Trust Through Transparency</h3>
          </div>
          <ul className="space-y-3 text-foreground/90">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">1.</span>
              <span>
                <strong>Source First:</strong> Every post links to its original
                source so you can verify for yourself.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">2.</span>
              <span>
                <strong>Official Only:</strong> We only cover information from
                official team channels—never leaks or rumors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">3.</span>
              <span>
                <strong>No Editorial Spin:</strong> We present announcements as
                they are, without adding speculation or price implications.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">4.</span>
              <span>
                <strong>Clear Labeling:</strong> Every post shows its source type
                so you know exactly where the information comes from.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="card p-6 border-accent/30">
        <h2 className="text-xl font-semibold mb-3">Support CryptoMole</h2>
        <p className="text-muted mb-4">
          CryptoMole is an independent project. If you value source-verified
          crypto news, consider becoming a sponsor to help us cover more projects
          and improve our coverage.
        </p>
        <Link href="/sponsor" className="btn-primary inline-block">
          Become a Sponsor
        </Link>
      </section>
    </div>
  );
}
