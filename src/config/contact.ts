/**
 * KONTAKTOPLYSNINGER OG ÅBNINGSTIDER
 * ------------------------------------------------
 * Ret dine oplysninger her – de bliver brugt både i kontaktsektionen
 * og i footeren.
 */

export const contactInfo = {
  phone: {
    display: "50 25 50 19",
    // Bruges til "ring op"-links – kun tal, gerne med landekode
    href: "tel:+4550255019",
  },
  email: {
    display: "mmgrevsen@gmail.com",
    href: "mailto:mmgrevsen@gmail.com",
  },
  area: "Aalborg og omegn",
} as const;

/**
 * ÅBNINGSTIDER
 * ------------------------------------------------
 * Skriv en linje pr. dag (eller dagsinterval). "Lukket" vises,
 * hvis der ikke er åbent den dag.
 */
export const openingHours = [
  { days: "Mandag – Torsdag", hours: "Lukket" },
  { days: "Fredag", hours: "16:00 – 21:00" },
  { days: "Lørdag", hours: "10:00 – 20:00" },
  { days: "Søndag", hours: "10:00 – 20:00" },
] as const;
