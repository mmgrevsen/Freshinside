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
            Din booking gemmes i 180 dage, så {siteConfig.name} kan holde styr
            på aftalerne, og slettes derefter automatisk.
          </p>
          <p>
            Oplysningerne videregives ikke til tredjepart og bruges ikke til
            markedsføring uden dit samtykke.
          </p>
          <h2 className="text-lg font-semibold text-ink">Besøg på hjemmesiden</h2>
          <p>
            Hjemmesiden tæller, hvor mange der besøger den. Der bruges hverken
            cookies eller IP-adresser til det, og der gemmes ingenting, der kan
            bruges til at genkende dig – hverken nu eller senere. Hver fane får
            blot et tilfældigt tal, som forsvinder igen, når du lukker siden.
          </p>
          <p>
            Det betyder, at {siteConfig.name} kan se, hvor mange der kigger på
            hjemmesiden – men aldrig hvem. Derfor er der heller ingen
            cookie-boks: der er ingen cookies at spørge om lov til.
          </p>
          <h2 className="text-lg font-semibold text-ink">Adresser og kort</h2>
          <p>
            Når du skriver din adresse, slås den op i Danmarks officielle
            adresseregister (Dataforsyningen), og afstanden beregnes via den
            åbne rutetjeneste BRouter. Vælger du at åbne kortet, hentes
            korttegningerne fra OpenStreetMap. Disse tjenester modtager kun den
            adresse eller det punkt, opslaget handler om.
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
