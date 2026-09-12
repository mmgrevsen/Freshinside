import { hasConflict, minutesFromTime, type BookedInterval } from "@/lib/schedule";

/**
 * HUSKELISTE OVER OPTAGNE TIDER
 * ------------------------------------------------
 * Når en kunde booker, gemmer vi tidspunktet her, så den samme tid
 * ikke kan bookes af to forskellige. Listen ligger i en lille gratis
 * database (Upstash Redis), som du kobler på fra Vercel – se afsnit 9
 * i README.
 *
 * Er databasen ikke sat op endnu, virker hjemmesiden stadig: bookinger
 * bliver modtaget som før, men to kunder KAN nå at vælge samme tid.
 */

const REDIS_URL = process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

/** Er den lille database sat op? */
export const bookingStoreEnabled = Boolean(REDIS_URL && REDIS_TOKEN);

/** Optagne tider slettes automatisk efter 90 dage – de er alligevel forbi. */
const KEEP_SECONDS = 60 * 60 * 24 * 90;

export type StoredBooking = BookedInterval & { name: string };

function keyFor(isoDate: string) {
  return `freshinside:bookings:${isoDate}`;
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const response = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Databasen svarede ${response.status}`);
  }

  const data = (await response.json()) as { result?: unknown };
  return data.result;
}

/** Henter de tider, der allerede er booket på en dato. */
export async function bookingsOnDate(isoDate: string): Promise<StoredBooking[]> {
  if (!bookingStoreEnabled) return [];

  try {
    const raw = await redis(["GET", keyFor(isoDate)]);
    if (typeof raw !== "string") return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is StoredBooking =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StoredBooking).start === "string" &&
        typeof (item as StoredBooking).end === "string"
    );
  } catch (error) {
    // Kan tiderne ikke hentes, siger vi hellere "ledig" end at afvise
    // en kunde, der gerne vil booke.
    console.error("Kunne ikke hente optagne tider:", error);
    return [];
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
    const existing = await bookingsOnDate(isoDate);
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
