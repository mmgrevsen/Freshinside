import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { contactInfo } from "@/config/contact";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privatlivspolitik",
  description: `Sådan behandler ${siteConfig.name} dine oplysninger.`,
};

/**
 * PLACEHOLDER-PRIVATLIVSPOLITIK
 * ------------------------------------------------
 * Denne tekst er en simpel, midlertidig skabelon. Når virksomheden
 * vokser, eller hvis du begynder at gemme rigtige kundedata i en
 * database, bør du få teksten gennemgået, så den matcher, hvad du
 * faktisk gør med oplysningerne.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-20 sm:pt-40">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Privatlivspolitik
        </h1>
        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-ink-soft">
          <p>
            Når du booker en rengøring hos {siteConfig.name}, indtaster du
            navn, telefonnummer, e-mail og adresse. Oplysningerne bruges
            udelukkende til at planlægge og gennemføre din rengøring samt til
            at kontakte dig om din booking.
          </p>
          <p>
            Oplysningerne videregives ikke til tredjepart og bruges ikke til
            markedsføring uden dit samtykke.
          </p>
          <p>
            Har du spørgsmål til, hvordan dine oplysninger behandles, kan du
            kontakte {siteConfig.name} på{" "}
            <a href={contactInfo.email.href} className="text-brand-700 underline">
              {contactInfo.email.display}
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
