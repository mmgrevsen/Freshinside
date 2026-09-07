import { NextResponse } from "next/server";
import { pricingPackages } from "@/config/pricing";
import { serviceAreaConfig } from "@/config/serviceArea";
import { checkServiceArea } from "@/lib/distance";
import type { BookingRequest } from "@/types/booking";

/**
 * BOOKING-API
 * ------------------------------------------------
 * Tager imod bookingforespørgsler fra formularen på forsiden:
 * 1. Tjekker at alle felter er udfyldt
 * 2. Tjekker at adressen ligger inden for dit køreområde
 * 3. Sender dig en e-mail med bookingen
 *
 * SÅDAN FÅR DU E-MAILS (engangsopsætning, ca. 5 minutter):
 * 1. Opret en gratis konto på https://resend.com – brug den samme
 *    e-mail, som du vil modtage bookinger på.
 * 2. Gå til "API Keys" og opret en nøgle. Kopiér den (starter med re_).
 * 3. Gå til dit projekt på vercel.com → Settings → Environment Variables
 * 4. Opret en variabel med navnet RESEND_API_KEY og indsæt nøglen som værdi.
 * 5. Gå til Deployments, klik ⋯ ved den nyeste og vælg "Redeploy".
 *
 * Indtil det er sat op, bliver bookinger stadig modtaget og skrevet i
 * loggen på Vercel (Projekt → Logs), så intet går tabt.
 */

const BOOKING_EMAIL = serviceAreaConfig.outOfAreaEmail;

function formatBookingEmail(booking: BookingRequest, distanceKm: number | null) {
  const chosenPackage = pricingPackages.find((pkg) => pkg.id === booking.packageId);

  return [
    "Ny bookingforespørgsel fra FreshInside.dk",
    "",
    `Pakke:     ${chosenPackage ? `${chosenPackage.name} (${chosenPackage.price} ${chosenPackage.priceSuffix})` : booking.packageId}`,
    `Dato:      ${booking.date}`,
    `Tidspunkt: ${booking.time}`,
    "",
    `Navn:      ${booking.name}`,
    `Telefon:   ${booking.phone}`,
    `E-mail:    ${booking.email}`,
    `Adresse:   ${booking.address}, ${booking.postalCode}`,
    distanceKm !== null ? `Afstand:   ca. ${distanceKm} km herfra` : "",
    "",
    "Besked fra kunden:",
    booking.message?.trim() || "(ingen besked)",
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendNotificationEmail(booking: BookingRequest, distanceKm: number | null) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("Ny booking (e-mail ikke sat op endnu):", booking);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "FreshInside <onboarding@resend.dev>",
      to: [BOOKING_EMAIL],
      reply_to: booking.email,
      subject: `Ny booking: ${booking.name} – ${booking.date} kl. ${booking.time}`,
      text: formatBookingEmail(booking, distanceKm),
    }),
  });

  if (!response.ok) {
    console.error(
      "Kunne ikke sende booking-mail:",
      response.status,
      await response.text()
    );
    console.log("Booking der ikke blev sendt på mail:", booking);
  }
}

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
    "postalCode",
  ];

  const missingField = requiredFields.find((field) => !body[field]);
  if (missingField) {
    return NextResponse.json(
      { ok: false, error: `Feltet "${missingField}" mangler.` },
      { status: 400 }
    );
  }

  const validPackage = pricingPackages.some((pkg) => pkg.id === body.packageId);
  if (!validPackage) {
    return NextResponse.json(
      { ok: false, error: "Ukendt rengøringspakke." },
      { status: 400 }
    );
  }

  const booking = body as BookingRequest;

  // Tjekkes igen her på serveren, så området ikke kan omgås i browseren.
  const { isInsideArea, distanceKm } = await checkServiceArea(
    booking.address,
    booking.postalCode
  );

  if (!isInsideArea) {
    return NextResponse.json(
      {
        ok: false,
        outOfArea: true,
        error: serviceAreaConfig.outOfAreaMessage,
      },
      { status: 422 }
    );
  }

  await sendNotificationEmail(booking, distanceKm);

  return NextResponse.json({ ok: true });
}
