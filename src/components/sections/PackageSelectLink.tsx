"use client";

import { bookingAnchor } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { selectForBooking } from "@/lib/bookingSelection";

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
      onClick={() => selectForBooking({ packageId, addOnIds: [] })}
    >
      {label}
    </Button>
  );
}
