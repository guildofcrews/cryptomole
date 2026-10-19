export const metadata = {
  title: "Sponsor | cryptomole",
  description:
    "Support cryptomole and help us deliver verified crypto news from official sources.",
};

export default function SponsorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text mb-2">
          Sponsor cryptomole
        </h1>
        <p className="text-ui-muted text-lg">
          Support independent, source-verified crypto journalism
        </p>
      </header>

      <section className="mb-12">
        <div className="card card-cta p-6 text-center mb-8">
          <svg
            className="w-8 h-8 text-ui-accent mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <h2 className="text-lg font-semibold text-white mb-2">
            Sponsorship Coming Soon
          </h2>
          <p className="text-ui-muted mb-4">
            We&apos;re building out our sponsorship program to let you support
            cryptomole directly. Sponsorship tiers with benefits like featured
            placement and early access are on the way.
          </p>
          <p className="text-sm text-ui-accent">
            Stripe payments integration launching soon
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Why Sponsor cryptomole?
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Support Truth",
              description:
                "Help us fight misinformation by funding source-verified journalism in crypto.",
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              ),
            },
            {
              title: "Expand Coverage",
              description:
                "Your support helps us track more coins and cover more official sources.",
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
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              ),
            },
            {
              title: "Get Recognition",
              description:
                "Sponsors get featured on cryptomole and priority access to new features.",
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
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="card p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center mx-auto mb-3 text-ui-accent">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-ui-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Planned Tiers</h2>
        <div className="grid gap-4">
          {[
            {
              name: "Mole Supporter",
              description: "Basic support tier with recognition on our sponsors page",
              price: "$5",
              featured: false,
            },
            {
              name: "Crypto Insider",
              description: "Featured sponsor with logo placement and early feature access",
              price: "$25",
              featured: true,
            },
            {
              name: "Diamond Mole",
              description: "Premium tier with prominent branding and direct communication",
              price: "$100",
              featured: false,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                tier.featured ? "card-cta" : ""
              }`}
            >
              <div>
                <h3 className="font-semibold text-white">{tier.name}</h3>
                <p className="text-sm text-ui-muted">{tier.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-ui-muted">/mo</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6 text-center">
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
        <h2 className="text-lg font-semibold text-white mb-2">Get Notified</h2>
        <p className="text-ui-muted mb-4">
          Want to be the first to know when sponsorships launch? Reach out to us
          and we&apos;ll let you know.
        </p>
        <p className="text-sm text-ui-accent">Contact: sponsors@cryptomole.ai</p>
      </section>
    </div>
  );
}
