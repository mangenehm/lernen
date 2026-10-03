// Meldet den Offline-Helfer an, damit die Seite als App installiert werden kann.
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
