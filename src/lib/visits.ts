import { databaseEnabled, redis, redisPipeline } from "@/lib/redis";
import { addDays, nowInDenmark } from "@/lib/schedule";

/**
 * BESØGSTÆLLER
 * ------------------------------------------------
 * Tæller, hvor mange der kigger på hjemmesiden. Vi gemmer BEVIDST
 * ingen personlige oplysninger:
 *
 *  - ingen IP-adresser
 *  - ingen cookies
 *  - intet om hvem folk er, hvor de bor, eller hvor de kommer fra
 *
 * Hver fane får et tilfældigt tal, som kun findes, mens fanen er åben,
 * og som ikke kan bruges til at genkende nogen senere. Derfor kan du
 * se HVOR MANGE der kigger – aldrig HVEM.
 *
 * Det er også grunden til, at hjemmesiden ikke skal have en
 * cookie-boks: vi sætter ingen cookies at spørge om.
 */

/** Besøgstal gemmes i et år og slettes så af sig selv. */
const KEEP_SECONDS = 60 * 60 * 24 * 370;

/** Man tæller som "inde lige nu" i 3 minutter efter sidste livstegn. */
const ACTIVE_WINDOW_MS = 3 * 60 * 1000;

const ACTIVE_KEY = "freshinside:active";

const viewsKey = (isoDate: string) => `freshinside:views:${isoDate}`;
const visitorsKey = (isoDate: string) => `freshinside:visitors:${isoDate}`;

/** Registrerer et besøg. Kaldes fra browseren, mens nogen kigger. */
export async function recordVisit(sessionId: string, isFirstView: boolean) {
  if (!databaseEnabled) return;

  const today = nowInDenmark().isoDate;
  const now = Date.now();

  const commands: (string | number)[][] = [
    // Hvem er inde lige nu (en liste sorteret efter tidspunkt)
    ["ZADD", ACTIVE_KEY, now, sessionId],
    ["ZREMRANGEBYSCORE", ACTIVE_KEY, 0, now - ACTIVE_WINDOW_MS],
    ["EXPIRE", ACTIVE_KEY, 3600],
    // Unikke besøgende i dag
    ["SADD", visitorsKey(today), sessionId],
    ["EXPIRE", visitorsKey(today), KEEP_SECONDS],
  ];

  if (isFirstView) {
    commands.push(["INCR", viewsKey(today)], ["EXPIRE", viewsKey(today), KEEP_SECONDS]);
  }

  try {
    await redisPipeline(commands);
  } catch (error) {
    // En besøgstæller må aldrig ødelægge siden for kunden.
    console.error("Kunne ikke tælle besøget:", error);
  }
}

export type VisitStats = {
  /** Hvor mange der kigger lige nu */
  activeNow: number;
  /** Unikke besøgende i dag */
  visitorsToday: number;
  /** Sidevisninger i dag */
  viewsToday: number;
  /** Unikke besøgende de sidste 7 dage (dag for dag, ældst først) */
  lastDays: { date: string; visitors: number }[];
};

/** Henter besøgstallene til /admin. */
export async function readVisitStats(days = 7): Promise<VisitStats | null> {
  if (!databaseEnabled) return null;

  const today = nowInDenmark().isoDate;
  const dates = Array.from({ length: days }, (_, index) =>
    addDays(today, index - (days - 1))
  );

  try {
    const results = await redisPipeline([
      ["ZCOUNT", ACTIVE_KEY, Date.now() - ACTIVE_WINDOW_MS, "+inf"],
      ["GET", viewsKey(today)],
      ...dates.map((date) => ["SCARD", visitorsKey(date)]),
    ]);

    const toNumber = (value: unknown) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const perDay = dates.map((date, index) => ({
      date,
      visitors: toNumber(results[index + 2]),
    }));

    return {
      activeNow: toNumber(results[0]),
      viewsToday: toNumber(results[1]),
      visitorsToday: perDay[perDay.length - 1]?.visitors ?? 0,
      lastDays: perDay,
    };
  } catch (error) {
    console.error("Kunne ikke hente besøgstal:", error);
    return null;
  }
}

/** Nulstiller "inde lige nu", når nogen lukker fanen. */
export async function dropActiveVisitor(sessionId: string) {
  if (!databaseEnabled) return;
  try {
    await redis(["ZREM", ACTIVE_KEY, sessionId]);
  } catch {
    // Ikke kritisk – de falder alligevel ud efter 3 minutter.
  }
}
