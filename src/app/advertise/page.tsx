import Link from "next/link";
import { type SiteStats } from "@/app/api/stats/route";

export const metadata = {
  title: "Advertise | cryptomole",
  description:
    "Reach crypto-native readers with source-verified news. See our audience stats and sponsorship options.",
};

export const revalidate = 300;

async function getStats(): Promise<SiteStats | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="cm-card p-5">
      <p className="cm-label mb-2">{label}</p>
      <p className="cm-mono text-2xl font-semibold text-[var(--cm-text-strong)]">
        {value}
      </p>
      {subtext && (
        <p className="text-[12px] text-[var(--cm-text-muted)] mt-1">{subtext}</p>
      )}
    </div>
  );
}

export default async function AdvertisePage() {
  const stats = await getStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-ui-primary/20 to-purple-500/15 border border-ui-primary/30 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-ui-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Advertise on cryptomole
        </h1>
        <p className="text-ui-muted text-lg">
          Reach crypto-native readers who value source-verified news
        </p>
      </header>

      {/* Stats Panel */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Who reads CryptoMole
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            label="Visits / day"
            value={stats?.visitsPerDay ?? "—"}
            subtext="7-day average"
          />
          <StatCard
            label="Visits"
            value={stats?.visitsLast7Days?.toLocaleString() ?? "—"}
            subtext="last 7 days"
          />
          <StatCard
            label="Unique visitors"
            value={stats?.uniqueVisitors7Days?.toLocaleString() ?? "—"}
            subtext="last 7 days"
          />
          <StatCard
            label="Top referrer"
            value={
              stats?.topReferrer
                ? `${stats.topReferrer.share}%`
                : "—"
            }
            subtext={stats?.topReferrer?.host ?? "from direct / X"}
          />
          <StatCard
            label="Mobile share"
            value={stats ? `${stats.mobileShare}%` : "—"}
            subtext="mobile + tablet"
          />
          <StatCard
            label="Coins covered"
            value={stats?.coinsCovered ?? 70}
          />
          <StatCard
            label="Stories published"
            value={stats?.storiesPublished?.toLocaleString() ?? "—"}
          />
        </div>

        <p className="text-center text-[11px] text-[var(--cm-text-muted)] cm-mono">
          Live from cryptomole.ai&apos;s own visit counter
          {stats?.asOf && `, as of ${stats.asOf}`}
        </p>
      </section>

      {/* Why Advertise */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Why Advertise With Us
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Crypto-Native Audience",
              description:
                "Our readers are actively following specific coins and projects — they're engaged, not just browsing.",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
            },
            {
              title: "Source-Verified Trust",
              description:
                "We only publish official news, so your brand appears alongside trusted, verified content.",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              ),
            },
            {
              title: "Transparent Stats",
              description:
                "We show our real traffic numbers publicly — no inflated metrics, just honest data.",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="cm-card p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center mx-auto mb-3 text-ui-accent">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-ui-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Placements */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Ad Placements</h2>
        <div className="grid gap-4">
          {[
            {
              name: "Sidebar Sponsor",
              description:
                "Your logo and message in the sidebar sponsor card on every page",
              price: "Contact us",
              featured: false,
            },
            {
              name: "Featured Sponsor",
              description:
                "Premium placement with larger logo, featured in the feed and coin pages",
              price: "Contact us",
              featured: true,
            },
            {
              name: "Category Sponsor",
              description:
                "Exclusive sponsorship of a specific coin category (AI, DeFi, etc.)",
              price: "Contact us",
              featured: false,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`cm-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                tier.featured ? "cm-card--cta" : ""
              }`}
            >
              <div>
                <h3 className="font-semibold text-white">{tier.name}</h3>
                <p className="text-sm text-ui-muted">{tier.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-lg font-semibold text-white">
                  {tier.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cm-card cm-card--cta p-6 text-center">
        <svg
          className="w-8 h-8 text-ui-accent mx-auto mb-4"
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
        <h2 className="text-lg font-semibold text-white mb-2">
          Get in Touch
        </h2>
        <p className="text-ui-muted mb-4">
          Interested in reaching our audience? Let&apos;s discuss how we can
          work together.
        </p>
        <p className="text-sm text-ui-accent mb-6">
          Contact: sponsors@cryptomole.ai
        </p>
        <Link href="/sponsor" className="cm-btn cm-btn--primary">
          View Sponsorship Options
        </Link>
      </section>
    </div>
  );
}
