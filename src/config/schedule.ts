/**
 * ÅBNINGSTIDER OG BOOKBARE TIDER
 * ------------------------------------------------
 * HER retter du, hvornår du har åbent. Det ene sted styrer BÅDE
 * åbningstiderne, der vises på hjemmesiden, OG hvilke tider kunden
 * kan vælge i booking-formularen. Så du kan ikke komme til at glemme
 * det ene sted.
 *
 * Sådan lukker du en dag:      { open: false }
 * Sådan åbner du en dag:       { open: true, from: "10:00", to: "20:00" }
 *
 * "to" er det tidspunkt, du er FÆRDIG – ikke det seneste, man kan booke.
 * Har du åbent til 20:00, og en pakke tager 3 timer, er den seneste
 * mulige starttid altså 17:00.
 */

export type DaySchedule = { open: false } | { open: true; from: string; to: string };

/** Rækkefølgen er fast: mandag først, søndag sidst. Lav ikke om på den. */
export const weekSchedule: DaySchedule[] = [
  { open: false }, // Mandag
  { open: false }, // Tirsdag
  { open: false }, // Onsdag
  { open: false }, // Torsdag
  { open: true, from: "15:00", to: "20:00" }, // Fredag
  { open: true, from: "10:00", to: "20:00" }, // Lørdag
  { open: true, from: "10:00", to: "20:00" }, // Søndag
];

export const weekdayNames = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
] as const;

export const scheduleConfig = {
  /** Hvor tit en tid kan starte, i minutter. 30 = kl. 10:00, 10:30, 11:00 ... */
  slotStepMinutes: 30,
  /** Ekstra luft efter hver booking, så du kan nå hjem og videre. */
  bufferMinutes: 30,
  /** Hvor langt frem kunden kan booke, i dage. */
  maxDaysAhead: 60,
  /** Hvor lang tid der mindst skal være til en booking, i timer. */
  minHoursNotice: 12,
} as const;
