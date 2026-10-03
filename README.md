# Lernspiele

Kleine Lernspiele für die Schule, erreichbar unter https://lernen.schreibblocka.de

Die Startseite ist eine gemeinsame Übersicht aller Spiele, gruppiert nach Klasse.

| Klasse | Spiel | Pfad | Beschreibung |
|---|---|---|---|
| Erdmännchenklasse | Guten Morgen, Erdmännchen! | `/erdmaennchenklasse/guten-morgen/` | Plus/Minus bis 100, Einmaleins und Einsdurcheins – Aufgaben werden vorgelesen und per Sprache beantwortet. |
| Hasenklasse | – | – | Noch keine Spiele. |

## Neues Spiel hinzufügen

1. Spiel als `/<klasse>/<spiel>/index.html` anlegen (z. B. `/hasenklasse/karotten/`).
2. In `index.html` eine Karte im Abschnitt der passenden Klasse eintragen (bei der Hasenklasse die „Bald geht's los“-Karte ersetzen).
3. Tabelle oben ergänzen.

## Gestaltung und Grafiken

- Gemeinsame Basis in `assets/base.css` (Papier-Look, Tintenkonturen, Knöpfe). Neue Spiele binden sie mit `<link rel="stylesheet" href="../../assets/base.css">` ein.
- Schriften Fredoka und Nunito liegen lokal in `assets/fonts/` (SIL Open Font License), es werden keine externen Schriften geladen.
- Illustrationen liegen als SVG in `assets/art/`. Die aktuellen Dateien sind handgezeichnete Platzhalter.
- Die passenden Recraft-Prompts stehen in `tools/art-prompts.json` (gemeinsamer Stil plus ein Prompt je Datei). Ein mit Recraft erzeugtes SVG (Modell `recraftv4_1_vector`) ersetzt einfach die Datei gleichen Namens.

## Als App installieren (PWA)

- `manifest.webmanifest` beschreibt die App (Name, Farben, Symbol). Sie startet direkt in „Guten Morgen, Erdmännchen!“, die Startseite gehört aber dazu.
- `sw.js` speichert die Seiten beim ersten Besuch, damit sie auch ohne Internet laufen. Online wird immer die aktuelle Fassung geholt. Bei neuen Spielen oder Grafiken die Dateien in `DATEIEN` eintragen und `VERSION` hochzählen.
- Neue Spielseiten brauchen dieselben Zeilen im `<head>` wie `erdmaennchenklasse/guten-morgen/index.html` (Manifest, Symbole, `assets/pwa.js`).
- App-Symbol: `assets/icons/icon.svg`, daraus die PNGs in 512, 192, 180 und 32 Pixel.
- Ohne Internet funktioniert die Spracheingabe nicht, das Vorlesen nur mit einer eingebauten deutschen Stimme.

## Weiterleitungen

- `/erdmaennchen/` → `/erdmaennchenklasse/guten-morgen/` (alter Pfad, damit bestehende Links weiter funktionieren)
- `/erdmaennchenklasse/wache/` → `/erdmaennchenklasse/guten-morgen/` (alter Name des Spiels)
- `/erdmaennchenklasse/` → Abschnitt auf der Startseite

Alles sind statische HTML-Seiten ohne Server oder Build-Schritt. Spielstände und Rekorde liegen nur im Browser (localStorage).
