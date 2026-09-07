/**
 * GRUNDLÆGGENDE OPLYSNINGER OM FRESHINSIDE
 * ------------------------------------------------
 * Denne fil samler navn, slogan, tekster og links, som bruges flere
 * steder på hjemmesiden. Ret her, og ændringen slår igennem alle steder.
 */

export const siteConfig = {
  // Virksomhedens navn
  name: "FreshInside",

  // Slogan – vises i hero-sektionen og i footeren
  slogan: "En friskere bil. Uden besværet.",

  // Kort beskrivelse – bruges i SEO (meta description) og enkelte steder på siden
  shortDescription:
    "Professionel indvendig bilrengøring i Aalborg og omegn. Nemt, lokalt og uden besvær – vi kommer til dig.",

  // Det fulde website-domæne (ret når du har købt et domæne og deployet på Vercel)
  url: "https://freshinside.dk",

  // Søgeord til SEO – bruges i metadata i src/app/layout.tsx
  keywords: [
    "bilrengøring Aalborg",
    "indvendig bilrengøring Aalborg",
    "bilpleje Aalborg",
    "rengøring af bil",
    "indvendig bilpleje",
    "mobil bilrengøring",
  ],

  // Området I kører ud til – bruges i "Vi kommer til dig"-sektionen, kontakt og SEO
  serviceArea: "Aalborg og omegn",

  // Sociale medier – sæt til tom streng "" for at skjule et ikon i footeren
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;

/**
 * NAVIGATION
 * ------------------------------------------------
 * Rækkefølgen herunder bestemmer rækkefølgen i menuen (både på
 * computer og i mobilmenuen). "href" er et anker, der peger på en
 * sektion på forsiden (id'et på sektionen i page.tsx).
 */
export const navLinks = [
  { label: "Forside", href: "#forside" },
  { label: "Priser", href: "#priser" },
  { label: "Sådan fungerer det", href: "#saadan-fungerer-det" },
  // "Før & efter" er midlertidigt fjernet fra menuen, fordi sektionen er
  // slået fra i src/app/page.tsx (se kommentaren der). Sæt linjen herunder
  // tilbage ind, når sektionen vises igen:
  // { label: "Før & efter", href: "#foer-efter" },
  { label: "Om FreshInside", href: "#om-os" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
] as const;

export const bookingAnchor = "#booking";

/**
 * TEKSTER TIL "SÅDAN FUNGERER DET"
 */
export const howItWorksSteps = [
  {
    title: "Book",
    description: "Vælg den rengøring, der passer til din bil.",
  },
  {
    title: "Jeg kommer til dig",
    description: "FreshInside kommer ud til kunden efter aftale.",
  },
  {
    title: "Nyd en friskere bil",
    description:
      "Bilen bliver rengjort indvendigt, så den føles ren og frisk igen.",
  },
] as const;

/**
 * TEKST TIL "OM FRESHINSIDE"
 */
export const aboutContent = {
  heading: "Om FreshInside",
  paragraphs: [
    "FreshInside er startet med et simpelt mål: at gøre det nemt for bilejere at få en renere og friskere bil.",
    "FreshInside drives af Marcus, som brænder for at skabe en god service og levere et resultat, man kan se og mærke.",
    "Fokus er enkelt: pålidelig kommunikation, grundigt arbejde og en bil, der føles frisk igen – hver gang.",
  ],
} as const;

/**
 * TEKST TIL OMRÅDE-SEKTIONEN ("VI KOMMER TIL DIG")
 */
export const areaContent = {
  heading: "Vi kommer til dig",
  description: `FreshInside fokuserer i starten på ${siteConfig.serviceArea}. Bor du i nærheden, aftaler vi nemt tid og sted, så rengøringen kan foregå der, hvor det passer dig bedst.`,
} as const;
