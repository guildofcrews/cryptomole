import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoMole - Coin-Specific Crypto News Direct from the Source",
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
    title: "CryptoMole - Direct-from-Source Crypto News",
    description:
      "Authentic crypto news from official project teams. No rumors, just facts.",
    type: "website",
  },
};

function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-xl">
            🕵️
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
              CryptoMole
            </h1>
            <p className="text-xs text-muted">Direct from the source</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            News
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/sponsor"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Sponsor
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span>A</span>
          <span className="font-semibold text-foreground">Guild of Crews</span>
          <span>site</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/sponsor" className="hover:text-foreground transition-colors">
            Sponsor
          </Link>
        </div>
        <p>© {new Date().getFullYear()} CryptoMole. All rights reserved.</p>
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
