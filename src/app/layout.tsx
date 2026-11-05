import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NavLink } from "@/components/NavLink";
import { SearchInput } from "@/components/SearchInput";
import { TrackingBeacon } from "@/components/TrackingBeacon";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const defaultTitle = "CryptoMole - Crypto News, Dug Up First";
const defaultDescription =
  "Authentic crypto news from official project teams. No rumors, just facts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description:
    "Get authentic crypto news for AI projects directly from official team sources. No rumors, no speculation - just verified announcements from Render, Akash, Bittensor, NEAR, and more.",
  keywords: [
    "crypto news",
    "AI crypto",
    "RENDER",
    "AKT",
    "TAO",
    "NEAR",
    "FET",
    "blockchain news",
  ],
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": "/feed.xml",
      "application/atom+xml": "/atom.xml",
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: [OG_IMAGE.url],
  },
};

function Header() {
  return (
    <header className="cm-header">
      <div className="cm-container cm-header__inner">
        <Link href="/" className="cm-logo" aria-label="Crypto Mole home">
          <Image
            src="/brand/mole-coin-icon.png"
            alt=""
            width={36}
            height={46}
            className="h-9 w-auto"
            unoptimized
            priority
          />
          <span className="cm-wordmark">
            crypto<span>mole</span>
          </span>
        </Link>

        <nav className="cm-nav" aria-label="Primary">
          <NavLink href="/">Feed</NavLink>
          <NavLink href="/coins">Coins</NavLink>
          <NavLink href="/sources">Sources</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="cm-header__actions">
          <SearchInput />
          <Link href="/about" className="cm-btn cm-btn--primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            Get alerts
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="cm-footer">
      <div className="cm-container cm-footer__inner">
        <span>© Crypto Mole · cryptomole.ai</span>
        <nav className="cm-footer__nav" aria-label="Footer">
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/feed.xml">RSS</Link>
        </nav>
        <span>Prices are indicative. News links go to the original source.</span>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-chat-bg text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* First-party analytics beacon */}
        <TrackingBeacon />
        {/* Vercel Analytics - enable in Vercel project settings */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
