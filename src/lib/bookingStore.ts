import { hasConflict, minutesFromTime, type BookedInterval } from "@/lib/schedule";
import { databaseEnabled, redis, redisPipeline } from "@/lib/redis";

/**
 * HUSKELISTE OVER BOOKINGER
 * ------------------------------------------------
 * Når en kunde booker, gemmer vi bookingen her. Det bruges til to ting:
 *  1. at den samme tid ikke kan bookes af to forskellige
 *  2. at du kan se dine bookinger på /admin
 *
 * Listen ligger i en lille gratis database (Upstash Redis), som du
 * kobler på fra Vercel – se afsnit 9 i README.
 *
 * Er databasen ikke sat op endnu, virker hjemmesiden stadig: bookinger
 * bliver modtaget og sendt til dig på mail som før, men de kan ikke
 * vises på /admin, og to kunder KAN nå at vælge samme tid.
 */

/** Er den lille database sat op? */
export const bookingStoreEnabled = databaseEnabled;

/** Bookinger slettes automatisk efter 180 dage. */
const KEEP_SECONDS = 60 * 60 * 24 * 180;

/**
 * Sådan ser en gemt booking ud. "start" og "end" er dem, tidsplanen
 * bruger; resten er til dig, så du kan se, hvem der kommer.
 */
export type StoredBooking = BookedInterval & {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  packageId?: string;
  addOnIds?: string[];
  totalPrice?: number;
  message?: string;
  /** Afstanden i km, hvis den kunne måles */
  distanceKm?: number | null;
  /** Hvornår bookingen kom ind (ISO-tidspunkt) */
  createdAt?: string;
};

/** En booking sammen med den dato, den hører til. */
export type BookingWithDate = StoredBooking & { date: string };

function keyFor(isoDate: string) {
  return `freshinside:bookings:${isoDate}`;
}

function parseBookings(raw: unknown): StoredBooking[] {
  if (typeof raw !== "string") return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is StoredBooking =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StoredBooking).start === "string" &&
        typeof (item as StoredBooking).end === "string"
    );
  } catch {
    return [];
  }
}

/**
 * Henter de bookinger, der ligger på en dato.
 * Returnerer null, hvis databasen slet ikke kunne læses – så ved vi
 * forskel på "der er ingen bookinger" og "vi kunne ikke se efter".
 */
export async function bookingsOnDate(isoDate: string): Promise<StoredBooking[] | null> {
  if (!bookingStoreEnabled) return null;

  try {
    return parseBookings(await redis(["GET", keyFor(isoDate)]));
  } catch (error) {
    // Kan tiderne ikke hentes, siger vi hellere "ledig" end at afvise
    // en kunde, der gerne vil booke.
    console.error("Kunne ikke hente optagne tider:", error);
    return null;
  }
}

/** Henter alle bookinger på en række datoer – bruges af /admin. */
export async function bookingsOnDates(
  isoDates: string[]
): Promise<BookingWithDate[] | null> {
  if (!bookingStoreEnabled || isoDates.length === 0) return null;

  try {
    const results = await redisPipeline(isoDates.map((date) => ["GET", keyFor(date)]));

    return isoDates
      .flatMap((date, index) =>
        parseBookings(results[index]).map((booking) => ({ ...booking, date }))
      )
      .sort((a, b) =>
        a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)
      );
  } catch (error) {
    console.error("Kunne ikke hente bookinger:", error);
    return null;
  }
}

export type ReserveResult =
  | { reserved: true }
  | { reserved: false; reason: "taken" | "unavailable" };

/**
 * Prøver at reservere en tid. Returnerer "taken", hvis nogen nåede
 * at booke den først.
 *
 * (Teknisk note: to bookinger i præcis samme sekund kan i teorien
 * begge slippe igennem. Ved en håndfuld bookinger om ugen er det
 * usandsynligt – og du får mail om begge, så du kan nå at reagere.)
 */
export async function reserveBooking(
  isoDate: string,
  booking: StoredBooking,
  workMinutes: number
): Promise<ReserveResult> {
  if (!bookingStoreEnabled) return { reserved: false, reason: "unavailable" };

  try {
    const existing = (await bookingsOnDate(isoDate)) ?? [];
    const startMinutes = minutesFromTime(booking.start);

    if (hasConflict(startMinutes, workMinutes, existing)) {
      return { reserved: false, reason: "taken" };
    }

    await redis([
      "SET",
      keyFor(isoDate),
      JSON.stringify([...existing, booking]),
      "EX",
      KEEP_SECONDS,
    ]);

    return { reserved: true };
  } catch (error) {
    console.error("Kunne ikke gemme den optagne tid:", error);
    return { reserved: false, reason: "unavailable" };
  }
}

/**
 * Fjerner en booking igen – bruges, når du aflyser en tid på /admin.
 * Tiden bliver dermed ledig for andre kunder.
 *
 * Returnerer den slettede booking, så vi kan skrive til kunden
 * bagefter – eller null, hvis der ikke var noget at slette.
 */
export async function removeBooking(
  isoDate: string,
  start: string,
  createdAt?: string
): Promise<StoredBooking | null> {
  if (!bookingStoreEnabled) return null;

  try {
    const existing = (await bookingsOnDate(isoDate)) ?? [];

    // Er der to bookinger på samme starttidspunkt (bør ikke ske), bruger
    // vi createdAt til at ramme den rigtige.
    let removed: StoredBooking | null = null;
    const remaining = existing.filter((booking) => {
      if (removed) return true;
      const matches =
        booking.start === start &&
        (createdAt === undefined || booking.createdAt === createdAt);
      if (matches) {
        removed = booking;
        return false;
      }
      return true;
    });

    if (!removed) return null;

    if (remaining.length === 0) {
      await redis(["DEL", keyFor(isoDate)]);
    } else {
      await redis([
        "SET",
        keyFor(isoDate),
        JSON.stringify(remaining),
        "EX",
        KEEP_SECONDS,
      ]);
    }

    return removed;
  } catch (error) {
    console.error("Kunne ikke slette bookingen:", error);
    return null;
  }
}
