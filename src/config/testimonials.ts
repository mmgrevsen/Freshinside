/**
 * KUNDEANMELDELSER
 * ------------------------------------------------
 * VIGTIGT: Disse anmeldelser er EKSEMPLER (placeholders) og vises
 * tydeligt som det på hjemmesiden, indtil du erstatter dem.
 *
 * Når du får rigtige anmeldelser: ret navn, tekst og stjerner,
 * og sæt isPlaceholder til false, så mærkatet "Eksempel" forsvinder.
 */

export type Testimonial = {
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  isPlaceholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    name: "Anders J.",
    location: "Aalborg",
    rating: 5,
    text: "Bilen fremstod som ny indvendig. Nemt at booke, og der blev holdt tid.",
    isPlaceholder: true,
  },
  {
    name: "Mette S.",
    location: "Nørresundby",
    rating: 5,
    text: "Rigtig grundig rengøring, og god kommunikation hele vejen igennem.",
    isPlaceholder: true,
  },
  {
    name: "Peter K.",
    location: "Aalborg SV",
    rating: 4,
    text: "Fin oplevelse fra booking til færdigt resultat. Kommer helt sikkert igen.",
    isPlaceholder: true,
  },
];
