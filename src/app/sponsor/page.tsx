import { Heart, Zap, Star, Mail } from "lucide-react";

export const metadata = {
  title: "Sponsor | CryptoMole",
  description:
    "Support CryptoMole and help us deliver verified crypto news from official sources.",
};

export default function SponsorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
          💎
        </div>
        <h1 className="text-3xl font-bold mb-2">Sponsor CryptoMole</h1>
        <p className="text-muted text-lg">
          Support independent, source-verified crypto journalism
        </p>
      </header>

      <section className="mb-12">
        <div className="card p-6 border-accent/30 text-center mb-8">
          <Zap className="w-8 h-8 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sponsorship Coming Soon</h2>
          <p className="text-muted mb-4">
            We&apos;re building out our sponsorship program to let you support
            CryptoMole directly. Sponsorship tiers with benefits like featured
            placement and early access are on the way.
          </p>
          <p className="text-sm text-accent">
            Stripe payments integration launching soon
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Why Sponsor CryptoMole?
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Support Truth</h3>
            <p className="text-sm text-muted">
              Help us fight misinformation by funding source-verified journalism
              in crypto.
            </p>
          </div>

          <div className="card p-5 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Expand Coverage</h3>
            <p className="text-sm text-muted">
              Your support helps us track more coins and cover more official
              sources.
            </p>
          </div>

          <div className="card p-5 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Get Recognition</h3>
            <p className="text-sm text-muted">
              Sponsors get featured on CryptoMole and priority access to new
              features.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Planned Tiers</h2>
        <div className="grid gap-4">
          <div className="card p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Mole Supporter</h3>
              <p className="text-sm text-muted">
                Basic support tier with recognition on our sponsors page
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent">$5</span>
              <span className="text-muted">/mo</span>
            </div>
          </div>

          <div className="card p-5 flex items-center justify-between border-accent/30">
            <div>
              <h3 className="font-semibold">Crypto Insider</h3>
              <p className="text-sm text-muted">
                Featured sponsor with logo placement and early feature access
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent">$25</span>
              <span className="text-muted">/mo</span>
            </div>
          </div>

          <div className="card p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Diamond Mole</h3>
              <p className="text-sm text-muted">
                Premium tier with prominent branding and direct communication
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent">$100</span>
              <span className="text-muted">/mo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6 text-center">
        <Mail className="w-8 h-8 text-accent mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Get Notified</h2>
        <p className="text-muted mb-4">
          Want to be the first to know when sponsorships launch? Reach out to us
          and we&apos;ll let you know.
        </p>
        <p className="text-sm text-accent">Contact: sponsors@cryptomole.ai</p>
      </section>
    </div>
  );
}
