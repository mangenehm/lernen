// Macht ein Spiel als eigene App installierbar (PWA).
//
//   node tools/app-anlegen.mjs <spielordner> "<Name>" "<Kurzname>" ["<Beschreibung>"]
//   z. B. node tools/app-anlegen.mjs hasenklasse/karotten "Karotten zählen" "Karotten"
//
// Legt <spielordner>/app/ an (Steckbrief manifest.webmanifest und App-Symbole),
// schreibt die PWA-Zeilen in den <head> von <spielordner>/index.html,
// trägt alles in sw.js ein, zählt VERSION hoch und ergänzt in manifest.webmanifest
// (Sammel-App) eine Verknüpfung zum Spiel. Mehrfach aufrufen schadet nicht.
//
// Das Symbol kommt aus <spielordner>/app/icon.svg. Fehlt es, wird das Sammel-Symbol
// als Vorlage kopiert. Nach dem Tausch des SVG nur die PNGs neu rechnen:
//   node tools/app-anlegen.mjs --symbole <ordner mit icon.svg>
//
// Für die PNGs wird Playwright gebraucht (npm i -g playwright).

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GROESSEN = [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180], ['favicon-32.png', 32]];
const PAPIER = '#fbf3e2';

function playwright() {
  const require = createRequire(import.meta.url);
  try { return require('playwright'); } catch {}
  try { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); } catch {}
  throw new Error('Playwright fehlt: npm i -g playwright');
}

export async function symboleRechnen(ordner) {
  const svg = readFileSync(join(ordner, 'icon.svg'), 'utf8');
  const browser = await playwright().chromium.launch();
  const seite = await browser.newPage();
  for (const [datei, px] of GROESSEN) {
    await seite.setViewportSize({ width: px, height: px });
    await seite.setContent(`<style>*{margin:0}svg{display:block;width:${px}px;height:${px}px}</style>${svg}`);
    await seite.screenshot({ path: join(ordner, datei) });
  }
  await browser.close();
}

function kopfzeilen(pfad, kurzname) {
  return [
    `<link rel="manifest" href="${pfad}app/manifest.webmanifest" />`,
    `<meta name="theme-color" content="${PAPIER}" />`,
    `<link rel="icon" href="${pfad}app/icon.svg" type="image/svg+xml" />`,
    `<link rel="icon" href="${pfad}app/favicon-32.png" sizes="32x32" type="image/png" />`,
    `<link rel="apple-touch-icon" href="${pfad}app/apple-touch-icon.png" />`,
    `<meta name="apple-mobile-web-app-title" content="${kurzname}" />`,
    `<script src="/assets/pwa.js" defer></script>`,
  ];
}

function kopfEintragen(htmlDatei, zeilen) {
  let html = readFileSync(htmlDatei, 'utf8');
  const block = /^([ \t]*)<link rel="manifest"[\s\S]*?<script src="\/assets\/pwa\.js" defer><\/script>\n/m;
  if (block.test(html)) {
    html = html.replace(block, (_, einzug) => zeilen.map((z) => einzug + z).join('\n') + '\n');
  } else {
    const viewport = /^([ \t]*)<meta name="viewport"[^\n]*\n/m;
    if (!viewport.test(html)) throw new Error(`${htmlDatei}: keine <meta name="viewport">-Zeile gefunden`);
    html = html.replace(viewport, (z, einzug) => z + zeilen.map((x) => einzug + x).join('\n') + '\n');
  }
  writeFileSync(htmlDatei, html);
}

function swEintragen(dateien) {
  const datei = join(WURZEL, 'sw.js');
  let sw = readFileSync(datei, 'utf8');
  const neu = dateien.filter((d) => !sw.includes(`'${d}'`));
  if (!neu.length) return;
  sw = sw.replace(/\n\];/, '\n' + neu.map((d) => `  '${d}',`).join('\n') + '\n];');
  sw = sw.replace(/const VERSION = 'v(\d+)';/, (_, n) => `const VERSION = 'v${Number(n) + 1}';`);
  writeFileSync(datei, sw);
}

function verknuepfungEintragen(name, pfad) {
  const datei = join(WURZEL, 'manifest.webmanifest');
  const m = JSON.parse(readFileSync(datei, 'utf8'));
  m.shortcuts = (m.shortcuts || []).filter((s) => s.url !== pfad);
  m.shortcuts.push({ name, url: pfad, icons: [{ src: `${pfad}app/icon-192.png`, sizes: '192x192' }] });
  writeFileSync(datei, JSON.stringify(m, null, 2) + '\n');
}

async function appAnlegen(ordner, name, kurzname, beschreibung) {
  ordner = ordner.replace(/^\/+|\/+$/g, '');
  const pfad = `/${ordner}/`;
  const spiel = join(WURZEL, ordner);
  const app = join(spiel, 'app');
  if (!existsSync(join(spiel, 'index.html'))) throw new Error(`${ordner}/index.html gibt es nicht`);
  mkdirSync(app, { recursive: true });
  if (!existsSync(join(app, 'icon.svg'))) {
    copyFileSync(join(WURZEL, 'assets/icons/icon.svg'), join(app, 'icon.svg'));
    console.log(`Vorlage-Symbol nach ${ordner}/app/icon.svg kopiert, bitte durch ein eigenes ersetzen.`);
  }
  await symboleRechnen(app);

  const s = (d) => `${pfad}app/${d}`;
  const steckbrief = {
    name,
    short_name: kurzname,
    description: beschreibung || name,
    lang: 'de',
    id: pfad,
    start_url: pfad,
    scope: pfad,
    display: 'standalone',
    orientation: 'any',
    background_color: PAPIER,
    theme_color: PAPIER,
    icons: [
      { src: s('icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: s('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: s('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: s('icon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
  writeFileSync(join(app, 'manifest.webmanifest'), JSON.stringify(steckbrief, null, 2) + '\n');

  kopfEintragen(join(spiel, 'index.html'), kopfzeilen(pfad, kurzname));
  swEintragen([pfad, s('manifest.webmanifest'), s('icon.svg'), ...GROESSEN.map(([d]) => s(d))]);
  verknuepfungEintragen(name, pfad);
  console.log(`Fertig: ${name} ist unter ${pfad} als eigene App installierbar.`);
}

const [eins, ...rest] = process.argv.slice(2);
if (eins === '--symbole' && rest[0]) {
  await symboleRechnen(resolve(rest[0]));
} else if (eins && rest.length >= 2) {
  await appAnlegen(eins, rest[0], rest[1], rest[2]);
} else {
  console.log('Aufruf: node tools/app-anlegen.mjs <spielordner> "<Name>" "<Kurzname>" ["<Beschreibung>"]');
  console.log('        node tools/app-anlegen.mjs --symbole <ordner mit icon.svg>');
  process.exit(1);
}
