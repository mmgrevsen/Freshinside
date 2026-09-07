"use client";

import { bookingAnchor } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { SELECTED_PACKAGE_STORAGE_KEY } from "@/lib/constants";

export function PackageSelectLink({
  packageId,
  label,
  variant,
}: {
  packageId: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  return (
    <Button
      as="a"
      href={bookingAnchor}
      variant={variant}
      className="w-full"
      onClick={() => {
        try {
          window.sessionStorage.setItem(SELECTED_PACKAGE_STORAGE_KEY, packageId);
        } catch {
          // sessionStorage kan være utilgængelig (f.eks. privat browsing) – ikke kritisk.
        }
      }}
    >
      {label}
    </Button>
  );
}
