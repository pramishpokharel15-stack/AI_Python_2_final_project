# Little Box

A static dodge-and-survive game for GitHub Pages. Open `index.html` to play; `shop.html` contains upgrades and the enemy guide. No server or build step is needed.

## Play

- Move with **WASD** or the arrow keys, fire a modest shot with **X** or click, and press **Esc** to pause.
- Enemies reward one matching token when they exit the arena. Movement upgrades accept Chaser or Speedy tokens.
- The boss can only be damaged by its own projectiles ricocheting into it.
- Buy upgrades with tokens in the shop. The playtest button unlocks all upgrades for free.
- Progress is saved in browser local storage. Browser audio starts after the first click.

## How it works

The project uses HTML for the two pages, CSS for the layout, and JavaScript for game rules, shop filters, and saving. The arena uses the browser's Canvas API to draw the player, enemies, and projectiles; `requestAnimationFrame` updates their movement. Keyboard and visibility events control movement and pausing. The Web Audio API generates simple music and sound effects, and `localStorage` saves tokens, upgrades, and wave progress on the device.
