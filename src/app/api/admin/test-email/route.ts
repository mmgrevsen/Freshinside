import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/adminAuth";
import { sendEmail } from "@/lib/email";
import { emailConfig } from "@/config/email";
import { siteConfig } from "@/config/site";

/**
 * SEND EN TESTMAIL
 * ------------------------------------------------
 * Så du kan se, om mails virker, uden at vente på en rigtig kunde.
 * Mailen går altid til DIN egen adresse.
 */

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false, error: "Ikke logget ind." }, { status: 401 });
  }

  const result = await sendEmail({
    to: emailConfig.owner,
    subject: `Testmail fra ${siteConfig.name}`,
    text: [
      "Det virker! 🎉",
      "",
      "Kan du læse denne mail, får du også besked, hver gang nogen booker.",
      "",
      `Afsender lige nu: ${emailConfig.from}`,
      emailConfig.canWriteToCustomers
        ? "Dit eget domæne er sat op, så du kan også skrive til kunderne."
        : "BEMÆRK: Afsenderen er stadig Resends testadresse, så du kan kun sende til dig selv. Vil du kunne skrive til kunderne (f.eks. ved aflysning), skal freshinside.dk godkendes hos Resend – se afsnit 11 i README.",
    ].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    sentTo: emailConfig.owner,
    canWriteToCustomers: emailConfig.canWriteToCustomers,
  });
}
