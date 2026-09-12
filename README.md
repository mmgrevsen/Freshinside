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
| `src/config/contact.ts` | Telefonnummer, e-mail og område |
| `src/config/schedule.ts` | **Åbningstider** – og dermed også hvilke tider kunden kan booke |
| `src/config/site.ts` | Navn, slogan, "Sådan fungerer det", "Om FreshInside"-tekst, område-tekst og menu-links |
| `src/config/testimonials.ts` | Kundeanmeldelser (husk at slå `isPlaceholder` fra, når det er en rigtig anmeldelse) |
| `src/config/faq.ts` | Spørgsmål og svar i FAQ-sektionen |
| `src/config/addons.ts` | Ekstra services, kunden kan tilvælge under booking, og hvad de koster |
| `src/config/quiz.ts` | Spørgsmålene i "Hvilken pakke passer til mig?"-quizzen |
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

**Afstanden måles på den rute, du faktisk skal cykle** – ikke i fugleflugt. Det betyder meget her: Aabybro er kun 14 km i fugleflugt, men 32 km på cykel, fordi man skal rundt om Limfjorden. Ruten hentes fra BRouter, en gratis cykelrute-tjeneste – ingen konto eller nøgle nødvendig.

Får du senere bil eller knallert, kan du skifte `routingProfile` i samme fil (`"trekking"` = cykel, `"car-fast"` = bil).

Kunden vælger sin adresse enten ved at **skrive den** (der kommer forslag frem, mens man skriver) eller ved at **klikke på et kort**. Begge dele bruger Danmarks officielle adresseregister, så adressen altid er rigtig.

Kortet viser det område, man reelt kan nå på cykel (altså med veje, broer og fjorden regnet med) – ikke en cirkel. Området hentes automatisk og følger med, når du ændrer `maxDistanceKm`.

### Eksempel: Ændre dine åbningstider

Åbn `src/config/schedule.ts`. Hver linje er én ugedag – mandag øverst, søndag nederst:

```ts
{ open: false },                            // Torsdag
{ open: true, from: "15:00", to: "20:00" }, // Fredag
```

Det ene sted styrer **både** åbningstiderne, der står på hjemmesiden, **og** hvilke tidspunkter kunden kan vælge, når der bookes. Så du kan ikke komme til at glemme det ene sted.

`to` er det tidspunkt, du er **færdig** – ikke det seneste, man kan starte. Har du åbent til 20:00, og Fresh Deep tager 3 timer, er den seneste starttid altså 17:00. Det regner hjemmesiden selv ud.

I samme fil kan du også skrue på:

| Indstilling | Betyder |
|---|---|
| `slotStepMinutes: 30` | Tider kan starte hver halve time (10:00, 10:30, 11:00 ...) |
| `bufferMinutes: 30` | Der er altid mindst en halv time mellem to bookinger |
| `maxDaysAhead: 60` | Kunden kan booke op til 60 dage frem |
| `minHoursNotice: 12` | Der skal bestilles mindst 12 timer i forvejen |

Hvor lang tid hver pakke tager, står som `blockMinutes` i `src/config/pricing.ts`. Sæt den til den **længste** tid, pakken kan tage – så undgår du at komme til at love to biler på én gang.

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
- De fleste andre tekster (om os, sådan-fungerer-det, område, trust-bar og "inden vi kommer") ligger i `src/config/site.ts`.
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

## 9. Sørg for at to kunder ikke booker samme tid

Booking-formularen viser kun de tidspunkter, der er ledige. For at den kan huske, hvad der allerede er booket, skal den bruge et lille sted at gemme det. Det er gratis og tager ca. 3 minutter:

1. Gå til dit projekt på [vercel.com](https://vercel.com) → fanen **Storage**.
2. Klik **Create Database** og vælg **Upstash → Redis**. Vælg den gratis plan, og vælg gerne en server i Europa.
3. Klik **Connect** for at koble den til dit `freshinside`-projekt.
4. Gå til **Deployments**, klik **⋯** ved den nyeste og vælg **Redeploy**.

Vercel opretter selv de nøgler, hjemmesiden skal bruge – du skal ikke skrive noget ind manuelt. Bliver du undervejs spurgt om et **Custom Prefix**, kan du roligt lade feltet stå tomt; hjemmesiden finder selv nøglerne, uanset hvad de kommer til at hedde.

**Sådan virker det bagefter:** Når nogen booker fredag kl. 15:00 til Fresh Deep, bliver 15:00–18:00 (plus en halv times pause) fjernet fra listen for de næste kunder. Booker en anden Fresh Clean lørdag kl. 12:00, forsvinder kun 12:00–13:30 den dag.

**Indtil du har sat det op:** hjemmesiden virker helt som normalt, og kunderne kan kun vælge tider inden for din åbningstid. Men to kunder *kan* nå at vælge samme tidspunkt, og så må du ringe til den ene. Derfor er det en god idé at få det sat op.

> Vil du selv aflyse eller blokere en tid (f.eks. fordi du skal til fodbold), kan du ikke gøre det fra hjemmesiden endnu. Sig til, så bygger vi en lille side til det.

---

## 10. Om booking-systemet

Sådan fungerer en booking i dag:

1. Kunden vælger pakke, og derefter en dato. Hjemmesiden viser kun de tidspunkter, der både ligger inden for din åbningstid og er ledige.
2. Kunden vælger sin adresse fra forslagene (eller på kortet), og cykelruten hjem til dig beregnes.
3. Er kunden **inden for** dit område (se `src/config/serviceArea.ts`), sendes forespørgslen afsted, og du får en e-mail (når du har sat det op – se afsnit 8).
4. Er kunden **uden for** området, kan der ikke bookes direkte. I stedet vises en besked med en knap, der åbner en mail til dig, så I kan aftale det.

Både afstanden **og** tidspunktet bliver tjekket igen på serveren, så hverken området eller en optaget tid kan omgås ved at pille ved siden i browseren.

**Hvis adresseregistret er nede:** Adresseforslagene kommer fra Danmarks officielle adresseregister (Dataforsyningen). Er den tjeneste nede, kan hjemmesiden ikke måle afstanden. I stedet for at spærre for booking får kunden så et felt til selv at skrive adresse og postnummer, og forespørgslen sendes videre til dig. I mailen står der `Afstand: KUNNE IKKE TJEKKES`, så du selv kan se efter, om du vil køre derud. Bedre at få forespørgslen end at miste kunden.

Der er **endnu ikke** en database, så bookinger gemmes ikke i en liste, du kan bladre i – de kommer kun på mail. Vil du senere have en rigtig oversigt over alle bookinger, kan der kobles en database på (f.eks. [Supabase](https://supabase.com)); der ligger en guide øverst i `src/app/api/booking/route.ts`.

---

## 11. Projektstruktur (kort overblik)

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

## 12. Teknologi

Hjemmesiden er bygget med:

- **[Next.js](https://nextjs.org)** – rammeværk til hurtige, SEO-venlige hjemmesider
- **[React](https://react.dev)** – til at bygge de enkelte komponenter/sektioner
- **[TypeScript](https://www.typescriptlang.org)** – JavaScript med ekstra fejl-tjek
- **[Tailwind CSS](https://tailwindcss.com)** – styling direkte i komponenterne

Alt sammen gratis, open-source og meget udbredt – der findes uendeligt mange gratis guides, hvis du vil lære mere.

---

Held og lykke med FreshInside! 🚗💦
