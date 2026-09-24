"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOns } from "@/config/addons";
import { pricingPackages } from "@/config/pricing";
import type { BookingWithDate } from "@/lib/bookingStore";

const weekdays = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
const months = [
  "januar", "februar", "marts", "april", "maj", "juni",
  "juli", "august", "september", "oktober", "november", "december",
];

/** "2026-09-19" -> "lørdag den 19. september" */
function danishDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return `${weekdays[date.getUTCDay()]} den ${date.getUTCDate()}. ${months[date.getUTCMonth()]}`;
}

/** Én booking, som du kan folde ud og aflyse. */
export function BookingRow({
  booking,
  isPast,
}: {
  booking: BookingWithDate;
  isPast: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const chosenPackage = pricingPackages.find((pkg) => pkg.id === booking.packageId);
  const chosenAddOns = addOns.filter((addOn) => booking.addOnIds?.includes(addOn.id));

  async function cancel() {
    setCancelling(true);
    setError("");

    try {
      const response = await fetch("/api/admin/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: booking.date,
          start: booking.start,
          createdAt: booking.createdAt,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Kunne ikke aflyse.");
      }

      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Kunne ikke aflyse.");
      setCancelling(false);
      setConfirming(false);
    }
  }

  return (
    <li
      className={`rounded-2xl border bg-white ${
        isPast ? "border-ink/10 opacity-70" : "border-ink/10"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start gap-4 p-4 text-left"
        aria-expanded={open}
      >
        <span className="flex w-16 flex-shrink-0 flex-col items-center rounded-xl bg-brand-50 px-2 py-2">
          <span className="text-lg font-bold leading-none text-brand-800">
            {booking.start}
          </span>
          <span className="mt-1 text-[11px] leading-none text-brand-700">
            {booking.end}
          </span>
        </span>

        <span className="flex-1">
          <span className="block font-semibold text-ink">{booking.name}</span>
          <span className="block text-sm text-ink-soft">{danishDate(booking.date)}</span>
          <span className="mt-1 block text-sm text-ink-soft">
            {chosenPackage?.name ?? booking.packageId}
            {chosenAddOns.length > 0 && ` + ${chosenAddOns.length} ekstra`}
            {typeof booking.totalPrice === "number" && ` · ${booking.totalPrice} kr.`}
          </span>
        </span>

        <span className="text-ink-soft/60">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-ink/10 px-4 py-4">
          <dl className="flex flex-col gap-2 text-sm">
            {booking.phone && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Telefon</dt>
                <dd>
                  <a href={`tel:${booking.phone}`} className="font-medium text-brand-700 underline">
                    {booking.phone}
                  </a>
                </dd>
              </div>
            )}
            {booking.email && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">E-mail</dt>
                <dd className="text-right">
                  <a href={`mailto:${booking.email}`} className="font-medium text-brand-700 underline break-all">
                    {booking.email}
                  </a>
                </dd>
              </div>
            )}
            {booking.address && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Adresse</dt>
                <dd className="text-right">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${booking.address} ${booking.postalCode ?? ""}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand-700 underline"
                  >
                    {booking.address}
                  </a>
                </dd>
              </div>
            )}
            {typeof booking.distanceKm === "number" && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Afstand</dt>
                <dd className="font-medium text-ink">ca. {booking.distanceKm} km</dd>
              </div>
            )}
            {booking.distanceKm === null && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Afstand</dt>
                <dd className="font-medium text-amber-700">Kunne ikke tjekkes</dd>
              </div>
            )}
            {chosenAddOns.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Ekstra</dt>
                <dd className="text-right font-medium text-ink">
                  {chosenAddOns.map((addOn) => addOn.name).join(", ")}
                </dd>
              </div>
            )}
          </dl>

          {booking.message && (
            <div className="mt-4 rounded-xl bg-paper-muted px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Besked fra kunden
              </p>
              <p className="mt-1 text-sm text-ink">{booking.message}</p>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!confirming ? (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                Aflys denne tid
              </button>
            ) : (
              <>
                <span className="text-sm text-ink-soft">
                  Sikker? Husk selv at give {booking.name.split(" ")[0]} besked.
                </span>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={cancelling}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {cancelling ? "Aflyser..." : "Ja, aflys"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  Fortryd
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
