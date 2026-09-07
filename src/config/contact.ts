/**
 * KONTAKTOPLYSNINGER OG ÅBNINGSTIDER
 * ------------------------------------------------
 * VIGTIGT: telefonnummer og e-mail herunder er PLACEHOLDERS.
 * Ret dem til dine rigtige oplysninger, før hjemmesiden går live.
 */

export const contactInfo = {
  phone: {
    display: "+45 00 00 00 00",
    // Bruges til "ring op"-links – kun tal, gerne med landekode
    href: "tel:+4500000000",
  },
  email: {
    display: "kontakt@freshinside.dk",
    href: "mailto:kontakt@freshinside.dk",
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
  { days: "Mandag – Fredag", hours: "15:00 – 19:00" },
  { days: "Lørdag", hours: "10:00 – 16:00" },
  { days: "Søndag", hours: "Lukket" },
] as const;
