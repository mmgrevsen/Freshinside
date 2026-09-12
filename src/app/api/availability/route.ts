import { NextResponse } from "next/server";
import { pricingPackages } from "@/config/pricing";
import { scheduleConfig } from "@/config/schedule";
import { bookingsOnDate } from "@/lib/bookingStore";
import {
  availableStartTimes,
  bookingDateRange,
  scheduleForDate,
  weekdayName,
} from "@/lib/schedule";

/**
 * LEDIGE TIDER
 * ------------------------------------------------
 * Booking-formularen spørger her, hver gang kunden vælger en dato:
 * "hvilke tidspunkter er ledige den dag?"
 *
 * Svaret regnes ud af åbningstiderne i src/config/schedule.ts minus
 * de tider, der allerede er booket.
 */

// Svaret må aldrig gemmes/caches – så ville optagne tider se ledige ud.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const packageId = searchParams.get("packageId") ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Ugyldig dato." }, { status: 400 });
  }

  const chosenPackage = pricingPackages.find((pkg) => pkg.id === packageId);
  if (!chosenPackage) {
    return NextResponse.json({ ok: false, error: "Ukendt pakke." }, { status: 400 });
  }

  const range = bookingDateRange();
  if (date < range.min || date > range.max) {
    return NextResponse.json({
      ok: true,
      times: [],
      closed: true,
      message: `Du kan booke op til ${scheduleConfig.maxDaysAhead} dage frem.`,
    });
  }

  const day = scheduleForDate(date);
  if (!day.open) {
    return NextResponse.json({
      ok: true,
      times: [],
      closed: true,
      message: `Jeg har desværre lukket om ${weekdayName(date).toLowerCase()}en. Vælg en anden dag.`,
    });
  }

  const booked = await bookingsOnDate(date);
  const times = availableStartTimes(date, chosenPackage.blockMinutes, booked);

  // Er der slet ingen tider tilbage, skyldes det enten for kort varsel
  // eller at dagen er booket op. Kunden skal have den rigtige besked.
  let message: string | null = null;
  if (times.length === 0) {
    const withoutBookings = availableStartTimes(date, chosenPackage.blockMinutes, []);
    message =
      withoutBookings.length === 0
        ? `Der skal bestilles mindst ${scheduleConfig.minHoursNotice} timer i forvejen. Vælg en senere dag.`
        : "Alle tider er optaget den dag. Prøv en anden dato.";
  }

  return NextResponse.json({ ok: true, times, closed: false, message });
}
