/**
 * EKSTRA SERVICES (TILVALG)
 * ------------------------------------------------
 * ⛔ SLÅET FRA LIGE NU.
 *
 * Tilvalgene er taget af siden, indtil du har værktøjet til dem
 * (pletfjerner, lugtbehandling osv.). Man skal ikke kunne bestille
 * noget, man ikke kan levere – og prisen skal være din, ikke et gæt.
 *
 * SÅDAN TÆNDER DU DEM IGEN:
 * 1. Flyt de blokke, du vil bruge, fra "paaVej" ned i "addOns"
 * 2. Ret prisen, så den passer til, hvad arbejdet tager dig af tid
 * 3. Gem filen
 *
 * Resten af hjemmesiden retter sig automatisk: er listen tom, findes
 * hele "Ekstra services"-afsnittet slet ikke i booking-formularen.
 * Lægger du noget i den, dukker det op af sig selv.
 */

export type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
};

/** Det kunden kan vælge til lige nu. Tom = afsnittet vises ikke. */
export const addOns: AddOn[] = [];

/**
 * PARKERET TIL SENERE
 * ------------------------------------------------
 * Beskrivelserne er klar. PRISERNE ER GÆT og skal rettes, før de
 * bruges – flyt blokken op i "addOns" ovenfor, når du er klar.
 */
export const paaVej: AddOn[] = [
  {
    id: "dyrehaar",
    name: "Fjernelse af dyrehår",
    description: "Ekstra tid til hår i sæder og gulvtæpper.",
    price: 79,
  },
  {
    id: "beskidte-saeder",
    name: "Ekstra beskidte sæder",
    description: "Til sæder med mange pletter eller indgroet snavs.",
    price: 99,
  },
  {
    id: "bagagerum",
    name: "Ekstra grundigt bagagerum",
    description: "Grundig behandling af bagagerum med meget snavs.",
    price: 59,
  },
  {
    id: "lugtfjernelse",
    name: "Lugtfjernelse",
    description: "Behandling af kabinen, så bilen dufter frisk igen.",
    price: 99,
  },
  {
    id: "pletbehandling",
    name: "Ekstra pletbehandling",
    description: "Målrettet behandling af enkelte, svære pletter.",
    price: 89,
  },
];
