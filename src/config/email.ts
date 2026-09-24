import { contactInfo } from "@/config/contact";
import { siteConfig } from "@/config/site";

/**
 * E-MAIL
 * ------------------------------------------------
 * Her står, hvem mails bliver sendt FRA.
 *
 * VIGTIGT OM AFSENDEREN:
 * Så længe der står "onboarding@resend.dev", kan hjemmesiden KUN sende
 * mails til dig selv. Det er Resends regel for konti uden et godkendt
 * domæne – og det betyder, at dine kunder ikke får noget.
 *
 * SÅDAN KOMMER DU TIL AT SKRIVE TIL KUNDERNE (se afsnit 11 i README):
 * 1. Gå til resend.com -> Domains -> Add Domain, og skriv freshinside.dk
 * 2. Resend viser nogle DNS-records. Læg dem ind hos Simply.com,
 *    ligesom du gjorde med A- og CNAME-recorden til domænet.
 * 3. Når Resend siger "Verified", retter du linjen herunder til:
 *       from: "FreshInside <booking@freshinside.dk>",
 * 4. Gem, og læg ændringen op (git push). Så virker mails til kunder.
 */

export const emailConfig = {
  /** Afsender. Skift til din egen adresse, når domænet er godkendt. */
  from: `${siteConfig.name} <onboarding@resend.dev>`,

  /**
   * Er afsenderen stadig Resends test-adresse? Så kan der kun sendes
   * til dig selv, og hjemmesiden siger det tydeligt i stedet for at
   * lade som om, kunden har fået en mail.
   */
  get canWriteToCustomers() {
    return !this.from.includes("onboarding@resend.dev");
  },

  /** Svarer kunden på mailen, havner svaret her. */
  replyTo: contactInfo.email.display,

  /** Din egen adresse – den bookinger bliver sendt til. */
  owner: contactInfo.email.display,
} as const;
