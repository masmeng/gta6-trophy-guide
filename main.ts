// Leonida Trophy Guide — entrypoint.
//
// Copies app/ and screenshots/ into the output directory and writes
// /output/dossier.json with buildDossier from the kit's vendored
// library. Node 22 standard library only, no build step.
//
//   MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Without MAKEFUN_OUTPUT_DIR the output goes to /output.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyTree(name: string): void {
  const from = join(repoRoot, name);
  const to = join(outDir, name);
  if (!existsSync(from)) throw new Error(`main.ts: ${name}/ is missing from the repository`);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree('app');
copyTree('screenshots');
console.log(`main.ts: copied app/ and screenshots/ into ${outDir}`);

const dossier = buildDossier(outDir, dossierCaps);
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`main.ts: wrote ${outDir}/dossier.json (${dossier.length} bytes)`);
