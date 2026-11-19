// Leonida Trophy Guide — hand-in program (Node 22, standard library only).
// The guide itself is plain static files in app/ (index.html, style.css,
// app.js, data/trophies.json) that a browser opens with no build step and no
// network. This program copies app/ and screenshots/ into the output
// directory and writes dossier.json with the vendored make.fun library.
// The scorer re-runs that same library on the handed-in files and requires
// dossier.json to match byte for byte, so the caps below mirror the gate.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.min.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(destination, { recursive: true });
cpSync(join(root, "app"), join(destination, "app"), { recursive: true });

const shotDir = join(destination, "screenshots");
mkdirSync(shotDir, { recursive: true });
const localShots = join(root, "screenshots");
if (existsSync(localShots)) {
  cpSync(localShots, shotDir, { recursive: true });
}

// Caps from the competition gate: the guide text is capped at 160 KiB,
// at most 4 screenshots of at most 256 KiB each, app/ holds at most 993
// entries and 48 MiB in total. Only the text cap shapes the dossier bytes;
// the rest refuse an entry the scorer would refuse.
const dossier = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(destination, "dossier.json"), dossier);
