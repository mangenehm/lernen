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

## Weiterleitungen

- `/erdmaennchen/` → `/erdmaennchenklasse/guten-morgen/` (alter Pfad, damit bestehende Links weiter funktionieren)
- `/erdmaennchenklasse/wache/` → `/erdmaennchenklasse/guten-morgen/` (alter Name des Spiels)
- `/erdmaennchenklasse/` → Abschnitt auf der Startseite

Alles sind statische HTML-Seiten ohne Server oder Build-Schritt. Spielstände und Rekorde liegen nur im Browser (localStorage).
