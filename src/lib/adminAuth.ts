import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * LOGIN TIL DIN EGEN SIDE
 * ------------------------------------------------
 * Siden /admin er kun for dig. Der er ingen brugerkonti og ingen
 * database med brugernavne – der er kun ÉN adgangskode, og den står
 * som en miljøvariabel på Vercel, ikke i koden.
 *
 * SÅDAN SÆTTER DU DEN OP (se også afsnit 10 i README):
 * 1. Find på en lang adgangskode – gerne 20+ tegn.
 * 2. Vercel → dit projekt → Settings → Environment Variables
 * 3. Navn: ADMIN_PASSWORD, værdi: din adgangskode
 * 4. Deployments → ⋯ på den nyeste → Redeploy
 *
 * Er ADMIN_PASSWORD ikke sat, er siden LUKKET for alle – også dig.
 * Den står altså aldrig åben ved en fejl.
 */

const COOKIE_NAME = "freshinside_admin";

/** Hvor længe du forbliver logget ind, før du skal skrive koden igen. */
const SESSION_DAYS = 14;

/** Mindste længde på adgangskoden. En kort kode er næsten som ingen kode. */
const MIN_LENGTH = 8;

function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < MIN_LENGTH) return null;
  return password;
}

export type AdminLoginState =
  /** Klar til brug */
  | "ready"
  /** ADMIN_PASSWORD findes slet ikke */
  | "missing"
  /** ADMIN_PASSWORD findes, men koden er for kort */
  | "too-short";

/**
 * Hvordan står det til med login? Vi skelner mellem "ikke oprettet" og
 * "for kort kode", så beskeden på skærmen siger, hvad der faktisk er galt.
 */
export function adminLoginState(): AdminLoginState {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "missing";
  if (password.length < MIN_LENGTH) return "too-short";
  return "ready";
}

export const minPasswordLength = MIN_LENGTH;

/** Er login overhovedet sat op? */
export function adminLoginConfigured(): boolean {
  return adminPassword() !== null;
}

/**
 * Laver en "billet", der beviser, at du har skrevet den rigtige kode.
 * Billetten er underskrevet med adgangskoden som nøgle, så den ikke kan
 * forfalskes – og skifter du adgangskode, bliver gamle billetter
 * ugyldige med det samme.
 */
function sign(expiresAt: number, password: string): string {
  return createHmac("sha256", password).update(String(expiresAt)).digest("hex");
}

/** Sammenligner to tekster, uden at tiden røber, hvor de er forskellige. */
function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function passwordIsCorrect(attempt: string): boolean {
  const password = adminPassword();
  if (!password) return false;
  return safeEqual(attempt, password);
}

export function createSessionValue(): string | null {
  const password = adminPassword();
  if (!password) return null;

  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expiresAt}.${sign(expiresAt, password)}`;
}

export const sessionCookie = {
  name: COOKIE_NAME,
  maxAgeSeconds: SESSION_DAYS * 24 * 60 * 60,
};

function sessionIsValid(value: string | undefined): boolean {
  const password = adminPassword();
  if (!password || !value) return false;

  const [expiresRaw, signature] = value.split(".");
  const expiresAt = Number(expiresRaw);

  if (!Number.isFinite(expiresAt) || !signature) return false;
  if (expiresAt < Date.now()) return false;

  return safeEqual(signature, sign(expiresAt, password));
}

/** Er du logget ind lige nu? Kaldes fra serveren, før siden vises. */
export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return sessionIsValid(store.get(COOKIE_NAME)?.value);
}
