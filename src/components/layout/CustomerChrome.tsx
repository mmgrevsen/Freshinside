"use client";

import { usePathname } from "next/navigation";

/**
 * Menu, footer og "BOOK NU"-knappen hører til kundernes side.
 * På /admin er de bare i vejen, så de skjules der.
 */
export function CustomerChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
