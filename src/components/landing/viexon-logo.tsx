import { useId } from "react";

type ViexonLogoProps = {
  compact?: boolean;
};

export function ViexonLogo({ compact = false }: ViexonLogoProps) {
  const primaryGradientId = useId();
  const secondaryGradientId = useId();

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-panel)] shadow-[0_0_40px_var(--accent-glow)] backdrop-blur-xl">
        <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient id={primaryGradientId} x1="14" y1="10" x2="48" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7AF4FF" />
              <stop offset="0.45" stopColor="#3CB8FF" />
              <stop offset="1" stopColor="#1E63FF" />
            </linearGradient>
            <linearGradient id={secondaryGradientId} x1="35" y1="16" x2="68" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B7FEFF" />
              <stop offset="0.4" stopColor="#5DDBFF" />
              <stop offset="1" stopColor="#286EFF" />
            </linearGradient>
          </defs>

          <path
            d="M12 10h16l14 25L31 53H19L12 10Z"
            fill={`url(#${primaryGradientId})`}
            opacity="0.98"
          />
          <path
            d="M47 14h18L45 53H29L47 14Z"
            fill={`url(#${secondaryGradientId})`}
            opacity="0.98"
          />
          <path
            d="M37 36h11l18 27H52L37 36Z"
            fill={`url(#${primaryGradientId})`}
            opacity="0.95"
          />
        </svg>
      </span>

      {!compact ? (
        <div className="leading-none">
          <span className="font-display block text-[0.95rem] font-semibold uppercase tracking-[0.34em] text-[var(--text-primary)]">
            Viexon
          </span>
          <span className="mt-1 block text-[0.63rem] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Premium Commerce OS
          </span>
        </div>
      ) : null}
    </div>
  );
}
