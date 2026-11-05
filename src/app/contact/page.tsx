import type { Metadata } from "next";
import Link from "next/link";
import { NEWS_EMAIL, PARTNERS_EMAIL, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact | cryptomole",
  description:
    "Email news@cryptomole.ai with tips, partner notes, or a request to add a coin.",
  path: "/contact",
});

const reasons = [
  {
    title: "News tips",
    description:
      "Send an official announcement, a correction, or a source we should look at. We publish from official channels, not rumors.",
  },
  {
    title: "Partner notes",
    description:
      "Project teams and partners can write here about coverage or a source we should follow.",
  },
  {
    title: "Add a coin",
    description:
      "Want a coin on CryptoMole? Tell us the project name, ticker, and the official site or X account.",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Contact
        </h1>
        <p className="text-ui-muted text-lg">
          Tips, partner notes, and coin-add requests go to one public inbox.
        </p>
      </header>

      <section className="card card-cta p-6 mb-8">
        <p className="text-xs uppercase tracking-wide text-ui-muted mb-2">
          Write to
        </p>
        <a
          href={`mailto:${NEWS_EMAIL}`}
          className="text-xl sm:text-2xl font-semibold text-white hover:text-ui-accent transition-colors"
        >
          {NEWS_EMAIL}
        </a>
        <p className="text-sm text-ui-muted mt-3">
          That address is for readers and project teams. We read it for news
          tips, partner-related notes, and requests to add a coin.
        </p>
      </section>

      <div className="grid gap-4 mb-8">
        {reasons.map((item) => (
          <section key={item.title} className="card p-5">
            <h2 className="font-semibold text-white mb-2">{item.title}</h2>
            <p className="text-sm text-ui-muted">{item.description}</p>
          </section>
        ))}
      </div>

      <section className="card p-6">
        <h2 className="font-semibold text-white mb-2">Sponsorship</h2>
        <p className="text-sm text-ui-muted mb-3">
          Sponsorship comes later. When you&apos;re ready to talk about it,
          email{" "}
          <a
            href={`mailto:${PARTNERS_EMAIL}`}
            className="text-ui-accent hover:text-white transition-colors"
          >
            {PARTNERS_EMAIL}
          </a>
          . Audience stats live on the advertise page.
        </p>
        <Link href="/advertise" className="text-sm text-ui-accent hover:text-white transition-colors">
          See who reads CryptoMole →
        </Link>
      </section>
    </div>
  );
}
