
# El Pollo Loco

Ein objektorientiertes 2D-Jump-and-Run-Spiel mit JavaScript, HTML, CSS und Canvas.

Das Projekt wurde im Rahmen der Frontend-Weiterbildung erstellt und setzt zentrale Lerninhalte aus Canvas-Rendering, objektorientierter Programmierung, Animationen, Kollisionen, Statusanzeigen, Audio, Mobile-Steuerung und sauberer Projektstruktur um.

## Projektziel

In „El Pollo Loco“ steuerst du Pepe durch eine Wüstenwelt. Pepe kann laufen, springen, Coins und Flaschen sammeln, Gegner besiegen und den Endboss mit geworfenen Flaschen bekämpfen.

Das Ziel ist es, den Endboss zu besiegen, ohne vorher alle Lebenspunkte zu verlieren.

## Features

- Startscreen mit Spielerklärung
- Canvas-Spielwelt im Format 720 x 480
- Objektorientierte Klassenstruktur
- Beweglicher Charakter mit mehreren Animationen
- Idle- und Long-Idle-/Sleep-Animation
- Normale Gegner und kleine Gegner
- Gegner können durch Sprung von oben besiegt werden
- Endboss mit Aktivierung, Alert-, Attack-, Hurt- und Dead-Animation
- Coins einsammeln
- Flaschen einsammeln
- Flaschen werfen
- Health-Bar
- Coin-Bar
- Bottle-Bar
- Endboss-Bar
- Game-Over-Screen
- Win-Screen
- Restart ohne Seitenreload
- Home-Funktion
- Soundeffekte
- Mute-Funktion mit Speicherung im LocalStorage
- Fullscreen-Modus
- Mobile Touch-Steuerung
- Hinweis bei mobiler Hochformatansicht
- Debug-Hitboxen per Taste H für Entwicklungs- und Prüfzwecke

## Steuerung

### Desktop

| Aktion                         | Taste / Button            |
| ------------------------------ | ------------------------- |
| Nach links laufen              | Pfeil links               |
| Nach rechts laufen             | Pfeil rechts              |
| Springen                       | Pfeil hoch oder Leertaste |
| Flasche werfen                 | D                         |
| Debug-Hitboxen ein-/ausblenden | H                         |
| Sound an/aus                   | Sound-Button              |
| Fullscreen                     | Fullscreen-Button         |
| Neustart                       | Restart-Button            |
| Zurück zum Startscreen        | Home-Button               |

### Mobil

Auf mobilen Geräten erscheinen im Querformat Touch-Buttons für:

- links laufen
- rechts laufen
- springen
- Flasche werfen

Im Hochformat erscheint ein Hinweis, dass das Gerät gedreht werden soll.

## Spielregeln

- Pepe verliert Energie, wenn er Gegner seitlich berührt.
- Normale Hühner und Küken können durch einen Sprung von oben besiegt werden.
- Bereits besiegte Gegner verursachen keinen Schaden mehr.
- Coins erhöhen die Coin-Anzeige.
- Gesammelte Flaschen erhöhen die Bottle-Anzeige.
- Nur gesammelte Flaschen können geworfen werden.
- Geworfene Flaschen können normale Gegner besiegen.
- Geworfene Flaschen verursachen Schaden beim Endboss.
- Der Endboss wird erst aktiv, wenn Pepe in seine Nähe kommt.
- Wenn Pepes Energie auf 0 fällt, endet das Spiel mit Game Over.
- Wenn der Endboss besiegt ist, erscheint der Win-Screen.

## Technischer Aufbau

Das Projekt nutzt Vanilla JavaScript ohne externe Game Engine.

Die Spielarchitektur basiert auf objektorientierter Programmierung. Die Spiellogik ist in Klassen aufgeteilt, damit Rendering, Bewegung, Kollisionen, Steuerung, Statusanzeigen und Spielregeln nachvollziehbar getrennt bleiben.

### Wichtige Klassen

| Klasse               | Aufgabe                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------- |
| `DrawableObject`   | Grundlage für Bild, Position, Größe, Bildladen und Zeichnen                          |
| `MovableObject`    | Erweiterung für Bewegung, Animation, Gravitation, Kollision, Energie und Hitboxen      |
| `Character`        | Spielfigur Pepe                                                                         |
| `Chicken`          | Normaler Gegner                                                                         |
| `SmallChicken`     | Kleiner Gegner                                                                          |
| `Endboss`          | Endgegner mit Aktivierung, Angriff, Treffer- und Todeslogik                             |
| `Cloud`            | Bewegliche Wolken                                                                       |
| `BackgroundObject` | Hintergrundebenen                                                                       |
| `Coin`             | Einsammelbare Münzen                                                                   |
| `Bottle`           | Einsammelbare Flaschen                                                                  |
| `ThrowableObject`  | Geworfene Flasche                                                                       |
| `StatusBar`        | Health-, Coin-, Bottle- und Endboss-Anzeige                                             |
| `Keyboard`         | Tastatur- und Touch-Zustände                                                           |
| `Level`            | Bündelt Gegner, Wolken, Hintergründe, Coins, Flaschen und Levelgrenze                 |
| `World`            | Zentrale Spielwelt, Canvas, Kamera, Rendering, Status und UI-Layer                      |
| `GameController`   | Spielregeln, Kollisionen, Sammelobjekte, Flaschenwurf, Endboss-Logik, Game Over und Win |
| `AudioManager`     | Soundeffekte, Hintergrundklang und Mute-Funktion                                        |

## Projektstruktur

```text
.
├── index.html
├── impressum.html
├── style.css
├── script.js
├── README.md
├── TESTING.md
├── classes/
│   ├── audio-manager.class.js
│   ├── background-object.class.js
│   ├── bottle.class.js
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── cloud.class.js
│   ├── coin.class.js
│   ├── drawable-object.class.js
│   ├── endboss.class.js
│   ├── game-controller.class.js
│   ├── keyboard.class.js
│   ├── level.class.js
│   ├── movable-object.class.js
│   ├── status-bar.class.js
│   ├── throwable-object.class.js
│   └── world.class.js
├── levels/
│   └── level1.js
└── img/
    └── Spielgrafiken
```
