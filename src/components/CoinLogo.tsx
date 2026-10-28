"use client";

import Image from "next/image";
import { useState } from "react";

interface CoinLogoProps {
  slug: string;
  ticker: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { px: 24, text: "text-[10px]" },
  sm: { px: 32, text: "text-xs" },
  md: { px: 40, text: "text-sm" },
  lg: { px: 48, text: "text-base" },
  xl: { px: 64, text: "text-2xl" },
};

export function CoinLogo({ slug, ticker, size = "md", className = "" }: CoinLogoProps) {
  const [hasError, setHasError] = useState(false);
  const { px, text } = sizeMap[size];
  
  const initials = ticker.slice(0, 2).toUpperCase();
  
  const fallbackClasses = `w-full h-full rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center font-bold text-ui-accent ${text}`;

  if (hasError) {
    return (
      <div className={`flex-shrink-0 ${className}`} style={{ width: px, height: px }}>
        <div className={fallbackClasses}>
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: px, height: px }}>
      <Image
        src={`/coin-logos/${slug}.png`}
        alt={`${ticker} logo`}
        width={px}
        height={px}
        className="rounded-full object-cover"
        onError={() => setHasError(true)}
        unoptimized
      />
    </div>
  );
}

export function CoinLogoFallback({ ticker, size = "md", className = "" }: Omit<CoinLogoProps, "slug">) {
  const { px, text } = sizeMap[size];
  const initials = ticker.slice(0, 2).toUpperCase();
  
  return (
    <div 
      className={`flex-shrink-0 rounded-full bg-gradient-to-br from-ui-primary/15 to-purple-500/10 border border-ui-primary/20 flex items-center justify-center font-bold text-ui-accent ${text} ${className}`}
      style={{ width: px, height: px }}
    >
      {initials}
    </div>
  );
}
