import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "About | cryptomole",
  description:
    "Learn how cryptomole delivers verified crypto news directly from official project sources.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Logo size="lg" />
        </div>
        <p className="text-ui-muted text-lg">news, dug up first</p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Our Mission</h2>
        <p className="text-gray-200 leading-relaxed mb-4">
          cryptomole is a coin-specific news platform that delivers updates
          directly from official project sources. In a space filled with rumors,
          speculation, and misleading headlines, we focus on what actually
          matters: verified information from the teams building these projects.
        </p>
        <p className="text-gray-200 leading-relaxed">
          Every post on cryptomole links back to its original source, whether
          that&apos;s an official X post, a blog announcement, or a community
          call transcript. We don&apos;t add spin or speculation—just the facts,
          straight from the source.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
        <div className="grid gap-4">
          {[
            {
              title: "Official X/Twitter",
              description:
                "We monitor official project X accounts for announcements, partnerships, and updates posted by the team.",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                </svg>
              ),
            },
            {
              title: "Official Blogs",
              description:
                "Long-form announcements, technical updates, and roadmap posts from official project blogs and documentation.",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              ),
            },
            {
              title: "Community Calls",
              description:
                "Key announcements and updates from official community calls, AMAs, and live streams hosted by project teams.",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ),
            },
            {
              title: "Direct Inbox",
              description:
                "Some projects send announcements directly to our dedicated inbox for timely coverage of important updates.",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center text-ui-accent">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-ui-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">
          What We Are (and Aren&apos;t)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-semibold text-emerald-300">What We Are</h3>
            </div>
            <ul className="space-y-2 text-sm text-ui-muted">
              <li>• Source-verified news aggregation</li>
              <li>• Coin-specific coverage</li>
              <li>• Direct links to original sources</li>
              <li>• Focus on AI crypto projects</li>
              <li>• Community-driven curation</li>
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3 className="font-semibold text-rose-300">What We Aren&apos;t</h3>
            </div>
            <ul className="space-y-2 text-sm text-ui-muted">
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
        <h2 className="text-xl font-semibold text-white mb-4">Our Principles</h2>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-ui-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-white">
              Trust Through Transparency
            </h3>
          </div>
          <ol className="space-y-3 text-gray-200">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ui-primary/15 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-ui-accent">
                1
              </span>
              <span>
                <strong className="text-white">Source First:</strong> Every post
                links to its original source so you can verify for yourself.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ui-primary/15 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-ui-accent">
                2
              </span>
              <span>
                <strong className="text-white">Official Only:</strong> We only
                cover information from official team channels—never leaks or
                rumors.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ui-primary/15 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-ui-accent">
                3
              </span>
              <span>
                <strong className="text-white">No Editorial Spin:</strong> We
                present announcements as they are, without adding speculation or
                price implications.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ui-primary/15 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-ui-accent">
                4
              </span>
              <span>
                <strong className="text-white">Clear Labeling:</strong> Every
                post shows its source type so you know exactly where the
                information comes from.
              </span>
            </li>
          </ol>
        </div>
      </section>

      <section className="card card-cta p-6">
        <h2 className="text-lg font-semibold text-white mb-3">
          Support cryptomole
        </h2>
        <p className="text-ui-muted mb-4">
          cryptomole is an independent project. If you value source-verified
          crypto news, consider becoming a sponsor to help us cover more
          projects and improve our coverage.
        </p>
        <Link href="/sponsor" className="btn-primary inline-flex">
          Become a Sponsor
        </Link>
      </section>
    </div>
  );
}
