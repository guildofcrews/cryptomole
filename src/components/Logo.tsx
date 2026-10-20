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
  header: { mark: 56, markMobile: 44, text: "text-[28px]", textMobile: "text-[22px]", tagline: "text-[10px]" },
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
    <div className="flex items-center gap-3">
      <Image
        src="/brand/mole-icon.svg"
        alt="CryptoMole"
        width={56}
        height={56}
        className="flex-shrink-0 hidden sm:block"
        priority
      />
      <Image
        src="/brand/mole-icon.svg"
        alt="CryptoMole"
        width={44}
        height={44}
        className="flex-shrink-0 sm:hidden"
        priority
      />
      <span className="font-bold tracking-tight text-[22px] sm:text-[28px]">
        <span style={{ color: "#F5EFE6" }}>Crypto</span>
        <span style={{ color: "#F2B33D" }}>Mole</span>
      </span>
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
        <span className={`${s.text} font-bold tracking-tight`}>
          <span style={{ color: "#F5EFE6" }}>Crypto</span>
          <span style={{ color: "#F2B33D" }}>Mole</span>
        </span>
        {showTagline && (
          <span className={`${s.tagline} text-ui-muted tracking-wide`}>
            news, dug up first
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <MoleMark size={s.mark} />
      <span className={`${s.text} font-bold tracking-tight`}>
        <span style={{ color: "#F5EFE6" }}>Crypto</span>
        <span style={{ color: "#F2B33D" }}>Mole</span>
      </span>
    </div>
  );
}

export function LogoCaption({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[10px] font-semibold tracking-widest uppercase ${className}`}
    >
      <span style={{ color: "#F5EFE6" }}>CRYPTO</span>
      <span style={{ color: "#F2B33D" }}>MOLE</span>
      <span className="text-ui-muted">.AI</span>
    </span>
  );
}
