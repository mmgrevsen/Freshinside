/**
 * FØR & EFTER-BILLEDER
 * ------------------------------------------------
 * Det er dine EGNE billeder fra en rigtig bil. De ligger i
 * public/images/arbejde/.
 *
 * SÅDAN TILFØJER DU ET NYT PAR:
 * 1. Læg de to billeder i public/images/arbejde/
 * 2. Kopiér en hel blok { ... } herunder og ret id, titel og filnavne
 * 3. Gem filen – hjemmesiden opdaterer sig selv
 *
 * GODE RÅD, NÅR DU FOTOGRAFERER:
 * - Tag "efter"-billedet fra PRÆCIS samme sted som "før". Stil dig
 *   det samme sted, hold telefonen i samme højde og samme retning
 *   (begge på højkant eller begge på langs). Så bliver forskellen
 *   tydelig – ellers ligner det bare to forskellige biler.
 * - Tag dem i samme lys. Helst i skygge eller overskyet vejr; skarpt
 *   sollys giver hårde skygger inde i kabinen.
 * - Send billederne i FULD størrelse. Sender du dem gennem en chat
 *   eller Snapchat, bliver de skrumpet, og så kan de ikke blive
 *   skarpe igen.
 */

export type BeforeAfterItem = {
  id: string;
  title: string;
  before: string;
  after: string;
  /** Kort forklaring, så kunden ved, hvad de kigger på */
  note?: string;
};

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: "saederyg",
    title: "Sæderyg",
    before: "/images/arbejde/saede-foer.webp",
    after: "/images/arbejde/saede-efter.webp",
    note: "Mærker og snavs på læderet er væk",
  },
  {
    id: "konsol",
    title: "Midterkonsol",
    before: "/images/arbejde/konsol-foer.webp",
    after: "/images/arbejde/konsol-efter.webp",
    note: "Ryddet op, tørret af og støvsuget",
  },
  {
    id: "kabine",
    title: "Kabine",
    before: "/images/arbejde/kabine-foer.webp",
    after: "/images/arbejde/kabine-efter.webp",
    note: "Måtter, gulv og overflader",
  },
];

/**
 * Hero-billedet øverst på forsiden bruges ikke lige nu – der står en
 * tegnet bilkabine i stedet (src/components/ui/HeroScene.tsx), fordi
 * den loader lynhurtigt og altid er skarp.
 *
 * Vil du hellere have dit eget foto øverst, så sig til.
 */
export const heroImage = {
  src: "/images/arbejde/kabine-efter.webp",
  alt: "Nyrengjort bilkabine",
};
