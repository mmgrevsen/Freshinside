import { NextResponse } from "next/server";
import { pricingPackages, type PricingPackage } from "@/config/pricing";
import { addOns } from "@/config/addons";
import { serviceAreaConfig } from "@/config/serviceArea";
import { checkServiceAreaByText, measureDistanceToCustomer } from "@/lib/distance";
import { addressById } from "@/lib/dawa";
import { bookingsOnDate, reserveBooking } from "@/lib/bookingStore";
import {
  availableStartTimes,
  minutesFromTime,
  timeFromMinutes,
  weekdayName,
} from "@/lib/schedule";
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

/** Prisen regnes ud her, så et manipuleret beløb fra browseren ikke kan snyde. */
function calculateTotal(booking: BookingRequest) {
  const chosenPackage = pricingPackages.find((pkg) => pkg.id === booking.packageId);
  const addOnTotal = addOns
    .filter((addOn) => booking.addOnIds?.includes(addOn.id))
    .reduce((sum, addOn) => sum + addOn.price, 0);

  return (chosenPackage?.price ?? 0) + addOnTotal;
}

function formatBookingEmail(booking: BookingRequest, distanceKm: number | null) {
  const chosenPackage = pricingPackages.find((pkg) => pkg.id === booking.packageId);

  const chosenAddOns = addOns.filter((addOn) =>
    booking.addOnIds?.includes(addOn.id)
  );

  return [
    "Ny bookingforespørgsel fra FreshInside.dk",
    "",
    `Pakke:     ${chosenPackage ? `${chosenPackage.name} (${chosenPackage.price} ${chosenPackage.priceSuffix})` : booking.packageId}`,
    chosenAddOns.length > 0
      ? `Ekstra:    ${chosenAddOns.map((a) => `${a.name} (+${a.price} kr.)`).join(", ")}`
      : "Ekstra:    ingen",
    `I alt:     ${calculateTotal(booking)} kr.`,
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

/**
 * Slår den valgte adresse op og måler afstanden hjem til dig.
 * Falder tilbage til et tekstopslag, hvis id'et ikke kan bruges.
 */
async function verifyServiceArea(booking: BookingRequest) {
  const address = booking.addressId ? await addressById(booking.addressId) : null;

  if (!address) {
    return checkServiceAreaByText(booking.address, booking.postalCode);
  }

  return measureDistanceToCustomer([address.longitude, address.latitude]);
}

/**
 * Tjekker at det ønskede tidspunkt overhovedet findes: at der er åbent,
 * at der er varslet i tide, og at ingen andre har taget tiden.
 * Tjekkes her på serveren, så det ikke kan omgås i browseren.
 */
async function verifyTimeSlot(booking: BookingRequest, chosenPackage: PricingPackage) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || !/^\d{2}:\d{2}$/.test(booking.time)) {
    return { ok: false as const, error: "Vælg venligst en dato og et tidspunkt." };
  }

  const booked = await bookingsOnDate(booking.date);
  const available = availableStartTimes(booking.date, chosenPackage.blockMinutes, booked);

  if (available.includes(booking.time)) return { ok: true as const };

  return {
    ok: false as const,
    error: booked.length > 0
      ? "Tiden blev desværre lige booket af en anden. Vælg et andet tidspunkt."
      : `Jeg kan desværre ikke ${weekdayName(booking.date).toLowerCase()} kl. ${booking.time}. Vælg et af de ledige tidspunkter.`,
  };
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

  const chosenPackage = pricingPackages.find((pkg) => pkg.id === body.packageId);
  if (!chosenPackage) {
    return NextResponse.json(
      { ok: false, error: "Ukendt rengøringspakke." },
      { status: 400 }
    );
  }

  const booking = body as BookingRequest;

  const slot = await verifyTimeSlot(booking, chosenPackage);
  if (!slot.ok) {
    return NextResponse.json({ ok: false, error: slot.error }, { status: 409 });
  }

  // Tjekkes igen her på serveren, så området ikke kan omgås i browseren.
  // Vi slår selv adressen op ud fra dens id i stedet for at stole på de
  // koordinater, browseren har sendt med.
  const { isInsideArea, distanceKm } = await verifyServiceArea(booking);

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

  // Tiden markeres som optaget, så den forsvinder for de næste kunder.
  const reservation = await reserveBooking(
    booking.date,
    {
      start: booking.time,
      end: timeFromMinutes(minutesFromTime(booking.time) + chosenPackage.blockMinutes),
      name: booking.name,
    },
    chosenPackage.blockMinutes
  );

  if (!reservation.reserved && reservation.reason === "taken") {
    return NextResponse.json(
      {
        ok: false,
        error: "Tiden blev desværre lige booket af en anden. Vælg et andet tidspunkt.",
      },
      { status: 409 }
    );
  }

  await sendNotificationEmail(booking, distanceKm);

  return NextResponse.json({ ok: true });
}
