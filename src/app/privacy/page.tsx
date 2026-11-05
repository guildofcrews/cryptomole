import type { Metadata } from "next";
import { NEWS_EMAIL, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy | cryptomole",
  description:
    "How CryptoMole handles visits and email. We do not store raw IP addresses.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Privacy
        </h1>
        <p className="text-ui-muted">
          Short version of what the site keeps, and what it doesn&apos;t.
        </p>
      </header>

      <div className="grid gap-4 text-sm text-ui-muted leading-relaxed">
        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">Visit counter</h2>
          <p>
            CryptoMole counts page views so we can show sponsors a real
            audience. Each visit stores a path, the date, a referrer host, a
            device type, and a daily-salted hash of the IP address plus the
            browser. We do not store the raw IP address.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">Other measurement</h2>
          <p>
            The site may also use Vercel Web Analytics and Speed Insights for
            aggregate traffic and performance. Price figures come from
            CoinGecko and are indicative. News pages link out to the original
            source.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">Email you send us</h2>
          <p>
            If you write to{" "}
            <a
              href={`mailto:${NEWS_EMAIL}`}
              className="text-ui-accent hover:text-white transition-colors"
            >
              {NEWS_EMAIL}
            </a>
            , we keep that message so we can reply and, when it&apos;s a coin
            request or a tip, decide what to cover. We don&apos;t sell personal
            information.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">Questions</h2>
          <p>
            Email{" "}
            <a
              href={`mailto:${NEWS_EMAIL}`}
              className="text-ui-accent hover:text-white transition-colors"
            >
              {NEWS_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
