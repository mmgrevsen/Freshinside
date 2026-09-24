/**
 * FORBINDELSE TIL DEN LILLE DATABASE
 * ------------------------------------------------
 * Hjemmesiden bruger en gratis Upstash Redis, du kobler på inde fra
 * Vercel (se afsnit 9 i README). Den husker to ting:
 *  - hvilke tider der er optaget
 *  - hvor mange der har været inde at kigge
 *
 * Er databasen ikke koblet på, virker hjemmesiden stadig – den kan
 * bare ikke huske noget af det.
 */

/**
 * Finder databasens adresse og adgangskode blandt Vercels
 * miljøvariabler. Vercel navngiver dem efter det "prefix", man vælger,
 * når databasen kobles på (KV_..., STORAGE_..., UPSTASH_... osv.), så
 * vi leder efter det par, der hører sammen, i stedet for at kræve ét
 * bestemt navn. Så virker det, uanset hvad du valgte i Vercel.
 */
function findCredentials(): { url: string; token: string } | null {
  const env = process.env;

  // Vi leder efter to variabler, der hører sammen: en adresse, der
  // slutter på _URL, og en adgangskode med præcis samme navn, bare med
  // _TOKEN til sidst.
  for (const key of Object.keys(env)) {
    if (!key.endsWith("_URL")) continue;

    const url = env[key];
    // Rigtige databaser er altid https. Localhost tillades også, så en
    // database kan køre på din egen computer under udvikling.
    const usable =
      url?.startsWith("https://") ||
      url?.startsWith("http://localhost") ||
      url?.startsWith("http://127.0.0.1");
    if (!url || !usable) continue;

    const token = env[`${key.slice(0, -"_URL".length)}_TOKEN`];
    if (token) return { url, token };
  }

  return null;
}

const credentials = findCredentials();

/** Er databasen koblet på? */
export const databaseEnabled = credentials !== null;

/** Sender én kommando til databasen. */
export async function redis(command: (string | number)[]): Promise<unknown> {
  if (!credentials) throw new Error("Databasen er ikke koblet på endnu.");

  const response = await fetch(credentials.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Databasen svarede ${response.status}`);
  }

  const data = (await response.json()) as { result?: unknown };
  return data.result;
}

/** Sender flere kommandoer på én gang – hurtigere end én ad gangen. */
export async function redisPipeline(
  commands: (string | number)[][]
): Promise<unknown[]> {
  if (!credentials) throw new Error("Databasen er ikke koblet på endnu.");
  if (commands.length === 0) return [];

  const response = await fetch(`${credentials.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Databasen svarede ${response.status}`);
  }

  const data = (await response.json()) as { result?: unknown }[];
  return Array.isArray(data) ? data.map((entry) => entry?.result) : [];
}
