import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/adminAuth";
import { removeBooking } from "@/lib/bookingStore";
import { sendEmail } from "@/lib/email";
import { emailConfig } from "@/config/email";
import { contactInfo } from "@/config/contact";
import { siteConfig } from "@/config/site";

/**
 * AFLYS EN BOOKING
 * ------------------------------------------------
 * Fjerner en booking fra kalenderen, så tiden bliver ledig igen, og
 * sender kunden den besked, du har skrevet.
 *
 * Kun dig – ruten tjekker, at du er logget ind.
 *
 * Bemærk: tiden bliver frigivet, også selvom mailen ikke kan sendes.
 * Svaret fortæller, om kunden fik besked, så du kan ringe i stedet.
 */

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false, error: "Ikke logget ind." }, { status: 401 });
  }

  let date = "";
  let start = "";
  let createdAt: string | undefined;
  let message = "";

  try {
    const body = (await request.json()) as Record<string, unknown>;
    date = typeof body.date === "string" ? body.date : "";
    start = typeof body.start === "string" ? body.start : "";
    createdAt = typeof body.createdAt === "string" ? body.createdAt : undefined;
    message = typeof body.message === "string" ? body.message.slice(0, MAX_MESSAGE_LENGTH) : "";
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

  // Tiden er nu ledig igen. Så prøver vi at give kunden besked.
  if (!message.trim()) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      emailNote: "Tiden er aflyst. Du skrev ingen besked, så kunden har ikke fået noget.",
    });
  }

  if (!removed.email) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      emailNote: "Tiden er aflyst, men der er ingen e-mailadresse på bookingen.",
    });
  }

  const result = await sendEmail({
    to: removed.email,
    replyTo: emailConfig.owner,
    subject: `Din tid hos ${siteConfig.name} den ${date} kl. ${start}`,
    text: [
      `Hej ${removed.name.split(" ")[0]}`,
      "",
      message.trim(),
      "",
      "---",
      `Det drejer sig om din tid ${date} kl. ${start}.`,
      `Du kan svare på denne mail eller ringe på ${contactInfo.phone.display}.`,
      "",
      "Venlig hilsen",
      `Marcus – ${siteConfig.name}`,
    ].join("\n"),
  });

  return NextResponse.json({
    ok: true,
    emailed: result.ok,
    emailNote: result.ok
      ? `Tiden er aflyst, og beskeden er sendt til ${removed.email}.`
      : `Tiden er aflyst, MEN beskeden kunne ikke sendes: ${result.error} Ring til kunden på ${removed.phone ?? "nummeret på bookingen"}.`,
  });
}
