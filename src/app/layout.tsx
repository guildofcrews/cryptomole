import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Logo, LogoCaption } from "@/components/Logo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="nav-pill"
    >
      {children}
    </Link>
  );
}

function Header() {
  return (
    <header className="header">
      <nav className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Logo size="header" />
        </Link>

        <div className="flex items-center gap-1">
          <NavLink href="/">Feed</NavLink>
          <NavLink href="/coins">Coins</NavLink>
          <NavLink href="/sources">Sources</NavLink>
        </div>

        <div className="hidden sm:block flex-shrink-0">
          <button
            className="btn-primary text-sm py-2 px-4 opacity-50 cursor-not-allowed"
            disabled
            title="Coming soon"
          >
            Get alerts
          </button>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-chat-border mt-auto py-8 px-4 bg-chat-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" />
            <span className="text-xs text-ui-muted">news, dug up first</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-ui-muted hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/sources"
              className="text-ui-muted hover:text-white transition-colors"
            >
              Sources
            </Link>
            <Link
              href="/sponsor"
              className="text-ui-muted hover:text-white transition-colors"
            >
              Sponsor
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <LogoCaption />
            <p className="text-xs text-ui-muted">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-chat-bg text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
