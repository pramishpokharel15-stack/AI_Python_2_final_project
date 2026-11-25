# Little Box

A static dodge-and-survive game for GitHub Pages. Open `index.html` to play; `shop.html` contains the branching upgrade tree, merge recipes, currencies, zone selection, and enemy index. No server, build step, external libraries, or assets are required.

## Play

- Move with **WASD** or the arrow keys. On touch screens, drag inside the arena.
- Dodge enemies and their attacks; press **X** (customizable in Keybind Settings) to fire at enemies and bosses. Enemies award one matching token only when they leave the arena. Merger tokens are also awarded when a Merger is consumed.
- Survive **five zones of ten waves each**. Current HP, currencies, upgrades, and discoveries carry between waves.
- Press **L** (customizable in Keybind Settings) to stack the next regular wave on the current one. Up to three waves can overlap; enemies and spawns already in progress remain. A retry or continue restores the full stack. A full clear resets the skip limit. Boss waves cannot be skipped. Use **Reset current zone to Wave 1** in Zone progression to restart that zone.
- Each wave adds its new enemy types to the existing spawn pool. Shooter appears in Zone 1 Wave 6, Dasher appears in Zone 2, and Stot joins Chaser in Zone 1 Wave 1. Stot travels quickly once toward your position when it spawns, never shoots, and exits shortly after arrival.
- Enemy movement gets 10% faster per wave (up to 1.9× by Wave 10, resetting in each zone). Ranged enemies get an additional 50% movement boost; Rock, Rolling Rock, and enemies with a base speed of 2 or less are exempt from both increases.
- Merger appears in Zone 3 Wave 5 and wanders without chasing you. It can trigger nearby compatible merges; Merge Repulser also triggers merges when it touches compatible enemies.
- Frost Sniper and other merged enemy types can appear naturally in later zones, whether or not you fused them earlier.
- Five Stot tokens buy an extra heart. Collect 10 Merger tokens to unlock the Merge Lab, then spend 200 Chaser tokens to unlock Auto-dodge. Turn Auto-dodge on or off in arena Settings; when on, it steers away from nearby enemies and incoming shots.
- Bosses can only be damaged by player-owned projectiles and abilities; their own projectiles and laser attacks cannot hurt them. Orbital Guardian keeps its 60 HP and moves at 45.
- Buy survival abilities and upgrades with matching enemy tokens. Each merged enemy has a separate currency and a themed, branching upgrade tree. Compatible enemies can merge when they meet in the arena.
- Press **Esc** to pause. The game also pauses when the tab loses focus.
- Change sound volumes, mute audio, and customize ability and skip keys from the main menu. Progress is saved in browser local storage; use **Save code** below the arena to generate a portable backup or import one from another browser. Importing replaces the current local save. Codes include saved progress and settings, but not the live positions of enemies in an active wave.
- Use **Reset all progress** in Save code settings to start over; this also turns off tester mode, so enter `tester` again to re-enable the Admin Panel. For local testing, open **Credits & audio** on the shop page and enter the exact code `tester`. Exiting tester mode restores the save captured when testing began. This is a local-only development switch, not authentication.

## Deployment

The site remains static and deploys directly to GitHub Pages or Vercel. No build step, server-side code, or external dependencies are required; `vercel.json` continues to provide clean URLs and response headers.

## Beginner-friendly implementation notes

The project is plain HTML, CSS, and JavaScript. Organized arrays hold the enemy stats, wave rosters, zones, merge recipes, and upgrade branches. Small functions update movement, collisions, attacks, drawing, and saving. The Canvas API draws the arena; `requestAnimationFrame` repeatedly advances the game. The Web Audio API creates original synthesized music and effects without external tracks. `localStorage` stores progress on the player's device.
