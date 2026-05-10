# El Pollo Loco

An object-oriented 2D jump-and-run game built with HTML, CSS, JavaScript and Canvas.

This project was created as part of a frontend training program. It demonstrates core frontend skills such as Canvas rendering, object-oriented programming, sprite animations, collision handling, status bars, audio, mobile controls and a clean project structure.

## Project Goal

In **El Pollo Loco**, you control Pepe through a desert world. Pepe can move, jump, collect coins and salsa bottles, defeat enemies and fight the endboss by throwing collected bottles.

The goal is to defeat the endboss before Pepe runs out of energy.

## Features

- Start screen with a short game introduction
- Canvas game world in 720 × 480 format
- Object-oriented JavaScript structure
- Animated character with idle, long-idle/sleep, walk, jump, hurt and dead states
- Regular chickens and small chickens
- Enemies can be defeated by jumping on them from above
- Endboss with activation, alert, attack, hurt and dead animation states
- Collectable coins
- Collectable salsa bottles
- Throwable bottles
- Health bar
- Coin bar
- Bottle bar
- Endboss health bar
- Game-over screen
- Win screen
- Restart without page reload
- Home navigation
- Sound effects generated via the Web Audio API
- Mute toggle with LocalStorage persistence
- Fullscreen mode
- Mobile touch controls
- Rotate-device hint in mobile portrait mode
- Debug hitboxes via the `H` key for development and testing

## Controls

### Desktop

| Action                | Key / Button         |
| --------------------- | -------------------- |
| Move left             | Left arrow           |
| Move right            | Right arrow          |
| Jump                  | Up arrow or spacebar |
| Throw bottle          | D                    |
| Toggle debug hitboxes | H                    |
| Toggle sound          | Sound button         |
| Fullscreen            | Fullscreen button    |
| Restart               | Restart button       |
| Back to start screen  | Home button          |

### Mobile

In landscape mode, touch buttons are shown for:

- moving left
- moving right
- jumping
- throwing bottles

In portrait mode, a rotate-device message is displayed.

## Game Rules

- Pepe loses energy when he collides with enemies from the side.
- Regular chickens and small chickens can be defeated by jumping on them from above.
- Defeated enemies no longer damage Pepe.
- Coins increase the coin status bar.
- Collected bottles increase the bottle status bar.
- Only collected bottles can be thrown.
- Thrown bottles can defeat regular enemies.
- Thrown bottles damage the endboss.
- The endboss is activated when Pepe gets close.
- The endboss becomes more threatening once activated.
- If Pepe's energy reaches 0, the game ends with Game Over.
- If the endboss is defeated, the win screen is shown.

## Technical Structure

The project uses Vanilla JavaScript without an external game engine.

The architecture is based on object-oriented programming. Rendering, movement, collision handling, controls, status bars and game rules are split into dedicated classes.

### Main Classes

| Class              | Responsibility                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `DrawableObject`   | Base class for image, position, size, image loading and drawing                             |
| `MovableObject`    | Adds movement, animation, gravity, collision boxes, energy and hit logic                    |
| `Character`        | Main playable character Pepe                                                                |
| `Chicken`          | Regular enemy                                                                               |
| `SmallChicken`     | Smaller enemy variant                                                                       |
| `Endboss`          | Endboss with activation, attack, hurt and death logic                                       |
| `Cloud`            | Moving cloud object                                                                         |
| `BackgroundObject` | Background layer object                                                                     |
| `Coin`             | Collectable coin                                                                            |
| `Bottle`           | Collectable salsa bottle                                                                    |
| `ThrowableObject`  | Thrown salsa bottle                                                                         |
| `StatusBar`        | Health, coin, bottle and endboss status bars                                                |
| `Keyboard`         | Keyboard and touch input state                                                              |
| `Level`            | Bundles enemies, clouds, backgrounds, coins, bottles and the level end                      |
| `World`            | Canvas, camera, rendering, global game state and UI layer                                   |
| `GameController`   | Game rules, collisions, collectables, bottle throws, endboss logic, game over and win state |
| `AudioManager`     | Sound effects, background sound and mute state                                              |

## Project Structure

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
    └── game assets
```

## How to Run

The project can be opened directly in the browser.

For the most reliable local setup, use VS Code Live Server or start a small local server:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Debug Hitboxes

Press `H` during gameplay to toggle collision boxes.

Colors:

- Blue: current Pepe hitbox
- Purple: previous Pepe hitbox
- Red: enemies and endboss
- Yellow: coins
- Orange: collectable bottles
- Green: thrown bottles

This feature is intended for development and testing. It is not required for normal gameplay.

## Quality Goals

This project focuses on:

- clear file structure
- object-oriented JavaScript
- readable function names
- JSDoc comments
- consistent English UI language
- no unnecessary console output
- no external game framework
- restart without page reload
- desktop and mobile support
- stable game-over and win states
- reliable collision handling
- clean portfolio presentation

## Notes

The legal notice contains publication information for the learning project. Before any public release, legal details and asset usage should be reviewed.

Sound effects are generated via the Web Audio API, so no additional audio files are required.
