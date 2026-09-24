import { NextResponse } from "next/server";
import { dropActiveVisitor, recordVisit } from "@/lib/visits";

/**
 * BESØGSTÆLLER
 * ------------------------------------------------
 * Browseren sender et kort livstegn hertil, mens nogen kigger på
 * siden. Vi gemmer kun et tilfældigt tal, der forsvinder igen – ingen
 * IP-adresse, ingen cookie, intet om hvem der kigger.
 */

export const dynamic = "force-dynamic";

/** Kun rene tilfældige id'er slipper ind. */
const ID_PATTERN = /^[a-z0-9]{8,40}$/;

export async function POST(request: Request) {
  let sessionId = "";
  let isFirstView = false;
  let leaving = false;

  try {
    const body = (await request.json()) as {
      id?: unknown;
      first?: unknown;
      leaving?: unknown;
    };
    sessionId = typeof body.id === "string" ? body.id : "";
    isFirstView = body.first === true;
    leaving = body.leaving === true;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!ID_PATTERN.test(sessionId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (leaving) {
    await dropActiveVisitor(sessionId);
  } else {
    await recordVisit(sessionId, isFirstView);
  }

  return NextResponse.json({ ok: true });
}
