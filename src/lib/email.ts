import { emailConfig } from "@/config/email";

/**
 * AFSENDELSE AF E-MAIL
 * ------------------------------------------------
 * Ét sted der sender mails, så både bookinger og aflysninger bruger
 * samme kode. Mails sendes via Resend (gratis konto).
 *
 * Er RESEND_API_KEY ikke sat på Vercel, bliver mailen skrevet i loggen
 * i stedet, så intet går tabt – se afsnit 8 i README.
 */

/** Er e-mail overhovedet sat op? */
export const emailConfigured = Boolean(process.env.RESEND_API_KEY);

/**
 * Adressen på mailtjenesten. Kan sættes til noget andet under test, så
 * man kan prøve forløbet igennem uden at sende rigtige mails. I drift
 * skal den bare stå tom, så bruges Resend.
 */
const API_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "rejected" | "failed"; error: string };

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`E-mail ikke sat op endnu. Skulle have sendt til ${to}:\n${text}`);
    return {
      ok: false,
      reason: "not-configured",
      error: "E-mail er ikke sat op endnu (RESEND_API_KEY mangler på Vercel).",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailConfig.from,
        to: [to],
        reply_to: replyTo ?? emailConfig.replyTo,
        subject,
        text,
      }),
    });

    if (response.ok) return { ok: true };

    const details = await response.text();
    console.error("Kunne ikke sende mail:", response.status, details);
    console.log(`Mailen der ikke blev sendt til ${to}:\n${text}`);

    // Resend afviser mails til andre end kontoens ejer, indtil man har
    // godkendt sit eget domæne. Det er den klart hyppigste årsag.
    const looksLikeUnverifiedDomain =
      response.status === 403 ||
      details.includes("verify a domain") ||
      details.includes("own email address");

    return {
      ok: false,
      reason: "rejected",
      error: looksLikeUnverifiedDomain
        ? "Resend vil kun sende til din egen adresse, indtil du har godkendt freshinside.dk som afsender. Se afsnit 11 i README."
        : `Mailtjenesten afviste beskeden (fejl ${response.status}).`,
    };
  } catch (error) {
    console.error("Mailen kunne slet ikke sendes:", error);
    console.log(`Mailen der ikke blev sendt til ${to}:\n${text}`);
    return {
      ok: false,
      reason: "failed",
      error: "Kunne ikke få fat i mailtjenesten. Prøv igen om lidt.",
    };
  }
}
