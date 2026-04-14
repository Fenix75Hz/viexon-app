import Image from "next/image";

type ViexonLogoProps = {
  compact?: boolean;
};

export function ViexonLogo({ compact = false }: ViexonLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-panel)] shadow-[0_0_40px_var(--accent-glow)] backdrop-blur-xl">
        <Image
          src="/brand/viexon-logo.png"
          alt="Viexon"
          width={28}
          height={28}
          priority
          className="h-7 w-7 rounded-[10px] object-contain"
        />
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
