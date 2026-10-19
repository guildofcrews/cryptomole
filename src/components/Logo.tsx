interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { mark: 32, text: "text-lg", tagline: "text-[9px]" },
  md: { mark: 40, text: "text-xl", tagline: "text-[10px]" },
  lg: { mark: 56, text: "text-2xl", tagline: "text-xs" },
};

function MoleMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="coinShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Coin being dug up */}
      <circle cx="44" cy="18" r="14" fill="url(#coinGrad)" />
      <circle cx="44" cy="18" r="14" fill="url(#coinShine)" />
      <circle
        cx="44"
        cy="18"
        r="10"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <text
        x="44"
        y="22"
        textAnchor="middle"
        fill="#a5b4fc"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
      >
        $
      </text>

      {/* Mole body */}
      <ellipse cx="28" cy="42" rx="22" ry="18" fill="#2d3548" />

      {/* Arm reaching for coin */}
      <ellipse
        cx="42"
        cy="30"
        rx="8"
        ry="5"
        fill="#2d3548"
        transform="rotate(-30 42 30)"
      />
      <circle cx="48" cy="26" r="4" fill="#2d3548" />

      {/* Face */}
      <ellipse cx="18" cy="38" rx="14" ry="12" fill="#3d4558" />

      {/* Snout */}
      <ellipse cx="8" cy="40" rx="7" ry="5" fill="#4a5568" />

      {/* Nose (pink) */}
      <ellipse cx="4" cy="40" rx="3.5" ry="2.8" fill="#fda4af" />

      {/* Eye */}
      <circle cx="14" cy="35" r="2" fill="#0d1117" />
      <circle cx="13.5" cy="34.5" r="0.6" fill="#a5b4fc" opacity="0.6" />

      {/* Whiskers */}
      <line
        x1="8"
        y1="38"
        x2="1"
        y2="35"
        stroke="#a5b4fc"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="8"
        y1="40"
        x2="1"
        y2="40"
        stroke="#a5b4fc"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="8"
        y1="42"
        x2="1"
        y2="45"
        stroke="#a5b4fc"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Claws */}
      <line
        x1="50"
        y1="24"
        x2="53"
        y2="21"
        stroke="#a5b4fc"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="51"
        y1="26"
        x2="55"
        y2="24"
        stroke="#a5b4fc"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="51"
        y1="28"
        x2="55"
        y2="28"
        stroke="#a5b4fc"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
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
        <span
          className={`${s.text} font-semibold tracking-tight bg-gradient-to-r from-white to-ui-accent bg-clip-text text-transparent`}
        >
          cryptomole
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
    <div className={`flex items-center gap-3 ${className}`}>
      <MoleMark size={s.mark} />
      <div className="flex flex-col">
        <span
          className={`${s.text} font-semibold tracking-tight bg-gradient-to-r from-white to-ui-accent bg-clip-text text-transparent`}
        >
          cryptomole
        </span>
        {showTagline && (
          <span className={`${s.tagline} text-ui-muted tracking-wide`}>
            news, dug up first
          </span>
        )}
      </div>
    </div>
  );
}

export function LogoCaption({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[10px] font-semibold tracking-widest text-ui-muted uppercase ${className}`}
    >
      CRYPTOMOLE.AI
    </span>
  );
}
