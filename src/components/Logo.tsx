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
  header: { mark: 38, text: "text-[20px]", tagline: "text-[10px]" },
};

function MoleMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/brand/mole-icon.svg"
      alt="CryptoMole"
      width={size}
      height={size}
      className="flex-shrink-0"
      priority
    />
  );
}

export function Logo({
  variant = "full",
  size = "md",
  showTagline = false,
  className = "",
}: LogoProps) {
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
