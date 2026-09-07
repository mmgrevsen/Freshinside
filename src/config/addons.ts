/**
 * EKSTRA SERVICES (ADD-ONS)
 * ------------------------------------------------
 * Kunden kan vælge disse til under booking. Det holder pris-siden
 * simpel, i stedet for at lave mange forskellige pakker.
 *
 * ⚠️ PRISERNE HERUNDER ER FORESLÅEDE STARTPRISER – ret dem, så de
 * passer til, hvad arbejdet reelt tager dig af tid.
 *
 * Vil du fjerne en ekstra service, sletter du bare hele blokken { ... }.
 */

export type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export const addOns: AddOn[] = [
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
