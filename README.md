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
3. Eigene App dazu anlegen (siehe unten): `node tools/app-anlegen.mjs hasenklasse/karotten "Karotten zählen" "Karotten"`
4. Tabelle oben ergänzen.

## Gestaltung und Grafiken

- Gemeinsame Basis in `assets/base.css` (Papier-Look, Tintenkonturen, Knöpfe). Neue Spiele binden sie mit `<link rel="stylesheet" href="../../assets/base.css">` ein.
- Schriften Fredoka und Nunito liegen lokal in `assets/fonts/` (SIL Open Font License), es werden keine externen Schriften geladen.
- Illustrationen liegen als SVG in `assets/art/`. Die aktuellen Dateien sind handgezeichnete Platzhalter.
- Die passenden Recraft-Prompts stehen in `tools/art-prompts.json` (gemeinsamer Stil plus ein Prompt je Datei). Ein mit Recraft erzeugtes SVG (Modell `recraftv4_1_vector`) ersetzt einfach die Datei gleichen Namens.

## Als App installieren (PWA)

Es gibt zwei Arten von Apps, die man nebeneinander installieren kann:

- **Sammel-App „Lernspiele“**: wird von der Startseite aus installiert, startet auf der Startseite und enthält alle Spiele. Steckbrief `manifest.webmanifest`, Symbol `assets/icons/`.
- **Eine App je Spiel**: wird auf der Seite des Spiels installiert, startet direkt im Spiel und bleibt in dessen Ordner. Steckbrief und Symbol liegen im Spielordner unter `app/`, z. B. `erdmaennchenklasse/guten-morgen/app/`.

Ein Spiel bekommt seine eigene App mit einem Befehl (braucht Node und Playwright):

```
node tools/app-anlegen.mjs <spielordner> "<Name>" "<Kurzname>" ["<Beschreibung>"]
```

Das Skript legt `<spielordner>/app/` mit Steckbrief und Symbolen an, schreibt die nötigen Zeilen in den `<head>` der Spielseite, trägt die Dateien in `sw.js` ein, zählt dort `VERSION` hoch und ergänzt in der Sammel-App eine Verknüpfung zum Spiel. Als Symbol dient `<spielordner>/app/icon.svg`; fehlt es, wird das Sammel-Symbol als Vorlage kopiert. Nach dem Austausch eines Symbol-SVGs rechnet `node tools/app-anlegen.mjs --symbole <ordner>` die PNGs (512, 192, 180 und 32 Pixel) neu.

- `sw.js` ist ein gemeinsamer Offline-Helfer für alle Apps. Er speichert die Seiten beim ersten Besuch, damit sie auch ohne Internet laufen; online wird immer die aktuelle Fassung geholt. Neue Grafiken in `DATEIEN` eintragen und `VERSION` hochzählen.
- Alle Apps laufen unter derselben Adresse, Rekorde und Einstellungen sind deshalb in allen Apps dieselben.
- Ohne Internet funktioniert die Spracheingabe nicht, das Vorlesen nur mit einer eingebauten deutschen Stimme.

## Weiterleitungen

- `/erdmaennchen/` → `/erdmaennchenklasse/guten-morgen/` (alter Pfad, damit bestehende Links weiter funktionieren)
- `/erdmaennchenklasse/wache/` → `/erdmaennchenklasse/guten-morgen/` (alter Name des Spiels)
- `/erdmaennchenklasse/` → Abschnitt auf der Startseite

Alles sind statische HTML-Seiten ohne Server oder Build-Schritt. Spielstände und Rekorde liegen nur im Browser (localStorage).
