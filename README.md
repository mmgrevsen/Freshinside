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
| `src/config/serviceArea.ts` | Hvor langt du kører ud (km), og hvem folk uden for området skal skrive til |
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
  id: "fresh-clean",
  name: "Fresh Clean",
  price: 219,
  ...
}
```

Ret `219` til den nye pris, og gem filen. Det er det!

### Eksempel: Ændre hvor langt du kører ud

Åbn `src/config/serviceArea.ts` og ret tallet:

```ts
maxDistanceKm: 15,
```

Kunder inden for den afstand kan booke direkte online. Ligger deres adresse længere væk, får de i stedet besked om at skrive til dig på den e-mail, der står i samme fil (`outOfAreaEmail`).

Kunden vælger sin adresse enten ved at **skrive den** (der kommer forslag frem, mens man skriver) eller ved at **klikke på et kort**. Begge dele bruger Danmarks officielle adresseregister, så adressen altid er en rigtig adresse, og afstanden bliver helt præcis. Du skal ikke opsætte noget – der er hverken konto eller nøgle involveret.

Ændrer du `maxDistanceKm`, følger cirklen på kortet automatisk med.

---

## 3. Sådan ændrer du billeder

Der er lige nu **ingen fotos** på hjemmesiden – de blev fjernet, indtil du har taget dine egne.

Billedet øverst på forsiden er i stedet en **tegnet illustration** (en bilkabine), som ligger i `src/components/ui/HeroScene.tsx`. Den er tegnet i kode, så den loader lynhurtigt og altid er skarp.

**Når du har taget dine egne billeder:**

1. Lav mappen `public/images/` og læg dine billeder derind, f.eks. `public/images/hero.jpg`.
2. Bed mig om at skifte illustrationen ud med dit foto – eller erstat `<HeroScene />` i `src/components/sections/Hero.tsx` med et `<Image>`-tag.

**Før/efter-sektionen** er midlertidigt slået fra (den er kun interessant med rigtige billeder). Filerne ligger der stadig: `src/components/sections/BeforeAfterSection.tsx` og `src/config/gallery.ts`. Du sætter den tilbage ved at fjerne `//` foran de to linjer i `src/app/page.tsx`.

**Delebillede:** Når du deler linket på Snapchat, Instagram eller SMS, laves der automatisk et flot forhåndsvisnings-billede. Det styres af `src/app/opengraph-image.tsx` – du behøver ikke uploade noget.

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

## 8. Få besked når nogen booker (e-mail)

Booking-formularen virker, men for at du får en **e-mail** hver gang nogen booker, skal du lave en gratis engangsopsætning (ca. 5 minutter):

1. Opret en gratis konto på [resend.com](https://resend.com) — brug den e-mail, du vil modtage bookinger på (`mmgrevsen@gmail.com`).
2. Gå til **API Keys** i menuen, og klik **Create API Key**. Kopiér nøglen (starter med `re_`).
3. Gå til dit projekt på [vercel.com](https://vercel.com) → **Settings → Environment Variables**.
4. Opret en variabel:
   - Name: `RESEND_API_KEY`
   - Value: nøglen du kopierede
5. Klik **Save**, gå til **Deployments**, klik **⋯** ved den nyeste og vælg **Redeploy**.

Derefter får du en mail med kundens navn, telefon, adresse, valgte pakke og ønsket tidspunkt, hver gang nogen booker.

**Indtil du har sat det op:** bookinger går ikke tabt — de bliver skrevet i loggen på Vercel. Du finder dem under dit projekt → **Logs**. Men det er nemmest at få dem på mail, så det anbefales at sætte det op.

## 9. Om booking-systemet

Sådan fungerer en booking i dag:

1. Kunden udfylder formularen på forsiden og vælger sin adresse fra forslagene (eller på kortet).
2. Afstanden fra din adresse til kundens regnes ud med det samme.
3. Er kunden **inden for** dit område (se `src/config/serviceArea.ts`), sendes forespørgslen afsted, og du får en e-mail (når du har sat det op – se afsnit 8).
4. Er kunden **uden for** området, kan der ikke bookes direkte. I stedet vises en besked med en knap, der åbner en mail til dig, så I kan aftale det.

Afstanden bliver også tjekket på serveren, så området ikke kan omgås ved at pille ved siden i browseren.

Der er **endnu ikke** en database, så bookinger gemmes ikke i en liste, du kan bladre i – de kommer kun på mail. Vil du senere have en rigtig oversigt over alle bookinger, kan der kobles en database på (f.eks. [Supabase](https://supabase.com)); der ligger en guide øverst i `src/app/api/booking/route.ts`.

---

## 10. Projektstruktur (kort overblik)

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

## 11. Teknologi

Hjemmesiden er bygget med:

- **[Next.js](https://nextjs.org)** – rammeværk til hurtige, SEO-venlige hjemmesider
- **[React](https://react.dev)** – til at bygge de enkelte komponenter/sektioner
- **[TypeScript](https://www.typescriptlang.org)** – JavaScript med ekstra fejl-tjek
- **[Tailwind CSS](https://tailwindcss.com)** – styling direkte i komponenterne

Alt sammen gratis, open-source og meget udbredt – der findes uendeligt mange gratis guides, hvis du vil lære mere.

---

Held og lykke med FreshInside! 🚗💦
