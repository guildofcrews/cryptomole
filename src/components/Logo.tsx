import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | "header";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { markHeight: 24, text: "text-base", tagline: "text-[9px]" },
  md: { markHeight: 32, text: "text-lg", tagline: "text-[10px]" },
  lg: { markHeight: 42, text: "text-xl", tagline: "text-xs" },
  header: { markHeight: 36, markHeightMobile: 30, text: "text-[24px]", textMobile: "text-[20px]", tagline: "text-[10px]" },
};

function MoleMark({ height = 32, className = "" }: { height?: number; className?: string }) {
  const width = Math.round(height * (48 / 62));
  return (
    <Image
      src="/brand/mole-coin-icon.png"
      alt="CryptoMole"
      width={width}
      height={height}
      className={`flex-shrink-0 ${className}`}
      unoptimized
      priority
    />
  );
}

function HeaderLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/brand/mole-coin-icon.png"
        alt="CryptoMole"
        width={28}
        height={36}
        className="flex-shrink-0 hidden sm:block"
        unoptimized
        priority
      />
      <Image
        src="/brand/mole-coin-icon.png"
        alt="CryptoMole"
        width={23}
        height={30}
        className="flex-shrink-0 sm:hidden"
        unoptimized
        priority
      />
      <div className="flex flex-col">
        <span className="font-bold tracking-tight text-[18px] sm:text-[22px] lowercase leading-tight">
          <span className="text-white">crypto</span>
          <span className="text-ui-accent">mole</span>
        </span>
        <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-ui-muted uppercase">
          cryptomole.ai
        </span>
      </div>
    </div>
  );
}

export function Logo({
  variant = "full",
  size = "md",
  showTagline = false,
  className = "",
}: LogoProps) {
  if (size === "header") {
    return <HeaderLogo />;
  }

  const s = sizes[size];

  if (variant === "mark") {
    return <MoleMark height={s.markHeight} />;
  }

  if (variant === "wordmark") {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={`${s.text} font-bold tracking-tight lowercase`}>
          <span className="text-white">crypto</span>
          <span className="text-ui-accent">mole</span>
        </span>
        {showTagline && (
          <span className={`${s.tagline} font-mono tracking-widest text-ui-muted uppercase`}>
            cryptomole.ai
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MoleMark height={s.markHeight} />
      <div className="flex flex-col">
        <span className={`${s.text} font-bold tracking-tight lowercase leading-tight`}>
          <span className="text-white">crypto</span>
          <span className="text-ui-accent">mole</span>
        </span>
        <span className={`${s.tagline} font-mono tracking-widest text-ui-muted uppercase`}>
          cryptomole.ai
        </span>
      </div>
    </div>
  );
}

export function LogoCaption({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[9px] font-mono tracking-widest uppercase ${className}`}
    >
      <span className="text-white">crypto</span>
      <span className="text-ui-accent">mole</span>
      <span className="text-ui-muted">.ai</span>
    </span>
  );
}
