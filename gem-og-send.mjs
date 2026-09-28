/**
 * MIDLERTIDIG NØDLØSNING
 * ------------------------------------------------
 * macOS-opdateringen fjernede Xcode, og dermed forsvandt `git` fra
 * maskinen. Det her script gør det samme som "git add / commit / push",
 * men med en git skrevet i JavaScript, der kører på Node.
 *
 * Når Command Line Tools er installeret igen (se README), kan filen
 * slettes og de almindelige git-kommandoer bruges i stedet.
 */
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "node:fs";

const dir = "/Users/Marcus/FreshInside";

const besked = process.argv[2];
if (!besked) {
  console.error("Brug: node gem-og-send.mjs \"commit-besked\"");
  process.exit(1);
}

// Hent adgangen fra den remote, der allerede er sat op.
const url = await git.getConfig({ fs, dir, path: "remote.origin.url" });
const match = url.match(/^https:\/\/([^@]+)@(.+)$/);
if (!match) {
  console.error("Kunne ikke læse adgangen fra remote-adressen.");
  process.exit(1);
}
const [, token, rest] = match;
const renUrl = `https://${rest}`;

// Læg alle ændringer til – også slettede filer.
const status = await git.statusMatrix({ fs, dir });
let tilfoejet = 0;
let slettet = 0;

for (const [filepath, , worktreeStatus] of status) {
  if (worktreeStatus === 0) {
    await git.remove({ fs, dir, filepath });
    slettet++;
  } else {
    await git.add({ fs, dir, filepath });
    tilfoejet++;
  }
}

console.log(`Lagt til: ${tilfoejet} filer, slettet: ${slettet}`);

const sha = await git.commit({
  fs,
  dir,
  message: besked,
  author: { name: "Marcus", email: "mmgrevsen@gmail.com" },
});

console.log(`Gemt som ${sha.slice(0, 7)}`);

await git.push({
  fs,
  http,
  dir,
  url: renUrl,
  remote: "origin",
  ref: "main",
  onAuth: () => ({ username: token, password: "x-oauth-basic" }),
});

console.log("Sendt til GitHub ✅");
