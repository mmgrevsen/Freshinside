# FreshInside 🚗✨

Hjemmesiden for **FreshInside** – indvendig bilrengøring i Aalborg og omegn.

> "En friskere bil. Uden besværet."

Denne README er skrevet, så du (Marcus) nemt kan finde rundt i projektet, selvom du er ny til webudvikling. Læs den roligt igennem – du skal ikke forstå det hele på én gang.

---

## 1. Kom hurtigt i gang

Du skal bruge [Node.js](https://nodejs.org/) (version 20 eller nyere) installeret på din computer. Har du det, kan du starte hjemmesiden lokalt sådan her:

```bash
npm install
```

Dette installerer alt, hjemmesiden har brug for (kun nødvendigt første gang, eller når du henter nye ændringer ned).

```bash
npm run dev
```

Åbn derefter [http://localhost:3000](http://localhost:3000) i din browser. Hjemmesiden opdaterer sig selv, hver gang du gemmer en ændring i en fil. Stop serveren igen med `Ctrl + C` i terminalen.

---

## 2. De filer, du skal kende

Al indhold, du med stor sandsynlighed vil ændre, ligger samlet i mappen **`src/config/`**. Du behøver ikke forstå resten af koden for at redigere disse filer.

| Fil | Hvad du ændrer her |
|---|---|
| `src/config/pricing.ts` | Priser, pakkenavne, beskrivelser og hvad der er inkluderet i hver pakke |
| `src/config/contact.ts` | Telefonnummer, e-mail, område og åbningstider |
| `src/config/site.ts` | Navn, slogan, "Sådan fungerer det", "Om FreshInside"-tekst, område-tekst og menu-links |
| `src/config/testimonials.ts` | Kundeanmeldelser (husk at slå `isPlaceholder` fra, når det er en rigtig anmeldelse) |
| `src/config/faq.ts` | Spørgsmål og svar i FAQ-sektionen |
| `src/config/gallery.ts` | Hvilke billeder der bruges i hero-sektionen og før/efter-sektionen |

Hver fil har kommentarer øverst, der forklarer, hvad du kan ændre. Du skal blot rette teksten/tallet mellem anførselstegnene og gemme filen.

### Eksempel: Ændre en pris

Åbn `src/config/pricing.ts` og find f.eks.:

```ts
{
  id: "fresh-basic",
  name: "Fresh Basic",
  price: 149,
  ...
}
```

Ret `149` til den nye pris, og gem filen. Det er det!

---

## 3. Sådan ændrer du billeder

Alle billeder ligger i mappen **`public/images/`**:

- `public/images/hero-car-interior.svg` – det store billede øverst på forsiden
- `public/images/before-after/` – før/efter-billederne (fem par: sæder, gulv, kopholdere, instrumentbræt, bagagerum)

Billederne, der ligger der nu, er **tegnede eksempel-billeder** (placeholders), så du kan se, hvordan hjemmesiden ser ud, før du har dine egne fotos.

**Sådan skifter du til dine egne billeder:**

1. Tag et billede (f.eks. med din telefon) og læg filen i den rigtige mappe, f.eks. `public/images/before-after/saeder-foer.jpg`.
2. Åbn `src/config/gallery.ts` og ret filstien, så den passer til dit nye filnavn.
3. Gem – hjemmesiden opdateres automatisk.

Du kan sagtens bruge `.jpg` eller `.png` i stedet for `.svg` – det virker present som det samme.

---

## 4. Sådan ændrer du tekst

- Overskrifter, undertekster og knap-tekster i **hero-sektionen** ligger i `src/components/sections/Hero.tsx`.
- De fleste andre tekster (om os, sådan-fungerer-det, område) ligger i `src/config/site.ts`.
- Har du brug for at ændre en tekst, du ikke kan finde i `src/config/`, så spørg endelig, hvor den ligger.

---

## 5. Byg til production (den "rigtige" version)

Når du vil se, hvordan hjemmesiden fungerer i den optimerede udgave, den kommer til at køre i, når den er live:

```bash
npm run build
npm run start
```

`npm run build` tjekker samtidig, om der er fejl i koden – kør den gerne, inden du lægger ændringer på GitHub.

---

## 6. Sådan lægger du projektet på GitHub

Første gang:

```bash
git init
git add .
git commit -m "Første version af FreshInside"
```

Opret derefter et nyt, tomt repository på [github.com/new](https://github.com/new) (opret **ikke** en README der – vi har allerede en). GitHub viser dig herefter nogle kommandoer, der ligner:

```bash
git remote add origin https://github.com/dit-brugernavn/freshinside.git
git branch -M main
git push -u origin main
```

**Når du senere laver ændringer**, gemmer og lægger du dem op igen med:

```bash
git add .
git commit -m "Beskriv kort, hvad du har ændret"
git push
```

---

## 7. Sådan publicerer du hjemmesiden (Vercel)

[Vercel](https://vercel.com) er lavet af samme firma som Next.js (teknologien, hjemmesiden er bygget med) og er den nemmeste måde at gøre hjemmesiden live på – gratis for et projekt som dette.

1. Opret en gratis konto på [vercel.com](https://vercel.com) (du kan logge ind med din GitHub-konto).
2. Klik **"Add New… → Project"** og vælg dit `freshinside`-repository fra GitHub.
3. Vercel opdager automatisk, at det er et Next.js-projekt – du skal ikke ændre noget. Klik **Deploy**.
4. Efter et minuts tid får du et link (f.eks. `freshinside.vercel.app`), hvor hjemmesiden er live.

**Sådan opdaterer du hjemmesiden, efter den er live:** Du skal ikke gøre noget særligt – hver gang du `git push` til GitHub, opdaterer Vercel automatisk den live hjemmeside efter ca. 1 minut.

Får du senere dit eget domæne (f.eks. freshinside.dk), kan du tilføje det under **Settings → Domains** på dit projekt i Vercel.

---

## 8. Om booking-systemet

Booking-formularen virker allerede i dag: en besøgende kan udfylde og sende en forespørgsel, og den bliver sendt til `src/app/api/booking/route.ts`, som lige nu skriver den til serverens log og bekræfter overfor kunden, at den er modtaget.

Der er **endnu ikke** en rigtig database, så bookinger bliver ikke gemt permanent nogen steder endnu. Filen `src/app/api/booking/route.ts` har en guide øverst i kommentarerne til, hvordan du (eller jeg, næste gang du beder om hjælp) kan koble en rigtig database på, f.eks. [Supabase](https://supabase.com), så bookinger bliver gemt, og du kan få en notifikation, når der kommer en ny.

---

## 9. Projektstruktur (kort overblik)

```
src/
  app/                    Selve siderne (forsiden, privatlivspolitik, booking-API)
  components/
    layout/               Menu (Navbar), footer, "BOOK NU"-knap på mobil
    sections/              De enkelte sektioner på forsiden (Hero, Priser, FAQ, osv.)
    ui/                    Små genbrugelige byggeklodser (knapper, ikoner, badges)
  config/                 HER ændrer du priser, tekster, kontaktinfo osv. (se ovenfor)
  lib/                    Små hjælpefunktioner
  types/                  Beskriver, hvordan en booking ser ud som data
public/
  images/                 Alle billeder, inkl. før/efter og hero-billedet
```

---

## 10. Teknologi

Hjemmesiden er bygget med:

- **[Next.js](https://nextjs.org)** – rammeværk til hurtige, SEO-venlige hjemmesider
- **[React](https://react.dev)** – til at bygge de enkelte komponenter/sektioner
- **[TypeScript](https://www.typescriptlang.org)** – JavaScript med ekstra fejl-tjek
- **[Tailwind CSS](https://tailwindcss.com)** – styling direkte i komponenterne

Alt sammen gratis, open-source og meget udbredt – der findes uendeligt mange gratis guides, hvis du vil lære mere.

---

Held og lykke med FreshInside! 🚗💦
