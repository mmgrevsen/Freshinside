import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { adminLoginConfigured, isLoggedIn } from "@/lib/adminAuth";
import { bookingStoreEnabled, bookingsOnDates } from "@/lib/bookingStore";
import { readVisitStats } from "@/lib/visits";
import { addDays, nowInDenmark } from "@/lib/schedule";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./LoginForm";
import { LogoutButton } from "./LogoutButton";
import { BookingRow } from "./BookingRow";

/**
 * DIN EGEN SIDE
 * ------------------------------------------------
 * Her kan du se dine bookinger og hvor mange der kigger på
 * hjemmesiden. Siden kræver login – se src/lib/adminAuth.ts og
 * afsnit 10 i README.
 *
 * Bemærk: du kan se HVOR MANGE der kigger, aldrig HVEM. Vi gemmer
 * hverken IP-adresser eller cookies om de besøgende.
 */

export const metadata: Metadata = {
  title: "Min side",
  // Siden skal aldrig findes på Google.
  robots: { index: false, follow: false },
};

// Tallene skal være friske hver gang – aldrig gemt.
export const dynamic = "force-dynamic";

/** Hvor langt tilbage og frem vi henter bookinger. */
const DAYS_BACK = 30;
const DAYS_AHEAD = 90;

function Card({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export default async function AdminPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center py-20">
        <Container className="max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {siteConfig.name} – min side
          </h1>

          {adminLoginConfigured() ? (
            <>
              <p className="mt-2 mb-8 text-sm text-ink-soft">
                Log ind for at se dine bookinger.
              </p>
              <LoginForm />
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              <p className="font-semibold">Login er ikke sat op endnu</p>
              <p className="mt-2">
                Opret en miljøvariabel ved navn <code>ADMIN_PASSWORD</code> på
                Vercel (Settings → Environment Variables), og lav derefter en
                Redeploy. Så kan du logge ind her.
              </p>
              <p className="mt-2">
                Indtil da er siden lukket for alle – også dig. Hele opskriften
                står i afsnit 10 i README.
              </p>
            </div>
          )}
        </Container>
      </div>
    );
  }

  const today = nowInDenmark().isoDate;
  const dates = Array.from(
    { length: DAYS_BACK + DAYS_AHEAD + 1 },
    (_, index) => addDays(today, index - DAYS_BACK)
  );

  const [bookings, stats] = await Promise.all([
    bookingsOnDates(dates),
    readVisitStats(),
  ]);

  const upcoming = (bookings ?? []).filter((booking) => booking.date >= today);
  const past = (bookings ?? []).filter((booking) => booking.date < today).reverse();

  const upcomingRevenue = upcoming.reduce(
    (sum, booking) => sum + (booking.totalPrice ?? 0),
    0
  );

  const busiestDay = stats?.lastDays.reduce(
    (best, day) => (day.visitors > best.visitors ? day : best),
    { date: "", visitors: 0 }
  );

  return (
    <div className="min-h-screen bg-paper py-10 sm:py-16">
      <Container className="max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Min side
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Hej Marcus – her er, hvad der sker på {siteConfig.name}.
            </p>
          </div>
          <LogoutButton />
        </div>

        {!bookingStoreEnabled && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <p className="font-semibold">Databasen er ikke koblet på</p>
            <p className="mt-2">
              Uden den kan hjemmesiden ikke huske bookinger eller besøgstal.
              Se afsnit 9 i README.
            </p>
          </div>
        )}

        {/* Besøgstal */}
        <h2 className="mt-10 text-lg font-semibold text-ink">Besøgende</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Du kan se, hvor mange der kigger – aldrig hvem. Hjemmesiden gemmer
          hverken IP-adresser eller cookies om de besøgende.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card
            label="Inde lige nu"
            value={stats?.activeNow ?? "–"}
            hint="seneste 3 min."
          />
          <Card label="I dag" value={stats?.visitorsToday ?? "–"} hint="personer" />
          <Card
            label="Sidevisninger"
            value={stats?.viewsToday ?? "–"}
            hint="i dag"
          />
          <Card
            label="Bedste dag"
            value={busiestDay?.visitors ?? "–"}
            hint={
              busiestDay?.date
                ? busiestDay.date.slice(8) + "." + busiestDay.date.slice(5, 7) + "."
                : "seneste uge"
            }
          />
        </div>

        {stats && stats.lastDays.some((day) => day.visitors > 0) && (
          <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Sidste 7 dage
            </p>
            <ul className="mt-4 flex items-end justify-between gap-2">
              {stats.lastDays.map((day) => {
                const highest = Math.max(
                  ...stats.lastDays.map((entry) => entry.visitors),
                  1
                );
                const height = Math.round((day.visitors / highest) * 100);
                return (
                  <li key={day.date} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium text-ink">{day.visitors}</span>
                    <span
                      className="w-full rounded-t bg-brand-500"
                      style={{ height: `${Math.max(height, 3)}px` }}
                    />
                    <span className="text-[11px] text-ink-soft">
                      {day.date.slice(8)}.
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Bookinger */}
        <div className="mt-12 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink">
            Kommende bookinger ({upcoming.length})
          </h2>
          {upcomingRevenue > 0 && (
            <p className="text-sm font-medium text-ink-soft">
              {upcomingRevenue} kr. i vente
            </p>
          )}
        </div>

        {bookings === null ? (
          <p className="mt-4 rounded-2xl border border-ink/10 bg-white p-5 text-sm text-ink-soft">
            {bookingStoreEnabled
              ? "Kunne ikke hente bookinger lige nu. Prøv at genindlæse siden."
              : "Bookinger kan først vises, når databasen er koblet på (afsnit 9 i README)."}
          </p>
        ) : upcoming.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-ink/10 bg-white p-5 text-sm text-ink-soft">
            Ingen bookinger endnu. De dukker op her, så snart nogen booker.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {upcoming.map((booking) => (
              <BookingRow
                key={`${booking.date}-${booking.start}-${booking.createdAt ?? ""}`}
                booking={booking}
                isPast={false}
              />
            ))}
          </ul>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-12 text-lg font-semibold text-ink">
              Tidligere ({past.length})
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {past.map((booking) => (
                <BookingRow
                  key={`${booking.date}-${booking.start}-${booking.createdAt ?? ""}`}
                  booking={booking}
                  isPast
                />
              ))}
            </ul>
          </>
        )}

        <p className="mt-12 text-xs text-ink-soft">
          Bookinger gemmes i 180 dage og slettes derefter automatisk.
        </p>
      </Container>
    </div>
  );
}
