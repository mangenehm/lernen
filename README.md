# Lernspiele

Kleine Lernspiele für die Schule, erreichbar unter https://lernen.schreibblocka.de

Die Startseite ist eine gemeinsame Übersicht aller Spiele, gruppiert nach Klasse.

| Klasse | Spiel | Pfad | Beschreibung |
|---|---|---|---|
| Erdmännchenklasse | Erdmännchen-Wache | `/erdmaennchenklasse/wache/` | Plus/Minus bis 100, Einmaleins und Einsdurcheins – Aufgaben werden vorgelesen und per Sprache beantwortet. |
| Hasenklasse | – | – | Noch keine Spiele. |

## Neues Spiel hinzufügen

1. Spiel als `/<klasse>/<spiel>/index.html` anlegen (z. B. `/hasenklasse/karotten/`).
2. In `index.html` eine Karte im Abschnitt der passenden Klasse eintragen (bei der Hasenklasse die „Bald geht's los“-Karte ersetzen).
3. Tabelle oben ergänzen.

## Weiterleitungen

- `/erdmaennchen/` → `/erdmaennchenklasse/wache/` (alter Pfad, damit bestehende Links weiter funktionieren)
- `/erdmaennchenklasse/` → Abschnitt auf der Startseite

Alles sind statische HTML-Seiten ohne Server oder Build-Schritt. Spielstände und Rekorde liegen nur im Browser (localStorage).
