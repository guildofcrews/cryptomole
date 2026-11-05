import type { Metadata } from "next";

export const SITE_URL = "https://cryptomole.ai";
export const SITE_NAME = "CryptoMole";

/** Public inbox: tips, partner notes, and coin-add requests. */
export const NEWS_EMAIL = "news@cryptomole.ai";

/** Sponsorship interest. Placements open later. */
export const PARTNERS_EMAIL = "partners@cryptomole.ai";

/** Existing purple mole-and-coin mark. Do not swap for a new logo. */
export const OG_IMAGE = {
  url: "/brand/mole-coin-icon.png",
  width: 284,
  height: 436,
  alt: "CryptoMole mole and coin",
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
