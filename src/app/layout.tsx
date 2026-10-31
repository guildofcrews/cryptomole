import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { NavLink } from "@/components/NavLink";
import { SearchInput } from "@/components/SearchInput";
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

export const metadata: Metadata = {
  title: "CryptoMole - Crypto News, Dug Up First",
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
  openGraph: {
    title: "CryptoMole - Crypto News, Dug Up First",
    description:
      "Authentic crypto news from official project teams. No rumors, just facts.",
    type: "website",
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
      </body>
    </html>
  );
}
