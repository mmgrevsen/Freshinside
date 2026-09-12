import {
  scheduleConfig,
  weekSchedule,
  weekdayNames,
  type DaySchedule,
} from "@/config/schedule";

/**
 * HJÆLPEFUNKTIONER TIL ÅBNINGSTIDER
 * ------------------------------------------------
 * Regner ud, hvilke tidspunkter kunden kan vælge på en given dato.
 * Du skal ikke rette noget her – åbningstiderne står i
 * src/config/schedule.ts.
 */

const TIME_ZONE = "Europe/Copenhagen";

/** "14:30" -> 870 minutter siden midnat. */
export function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** 870 -> "14:30". */
export function timeFromMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Dato og klokkeslæt lige nu i Danmark – uanset hvor serveren står. */
export function nowInDenmark(): { isoDate: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    isoDate: `${value("year")}-${value("month")}-${value("day")}`,
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

/** Midt på dagen i UTC, så sommertid aldrig kan flytte datoen en dag. */
function noonUtc(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

export function addDays(isoDate: string, days: number): string {
  const date = noonUtc(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  return Math.round((noonUtc(to).getTime() - noonUtc(from).getTime()) / 86_400_000);
}

/** 0 = mandag ... 6 = søndag (samme rækkefølge som weekSchedule). */
export function weekdayIndex(isoDate: string): number {
  return (noonUtc(isoDate).getUTCDay() + 6) % 7;
}

export function scheduleForDate(isoDate: string): DaySchedule {
  return weekSchedule[weekdayIndex(isoDate)];
}

export function weekdayName(isoDate: string): string {
  return weekdayNames[weekdayIndex(isoDate)];
}

/** Hvor mange minutter der er til en bestemt dato og tid. Negativt = fortid. */
export function minutesUntil(isoDate: string, time: string): number {
  const now = nowInDenmark();
  return daysBetween(now.isoDate, isoDate) * 1440 + (minutesFromTime(time) - now.minutes);
}

export type BookedInterval = { start: string; end: string };

/**
 * Er der plads til en ny booking? Der skal være pause (bufferMinutes)
 * både før og efter de bookinger, der allerede ligger på dagen.
 */
export function hasConflict(
  startMinutes: number,
  workMinutes: number,
  booked: BookedInterval[]
): boolean {
  const buffer = scheduleConfig.bufferMinutes;
  const endMinutes = startMinutes + workMinutes;

  return booked.some((slot) => {
    const bookedStart = minutesFromTime(slot.start);
    const bookedEnd = minutesFromTime(slot.end);
    return startMinutes < bookedEnd + buffer && bookedStart < endMinutes + buffer;
  });
}

/**
 * Alle starttidspunkter kunden kan vælge på en dato – dem der er
 * optaget, eller ligger for tæt på nu, er allerede sorteret fra.
 */
export function availableStartTimes(
  isoDate: string,
  workMinutes: number,
  booked: BookedInterval[] = []
): string[] {
  const day = scheduleForDate(isoDate);
  if (!day.open) return [];

  const opens = minutesFromTime(day.from);
  const closes = minutesFromTime(day.to);
  const noticeMinutes = scheduleConfig.minHoursNotice * 60;

  const times: string[] = [];

  for (
    let start = opens;
    start + workMinutes <= closes;
    start += scheduleConfig.slotStepMinutes
  ) {
    const time = timeFromMinutes(start);
    if (minutesUntil(isoDate, time) < noticeMinutes) continue;
    if (hasConflict(start, workMinutes, booked)) continue;
    times.push(time);
  }

  return times;
}

/** Den første dato, kunden kan booke, og den sidste. */
export function bookingDateRange(): { min: string; max: string } {
  const today = nowInDenmark().isoDate;
  return { min: today, max: addDays(today, scheduleConfig.maxDaysAhead) };
}

/**
 * Åbningstiderne skrevet pænt op til hjemmesiden. Dage med samme tider
 * lægges sammen, så der f.eks. står "Mandag – Torsdag: Lukket".
 */
export const openingHoursDisplay: { days: string; hours: string }[] = (() => {
  const rows: { days: string; hours: string }[] = [];

  weekSchedule.forEach((day, index) => {
    const hours = day.open ? `${day.from} – ${day.to}` : "Lukket";
    const previous = rows[rows.length - 1];

    if (previous && previous.hours === hours) {
      const [first] = previous.days.split(" – ");
      previous.days = `${first} – ${weekdayNames[index]}`;
      return;
    }

    rows.push({ days: weekdayNames[index], hours });
  });

  return rows;
})();
