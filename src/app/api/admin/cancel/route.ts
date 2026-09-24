import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/adminAuth";
import { removeBooking } from "@/lib/bookingStore";

/**
 * AFLYS EN BOOKING
 * ------------------------------------------------
 * Fjerner en booking fra kalenderen, så tiden bliver ledig igen.
 * Kun dig – ruten tjekker, at du er logget ind.
 *
 * Kunden får IKKE automatisk besked. Ring eller skriv til dem selv;
 * deres telefonnummer står på bookingen.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false, error: "Ikke logget ind." }, { status: 401 });
  }

  let date = "";
  let start = "";
  let createdAt: string | undefined;

  try {
    const body = (await request.json()) as {
      date?: unknown;
      start?: unknown;
      createdAt?: unknown;
    };
    date = typeof body.date === "string" ? body.date : "";
    start = typeof body.start === "string" ? body.start : "";
    createdAt = typeof body.createdAt === "string" ? body.createdAt : undefined;
  } catch {
    return NextResponse.json({ ok: false, error: "Ugyldig forespørgsel." }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start)) {
    return NextResponse.json({ ok: false, error: "Ugyldig dato eller tid." }, { status: 400 });
  }

  const removed = await removeBooking(date, start, createdAt);

  if (!removed) {
    return NextResponse.json(
      { ok: false, error: "Bookingen blev ikke fundet." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
