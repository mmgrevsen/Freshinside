/**
 * Datastrukturen for en bookingforespørgsel.
 *
 * Denne type bruges både af bookingformularen (src/components/sections/BookingSection.tsx)
 * og af API-routen (src/app/api/booking/route.ts), så de altid er enige om,
 * hvilke felter en booking indeholder. Når der senere kobles en rigtig
 * database på (f.eks. Supabase), er det denne type, en tabel/tabel-række
 * skal matche.
 */
export type BookingRequest = {
  packageId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  message: string;
};
