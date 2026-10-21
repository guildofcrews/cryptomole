import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | "header";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { mark: 28, text: "text-base", tagline: "text-[9px]" },
  md: { mark: 36, text: "text-lg", tagline: "text-[10px]" },
  lg: { mark: 48, text: "text-xl", tagline: "text-xs" },
  header: { mark: 48, markMobile: 40, text: "text-[24px]", textMobile: "text-[20px]", tagline: "text-[10px]" },
};

function MoleMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/mole-icon.svg"
      alt="CryptoMole"
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      priority
    />
  );
}

function HeaderLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/brand/mole-icon.svg"
        alt="CryptoMole"
        width={44}
        height={44}
        className="flex-shrink-0 hidden sm:block"
        priority
      />
      <Image
        src="/brand/mole-icon.svg"
        alt="CryptoMole"
        width={36}
        height={36}
        className="flex-shrink-0 sm:hidden"
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
    return <MoleMark size={s.mark} />;
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
      <MoleMark size={s.mark} />
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
