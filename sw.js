// Offline-Helfer: legt die Seiten beim ersten Besuch auf dem Gerät ab.
// Online wird immer zuerst die aktuelle Fassung geholt, ohne Netz die gespeicherte.
// Neue Dateien in DATEIEN eintragen und VERSION hochzählen.
const VERSION = 'v2';
const DATEIEN = [
  '/',
  '/erdmaennchenklasse/guten-morgen/',
  '/manifest.webmanifest',
  '/assets/base.css',
  '/assets/pwa.js',
  '/assets/art/ende.webp',
  '/assets/art/header.webp',
  '/assets/art/karte-wache.webp',
  '/assets/art/klasse-erdmaennchen.webp',
  '/assets/art/klasse-hasen.webp',
  '/assets/fonts/fredoka-latin-500-normal.woff2',
  '/assets/fonts/fredoka-latin-600-normal.woff2',
  '/assets/fonts/fredoka-latin-700-normal.woff2',
  '/assets/fonts/nunito-latin-400-normal.woff2',
  '/assets/fonts/nunito-latin-700-normal.woff2',
  '/assets/fonts/nunito-latin-800-normal.woff2',
  '/assets/icons/icon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/favicon-32.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((antwort) => {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(VERSION).then((c) => c.put(req, kopie));
        }
        return antwort;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((gespeichert) => gespeichert || Response.error()))
  );
});
