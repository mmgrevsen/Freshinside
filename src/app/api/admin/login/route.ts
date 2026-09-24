import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  adminLoginConfigured,
  createSessionValue,
  passwordIsCorrect,
  sessionCookie,
} from "@/lib/adminAuth";
import { databaseEnabled, redis } from "@/lib/redis";

/**
 * LOGIN
 * ------------------------------------------------
 * Tager imod adgangskoden og giver dig en "billet" (en cookie), der
 * viser, at du er logget ind.
 *
 * For at ingen kan sidde og gætte sig frem, tæller vi forkerte forsøg.
 * Efter 8 forkerte forsøg er der lukket i et kvarter. Tælleren hører til
 * den enkelte internetforbindelse, så andres gætteri ikke kan spærre
 * DIG ude.
 */

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 8;
const LOCKOUT_SECONDS = 15 * 60;

/**
 * Vi gemmer ikke IP-adressen, men et uigenkendeligt aftryk af den, så
 * tælleren kan virke uden at vi opbevarer personlige oplysninger.
 */
function attemptKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "ukendt";
  const ip = forwarded.split(",")[0].trim();
  const fingerprint = createHash("sha256").update(ip).digest("hex").slice(0, 16);
  return `freshinside:login-fejl:${fingerprint}`;
}

async function failedAttempts(key: string): Promise<number> {
  if (!databaseEnabled) return 0;
  try {
    return Number(await redis(["GET", key])) || 0;
  } catch {
    return 0;
  }
}

async function countFailure(key: string) {
  if (!databaseEnabled) return;
  try {
    await redis(["INCR", key]);
    await redis(["EXPIRE", key, LOCKOUT_SECONDS]);
  } catch {
    // Ikke kritisk.
  }
}

async function clearFailures(key: string) {
  if (!databaseEnabled) return;
  try {
    await redis(["DEL", key]);
  } catch {
    // Ikke kritisk.
  }
}

export async function POST(request: Request) {
  if (!adminLoginConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Login er ikke sat op endnu. Opret ADMIN_PASSWORD på Vercel – se afsnit 10 i README.",
      },
      { status: 503 }
    );
  }

  const key = attemptKey(request);
  if ((await failedAttempts(key)) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { ok: false, error: "For mange forsøg. Prøv igen om et kvarter." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  if (!passwordIsCorrect(password)) {
    await countFailure(key);
    // Lille forsinkelse, så det ikke kan gættes hurtigt.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json(
      { ok: false, error: "Forkert adgangskode." },
      { status: 401 }
    );
  }

  const value = createSessionValue();
  if (!value) {
    return NextResponse.json(
      { ok: false, error: "Login er ikke sat op korrekt." },
      { status: 503 }
    );
  }

  await clearFailures(key);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie.name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionCookie.maxAgeSeconds,
  });

  return response;
}
