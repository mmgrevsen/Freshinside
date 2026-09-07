import { NextResponse } from "next/server";
import { pricingPackages } from "@/config/pricing";
import type { BookingRequest } from "@/types/booking";

/**
 * BOOKING-API (PROTOTYPE)
 * ------------------------------------------------
 * Der er endnu ikke koblet en rigtig database på. Lige nu bliver en
 * bookingforespørgsel valideret og skrevet til serverens log (console.log),
 * så hele flowet – formular -> API -> bekræftelse – virker end-to-end.
 *
 * SÅDAN GØR DU DET FULDT FUNKTIONELT SENERE (f.eks. med Supabase):
 * 1. Opret et projekt hos Supabase og en tabel "bookings", der matcher
 *    typen BookingRequest i src/types/booking.ts.
 * 2. Installer Supabase-klienten og opret en forbindelse (typisk i en
 *    fil som src/lib/supabase.ts).
 * 3. Erstat "console.log(booking)" herunder med et rigtigt kald, der
 *    indsætter bookingen i databasen, f.eks.
 *    await supabase.from("bookings").insert(booking)
 * 4. Overvej at sende en bekræftelses-mail/SMS herfra, når bookingen
 *    er gemt.
 */
export async function POST(request: Request) {
  let body: Partial<BookingRequest>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ugyldig forespørgsel." },
      { status: 400 }
    );
  }

  const requiredFields: (keyof BookingRequest)[] = [
    "packageId",
    "date",
    "time",
    "name",
    "phone",
    "email",
    "address",
  ];

  const missingField = requiredFields.find((field) => !body[field]);
  if (missingField) {
    return NextResponse.json(
      { ok: false, error: `Feltet "${missingField}" mangler.` },
      { status: 400 }
    );
  }

  const validPackage = pricingPackages.some(
    (pkg) => pkg.id === body.packageId
  );
  if (!validPackage) {
    return NextResponse.json(
      { ok: false, error: "Ukendt rengøringspakke." },
      { status: 400 }
    );
  }

  const booking = body as BookingRequest;

  // TODO: Gem i en rigtig database (se guiden ovenfor).
  console.log("Ny bookingforespørgsel modtaget:", booking);

  return NextResponse.json({ ok: true });
}
