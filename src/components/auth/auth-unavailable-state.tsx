import { InlineMessage } from "./form-primitives";

export function AuthUnavailableState({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
          Ambiente incompleto
        </p>
        <h2 className="font-display mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[2.35rem]">
          O fluxo de autenticacao depende das variaveis publicas do Supabase.
        </h2>
        <p className="mt-3 max-w-[32rem] text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          Assim que o ambiente estiver preenchido, as telas de login e cadastro passam a operar com
          o backend real sem necessidade de ajustes na interface.
        </p>
      </div>

      <InlineMessage message={message} tone="error" />
    </div>
  );
}
