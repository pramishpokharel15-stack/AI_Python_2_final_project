# Little Box

A static dodge-and-survive game for GitHub Pages. Open `index.html` to play; `shop.html` contains the branching upgrade tree, merge recipes, currencies, zone selection, and enemy index. No server, build step, external libraries, or assets are required.

## Play

- Move with **WASD** or the arrow keys. On touch screens, drag inside the arena.
- Dodge enemies and their attacks; there is no player weapon. Enemies give one matching token when they leave. Merger tokens are also awarded when a Merger is consumed.
- Survive **five zones of ten waves each**. Current HP, currencies, upgrades, and discoveries carry between waves.
- Press **L** (customizable in Keybind Settings) to stack the next regular wave on the current one. Up to three waves can overlap; enemies and spawns already in progress remain. A full clear resets the skip limit. Boss waves cannot be skipped.
- Each wave adds its new enemy types to the existing spawn pool. Shooter appears in Zone 1 Wave 6, Dasher appears in Zone 2, and Stot joins Chaser in Zone 1 Wave 1. Stot travels quickly once toward your position when it spawns, never shoots, and exits shortly after arrival.
- Merger appears in Zone 3 Wave 5 and wanders without chasing you. It can trigger nearby compatible merges; Merge Repulser also triggers merges when it touches compatible enemies.
- Frost Sniper and other merged enemy types can appear naturally in later zones, whether or not you fused them earlier.
- Five Stot tokens buy an extra heart. Collect 10 Merger tokens to unlock the Merge Lab, then spend 200 Chaser tokens to unlock Auto-dodge. Turn Auto-dodge on or off in arena Settings; when on, it steers away from nearby enemies and incoming shots.
- Damage a boss only with its own projectiles: dodge them, let them ricochet off a wall, and guide the returning shots into the boss.
- Buy survival abilities and upgrades with the matching enemy tokens. Compatible enemies can merge when they meet in the arena.
- Press **Esc** to pause. The game also pauses when the tab loses focus.
- Change sound volumes, mute audio, and customize ability and skip keys from the main menu. Progress is saved in browser local storage; use **Save code** below the arena to generate a portable backup or import one from another browser. Importing replaces the current local save. Codes include saved progress and settings, but not the live positions of enemies in an active wave.

## Beginner-friendly implementation notes

The project is plain HTML, CSS, and JavaScript. Organized arrays hold the enemy stats, wave rosters, zones, merge recipes, and upgrade branches. Small functions update movement, collisions, attacks, drawing, and saving. The Canvas API draws the arena; `requestAnimationFrame` repeatedly advances the game. The Web Audio API creates original synthesized music and effects without external tracks. `localStorage` stores progress on the player's device.
