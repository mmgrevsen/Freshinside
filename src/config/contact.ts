/**
 * KONTAKTOPLYSNINGER
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
 * Åbningstiderne står IKKE her længere – de står i
 * src/config/schedule.ts, fordi de samme tider også bestemmer,
 * hvilke tidspunkter kunden kan booke.
 *
 * Retter du dem der, opdaterer både denne liste og booking-formularen
 * sig automatisk.
 */
export { openingHoursDisplay as openingHours } from "@/lib/schedule";
