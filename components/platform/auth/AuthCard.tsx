import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  step,
  children,
  labelledBy,
}: {
  title: string;
  description: string;
  step?: string;
  children: ReactNode;
  labelledBy: string;
}) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-zinc-100 px-5 py-10 text-zinc-900 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-100 via-rose-100 to-zinc-200 opacity-80 blur-3xl" />
        <div className="absolute -bottom-64 -right-48 h-[32rem] w-[32rem] rounded-full bg-orange-100/70 blur-3xl" />
      </div>

      <section
        aria-labelledby={labelledBy}
        className="relative w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6 text-white shadow-[0_28px_72px_rgba(24,24,27,0.24)] sm:p-7"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.16),transparent_42%)]" />
        <div className="relative space-y-5">
          <header className="space-y-2.5">
            {step && (
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {step}
              </span>
            )}
            <div className="space-y-1.5">
              <h1 id={labelledBy} className="text-2xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              <p className="max-w-sm text-sm leading-5 text-zinc-400">{description}</p>
            </div>
          </header>
          {children}
        </div>
      </section>
    </main>
  );
}
