import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  verified?: boolean;
};

export function AuthField({ id, label, verified = false, className = "", ...inputProps }: AuthFieldProps) {
  return (
    <label className="block space-y-2 text-sm font-medium text-zinc-200" htmlFor={id}>
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {verified && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
            <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.78-9.97a.75.75 0 0 0-1.06-1.06L9 10.69 7.28 8.97a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" clipRule="evenodd" />
            </svg>
            Verified by Google
          </span>
        )}
      </span>
      <input
        id={id}
        {...inputProps}
        className={`w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-300/60 focus:ring-4 focus:ring-orange-400/10 read-only:cursor-not-allowed read-only:bg-white/[0.035] read-only:text-zinc-300 read-only:focus:border-white/10 read-only:focus:ring-0 ${className}`}
      />
    </label>
  );
}
