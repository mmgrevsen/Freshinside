import { type ReactNode } from "react";

export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "neutral" | "outline";
}) {
  const styles = {
    brand: "bg-brand-500 text-white",
    neutral: "bg-ink text-white",
    outline: "border border-ink/15 text-ink-soft",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
