import type { Metadata } from "next";
import { NEWS_EMAIL, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms | cryptomole",
  description:
    "CryptoMole publishes source-linked news. It is not trading advice.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Terms
        </h1>
        <p className="text-ui-muted">
          Plain terms for reading CryptoMole. Not a contract wall.
        </p>
      </header>

      <div className="grid gap-4 text-sm text-ui-muted leading-relaxed">
        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">What the site is</h2>
          <p>
            CryptoMole collects news from official project sources and links
            back to them. Posts that appear in the public feed have been
            approved. The site is for information. It is not investment,
            trading, or legal advice, and prices shown are indicative.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">Using it</h2>
          <p>
            You can read, link, and share pages. Don&apos;t misuse the site,
            scrape it in a way that knocks it over, or present our summaries as
            if they were the original announcement. The original source is the
            record.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">As-is</h2>
          <p>
            Coverage can be incomplete or late. We can change or remove pages.
            The site is provided as-is, without a promise that it will be
            uninterrupted or error-free.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-white mb-2">Contact</h2>
          <p>
            Questions about these terms:{" "}
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
