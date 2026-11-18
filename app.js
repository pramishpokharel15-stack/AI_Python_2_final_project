(() => {
  "use strict";

  const SAVE_KEY = "little-box-save-v1";
  const ZONES = [
    { id: 1, name: "The Quiet Room", boss: "Orbital Guardian", hp: 1, speed: 1, bossHp: 60, color: "#ff698f" },
    { id: 2, name: "Afterimage Hall", boss: "Prism Warden", hp: 1.2, speed: 1.05, bossHp: 78, color: "#a98aff" },
    { id: 3, name: "The Sunken Circuit", boss: "Tidal Engine", hp: 1.4, speed: 1.1, bossHp: 96, color: "#5bdcf2" },
    { id: 4, name: "Cinder Garden", boss: "Ember Crown", hp: 1.65, speed: 1.15, bossHp: 114, color: "#ff9d59" },
    { id: 5, name: "The Last Reflection", boss: "Null Sovereign", hp: 1.9, speed: 1.2, bossHp: 132, color: "#d8a6ff" }
  ];

  const ENEMIES = [
    { id: "chaser", name: "Chaser", zone: 1, hp: 26, speed: 5, damage: 1, icon: "●", color: "#ff718f", attack: "Melee", difficulty: "Easy", size: 13, pattern: "chase", description: "Follows the player directly.", special: "Persistent pursuit.", tip: "Keep moving and turn sharply when it gets close." },
    { id: "dasher", name: "Dasher", zone: 2, hp: 28, speed: 5, damage: 1, icon: "➤", color: "#ffad67", attack: "Charging", difficulty: "Medium", size: 12, pattern: "charge", description: "Locks onto your position, warns, then charges.", special: "Long telegraphed dash.", tip: "Wait for its line warning, then dodge sideways." },
    { id: "stot", name: "Stot", zone: 1, hp: 3, speed: 6, damage: 1, icon: "·", color: "#fff08a", attack: "Melee", difficulty: "Easy", size: 8, pattern: "stot", description: "Moves quickly toward your position when it spawns, then exits.", special: "Never fires or follows you.", tip: "Move after it picks its destination." },
    { id: "shooter", name: "Shooter", zone: 1, hp: 34, speed: 4, damage: 1, icon: "✦", color: "#c796ff", attack: "Ranged", difficulty: "Medium", size: 14, pattern: "shoot", description: "Moves around the arena while firing aimed projectiles.", special: "Single aimed shots.", tip: "Move perpendicular to the incoming shot." },
    { id: "spinner", name: "Spinner", zone: 1, hp: 36, speed: 0, damage: 1, icon: "✳", color: "#66d9ff", attack: "Area", difficulty: "Medium", size: 15, pattern: "spin", description: "Circles the arena while firing rings of projectiles.", special: "Radial volleys.", tip: "Find a gap between bullets before the ring spreads." },
    { id: "bouncer", name: "Bouncer", zone: 1, hp: 35, speed: 5, damage: 1, icon: "◈", color: "#72efb3", attack: "Melee", difficulty: "Medium", size: 12, pattern: "bounce", description: "Ricochets around the box on a hard-to-predict path.", special: "Wall rebounds.", tip: "Track its direction and avoid the next wall turn." },
    { id: "exploder", name: "Exploder", zone: 1, hp: 25, speed: 3, damage: 1, icon: "✹", color: "#ffc667", attack: "Explosive", difficulty: "Hard", size: 16, pattern: "explode", description: "Moves toward the player, then flashes and bursts at close range.", special: "Slow pursuit and close-range blast.", tip: "When it flashes, make distance immediately." },
    { id: "sniper", name: "Sniper", zone: 1, hp: 23, speed: 0, damage: 1, icon: "⌖", color: "#ff77d2", attack: "Ranged", difficulty: "Hard", size: 12, pattern: "snipe", description: "Marks your position before firing a fast shot.", special: "Target warning.", tip: "Do not stay on the marked line." },
    { id: "splitter", name: "Splitter", zone: 1, hp: 44, speed: 5, damage: 1, icon: "◇", color: "#91a0ff", attack: "Area", difficulty: "Hard", size: 15, pattern: "split", description: "Splits after a short delay into two tiny pursuers.", special: "Two children with 1 HP each; they cannot split.", tip: "Make room before it divides." },
    { id: "rock", name: "Rock", zone: 1, hp: 82, speed: 5, damage: 1, icon: "⬟", color: "#9b8c77", attack: "Melee", difficulty: "Hard", size: 21, pattern: "chase", reduction: 0.75, description: "A heavy rolling obstacle that advances steadily.", special: "Exactly 75% damage reduction.", tip: "It is slow; leave a wide path around it." },

    { id: "repulser", name: "Repulser", zone: 2, hp: 44, speed: 5, damage: 1, icon: "✣", color: "#fa8197", attack: "Area", difficulty: "Medium", size: 16, pattern: "repulse", description: "Sends pulses that push the player away.", special: "Knockback only; no damage resistance.", tip: "Use its pulse to create space, then keep moving." },
    { id: "freezer", name: "Freezer", zone: 2, hp: 34, speed: 5, damage: 1, icon: "❄", color: "#75dafa", attack: "Ranged", difficulty: "Medium", size: 14, pattern: "freezer", description: "Fires ice shots that briefly slow the player.", special: "A slow hit refreshes a short, capped timer; it cannot stack.", tip: "Dodge the blue shot before it reaches you." },
    { id: "teleporter", name: "Teleporter", zone: 2, hp: 36, speed: 5, damage: 1, icon: "⌘", color: "#a786ff", attack: "Teleporting", difficulty: "Medium", size: 13, pattern: "teleport", description: "Flashes a warning, then blinks to another spot.", special: "Short-range relocation.", tip: "Watch its warning glow before changing direction." },
    { id: "healer", name: "Healer", zone: 2, hp: 53, speed: 0, damage: 0, icon: "+", color: "#8df1bc", attack: "Support", difficulty: "Easy", size: 15, pattern: "heal", description: "Stays back and restores nearby enemies over time.", special: "Healing aura.", tip: "Avoid being surrounded by the enemies it supports." },
    { id: "shieldBall", name: "Shield Ball", zone: 2, hp: 63, speed: 5, damage: 1, icon: "⬡", color: "#86aaff", attack: "Support", difficulty: "Medium", size: 19, pattern: "shield", description: "Moves near other enemies and gives them a visible temporary shield.", special: "Shield lasts briefly and does not reduce player damage.", tip: "Keep your route clear of its support group." },
    { id: "leech", name: "Leech", zone: 2, hp: 35, speed: 5, damage: 1, icon: "∿", color: "#ff6582", attack: "Melee", difficulty: "Hard", size: 13, pattern: "leech", description: "Chases the player and heals itself after contact.", special: "Contact drains a little health and restores its own.", tip: "Avoid close contact; its lunge is short." },
    { id: "poisonBall", name: "Poison Ball", zone: 2, hp: 35, speed: 0, damage: 1, icon: "☠", color: "#a6e66d", attack: "Ranged", difficulty: "Hard", size: 15, pattern: "poison", description: "Fires poison shots that apply a brief damage-over-time effect.", special: "Poison duration is capped and never stacks.", tip: "Avoid its green projectiles and keep space to dodge." },
    { id: "magnet", name: "Magnet", zone: 2, hp: 53, speed: 5, damage: 1, icon: "↟", color: "#f0a8ff", attack: "Area", difficulty: "Medium", size: 16, pattern: "magnet", description: "Moves near the player and pulls them closer inside its radius.", special: "Directional pull.", tip: "Move across its edge instead of straight away." },
    { id: "summoner", name: "Summoner", zone: 2, hp: 62, speed: 5, damage: 0, icon: "✧", color: "#d5a5ff", attack: "Summoning", difficulty: "Hard", size: 19, pattern: "summon", description: "Periodically calls in a weaker supporting enemy.", special: "Summoned minions also reward their own token on exit.", tip: "Stay mobile when it begins its summoning flash." },
    { id: "phantom", name: "Phantom", zone: 2, hp: 37, speed: 5, damage: 1, icon: "◌", color: "#b2c1ff", attack: "Melee", difficulty: "Hard", size: 14, pattern: "phantom", description: "Fades in and out while moving toward the player.", special: "Hard to see; harmless to touch while faded.", tip: "Watch its outline and avoid its last known position." },
    { id: "supportling", name: "Supportling", zone: 2, hp: 4, speed: 4, damage: 1, icon: "·", color: "#e1c4ff", attack: "Melee", difficulty: "Easy", size: 8, pattern: "chase", description: "A fragile minion called by the Summoner.", special: "One hit point; cannot split.", tip: "Keep moving while it follows." },

    { id: "riftling", name: "Riftling", zone: 3, hp: 32, speed: 4, damage: 1, icon: "⟐", color: "#68e5e6", attack: "Teleporting", difficulty: "Medium", size: 13, pattern: "teleport", description: "Jumps through short rifts and reappears near the player.", special: "Briefly telegraphs each jump.", tip: "Change direction when the rift opens." },
    { id: "echo", name: "Echo", zone: 3, hp: 39, speed: 4, damage: 1, icon: "◎", color: "#9ee8d6", attack: "Ranged", difficulty: "Medium", size: 14, pattern: "echo", description: "Fires a slow echo shot that leaves a lingering trail.", special: "Predictable, lingering projectile.", tip: "Move out of its trail rather than through it." },
    { id: "vortex", name: "Vortex", zone: 3, hp: 48, speed: 3, damage: 1, icon: "◉", color: "#63bdea", attack: "Area", difficulty: "Hard", size: 18, pattern: "vortex", description: "Draws the player inward while releasing a rotating ring.", special: "Pull followed by a radial volley.", tip: "Leave the pull radius before the ring fires." },
    { id: "prism", name: "Prism", zone: 3, hp: 37, speed: 3, damage: 1, icon: "◇", color: "#ffe38a", attack: "Ranged", difficulty: "Medium", size: 15, pattern: "prism", description: "Fires a three-way fan of bright projectiles.", special: "Wide but spaced volley.", tip: "Slip through the gap between its shots." },
    { id: "mine", name: "Mine", zone: 3, hp: 54, speed: 2, damage: 1, icon: "✹", color: "#e5aa66", attack: "Explosive", difficulty: "Hard", size: 15, pattern: "mine", description: "Drifts until it flashes, then bursts in a small area.", special: "Drifting timed blast.", tip: "Leave the warning ring before it detonates." },
    { id: "merger", name: "Merger", zone: 3, hp: 45, speed: 3, damage: 0, icon: "⊕", color: "#a9f27b", attack: "Merging", difficulty: "Hard", size: 14, pattern: "merger", description: "Wanders around the arena and merges compatible nearby enemies when touched.", special: "Awards a Merger token when it escapes or is consumed.", tip: "Keep it away from enemies you want to keep separate." },
    { id: "mergeRepulser", name: "Merge Repulser", zone: 3, hp: 62, speed: 4, damage: 1, icon: "✣", color: "#c5e86d", attack: "Merging", difficulty: "Very Hard", size: 18, pattern: "mergeRepulse", description: "Repulses the player and triggers nearby compatible enemy merges on contact.", special: "Created when a Merger and Repulser merge.", tip: "Give it space around groups of enemies." },

    { id: "cinder", name: "Cinder", zone: 4, hp: 43, speed: 5, damage: 1, icon: "✺", color: "#ff9b60", attack: "Ranged", difficulty: "Medium", size: 14, pattern: "shoot", description: "Sends quick ember shots toward the player.", special: "Fast single shots.", tip: "Dodge sideways as its ember lights." },
    { id: "wisp", name: "Wisp", zone: 4, hp: 33, speed: 6, damage: 1, icon: "☼", color: "#ffd079", attack: "Melee", difficulty: "Hard", size: 12, pattern: "phantom", description: "Flickers and darts toward the player's last position.", special: "Alternates between visible and faded.", tip: "Wait for its reappearance before choosing a route." },
    { id: "quake", name: "Quake", zone: 4, hp: 68, speed: 2, damage: 1, icon: "▦", color: "#ff735f", attack: "Area", difficulty: "Hard", size: 21, pattern: "quake", description: "Creates a marked ground pulse that knocks the player back.", special: "Expanding warning ring.", tip: "Step outside the ring before it reaches you." },
    { id: "arc", name: "Arc", zone: 4, hp: 46, speed: 5, damage: 1, icon: "ϟ", color: "#ffcf63", attack: "Charging", difficulty: "Medium", size: 14, pattern: "charge", description: "Zigzags, then charges along a warned line.", special: "Delayed directional lunge.", tip: "Dodge perpendicular to the charge line." },
    { id: "siphon", name: "Siphon", zone: 4, hp: 50, speed: 4, damage: 1, icon: "∿", color: "#ff8c75", attack: "Melee", difficulty: "Hard", size: 15, pattern: "leech", description: "Surges forward and regains a little strength on contact.", special: "Short contact lunge.", tip: "Keep moving; do not let it corner you." },

    { id: "nova", name: "Nova", zone: 5, hp: 50, speed: 4, damage: 1, icon: "✷", color: "#f195ff", attack: "Area", difficulty: "Hard", size: 17, pattern: "spin", description: "Emits two rotating waves of projectiles.", special: "Alternating radial volleys.", tip: "Find a gap, then keep moving as the ring turns." },
    { id: "lattice", name: "Lattice", zone: 5, hp: 58, speed: 3, damage: 1, icon: "▧", color: "#92c4ff", attack: "Ranged", difficulty: "Hard", size: 18, pattern: "lattice", description: "Fires a wide, evenly spaced projectile grid.", special: "Alternating horizontal and vertical patterns.", tip: "Move into the gaps between grid lines." },
    { id: "chrono", name: "Chrono", zone: 5, hp: 45, speed: 4, damage: 1, icon: "◷", color: "#8ce7e2", attack: "Ranged", difficulty: "Hard", size: 15, pattern: "freezer", description: "Fires a time-fragment shot that briefly slows movement.", special: "Short, non-stacking slow.", tip: "Dodge its visible shot before it reaches you." },
    { id: "maw", name: "Maw", zone: 5, hp: 74, speed: 4, damage: 1, icon: "◒", color: "#ff7894", attack: "Charging", difficulty: "Very Hard", size: 20, pattern: "charge", description: "Winds up a long, heavy lunge at your marked position.", special: "Slow wind-up; strong directional charge.", tip: "Use the warning time to cross behind it." },
    { id: "pulse", name: "Pulse", zone: 5, hp: 54, speed: 4, damage: 1, icon: "⊙", color: "#bc9aff", attack: "Area", difficulty: "Hard", size: 17, pattern: "repulse", description: "Alternates between pulling and pushing pulses.", special: "Each pulse is clearly telegraphed.", tip: "Use the pause between pulses to reposition." },

    { id: "slowShooter", name: "Slow Shooter", zone: 2, hp: 42, speed: 3, damage: 1, icon: "❄", color: "#64dff0", attack: "Ranged", difficulty: "Hard", size: 16, pattern: "freezer", description: "Fires projectiles that damage and briefly slow the player.", special: "Slow lasts a short, capped duration and does not stack.", tip: "Dodge each blue shot; the effect cannot build indefinitely." },
    { id: "explosiveChaser", name: "Explosive Chaser", zone: 1, hp: 38, speed: 5, damage: 1, icon: "✹", color: "#ff735c", attack: "Explosive", difficulty: "Hard", size: 17, pattern: "explode", description: "Pursues the player and detonates after a clear warning.", special: "Chase plus timed blast.", tip: "When it flashes, turn away and make space." },
    { id: "rollingRock", name: "Rolling Rock", zone: 1, hp: 96, speed: 5, damage: 1, icon: "⬢", color: "#bfaa87", attack: "Melee", difficulty: "Hard", size: 23, pattern: "bounce", reduction: 0.75, description: "A bouncing heavy rock that blocks space as it rolls.", special: "Exactly 75% damage reduction.", tip: "Use the corners only briefly; it can rebound there." },
    { id: "frostSniper", name: "Frost Sniper", zone: 3, hp: 31, speed: 2, damage: 1, icon: "⌖", color: "#86d9ff", attack: "Ranged", difficulty: "Hard", size: 13, pattern: "snipeSlow", description: "Marks your position and fires a fast slowing shot.", special: "Warning line plus a capped slow effect.", tip: "Move off the marked line before it fires." },
    { id: "toxicSpinner", name: "Toxic Spinner", zone: 2, hp: 43, speed: 3, damage: 1, icon: "☣", color: "#b1ed63", attack: "Area", difficulty: "Hard", size: 17, pattern: "toxicSpin", description: "Spins out a radial volley of poison shots.", special: "Poison duration is limited and cannot stack.", tip: "Look for a safe opening between the green shots." },
    { id: "explosiveDasher", name: "Explosive Dasher", zone: 2, hp: 42, speed: 5, damage: 1, icon: "➤", color: "#ff8655", attack: "Charging", difficulty: "Hard", size: 15, pattern: "explosiveCharge", description: "Charges along a warning line and bursts at the end.", special: "Charge followed by a visible blast.", tip: "Dodge across its path, then keep away from the blast." },
    { id: "guardianHealer", name: "Guardian Healer", zone: 2, hp: 59, speed: 3, damage: 1, icon: "✚", color: "#93efc1", attack: "Support", difficulty: "Hard", size: 18, pattern: "shieldHeal", description: "Moves with nearby enemies and gives them brief shields and healing.", special: "Support aura, not a player defense effect.", tip: "Do not get trapped among the group it protects." },
    { id: "phantomJumper", name: "Phantom Jumper", zone: 2, hp: 41, speed: 5, damage: 1, icon: "◈", color: "#c4abff", attack: "Teleporting", difficulty: "Hard", size: 15, pattern: "phantomTeleport", description: "Fades out, teleports, then reappears nearby.", special: "Warning flash before each jump.", tip: "Keep room around the fading outline." },
    { id: "gravityController", name: "Gravity Controller", zone: 2, hp: 61, speed: 3, damage: 1, icon: "⊛", color: "#ed9aff", attack: "Area", difficulty: "Very Hard", size: 19, pattern: "gravity", description: "Moves near the player while alternating between pulls and pushes.", special: "Telegraphed gravity pulses.", tip: "Change direction when its pulse color changes." },
    { id: "splitSummoner", name: "Split Summoner", zone: 2, hp: 65, speed: 4, damage: 1, icon: "✧", color: "#e6aaff", attack: "Summoning", difficulty: "Very Hard", size: 20, pattern: "summonSplit", description: "Summons weak split-shaped helpers that never split again.", special: "Summon warning and limited helper count.", tip: "Watch the summon flash and leave a path open." },
    { id: "boss1", name: "Orbital Guardian", zone: 1, hp: 60, speed: 2, speedStat: 35, damage: 1, icon: "⬡", color: "#ff698f", attack: "Boss", difficulty: "Very Hard", size: 43, pattern: "boss", description: "The Zone 1 boss uses bursts, circular attacks, target locks, and summons.", special: "Only its own wall-ricocheted projectiles can damage it.", tip: "Dodge until a missed shot bounces back toward the Guardian." },
    { id: "boss2", name: "Prism Warden", zone: 2, hp: 78, speed: 2, speedStat: 35, damage: 1, icon: "⬡", color: "#a98aff", attack: "Boss", difficulty: "Very Hard", size: 43, pattern: "boss", description: "A shifting boss that alternates projectile patterns and summons.", special: "Only its own wall-ricocheted projectiles can damage it.", tip: "Watch its attack warning and use the arena walls to return shots." },
    { id: "boss3", name: "Tidal Engine", zone: 3, hp: 96, speed: 2, speedStat: 35, damage: 1, icon: "⬡", color: "#5bdcf2", attack: "Boss", difficulty: "Very Hard", size: 43, pattern: "boss", description: "A tidal boss with bursts, circular attacks, target locks, and summons.", special: "Only its own wall-ricocheted projectiles can damage it.", tip: "Let a missed shot rebound into the Engine." },
    { id: "boss4", name: "Ember Crown", zone: 4, hp: 114, speed: 2, speedStat: 35, damage: 1, icon: "⬡", color: "#ff9d59", attack: "Boss", difficulty: "Very Hard", size: 43, pattern: "boss", description: "An ember boss with bursts, circular attacks, target locks, and summons.", special: "Only its own wall-ricocheted projectiles can damage it.", tip: "Dodge the warning first; make its shots return after a wall bounce." },
    { id: "boss5", name: "Null Sovereign", zone: 5, hp: 132, speed: 2, speedStat: 35, damage: 1, icon: "⬡", color: "#d8a6ff", attack: "Boss", difficulty: "Very Hard", size: 43, pattern: "boss", description: "The final boss combines all four patterns and calls in reinforcements.", special: "Only its own wall-ricocheted projectiles can damage it.", tip: "Use each warning to find a safe place for the returning shots." }
  ];
  const ENEMY_BY_ID = Object.fromEntries(ENEMIES.map(enemy => [enemy.id, enemy]));
  const BOSS_CURRENCY = ZONES.map(zone => ({ id: `boss${zone.id}`, name: `Zone ${zone.id} boss`, icon: "♢" }));
  const CURRENCIES = [...ENEMIES.filter(enemy => !enemy.id.startsWith("boss")).map(enemy => ({ id: enemy.id, name: enemy.name, icon: enemy.icon })), ...BOSS_CURRENCY];

  const WAVE_ENEMIES = {
    1: [
      ["chaser", "stot"], ["chaser"], ["bouncer", "chaser"], ["spinner", "chaser"],
      ["exploder", "bouncer"], ["shooter", "bouncer"], ["sniper", "spinner"],
      ["splitter", "exploder", "rock", "shooter"], ["chaser", "shooter", "spinner", "bouncer", "exploder", "sniper", "splitter", "rock"]
    ],
    2: [
      ["repulser", "dasher", "explosiveChaser"], ["freezer", "rollingRock"], ["teleporter", "repulser"], ["healer", "freezer"], ["shieldBall", "teleporter"],
      ["leech", "poisonBall", "repulser"], ["magnet", "summoner", "phantom"],
      ["chaser", "shooter", "spinner", "sniper", "splitter", "repulser", "freezer", "teleporter", "summoner"],
      ["repulser", "freezer", "teleporter", "healer", "shieldBall", "leech", "poisonBall", "magnet", "summoner", "phantom"]
    ],
    3: [
      ["riftling", "frostSniper"], ["echo", "slowShooter"], ["vortex", "riftling", "toxicSpinner"], ["prism", "echo", "explosiveDasher"], ["mine", "vortex", "guardianHealer", "merger", "repulser"],
      ["riftling", "prism", "mine", "phantomJumper"], ["echo", "vortex", "prism", "gravityController"], ["chaser", "freezer", "riftling", "vortex", "splitSummoner"],
      ["riftling", "echo", "vortex", "prism", "mine", "slowShooter", "toxicSpinner", "explosiveDasher", "guardianHealer", "phantomJumper", "gravityController", "splitSummoner"]
    ],
    4: [
      ["cinder", "mergeRepulser"], ["wisp"], ["quake", "cinder"], ["arc", "wisp"], ["siphon", "quake"],
      ["cinder", "arc", "siphon"], ["wisp", "quake", "arc"], ["repulser", "cinder", "wisp", "quake"],
      ["cinder", "wisp", "quake", "arc", "siphon"]
    ],
    5: [
      ["nova"], ["lattice"], ["chrono", "nova"], ["maw", "lattice"], ["pulse", "chrono"],
      ["nova", "maw", "pulse"], ["lattice", "chrono", "maw"], ["vortex", "phantom", "nova", "pulse"],
      ["nova", "lattice", "chrono", "maw", "pulse"]
    ]
  };
  function waveCandidates(zone, wave) {
    return [...new Set(WAVE_ENEMIES[zone].slice(0, Math.min(wave, WAVE_ENEMIES[zone].length)).flat())];
  }

  const MERGES = [
    { a: "freezer", b: "shooter", result: "slowShooter", zone: 2, wave: 1 },
    { a: "chaser", b: "exploder", result: "explosiveChaser", zone: 1, wave: 3 },
    { a: "rock", b: "bouncer", result: "rollingRock", zone: 1, wave: 5 },
    { a: "sniper", b: "freezer", result: "frostSniper", zone: 2, wave: 3 },
    { a: "spinner", b: "poisonBall", result: "toxicSpinner", zone: 2, wave: 6 },
    { a: "dasher", b: "exploder", result: "explosiveDasher", zone: 2, wave: 4 },
    { a: "healer", b: "shieldBall", result: "guardianHealer", zone: 2, wave: 5 },
    { a: "teleporter", b: "phantom", result: "phantomJumper", zone: 2, wave: 7 },
    { a: "magnet", b: "repulser", result: "gravityController", zone: 2, wave: 7 },
    { a: "summoner", b: "splitter", result: "splitSummoner", zone: 2, wave: 7 },
    { a: "merger", b: "repulser", result: "mergeRepulser", zone: 3, wave: 5 }
  ];

  const UPGRADE_GROUPS = [
    { name: "Damage", upgrades: [
      { id: "reflectionPower", name: "Reflected force", currency: "shooter", cost: 2, requires: [], description: "Boss projectiles deal 10% more damage when they ricochet back into a boss." }
    ] },
    { name: "Survival", upgrades: [
      { id: "maxHealth", name: "Extra heart", currency: "stot", cost: 5, requires: [], description: "Spend 5 Stot tokens to increase maximum health by 1. Your current HP is not refilled." },
      { id: "regeneration", name: "Slow recovery", currency: "healer", cost: 3, requires: ["maxHealth"], description: "Recover 0.15 HP per second while a wave is active." },
      { id: "damageReduction", name: "Steady nerves", currency: "rock", cost: 2, requires: ["regeneration"], description: "Reduce each incoming hit by 5% per level. Starts at 0%." }
    ] },
    { name: "Movement", upgrades: [
      { id: "movementSpeed", name: "Light steps", currency: "dasher", cost: 2, requires: [], description: "Increase movement speed by 6% per level." },
      { id: "dash", name: "Dash", currency: "dasher", cost: 3, requires: ["movementSpeed"], description: "Unlock a brief, damage-immune dash; each level extends its duration." },
      { id: "dashCooldown", name: "Quick recovery", currency: "dasher", cost: 2, requires: ["dash"], description: "Shorten dash cooldown by 0.4 seconds per level." }
    ] },
    { name: "Abilities", upgrades: [
      { id: "slowMotion", name: "Slow motion · Q", currency: "sniper", cost: 2, requires: [], description: "Unlock a short enemy and projectile slow; each level extends its duration." },
      { id: "energyPulse", name: "Energy pulse · E", currency: "spinner", cost: 2, requires: ["slowMotion"], description: "Unlock a pulse that knocks nearby enemies and shots away; each level increases its reach." },
      { id: "deflection", name: "Deflection · R", currency: "shooter", cost: 3, requires: ["energyPulse"], description: "Unlock a pulse that redirects nearby shots; each level increases its reach." },
      { id: "phaseShift", name: "Phase shift · F", currency: "boss1", cost: 1, requires: ["deflection"], description: "Unlock a brief phase through attacks; each level extends its duration." }
    ] },
    { name: "Special mechanics", upgrades: [
      { id: "magnet", name: "Merge resonance", currency: "splitter", cost: 2, requires: [], description: "Increase the distance at which compatible enemies merge." },
      { id: "shield", name: "One-hit shield", currency: "shieldBall", cost: 2, requires: ["magnet"], description: "Block one hit per level at the start of each wave." },
      { id: "extraLife", name: "Second chance", currency: "boss1", cost: 2, requires: ["shield"], description: "Once per wave, survive a fatal hit; more levels restore a little extra HP." }
    ] }
  ];
  const AUTO_DODGE_UPGRADE = { id: "autoDodge", name: "Auto-dodge", currency: "chaser", cost: 200 };
  const UPGRADES = [...UPGRADE_GROUPS.flatMap(group => group.upgrades), AUTO_DODGE_UPGRADE];
  let selectedUpgradeId = "reflectionPower";
  const defaultKeybinds = { pause: "escape", dash: " ", slowMotion: "q", energyPulse: "e", deflection: "r", phaseShift: "f", skipWave: "l" };
  const defaultSave = () => ({
    currencies: Object.fromEntries(CURRENCIES.map(currency => [currency.id, 0])),
    upgrades: Object.fromEntries(UPGRADES.map(upgrade => [upgrade.id, 0])),
    discovered: [],
    unlockedZone: 1,
    zone: 1,
    continueWave: 1,
    skipStreak: 0,
    currentHp: 3,
    autoDodgeEnabled: false,
    musicVolume: 35,
    soundVolume: 55,
    muted: false,
    keybinds: { ...defaultKeybinds }
  });
  let save = defaultSave();
  const statusElement = document.getElementById("saveStatus");
  function isSaveRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function normalizeSave(stored) {
    if (!isSaveRecord(stored)) throw new Error("Save data is not an object.");
    for (const key of ["currencies", "upgrades", "keybinds"]) {
      if (stored[key] !== undefined && !isSaveRecord(stored[key])) {
        throw new Error(`Save data has invalid ${key}.`);
      }
    }
    const fresh = defaultSave();
    const normalized = {
      ...fresh,
      ...stored,
      currencies: { ...fresh.currencies, ...(stored.currencies || {}) },
      upgrades: { ...fresh.upgrades, ...(stored.upgrades || {}) },
      keybinds: { ...fresh.keybinds, ...(stored.keybinds || {}) },
      discovered: Array.isArray(stored.discovered) ? stored.discovered.filter(id => ENEMY_BY_ID[id]) : []
    };
    normalized.unlockedZone = Math.max(1, Math.min(5, Number(normalized.unlockedZone) || 1));
    normalized.zone = Math.max(1, Math.min(normalized.unlockedZone, Number(normalized.zone) || 1));
    normalized.continueWave = Math.max(1, Math.min(10, Number(normalized.continueWave) || 1));
    normalized.skipStreak = Math.max(0, Math.min(3, Math.floor(Number(normalized.skipStreak) || 0)));
    normalized.currentHp = Number.isFinite(Number(normalized.currentHp)) ? Math.max(0, Number(normalized.currentHp)) : 3;
    normalized.musicVolume = Math.max(0, Math.min(100, Number(normalized.musicVolume) || 0));
    normalized.soundVolume = Math.max(0, Math.min(100, Number(normalized.soundVolume) || 0));
    normalized.muted = Boolean(normalized.muted);
    normalized.autoDodgeEnabled = Boolean(normalized.autoDodgeEnabled);
    for (const key of Object.keys(normalized.currencies)) {
      const value = Number(normalized.currencies[key]);
      normalized.currencies[key] = Number.isFinite(value) ? Math.max(0, value) : 0;
    }
    for (const key of Object.keys(normalized.upgrades)) {
      const value = Number(normalized.upgrades[key]);
      normalized.upgrades[key] = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
    }
    for (const key of Object.keys(defaultKeybinds)) {
      if (typeof normalized.keybinds[key] !== "string" || !normalized.keybinds[key]) normalized.keybinds[key] = defaultKeybinds[key];
    }
    return normalized;
  }
  function encodeSaveCode(snapshot) {
    const bytes = new TextEncoder().encode(JSON.stringify({ version: 1, save: snapshot }));
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const encoded = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    return `LB1-${encoded}`;
  }
  function decodeSaveCode(code) {
    const compactCode = code.trim().replace(/\s/g, "");
    if (compactCode.length > 50000) throw new Error("Save code is too long.");
    if (!compactCode.startsWith("LB1-")) throw new Error("Save code must start with LB1-.");
    const payload = compactCode.slice(4);
    if (!payload || !/^[A-Za-z0-9_-]+$/.test(payload)) throw new Error("Save code contains invalid characters.");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "=".repeat((4 - base64.length % 4) % 4));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const envelope = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!isSaveRecord(envelope) || envelope.version !== 1) throw new Error("Save code version is not supported.");
    return normalizeSave(envelope.save);
  }
  function showStorageStatus(message, failed = false) {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.style.color = failed ? "#ff9db7" : "";
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      save = normalizeSave(JSON.parse(raw));
    } catch (error) {
      showStorageStatus("Save unavailable", true);
      console.error("Could not read the Little Box save:", error);
    }
  }
  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      showStorageStatus("Saved locally");
      return true;
    } catch (error) {
      showStorageStatus("Could not save", true);
      console.error("Could not save Little Box progress:", error);
      return false;
    }
  }
  loadSave();

  let audioContext;
  let musicGain;
  let musicOscillator;
  let musicHarmony;
  let musicIntensity = 0.12;
  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioContext) {
      audioContext = new AudioContext();
      musicGain = audioContext.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(audioContext.destination);
      musicOscillator = audioContext.createOscillator();
      musicHarmony = audioContext.createOscillator();
      musicOscillator.type = "triangle";
      musicHarmony.type = "sine";
      musicOscillator.frequency.value = 110;
      musicHarmony.frequency.value = 164.81;
      musicOscillator.connect(musicGain);
      musicHarmony.connect(musicGain);
      musicOscillator.start();
      musicHarmony.start();
      updateMusic();
    }
    if (audioContext.state === "suspended") audioContext.resume();
  }
  function updateMusic() {
    if (!audioContext || !musicGain) return;
    const now = audioContext.currentTime;
    const volume = save.muted ? 0 : Number(save.musicVolume) / 100;
    const level = Math.max(0.08, musicIntensity);
    musicOscillator.frequency.setTargetAtTime(82 + level * 92, now, 0.8);
    musicHarmony.frequency.setTargetAtTime(123 + level * 130, now, 0.8);
    musicGain.gain.setTargetAtTime(volume * (0.008 + level * 0.025), now, 1.1);
  }
  function setMusicForWave(wave) {
    musicIntensity = wave <= 0 ? 0.1 : wave <= 3 ? 0.18 : wave <= 6 ? 0.48 : wave <= 9 ? 0.78 : 1;
    updateMusic();
  }
  function playTone(frequency, duration = 0.09, type = "sine") {
    if (save.muted || Number(save.soundVolume) <= 0) return;
    ensureAudio();
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime((Number(save.soundVolume) / 100) * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
  function setVolume(kind, value) {
    save[kind] = Number(value);
    document.querySelectorAll(kind === "musicVolume" ? "#musicVolume" : "#soundVolume").forEach(input => { input.value = String(value); });
    persist();
    updateMusic();
  }
  function setMute(value) {
    save.muted = Boolean(value);
    document.querySelectorAll("#muteSound").forEach(input => { input.checked = save.muted; });
    persist();
    updateMusic();
  }
  function connectVolumeControls() {
    document.querySelectorAll("#musicVolume").forEach(input => {
      input.value = String(save.musicVolume);
      input.addEventListener("input", () => setVolume("musicVolume", input.value));
    });
    document.querySelectorAll("#soundVolume").forEach(input => {
      input.value = String(save.soundVolume);
      input.addEventListener("input", () => setVolume("soundVolume", input.value));
    });
    document.querySelectorAll("#muteSound").forEach(input => {
      input.checked = save.muted;
      input.addEventListener("change", () => setMute(input.checked));
    });
    document.addEventListener("pointerdown", ensureAudio, { once: true });
  }
  connectVolumeControls();
  if (document.body.dataset.page === "shop") {
    musicIntensity = 0.1;
    updateMusic();
    renderShop();
  } else {
    initGame();
  }

  function upgradeNodeMarkup(upgrade, isAutoDodge = false) {
    const level = save.upgrades[upgrade.id] || 0;
    const maxLevel = isAutoDodge ? 1 : 5;
    const mergerTokens = save.currencies.merger || 0;
    const locked = isAutoDodge
      ? mergerTokens < 10 && level === 0
      : !upgrade.requires.every(id => (save.upgrades[id] || 0) > 0);
    const currency = ENEMY_BY_ID[upgrade.currency] || BOSS_CURRENCY.find(item => item.id === upgrade.currency);
    const cost = isAutoDodge ? upgrade.cost : upgrade.cost * (level + 1);
    const canBuy = !locked && level < maxLevel && (save.currencies[upgrade.currency] || 0) >= cost;
    const state = locked ? "locked" : level > 0 ? "owned" : canBuy ? "affordable" : "";
    const name = isAutoDodge ? "Auto-dodge" : upgrade.name;
    const mark = locked ? "?" : currency.icon;
    const levelText = locked ? "LOCKED" : isAutoDodge ? (level ? "INSTALLED" : "NOT OWNED") : `LV ${level} / ${maxLevel}`;
    const costText = locked ? "???" : level >= maxLevel ? "MAXED" : `${currency.icon} ${cost}`;
    const label = locked ? "Unknown upgrade" : `${name}, ${levelText}, ${costText}`;
    return `<div class="upgrade-node-shell ${state}${selectedUpgradeId === upgrade.id ? " selected" : ""}">
      <button class="upgrade-node" type="button" data-select-upgrade="${upgrade.id}" aria-label="${label}" aria-pressed="${selectedUpgradeId === upgrade.id}">
        <span class="upgrade-node-mark" aria-hidden="true">${mark}</span>
        <strong>${locked ? "?" : name}</strong>
        <small>${levelText}</small>
        <span class="upgrade-node-cost">${costText}</span>
      </button>
    </div>`;
  }

  function renderUpgradeDetails() {
    const details = document.getElementById("upgradeDetails");
    if (!details) return;
    const upgrade = selectedUpgradeId === "autoDodge"
      ? AUTO_DODGE_UPGRADE
      : UPGRADE_GROUPS.flatMap(group => group.upgrades).find(item => item.id === selectedUpgradeId);
    if (!upgrade) return;

    if (upgrade.id === "autoDodge") {
      const level = save.upgrades.autoDodge || 0;
      const mergerTokens = save.currencies.merger || 0;
      const chaserTokens = save.currencies.chaser || 0;
      const unlocked = mergerTokens >= 10;
      const canBuy = unlocked && level === 0 && chaserTokens >= AUTO_DODGE_UPGRADE.cost;
      details.innerHTML = `<div class="upgrade-detail-copy">
        <p class="eyebrow">SPECIAL MECHANIC</p>
        <h3>Auto-dodge</h3>
        <p>Steers away from nearby enemies and incoming shots. Unlock the Merge Lab with 10 Merger tokens, then buy this for 200 Chaser tokens.</p>
        <span class="upgrade-detail-cost">${unlocked ? `${ENEMY_BY_ID.chaser.icon} ${AUTO_DODGE_UPGRADE.cost} Chaser tokens · You have ${chaserTokens}` : `Merge Lab · ${mergerTokens} / 10 Merger tokens`}</span>
      </div>
      <button class="button" type="button" data-buy-auto-dodge ${canBuy ? "" : "disabled"}>${level ? "Installed" : unlocked ? "Buy Auto-dodge" : "Locked"}</button>`;
    } else {
      const level = save.upgrades[upgrade.id] || 0;
      const prereqs = upgrade.requires || [];
      const visible = prereqs.every(id => (save.upgrades[id] || 0) > 0);
      const currency = ENEMY_BY_ID[upgrade.currency] || BOSS_CURRENCY.find(item => item.id === upgrade.currency);
      const cost = upgrade.cost * (level + 1);
      const canBuy = visible && level < 5 && (save.currencies[upgrade.currency] || 0) >= cost;
      const requirement = visible
        ? `${currency.icon} ${cost} ${currency.name} tokens · You have ${save.currencies[upgrade.currency] || 0}`
        : `Requires ${prereqs.map(id => UPGRADES.find(item => item.id === id).name).join(", ")} first`;
      details.innerHTML = `<div class="upgrade-detail-copy">
        <p class="eyebrow">${UPGRADE_GROUPS.find(group => group.upgrades.includes(upgrade)).name.toUpperCase()}</p>
        <h3>${upgrade.name} <span class="level-text">LV ${level} / 5</span></h3>
        <p>${upgrade.description}${prereqs.length ? ` Requires: ${prereqs.map(id => UPGRADES.find(item => item.id === id).name).join(", ")}.` : ""}</p>
        <span class="upgrade-detail-cost">${visible ? level >= 5 ? "MAX LEVEL" : requirement : requirement}</span>
      </div>
      <button class="button" type="button" data-buy="${upgrade.id}" ${canBuy ? "" : "disabled"}>${level >= 5 ? "Maxed" : visible ? "Upgrade" : "Locked"}</button>`;
    }

    details.onclick = event => {
      if (event.target.closest("[data-buy-auto-dodge]")) {
        buyAutoDodge();
        return;
      }
      const button = event.target.closest("[data-buy]");
      if (!button || button.disabled) return;
      const purchasedUpgrade = UPGRADE_GROUPS.flatMap(group => group.upgrades).find(item => item.id === button.dataset.buy);
      if (!purchasedUpgrade) return;
      const level = save.upgrades[purchasedUpgrade.id] || 0;
      const cost = purchasedUpgrade.cost * (level + 1);
      if (level >= 5 || (save.currencies[purchasedUpgrade.currency] || 0) < cost
        || !purchasedUpgrade.requires.every(id => save.upgrades[id] > 0)) return;
      save.currencies[purchasedUpgrade.currency] -= cost;
      save.upgrades[purchasedUpgrade.id] = level + 1;
      if (purchasedUpgrade.id === "maxHealth" && save.currentHp > 0) save.currentHp = Math.min(save.currentHp, 3 + save.upgrades.maxHealth);
      persist();
      playTone(680, 0.12);
      renderShop();
    };
  }

  function renderUpgradeTree() {
    const upgradeGroups = document.getElementById("upgradeGroups");
    const purchased = UPGRADES.filter(upgrade => (save.upgrades[upgrade.id] || 0) > 0).length;
    upgradeGroups.innerHTML = `<div class="upgrade-root"><div class="upgrade-core"><span>THE LITTLE BOX</span><strong>UPGRADE CORE</strong><small>${purchased} / ${UPGRADES.length} NODES OWNED</small></div></div>
      <div class="upgrade-branches">${UPGRADE_GROUPS.map(group => {
        const nodes = group.upgrades.map(upgrade => upgradeNodeMarkup(upgrade)).join("");
        const autoDodge = group.name === "Special mechanics" ? upgradeNodeMarkup(AUTO_DODGE_UPGRADE, true) : "";
        return `<section class="upgrade-branch"><h3>${group.name}</h3><div class="upgrade-node-stack">${nodes}${autoDodge}</div></section>`;
      }).join("")}</div>`;
    upgradeGroups.onclick = event => {
      const node = event.target.closest("[data-select-upgrade]");
      if (!node) return;
      selectedUpgradeId = node.dataset.selectUpgrade;
      upgradeGroups.querySelectorAll(".upgrade-node-shell").forEach(shell => {
        const button = shell.querySelector("[data-select-upgrade]");
        shell.classList.toggle("selected", button.dataset.selectUpgrade === selectedUpgradeId);
        button.setAttribute("aria-pressed", String(button.dataset.selectUpgrade === selectedUpgradeId));
      });
      renderUpgradeDetails();
    };
    renderUpgradeDetails();
  }

  function buyAutoDodge() {
    if ((save.currencies.merger || 0) < 10 || (save.currencies.chaser || 0) < AUTO_DODGE_UPGRADE.cost || save.upgrades.autoDodge > 0) return;
    save.currencies.chaser -= AUTO_DODGE_UPGRADE.cost;
    save.upgrades.autoDodge = 1;
    save.autoDodgeEnabled = true;
    persist();
    renderShop();
  }

  function renderShop() {
    const currencyList = document.getElementById("currencyList");
    currencyList.innerHTML = CURRENCIES.map(currency => `
      <div class="currency-card">
        <span class="currency-icon">${save.discovered.includes(currency.id) ? currency.icon : "?"}</span>
        <div><strong>${save.discovered.includes(currency.id) ? (save.currencies[currency.id] || 0) : "???"}</strong><span>${save.discovered.includes(currency.id) ? `${currency.name} tokens` : "??? tokens"}</span></div>
      </div>`).join("");

    renderUpgradeTree();

    renderMerges();
    const zoneList = document.getElementById("zoneList");
    zoneList.innerHTML = ZONES.map(zone => {
      const unlocked = zone.id <= save.unlockedZone;
      return `<article class="zone-card ${unlocked ? "unlocked" : ""}">
        <h3>Zone ${String(zone.id).padStart(2, "0")} · ${zone.name}</h3>
        <p>${unlocked ? `10 waves · ${zone.hp.toFixed(2)}× HP · ${zone.speed.toFixed(2)}× speed` : "Locked"}<br>Boss: ${unlocked ? zone.boss : "???"}</p>
        ${unlocked
          ? `<a class="button" href="index.html" data-zone="${zone.id}">${save.zone === zone.id ? `Continue · Wave ${save.continueWave}` : "Enter zone"}</a>`
          : `<button class="button" type="button" disabled>Defeat the previous boss to unlock</button>`}
      </article>`;
    }).join("");
    zoneList.onclick = event => {
      const link = event.target.closest("[data-zone]");
      if (!link) return;
      event.preventDefault();
      const selectedZone = Number(link.dataset.zone);
      if (selectedZone !== save.zone) save.continueWave = 1;
      save.zone = selectedZone;
      persist();
      window.location.href = "index.html";
    };
    const search = document.getElementById("enemySearch");
    const attackFilter = document.getElementById("attackFilter");
    const difficulty = document.getElementById("difficultyFilter");
    const speed = document.getElementById("speedFilter");
    const health = document.getElementById("healthFilter");
    const size = document.getElementById("sizeFilter");
    const attacks = [...new Set(ENEMIES.map(enemy => enemy.attack))];
    attackFilter.innerHTML += attacks.map(attack => `<option>${attack}</option>`).join("");
    [search, attackFilter, difficulty, speed, health, size].filter(Boolean).forEach(input => {
      input.addEventListener("input", updateEnemies);
      input.addEventListener("change", updateEnemies);
    });
    updateEnemies();
  }

  function renderMerges() {
    const mergeGrid = document.getElementById("mergeGrid");
    const mergeLabUpgrade = document.getElementById("mergeLabUpgrade");
    const mergerTokens = save.currencies.merger || 0;
    if (mergerTokens < 10) {
      mergeLabUpgrade.innerHTML = `<p class="section-copy">Merge Lab locked · Merger tokens: ${mergerTokens} / 10</p>`;
    } else if (save.upgrades.autoDodge > 0) {
      mergeLabUpgrade.innerHTML = `<p class="section-copy">Merge Lab unlocked · Auto-dodge is installed. Toggle it in arena Settings.</p>`;
    } else {
      mergeLabUpgrade.innerHTML = `<p class="section-copy">Merge Lab unlocked · Select Auto-dodge in the upgrade tree to install it for 200 Chaser tokens.</p>`;
    }
    mergeLabUpgrade.onclick = null;
    const unlocked = recipe => save.unlockedZone > recipe.zone || save.zone > recipe.zone
      || (save.zone === recipe.zone && save.continueWave >= recipe.wave);
    document.getElementById("recipeCount").textContent = `${MERGES.filter(unlocked).length} / ${MERGES.length} recipes available`;
    mergeGrid.innerHTML = MERGES.map(recipe => {
      if (!unlocked(recipe)) return `<article class="merge-card merge-unknown"><span class="enemy-icon">?</span><div><h3>Locked recipe</h3><p>Reach Zone ${recipe.zone}, wave ${recipe.wave} to reveal this recipe.</p></div></article>`;
      const foundInputs = save.discovered.includes(recipe.a) && save.discovered.includes(recipe.b);
      const resultFound = save.discovered.includes(recipe.result);
      const first = ENEMY_BY_ID[recipe.a], second = ENEMY_BY_ID[recipe.b], result = ENEMY_BY_ID[recipe.result];
      if (!foundInputs) return `<article class="merge-card merge-unknown"><span class="enemy-icon">?</span><div><h3>Unknown recipe</h3><p>Encounter both ingredients in Zone ${recipe.zone} to reveal this recipe.</p></div></article>`;
      return `<article class="merge-card">
        <span class="enemy-icon" style="color:${resultFound ? result.color : "var(--muted)"}">${resultFound ? result.icon : "?"}</span>
        <div><h3>${first.name} + ${second.name} → ${resultFound ? result.name : "???"}</h3><p>${resultFound ? result.special : "The combined enemy is still undiscovered. Let both ingredients meet in the arena."}</p></div>
      </article>`;
    }).join("");
  }

  function updateEnemies() {
    const query = document.getElementById("enemySearch").value.trim().toLowerCase();
    const attack = document.getElementById("attackFilter").value;
    const difficulty = document.getElementById("difficultyFilter").value;
    const speed = document.getElementById("speedFilter").value;
    const maxHealth = Number(document.getElementById("healthFilter").value);
    const sizeFilter = document.getElementById("sizeFilter");
    const maxSize = sizeFilter ? Number(sizeFilter.value) : 100;
    document.getElementById("healthFilterValue").textContent = maxHealth >= 140 ? "140+" : `${maxHealth}`;
    if (document.getElementById("sizeFilterValue")) document.getElementById("sizeFilterValue").textContent = `${maxSize}+`;
    const discovered = ENEMIES.filter(enemy => save.discovered.includes(enemy.id));
    const matches = discovered.filter(enemy => {
      const text = `${enemy.name} ${enemy.attack} ${enemy.difficulty} ${enemy.description} ${enemy.special} ${enemy.tip}`.toLowerCase();
      return (!query || text.includes(query))
        && (!attack || enemy.attack === attack)
        && (!difficulty || enemy.difficulty === difficulty)
        && (!speed || enemySpeedName(enemy.speed) === speed)
        && enemy.hp <= maxHealth
        && enemy.size <= maxSize;
    });
    const unknown = ENEMIES.filter(enemy => !save.discovered.includes(enemy.id));
    document.getElementById("enemyCount").textContent = `${discovered.length} discovered · ${unknown.length} hidden`;
    document.getElementById("emptyEnemies").hidden = matches.length > 0 || unknown.length > 0;
    document.getElementById("enemyGrid").innerHTML = matches.map(enemy => {
      const healthWidth = Math.max(5, Math.min(100, enemy.hp / 1.4));
      const sizeWidth = Math.max(5, Math.min(100, enemy.size / 24 * 100));
      const reduction = enemy.reduction ? `<br><strong>Defense:</strong> exactly 75% damage reduction.` : "";
      return `<article class="enemy-card">
        <div class="enemy-top"><span class="enemy-icon" style="color:${enemy.color}">${enemy.icon}</span><div><h3>${enemy.name}</h3><p>Zone ${enemy.zone} · ${enemy.attack} · ${enemy.speedStat ? `${enemy.speedStat} speed` : enemySpeedName(enemy.speed)}</p></div><span class="difficulty">${enemy.difficulty}</span></div>
        <p class="enemy-description">${enemy.description}</p>
        <div class="enemy-stats">
          <div class="enemy-stat"><b>${enemy.hp} HP · ${enemy.damage} damage</b><div class="stat-bar"><i style="width:${healthWidth}%"></i></div></div>
          <div class="enemy-stat"><b>SIZE · ${enemy.size}</b><div class="stat-bar"><i style="width:${sizeWidth}%"></i></div></div>
        </div>
        <p class="enemy-tip"><strong>Ability:</strong> ${enemy.special}${reduction}<br><strong>Tip:</strong> ${enemy.tip}</p>
      </article>`;
    }).join("") + unknown.map(() => `<article class="enemy-card undiscovered"><div class="enemy-top"><span class="enemy-icon">?</span><div><h3>Undiscovered</h3><p>Encounter to reveal details</p></div><span class="difficulty">???</span></div><p class="enemy-description">This enemy's identity and abilities are hidden.</p><div class="enemy-stats"><div class="enemy-stat"><b>?? HP</b><div class="stat-bar"><i style="width:25%"></i></div></div><div class="enemy-stat"><b>SIZE · ??</b><div class="stat-bar"><i style="width:25%"></i></div></div></div><p class="enemy-tip">Find it in the arena to unlock its entry.</p></article>`).join("");
  }
  function enemySpeedName(speed) {
    return speed <= 2 ? "Slow" : speed <= 3 ? "Medium" : speed <= 5 ? "Fast" : "Very Fast";
  }

  function initGame() {
    const canvas = document.getElementById("arena");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      showStorageStatus("Canvas unavailable", true);
      console.error("Little Box could not create a 2D canvas context.");
      return;
    }
    const overlay = document.getElementById("gameOverlay");
    const overlayTitle = document.getElementById("overlayTitle");
    const overlayText = document.getElementById("overlayText");
    const overlayEyebrow = document.getElementById("overlayEyebrow");
    const overlayExtra = document.getElementById("overlayExtra");
    const overlayButtons = document.getElementById("overlayButtons");
    const autoDodgeSetting = document.getElementById("autoDodgeSetting");
    const autoDodgeToggle = document.getElementById("autoDodgeToggle");
    const player = { x: 400, y: 440, vx: 0, vy: 0, hp: 3, maxHp: 3, radius: 28, invulnerable: 0, dashTime: 0, dashCooldown: 0, pulseCooldown: 0, deflectionCooldown: 0, phaseCooldown: 0, slowCooldown: 0, shieldHits: 0, livesUsed: 0, slowTime: 0, slowedTime: 0, phaseTime: 0, poisonTime: 0, poisonTick: 0, touchTarget: null };
    const run = { state: "idle", wave: save.continueWave, zone: save.zone, paused: false, clock: 0, waveSpawns: [], transitionTimer: 0, enemies: [], shots: [], boss: null, bossAttack: 0, bossAttackStep: 0, bossTell: null, rapidShots: 0, rapidClock: 0, toastTimer: 0, rebind: null };
    const held = new Set();
    let lastFrame = 0;
    let animationId = 0;
    let skipPagehideSave = false;
    let testerMode = false;
    let testerCodeInput = "";
    let testerSpeedMultiplier = 1;

    function currentZone() { return ZONES.find(zone => zone.id === run.zone) || ZONES[0]; }
    function upgradeLevel(id) { return save.upgrades[id] || 0; }
    function syncAutoDodgeSetting() {
      autoDodgeSetting.hidden = upgradeLevel("autoDodge") <= 0;
      autoDodgeToggle.checked = save.autoDodgeEnabled && upgradeLevel("autoDodge") > 0;
    }
    function maxHealth() { return 3 + upgradeLevel("maxHealth"); }
    function addWaveSpawner(wave) {
      run.waveSpawns.push({
        wave,
        spawned: 0,
        total: 3 + wave * 2,
        spawnClock: 0.1,
        candidates: waveCandidates(run.zone, wave)
      });
    }
    function showOverlay(title, text, buttons, eyebrow = "LITTLE BOX", extra = null) {
      overlayTitle.textContent = title;
      overlayText.textContent = text;
      overlayEyebrow.textContent = eyebrow;
      overlayExtra.replaceChildren();
      if (extra) overlayExtra.append(extra);
      overlayButtons.replaceChildren();
      buttons.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `button ${item.secondary ? "button-secondary" : ""} ${item.danger ? "button-danger" : ""}`;
        button.textContent = item.label;
        button.addEventListener("click", item.action);
        overlayButtons.append(button);
      });
      overlay.classList.remove("fade-out");
      overlay.hidden = false;
    }
    function hideOverlay() { overlay.hidden = true; }
    function setStateLabel(text) { document.getElementById("arenaState").textContent = text; }
    function announce(text) {
      const toast = document.getElementById("toast");
      toast.textContent = text;
      toast.classList.add("show");
      run.toastTimer = 1.6;
    }
    function drawHud() {
      document.getElementById("waveLabel").textContent = `${run.zone} · ${run.wave} / 10`;
      const healthRatio = Math.max(0, player.hp / player.maxHp);
      document.getElementById("healthFill").style.width = `${healthRatio * 100}%`;
      document.getElementById("healthLabel").textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
      const elapsed = Math.floor(run.clock);
      document.getElementById("timerLabel").textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
      const bossHud = document.getElementById("bossHud");
      bossHud.hidden = !run.boss;
      if (run.boss) {
        const ratio = Math.max(0, run.boss.hp / run.boss.maxHp);
        document.getElementById("bossFill").style.width = `${ratio * 100}%`;
        document.getElementById("bossLabel").textContent = `${Math.ceil(run.boss.hp)} / ${run.boss.maxHp}`;
        bossHud.querySelector("span").textContent = currentZone().boss.toUpperCase();
      }
      const heading = document.getElementById("zoneHeading");
      heading.textContent = `ZONE ${String(run.zone).padStart(2, "0")} · ${currentZone().name.toUpperCase()}`;
      const abilityHud = document.getElementById("abilityHud");
      abilityHud.innerHTML = [
        ["skipWave", `Skip ${save.skipStreak}/3`, null], ["dash", "Dash", "dash"], ["slowMotion", "Slow", "slowMotion"],
        ["energyPulse", "Pulse", "energyPulse"], ["deflection", "Deflect", "deflection"], ["phaseShift", "Phase", "phaseShift"]
      ].filter(item => item[2] === null || upgradeLevel(item[2]) > 0)
        .map(item => `<span><kbd>${formatKey(save.keybinds[item[0]])}</kbd> ${item[1]}</span>`).join("") || "<span>Unlock abilities in the upgrade tree</span>";
      document.getElementById("skipKeyHint").textContent = formatKey(save.keybinds.skipWave);
    }
    function startWave(wave = run.wave, zone = run.zone, refill = false) {
      ensureAudio();
      run.zone = zone;
      save.zone = zone;
      run.wave = Math.max(1, Math.min(10, wave));
      run.state = "countdown";
      run.paused = false;
      document.getElementById("pauseButton").textContent = "Pause";
      run.clock = 0;
      run.countdown = 2.5;
      run.waveSpawns = [];
      if (run.wave < 10) addWaveSpawner(run.wave);
      run.enemies = [];
      run.shots = [];
      run.boss = null;
      run.bossTell = null;
      run.bossAttack = 1.2;
      run.bossAttackStep = 0;
      run.rapidShots = 0;
      player.maxHp = maxHealth();
      player.hp = refill || save.currentHp <= 0 ? player.maxHp : Math.min(player.maxHp, save.currentHp);
      player.x = 400;
      player.y = 440;
      player.vx = 0;
      player.vy = 0;
      player.invulnerable = 0;
      player.dashTime = 0;
      player.dashCooldown = 0;
      player.pulseCooldown = 0;
      player.deflectionCooldown = 0;
      player.phaseCooldown = 0;
      player.slowCooldown = 0;
      player.shieldHits = upgradeLevel("shield");
      player.livesUsed = 0;
      player.slowTime = 0;
      player.slowedTime = 0;
      player.phaseTime = 0;
      player.poisonTime = 0;
      player.poisonTick = 0;
      save.currentHp = player.hp;
      save.continueWave = run.wave;
      persist();
      setMusicForWave(run.wave);
      setStateLabel("GET READY");
      drawHud();
      hideOverlay();
    }
    function showPauseMenu() {
      const buttons = [
        { label: "Resume", action: resumeGame },
        { label: "How to Play", action: () => showHowToPlay(showPauseMenu), secondary: true },
        { label: "Restart wave", action: () => startWave(run.wave, run.zone), secondary: true },
        { label: "Main menu", action: mainMenu, secondary: true }
      ];
      if (testerMode) buttons.splice(3, 0, { label: "Tester Tools", action: () => showTesterTools(showPauseMenu), secondary: true });
      showOverlay("Paused", "Everything is still. Take a breath before going back in.", buttons, "PAUSE MENU");
    }
    function pauseGame() {
      if (["idle", "victory", "defeat"].includes(run.state) || run.paused) return;
      run.paused = true;
      setStateLabel("PAUSED");
      document.getElementById("pauseButton").textContent = "Resume";
      showPauseMenu();
    }
    function resumeGame() {
      ensureAudio();
      run.paused = false;
      hideOverlay();
      setStateLabel(run.state === "boss" ? "BOSS FIGHT" : "SURVIVE");
      document.getElementById("pauseButton").textContent = "Pause";
    }
    function addVolumeControls(container) {
      const row = document.createElement("div");
      row.className = "settings-row overlay-settings";
      [["Music", "musicVolume", save.musicVolume], ["Effects", "soundVolume", save.soundVolume]].forEach(item => {
        const label = document.createElement("label");
        label.textContent = `${item[0]} `;
        const input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = "100";
        input.value = String(item[2]);
        input.addEventListener("input", () => setVolume(item[1], input.value));
        label.append(input);
        row.append(label);
      });
      const muteLabel = document.createElement("label");
      muteLabel.className = "mute-setting";
      const mute = document.createElement("input");
      mute.type = "checkbox";
      mute.checked = save.muted;
      mute.addEventListener("change", () => setMute(mute.checked));
      muteLabel.append(mute, document.createTextNode(" Mute all"));
      row.append(muteLabel);
      if (upgradeLevel("autoDodge") > 0) {
        const autoDodgeLabel = document.createElement("label");
        autoDodgeLabel.className = "mute-setting";
        const autoDodge = document.createElement("input");
        autoDodge.type = "checkbox";
        autoDodge.id = "autoDodgeOverlayToggle";
        autoDodge.checked = save.autoDodgeEnabled;
        autoDodge.addEventListener("change", () => {
          save.autoDodgeEnabled = autoDodge.checked;
          autoDodgeToggle.checked = autoDodge.checked;
          persist();
        });
        autoDodgeLabel.append(autoDodge, document.createTextNode(" Auto-dodge"));
        row.append(autoDodgeLabel);
      }
      container.append(row);
    }
    function menuSection(title, text, eyebrow = "GAME GUIDE") {
      const extra = document.createElement("div");
      extra.className = "guide-copy";
      extra.textContent = text;
      showOverlay(title, "", [{ label: "Back to menu", action: mainMenu, secondary: true }], eyebrow, extra);
    }
    function showHowToPlay(backAction) {
      const extra = document.createElement("div");
      extra.className = "guide-copy";
      extra.textContent = `Move with WASD or the arrow keys; on touch screens, drag inside the arena. Stot moves quickly toward your spawn-time position, never shoots, and exits shortly after arrival. Merger appears in Zone 3 Wave 5 and wanders; touching it triggers the nearest compatible merge. Merge Repulser also triggers merges on contact. Five Stot tokens buy an extra heart. Collect 10 Merger tokens to unlock the Merge Lab, then spend 200 Chaser tokens to unlock Auto-dodge. Toggle Auto-dodge in Settings & audio to turn its threat avoidance off or on. Dodge other contact attacks, warning lines, blasts, and enemy projectiles. Survive ten waves per zone; older enemy types stay in the spawn pool as you progress. Use ${formatKey(save.keybinds.dash)} to dash; ${formatKey(save.keybinds.slowMotion)} slows time, ${formatKey(save.keybinds.energyPulse)} pulses nearby threats, ${formatKey(save.keybinds.deflection)} deflects projectiles, and ${formatKey(save.keybinds.phaseShift)} activates phase shift when each ability is unlocked. Press ${formatKey(save.keybinds.skipWave)} during a regular wave to start the next wave without removing the current wave's enemies or spawns; up to three waves can overlap. A full clear resets the skip limit. Boss waves cannot be skipped. Press ${formatKey(save.keybinds.pause)} or the Pause button to pause; the game also pauses when you leave the tab. Bosses are only damaged by their own projectiles after a shot misses you, bounces off the arena wall, and hits the boss. The shop contains upgrades, the discovered-enemy index, and merge recipes. Health, tokens, upgrades, discoveries, settings, and progress are saved in this browser; use Save code settings to back them up or transfer them.`;
      showOverlay("How to Play", "", [{ label: "Back", action: backAction, secondary: true }], "GAME GUIDE", extra);
    }
    function showTesterTools(backAction) {
      if (!testerMode) return backAction();
      showOverlay("Tester Tools", "Tester access and the speed boost last only for this session; progress and upgrades use normal saving.", [
        { label: "Clear current waves", action: () => {
          if (["idle", "victory", "defeat"].includes(run.state)) {
            announce("Start a wave before clearing it");
            backAction();
            return;
          }
          run.waveSpawns = [];
          run.enemies = [];
          run.shots = [];
          run.paused = false;
          document.getElementById("pauseButton").textContent = "Pause";
          if (run.boss || run.wave >= 10) {
            run.boss = null;
            winBoss();
            return;
          }
          completeWave();
          if (backAction === showPauseMenu) {
            run.paused = true;
            document.getElementById("pauseButton").textContent = "Resume";
          }
          backAction();
        } },
        { label: "Full HP + 1.5x speed", action: () => {
          testerSpeedMultiplier = 1.5;
          player.maxHp = maxHealth();
          player.hp = player.maxHp;
          save.currentHp = player.hp;
          persist();
          drawHud();
          announce("Tester stats applied");
          backAction();
        }, secondary: true },
        { label: "Buy all upgrades", action: () => {
          UPGRADES.forEach(upgrade => { save.upgrades[upgrade.id] = upgrade.id === "autoDodge" ? 1 : 5; });
          player.maxHp = maxHealth();
          player.hp = Math.min(player.hp, player.maxHp);
          save.currentHp = player.hp;
          syncAutoDodgeSetting();
          persist();
          drawHud();
          announce("All upgrades unlocked");
          backAction();
        }, secondary: true },
        { label: "Spawn all enemy types", action: () => {
          const wasIdle = run.state === "idle";
          if (wasIdle) startWave(save.continueWave, save.zone, true);
          ENEMIES.filter(enemy => !enemy.id.startsWith("boss")).forEach(enemy => spawnEnemy(enemy.id));
          announce("Spawned all non-boss enemy types");
          if (wasIdle) hideOverlay();
          else backAction();
        }, secondary: true },
        { label: "Reveal all question marks", action: () => {
          save.discovered = ENEMIES.map(enemy => enemy.id);
          renderMergesIfShop();
          persist();
          announce("All discoveries revealed");
          backAction();
        }, secondary: true },
        { label: "Back", action: backAction, secondary: true }
      ], "TESTER MODE");
    }
    function openKeybindSettings() {
      drawHud();
      const extra = document.createElement("div");
      extra.className = "keybind-list";
      const labels = { pause: "Pause / resume", dash: "Dash", slowMotion: "Slow motion", energyPulse: "Energy pulse", deflection: "Projectile deflection", phaseShift: "Phase shift", skipWave: "Skip regular wave (max 3 in a row)" };
      Object.keys(labels).forEach(id => {
        const row = document.createElement("div");
        row.className = "keybind-row";
        const label = document.createElement("span");
        label.textContent = labels[id];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "button button-secondary";
        button.textContent = formatKey(save.keybinds[id]);
        button.addEventListener("click", () => {
          run.rebind = { id, button };
          button.textContent = "Press a key…";
        });
        row.append(label, button);
        extra.append(row);
      });
      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "button button-secondary keybind-reset";
      reset.textContent = "Reset to defaults";
      reset.addEventListener("click", () => {
        save.keybinds = { ...defaultKeybinds };
        persist();
        openKeybindSettings();
      });
      extra.append(reset);
      showOverlay("Keybind settings", "Select an action, then press a key. Each action uses a distinct key. Clear a wave to reset the three-skip limit; bosses cannot be skipped.", [
        { label: "Back to menu", action: mainMenu, secondary: true }
      ], "CONTROLS", extra);
    }
    function formatKey(key) { return key === " " ? "SPACE" : key.length === 1 ? key.toUpperCase() : key.toUpperCase(); }
    function mainMenu() {
      run.state = "idle";
      run.paused = false;
      run.enemies = [];
      run.shots = [];
      run.boss = null;
      setMusicForWave(0);
      syncAutoDodgeSetting();
      setStateLabel("READY");
      document.getElementById("pauseButton").textContent = "Pause";
      const buttons = [
        { label: "Play", action: () => {
          overlay.classList.add("fade-out");
          window.setTimeout(() => startWave(save.continueWave, save.zone, save.currentHp <= 0), 280);
        } },
        { label: "How to Play", action: () => showHowToPlay(mainMenu) },
        { label: "Index", action: () => { window.location.href = "shop.html#enemy-index"; }, secondary: true },
        { label: "Upgrade Tree", action: () => { window.location.href = "shop.html#upgrade-tree"; }, secondary: true },
        { label: "Keybind Settings", action: openKeybindSettings, secondary: true },
        { label: "Settings & sound", action: () => {
          const extra = document.createElement("div");
          addVolumeControls(extra);
          showOverlay("Settings & sound", "Toggle Auto-dodge here after unlocking it in the Merge Lab. Music intensity rises with the wave and calms in the shop.", [{ label: "Back to menu", action: mainMenu, secondary: true }], "SETTINGS", extra);
        }, secondary: true },
        { label: "Credits", action: () => menuSection("Credits", "Music and sound effects: original synthesized tones created in your browser. Images and visual assets: original canvas-drawn shapes. External libraries and APIs: none. Audio uses the browser Web Audio API; progress uses local storage.", "MADE FOR THE BOX"), secondary: true }
      ];
      if (testerMode) buttons.splice(2, 0, { label: "Tester Tools", action: () => showTesterTools(mainMenu), secondary: true });
      showOverlay("Ready when you are.", `Zone ${run.zone}, wave ${save.continueWave} is next. Your current ${Math.ceil(save.currentHp)} HP carries forward.`, buttons, "A SMALL BOX. A BIG PROBLEM.");
    }
    function openShop() { window.location.href = "shop.html#upgrade-tree"; }
    function completeWave() {
      if (run.wave >= 10) return;
      save.continueWave = run.wave + 1;
      save.currentHp = player.hp;
      save.skipStreak = 0;
      persist();
      run.state = "transition";
      run.transitionTimer = 1.7;
      setMusicForWave(0);
      setStateLabel("WAVE CLEAR");
      drawHud();
      announce(`Wave ${run.wave} clear · next wave soon`);
      playTone(620, 0.2);
    }
    function skipWave() {
      if (run.state !== "active" || run.wave >= 10 || run.paused) return;
      if (save.skipStreak >= 3) {
        announce("Clear a wave before skipping again");
        return;
      }
      save.skipStreak++;
      run.wave++;
      save.continueWave = run.wave;
      save.currentHp = player.hp;
      persist();
      if (run.wave < 10) addWaveSpawner(run.wave);
      else startBoss();
      if (run.wave < 10) {
        setMusicForWave(run.wave);
        setStateLabel(`WAVE ${run.wave} STACKED`);
      }
      drawHud();
      announce(`Wave ${run.wave - 1} skipped · ${run.waveSpawns.length} waves overlapping · ${save.skipStreak}/3`);
    }
    function winBoss() {
      const clearedZone = run.zone;
      run.state = "victory";
      run.boss = null;
      run.shots = [];
      run.enemies = [];
      save.currencies[`boss${clearedZone}`] += 25;
      save.currentHp = player.hp;
      save.skipStreak = 0;
      if (clearedZone < ZONES.length) {
        save.unlockedZone = Math.max(save.unlockedZone, clearedZone + 1);
        save.zone = clearedZone + 1;
        save.continueWave = 1;
      } else {
        save.continueWave = 1;
      }
      persist();
      setMusicForWave(0);
      setStateLabel("BOSS DEFEATED");
      playTone(880, 0.35, "triangle");
      if (clearedZone < ZONES.length) {
        showOverlay("The boss hit itself.", `+25 Zone ${clearedZone} boss tokens. ${ZONES[clearedZone].name} is unlocked; your HP and upgrades are preserved.`, [
          { label: "Enter next zone", action: () => startWave(1, clearedZone + 1) },
          { label: "Open upgrade tree", action: openShop, secondary: true },
          { label: "Continue automatically", action: () => { hideOverlay(); run.state = "transition"; run.transitionTimer = 3; }, secondary: true }
        ], "ZONE CLEAR");
        run.state = "transition";
        run.transitionTimer = 8;
      } else {
        showOverlay("You escaped the final reflection.", "All five zones and fifty waves are complete. Your discoveries and progress are saved.", [
          { label: "Open upgrade tree", action: openShop },
          { label: "Return to main menu", action: mainMenu, secondary: true }
        ], "VICTORY");
      }
    }
    function loseGame() {
      run.state = "defeat";
      run.shots = [];
      setMusicForWave(0);
      setStateLabel("RUN OVER");
      playTone(150, 0.35, "sawtooth");
      showOverlay("The box wins this round.", `You reached Zone ${run.zone}, wave ${run.wave}. Tokens, discoveries, and upgrades are safe.`, [
        { label: "Retry wave", action: () => startWave(run.wave, run.zone, true) },
        { label: "Upgrade tree", action: openShop, secondary: true },
        { label: "Main menu", action: mainMenu, secondary: true }
      ], "TRY AGAIN");
    }
    function discoverEnemy(id) {
      if (save.discovered.includes(id)) return;
      const enemy = ENEMY_BY_ID[id];
      if (!enemy) return;
      save.discovered.push(id);
      persist();
      const notice = document.getElementById("discoveryToast");
      notice.innerHTML = `<span class="enemy-icon" style="color:${enemy.color}">${enemy.icon}</span><span><b>New discovery</b><br>${enemy.name} · Open index</span>`;
      notice.hidden = false;
      window.clearTimeout(notice.hideTimer);
      notice.hideTimer = window.setTimeout(() => { notice.hidden = true; }, 3000);
      renderMergesIfShop();
    }
    function renderMergesIfShop() {
      const grid = document.getElementById("mergeGrid");
      if (grid) renderMerges();
    }
    function fire(x, y, tx, ty, speed, color, options = {}) {
      const dx = tx - x;
      const dy = ty - y;
      const length = Math.hypot(dx, dy) || 1;
      run.shots.push({
        x, y, vx: dx / length * speed, vy: dy / length * speed,
        radius: options.radius || 5, color, bossShot: Boolean(options.bossShot),
        bounces: options.bounces || 0, bounced: 0, damage: options.damage || 1,
        bossDamage: options.bossDamage || 10, effect: options.effect || "",
        age: 0, distance: 0, source: options.source || "enemy"
      });
    }
    function spawnEnemy(id, mini = false) {
      const data = ENEMY_BY_ID[id];
      if (!data) return;
      const side = Math.floor(Math.random() * 4);
      let x = 25 + Math.random() * 750, y = 25 + Math.random() * 750;
      if (side === 0) y = 20;
      if (side === 1) x = 780;
      if (side === 2) y = 780;
      if (side === 3) x = 20;
      const zone = currentZone();
      const waveFactor = 1 + (run.wave - 1) * 0.025;
      const enemy = {
        id, x, y, vx: 0, vy: 0, age: 0, radius: mini ? 7 : data.size,
        speed: data.speed * 16 * zone.speed * waveFactor,
        health: mini ? 1 : Math.ceil(data.hp * zone.hp), maxHealth: mini ? 1 : Math.ceil(data.hp * zone.hp),
        mini, rewardId: id, chargeIn: 1.2 + Math.random() * 1.1, charging: 0,
        aim: 0, marked: null, fireIn: 1 + Math.random(), splitIn: 4.5,
        explode: 0, leaving: false, leaveTimer: 6.5 + Math.random() * 2.2,
        radialAngle: Math.random() * Math.PI * 2, color: data.color, telegraph: 0,
        shieldTime: 0, phantomTime: 0, pulseIn: 2.2, summonIn: 3.2, slowTimer: 0,
        pulsePush: true, splitReady: !mini, merged: false
      };
      if (data.pattern === "stot") enemy.stotTarget = { x: player.x, y: player.y };
      if (data.pattern === "merger") enemy.wanderTarget = { x: 55 + Math.random() * 690, y: 55 + Math.random() * 690 };
      if (data.pattern === "bounce") {
        enemy.vx = (Math.random() < 0.5 ? -1 : 1) * enemy.speed;
        enemy.vy = (Math.random() * 2 - 1) * enemy.speed;
      }
      if (data.pattern === "mine") {
        const angle = Math.random() * Math.PI * 2;
        const driftSpeed = Math.max(18, enemy.speed * 0.35);
        enemy.vx = Math.cos(angle) * driftSpeed;
        enemy.vy = Math.sin(angle) * driftSpeed;
        enemy.wanderTarget = { x: 55 + Math.random() * 690, y: 55 + Math.random() * 690 };
      }
      run.enemies.push(enemy);
      discoverEnemy(id);
    }
    function startBoss() {
      const zone = currentZone();
      const bossData = { id: `boss${zone.id}`, name: zone.boss, icon: "⬡", color: zone.color, zone: zone.id, hp: zone.bossHp, speed: 35 };
      const boss = { x: 400, y: 230, radius: 43, hp: bossData.hp, maxHp: bossData.hp, color: bossData.color, age: 0 };
      run.boss = boss;
      run.state = "boss";
      run.bossAttack = 0.8;
      run.bossAttackStep = 0;
      setMusicForWave(10);
      setStateLabel("BOSS FIGHT");
      discoverBoss(bossData);
      announce(`${zone.boss} entered the box`);
      drawHud();
    }
    function discoverBoss(boss) { discoverEnemy(boss.id); }
    function rewardEnemy(enemy) {
      if (enemy.rewarded) return;
      enemy.rewarded = true;
      const currency = enemy.rewardId || enemy.id;
      if (!Object.prototype.hasOwnProperty.call(save.currencies, currency)) save.currencies[currency] = 0;
      save.currencies[currency] += 1;
      persist();
      announce(`+1 ${ENEMY_BY_ID[currency] ? ENEMY_BY_ID[currency].name : currency} token`);
      playTone(530, 0.08);
    }
    function escapeEnemy(enemy) {
      if (enemy.escaped) return;
      enemy.escaped = true;
      rewardEnemy(enemy);
    }
    function beginLeaving(enemy) {
      if (enemy.leaving) return;
      enemy.leaving = true;
      enemy.charging = 0;
      enemy.marked = null;
      enemy.exitTarget = [
        { x: 400, y: -70 }, { x: 870, y: 400 }, { x: 400, y: 870 }, { x: -70, y: 400 }
      ].sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0];
    }
    function damagePlayer(amount = 1) {
      if (player.invulnerable > 0 || player.phaseTime > 0 || ["idle", "defeat", "victory"].includes(run.state)) return false;
      if (player.shieldHits > 0) {
        player.shieldHits -= 1;
        player.invulnerable = 0.7;
        announce("One-hit shield blocked a hit");
        playTone(740, 0.12);
        return false;
      }
      const reduction = Math.min(0.25, upgradeLevel("damageReduction") * 0.05);
      player.hp -= amount * (1 - reduction);
      player.invulnerable = 0.85;
      save.currentHp = Math.max(0, player.hp);
      persist();
      playTone(190, 0.12, "square");
      if (player.hp <= 0) {
        if (player.livesUsed < (upgradeLevel("extraLife") > 0 ? 1 : 0)) {
          player.livesUsed++;
          player.hp = Math.min(player.maxHp, upgradeLevel("extraLife"));
          player.invulnerable = 1.8;
          save.currentHp = player.hp;
          announce("Second chance used");
        } else {
          player.hp = 0;
          save.currentHp = 0;
          drawHud();
          loseGame();
          return true;
        }
      }
      return true;
    }
    function abilityAvailable() {
      return !["idle", "transition", "intermission", "victory", "defeat"].includes(run.state) && !run.paused;
    }
    function useAbility(action) {
      if (!abilityAvailable()) return;
      if (action === "dash" && upgradeLevel("dash") > 0 && player.dashCooldown <= 0) {
        let dx = (held.has("arrowright") || held.has("d") ? 1 : 0) - (held.has("arrowleft") || held.has("a") ? 1 : 0);
        let dy = (held.has("arrowdown") || held.has("s") ? 1 : 0) - (held.has("arrowup") || held.has("w") ? 1 : 0);
        if (!dx && !dy) { dx = player.vx; dy = player.vy; }
        if (!dx && !dy) dx = 1;
        const length = Math.hypot(dx, dy) || 1;
        player.vx = dx / length * 720;
        player.vy = dy / length * 720;
        player.dashTime = 0.2 + upgradeLevel("dash") * 0.03;
        player.dashCooldown = Math.max(0.8, 3 - upgradeLevel("dashCooldown") * 0.4);
        player.invulnerable = Math.max(player.invulnerable, player.dashTime);
        playTone(390, 0.1, "triangle");
      } else if (action === "slowMotion" && upgradeLevel(action) && player.slowCooldown <= 0) {
        player.slowTime = 2.4 + (upgradeLevel("slowMotion") - 1) * 0.4;
        player.slowCooldown = 6;
        announce("Slow motion");
      } else if (action === "energyPulse" && upgradeLevel(action) && player.pulseCooldown <= 0) {
        player.pulseCooldown = 4;
        const radius = 150 + upgradeLevel("energyPulse") * 12;
        run.enemies.forEach(enemy => {
          const dx = enemy.x - player.x, dy = enemy.y - player.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < radius) { enemy.vx += dx / distance * (260 + upgradeLevel("energyPulse") * 20); enemy.vy += dy / distance * (260 + upgradeLevel("energyPulse") * 20); }
        });
        run.shots.forEach(shot => {
          const dx = shot.x - player.x, dy = shot.y - player.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < radius) { shot.vx += dx / distance * (190 + upgradeLevel("energyPulse") * 15); shot.vy += dy / distance * (190 + upgradeLevel("energyPulse") * 15); }
        });
        announce("Energy pulse");
        playTone(260, 0.18, "triangle");
      } else if (action === "deflection" && upgradeLevel(action) && player.deflectionCooldown <= 0) {
        player.deflectionCooldown = 4;
        const radius = 115 + upgradeLevel("deflection") * 18;
        run.shots.forEach(shot => {
          if (Math.hypot(shot.x - player.x, shot.y - player.y) > radius) return;
          const target = run.boss || { x: player.x - shot.vx, y: player.y - shot.vy };
          const dx = target.x - shot.x, dy = target.y - shot.y;
          const distance = Math.hypot(dx, dy) || 1;
          const speed = Math.max(320, Math.hypot(shot.vx, shot.vy));
          shot.vx = dx / distance * speed;
          shot.vy = dy / distance * speed;
          shot.bossShot = shot.bossShot && Boolean(run.boss);
          shot.bounces = Math.max(shot.bounces, 1);
          shot.bounced = 0;
        });
        announce("Nearby projectiles redirected");
        playTone(570, 0.14, "triangle");
      } else if (action === "phaseShift" && upgradeLevel(action) && player.phaseCooldown <= 0) {
        player.phaseTime = 0.85 + (upgradeLevel("phaseShift") - 1) * 0.12;
        player.phaseCooldown = 5;
        player.invulnerable = Math.max(player.invulnerable, player.phaseTime);
        announce("Phase shift");
        playTone(820, 0.12);
      }
    }
    function updatePlayer(dt) {
      const accel = 1100;
      const maxSpeed = 270 * (1 + upgradeLevel("movementSpeed") * 0.06) * testerSpeedMultiplier * (player.slowedTime > 0 ? 0.55 : 1);
      let dx = (held.has("arrowright") || held.has("d") ? 1 : 0) - (held.has("arrowleft") || held.has("a") ? 1 : 0);
      let dy = (held.has("arrowdown") || held.has("s") ? 1 : 0) - (held.has("arrowup") || held.has("w") ? 1 : 0);
      if (!dx && !dy && player.touchTarget) {
        const tx = player.touchTarget.x - player.x, ty = player.touchTarget.y - player.y;
        const distance = Math.hypot(tx, ty);
        if (distance > 8) { dx = tx / distance; dy = ty / distance; }
      }
      if (upgradeLevel("autoDodge") > 0 && save.autoDodgeEnabled) {
        let avoidX = 0, avoidY = 0;
        run.enemies.forEach(enemy => {
          if (enemy.leaving) return;
          const awayX = player.x - enemy.x, awayY = player.y - enemy.y;
          const distance = Math.hypot(awayX, awayY) || 1;
          const range = player.radius + enemy.radius + 78;
          if (distance < range) {
            const weight = (range - distance) / range;
            avoidX += awayX / distance * weight;
            avoidY += awayY / distance * weight;
          }
        });
        run.shots.forEach(shot => {
          const speedSquared = shot.vx * shot.vx + shot.vy * shot.vy;
          const time = speedSquared ? Math.max(0, Math.min(0.55,
            ((player.x - shot.x) * shot.vx + (player.y - shot.y) * shot.vy) / speedSquared)) : 0;
          const closestX = shot.x + shot.vx * time, closestY = shot.y + shot.vy * time;
          let awayX = player.x - closestX, awayY = player.y - closestY;
          let distance = Math.hypot(awayX, awayY);
          const range = player.radius + shot.radius + 65;
          if (distance < range) {
            if (distance < 1) {
              awayX = -shot.vy;
              awayY = shot.vx;
              if ((awayX * player.vx + awayY * player.vy) < 0) { awayX *= -1; awayY *= -1; }
              distance = Math.hypot(awayX, awayY) || 1;
            }
            const weight = (range - distance) / range;
            avoidX += awayX / distance * weight;
            avoidY += awayY / distance * weight;
          }
        });
        dx += avoidX * 1.5;
        dy += avoidY * 1.5;
      }
      const length = Math.hypot(dx, dy);
      if (length) { dx /= length; dy /= length; }
      if (player.dashTime > 0) player.dashTime -= dt;
      else {
        player.vx += dx * accel * dt;
        player.vy += dy * accel * dt;
        const friction = Math.exp(-7 * dt);
        player.vx *= friction;
        player.vy *= friction;
        const speed = Math.hypot(player.vx, player.vy);
        if (speed > maxSpeed) { player.vx = player.vx / speed * maxSpeed; player.vy = player.vy / speed * maxSpeed; }
      }
      player.x = Math.max(player.radius + 4, Math.min(796 - player.radius, player.x + player.vx * dt));
      player.y = Math.max(player.radius + 4, Math.min(796 - player.radius, player.y + player.vy * dt));
      player.invulnerable = Math.max(0, player.invulnerable - dt);
      player.dashCooldown = Math.max(0, player.dashCooldown - dt);
      player.pulseCooldown = Math.max(0, player.pulseCooldown - dt);
      player.deflectionCooldown = Math.max(0, player.deflectionCooldown - dt);
      player.phaseCooldown = Math.max(0, player.phaseCooldown - dt);
      player.slowCooldown = Math.max(0, player.slowCooldown - dt);
      player.phaseTime = Math.max(0, player.phaseTime - dt);
      player.slowTime = Math.max(0, player.slowTime - dt);
      player.slowedTime = Math.max(0, player.slowedTime - dt);
      if (player.poisonTime > 0) {
        player.poisonTime -= dt;
        player.poisonTick -= dt;
        if (player.poisonTick <= 0 && player.poisonTime > 0) {
          damagePlayer(1);
          player.poisonTick = 1;
        }
      }
      if ((run.state === "active" || run.state === "boss") && upgradeLevel("regeneration") > 0) {
        player.hp = Math.min(player.maxHp, player.hp + 0.15 * upgradeLevel("regeneration") * dt);
        save.currentHp = player.hp;
      }
    }
    function moveToward(enemy, tx, ty, speed, dt) {
      const dx = tx - enemy.x, dy = ty - enemy.y;
      const length = Math.hypot(dx, dy) || 1;
      enemy.vx += (dx / length * speed - enemy.vx) * Math.min(1, dt * 3.2);
      enemy.vy += (dy / length * speed - enemy.vy) * Math.min(1, dt * 3.2);
    }
    function throwShot(enemy, effect = "", speed = 180, damage = 1) {
      fire(enemy.x, enemy.y, player.x, player.y, speed, enemy.color, { damage, effect, radius: 5 });
    }
    function splitEnemy(enemy) {
      if (!enemy.splitReady) return;
      enemy.splitReady = false;
      const at = run.enemies.indexOf(enemy);
      if (at >= 0) run.enemies.splice(at, 1);
      for (let child = 0; child < 2; child++) {
        const mini = { ...enemy, x: enemy.x + (child ? 15 : -15), y: enemy.y + (child ? 10 : -10), vx: child ? 55 : -55, vy: 35, age: 0, radius: 7, health: 1, maxHealth: 1, mini: true, leaveTimer: 5.5, splitReady: false, leaving: false, escaped: false, explode: 0, rewardId: "splitter", id: "splitter" };
        run.enemies.push(mini);
      }
      announce("Splitter divided into two 1 HP children");
    }
    function pulsePlayer(enemy, push) {
      const dx = player.x - enemy.x, dy = player.y - enemy.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > 190) return;
      const force = (push ? 1 : -1) * (1 - distance / 220) * 260;
      player.vx += dx / distance * force;
      player.vy += dy / distance * force;
    }
    function updateEnemy(enemy, dt) {
      enemy.age += dt;
      enemy.fireIn -= dt;
      enemy.pulseIn -= dt;
      const data = ENEMY_BY_ID[enemy.id];
      const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      const slow = player.slowTime > 0 ? 0.42 : 1;
      const stotReadyToLeave = data.pattern === "stot" && enemy.stotArrived && enemy.age - enemy.stotArrivedAt > 0.55;
      if (!enemy.leaving && (enemy.age > enemy.leaveTimer || stotReadyToLeave)) beginLeaving(enemy);
      if (enemy.leaving) {
        moveToward(enemy, enemy.exitTarget.x, enemy.exitTarget.y, Math.max(120, enemy.speed * 1.8), dt * slow);
      } else if (data.pattern === "stot") {
        const dx = enemy.stotTarget.x - enemy.x, dy = enemy.stotTarget.y - enemy.y;
        const length = Math.hypot(dx, dy);
        const step = enemy.speed * dt * slow;
        if (length <= step) {
          enemy.x = enemy.stotTarget.x;
          enemy.y = enemy.stotTarget.y;
          enemy.vx = 0;
          enemy.vy = 0;
          if (!enemy.stotArrived) {
            enemy.stotArrived = true;
            enemy.stotArrivedAt = enemy.age;
          }
        } else {
          enemy.vx = dx / length * enemy.speed;
          enemy.vy = dy / length * enemy.speed;
          enemy.x += enemy.vx * dt * slow;
          enemy.y += enemy.vy * dt * slow;
        }
      } else if (data.pattern === "merger") {
        if (Math.hypot(enemy.wanderTarget.x - enemy.x, enemy.wanderTarget.y - enemy.y) < 24) {
          enemy.wanderTarget = { x: 55 + Math.random() * 690, y: 55 + Math.random() * 690 };
        }
        moveToward(enemy, enemy.wanderTarget.x, enemy.wanderTarget.y, enemy.speed, dt * slow);
      } else if (["chase", "explode", "split", "leech"].includes(data.pattern)) {
        moveToward(enemy, player.x, player.y, enemy.speed, dt * slow);
        if (data.pattern === "explode") {
          if (distance < 84 && enemy.explode <= 0) enemy.explode = 0.72;
          if (enemy.explode > 0) {
            enemy.explode -= dt;
            if (enemy.explode <= 0) {
              if (distance < 105) damagePlayer(1);
              beginLeaving(enemy);
            }
          }
        }
        if (data.pattern === "split" && enemy.splitReady && enemy.age > enemy.splitIn) {
          splitEnemy(enemy);
          return;
        }
        if (data.pattern === "leech" && distance < player.radius + enemy.radius + 4 && enemy.leechCooldown <= 0) {
          damagePlayer(1);
          enemy.health = Math.min(enemy.maxHealth, enemy.health + 2);
          enemy.leechCooldown = 2;
        }
      } else if (data.pattern === "bounce") {
        if (Math.hypot(enemy.vx, enemy.vy) < 1) enemy.vx = Math.max(80, enemy.speed);
        const nextX = enemy.x + enemy.vx * dt * slow;
        const nextY = enemy.y + enemy.vy * dt * slow;
        if (nextX < 6 || nextX > 794) enemy.vx *= -1;
        if (nextY < 6 || nextY > 794) enemy.vy *= -1;
      } else if (["charge", "explosiveCharge"].includes(data.pattern)) {
        if (enemy.charging > 0) {
          enemy.x += enemy.vx * dt * slow;
          enemy.y += enemy.vy * dt * slow;
          enemy.charging -= dt * slow;
          if (enemy.charging <= 0) {
            enemy.charging = 0;
            enemy.vx = 0;
            enemy.vy = 0;
          }
          if (enemy.charging <= 0 && data.pattern === "explosiveCharge") enemy.explode = 0.55;
        } else if (enemy.chargeIn <= 0) {
          enemy.marked = { x: player.x, y: player.y };
          const dx = enemy.marked.x - enemy.x, dy = enemy.marked.y - enemy.y;
          const length = Math.hypot(dx, dy) || 1;
          const dashSpeed = enemy.speed * 3.5;
          const dashDistance = Math.hypot(dx, dy) + player.radius * 2;
          enemy.vx = dx / length * dashSpeed;
          enemy.vy = dy / length * dashSpeed;
          enemy.charging = dashDistance / dashSpeed;
          enemy.chargeIn = 2.4;
        } else {
          enemy.chargeIn -= dt;
          moveToward(enemy, player.x, player.y, enemy.speed * 0.32, dt * slow);
        }
        if (enemy.explode > 0) {
          enemy.explode -= dt;
          if (enemy.explode <= 0) {
            if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < 92) damagePlayer(1);
            beginLeaving(enemy);
          }
        }
      } else if (data.pattern === "spin" || data.pattern === "toxicSpin" || data.pattern === "vortex") {
        const angle = enemy.age * (data.pattern === "vortex" ? -0.5 : 0.65);
        const tx = 400 + Math.cos(angle) * 190, ty = 400 + Math.sin(angle) * 190;
        moveToward(enemy, tx, ty, Math.max(enemy.speed, 115), dt * slow);
        if (data.pattern === "vortex" && distance < 240) {
          const dx = player.x - enemy.x, dy = player.y - enemy.y, length = distance || 1;
          player.vx -= dx / length * 85 * dt;
          player.vy -= dy / length * 85 * dt;
        }
        if (enemy.fireIn <= 0) {
          const count = data.pattern === "vortex" ? 10 : 8;
          for (let i = 0; i < count; i++) {
            const theta = enemy.radialAngle + Math.PI * 2 * i / count;
            fire(enemy.x, enemy.y, enemy.x + Math.cos(theta) * 100, enemy.y + Math.sin(theta) * 100, 145, enemy.color, { radius: 4, effect: data.pattern === "toxicSpin" ? "poison" : "" });
          }
          enemy.radialAngle += 0.22;
          enemy.fireIn = 2.8;
        }
      } else if (["shoot", "stot", "freezer", "poison", "echo", "prism", "lattice", "snipe", "snipeSlow"].includes(data.pattern)) {
        moveToward(enemy, player.x + Math.sign(enemy.x - player.x) * 120, player.y + Math.sign(enemy.y - player.y) * 120, Math.max(60, enemy.speed * 0.4), dt * slow);
        if (data.pattern === "snipe" || data.pattern === "snipeSlow") {
          if (enemy.aim > 0) {
            enemy.aim -= dt;
            if (enemy.aim <= 0 && enemy.marked) {
              fire(enemy.x, enemy.y, enemy.marked.x, enemy.marked.y, 430, enemy.color, { radius: 4, effect: data.pattern === "snipeSlow" ? "slow" : "" });
              enemy.marked = null;
              enemy.fireIn = 2.7;
            }
          } else if (enemy.fireIn <= 0) {
            enemy.aim = 0.9;
            enemy.marked = { x: player.x, y: player.y };
          }
        } else if (enemy.fireIn <= 0) {
          if (data.pattern === "prism") {
            const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            for (let i = -1; i <= 1; i++) fire(enemy.x, enemy.y, enemy.x + Math.cos(angle + i * 0.32) * 100, enemy.y + Math.sin(angle + i * 0.32) * 100, 185, enemy.color);
          } else if (data.pattern === "lattice") {
            const horizontal = Math.floor(enemy.age / 3) % 2 === 0;
            for (let i = -2; i <= 2; i++) {
              const theta = horizontal ? i * 0.14 : Math.PI / 2 + i * 0.14;
              fire(enemy.x, enemy.y, enemy.x + Math.cos(theta) * 100, enemy.y + Math.sin(theta) * 100, 165, enemy.color);
            }
          } else {
            const effect = ["freezer"].includes(data.pattern) ? "slow" : data.pattern === "poison" ? "poison" : "";
            throwShot(enemy, effect, data.pattern === "echo" ? 135 : data.pattern === "poison" ? 155 : 180);
          }
          enemy.fireIn = data.pattern === "echo" ? 3 : 2.2;
        }
      } else if (["repulse", "magnet", "gravity", "mergeRepulse"].includes(data.pattern)) {
        if (data.pattern === "repulse" || data.pattern === "mergeRepulse") moveToward(enemy, player.x + Math.sign(enemy.x - player.x) * 135, player.y + Math.sign(enemy.y - player.y) * 135, enemy.speed * 0.7, dt * slow);
        if (data.pattern === "magnet" || data.pattern === "gravity") {
          const dx = enemy.x - player.x, dy = enemy.y - player.y, length = distance || 1;
          const orbitDistance = data.pattern === "magnet" ? 175 : 205;
          const speed = enemy.speed * (data.pattern === "magnet" ? 0.55 : 0.4);
          moveToward(enemy, player.x + dx / length * orbitDistance, player.y + dy / length * orbitDistance, speed, dt * slow);
        }
        if (data.pattern === "magnet" && distance < 250) {
          const dx = enemy.x - player.x, dy = enemy.y - player.y, length = distance || 1;
          player.vx += dx / length * 95 * dt;
          player.vy += dy / length * 95 * dt;
        }
        if (enemy.pulseIn <= 0) {
          if (data.pattern === "gravity") enemy.pulsePush = !enemy.pulsePush;
          pulsePlayer(enemy, data.pattern === "repulse" || data.pattern === "mergeRepulse" || (data.pattern === "gravity" && enemy.pulsePush));
          enemy.pulseIn = 2.7;
        }
      } else if (["teleport", "phantomTeleport"].includes(data.pattern)) {
        enemy.telegraph = Math.max(0, enemy.telegraph - dt);
        if (enemy.fireIn <= 0) {
          if (enemy.telegraph <= 0) enemy.telegraph = 0.7;
          else if (enemy.telegraph < 0.2) {
            enemy.x = 70 + Math.random() * 660;
            enemy.y = 70 + Math.random() * 660;
            enemy.telegraph = 0;
            enemy.fireIn = 3;
          }
        }
        if (data.pattern === "phantomTeleport" && enemy.telegraph <= 0 && enemy.age % 2.6 < 1.3) enemy.phantomTime = Math.max(0, enemy.phantomTime - dt);
      } else if (data.pattern === "phantom") {
        moveToward(enemy, player.x, player.y, enemy.speed, dt * slow);
        enemy.phantomTime += dt;
        if (enemy.phantomTime > 2.5) enemy.phantomTime = 0;
      } else if (["heal", "shieldHeal", "shield"].includes(data.pattern)) {
        if (data.pattern === "heal" || data.pattern === "shieldHeal") {
          if (data.pattern === "shieldHeal") {
            const ally = run.enemies.filter(other => other !== enemy && !other.leaving)
              .sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0];
            const target = ally || { x: 400, y: 400 };
            moveToward(enemy, target.x, target.y, enemy.speed, dt * slow);
          }
          run.enemies.forEach(other => {
            if (other !== enemy && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 125) {
              if (data.pattern === "heal") other.health = Math.min(other.maxHealth, other.health + dt * 2);
              else other.shieldTime = Math.max(other.shieldTime, 1.5);
            }
          });
        }
        if (data.pattern === "shield") {
          moveToward(enemy, player.x + Math.sign(enemy.x - player.x) * 100, player.y + Math.sign(enemy.y - player.y) * 100, enemy.speed * 0.5, dt * slow);
          run.enemies.forEach(other => {
            if (other !== enemy && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 130) other.shieldTime = Math.max(other.shieldTime, 1.2);
          });
        }
        enemy.shieldTime = Math.max(0, enemy.shieldTime - dt);
      } else if (data.pattern === "summon" || data.pattern === "summonSplit") {
        moveToward(enemy, player.x + Math.sign(enemy.x - player.x) * 140, player.y + Math.sign(enemy.y - player.y) * 140, enemy.speed * 0.5, dt * slow);
        if (enemy.summonIn <= 0 && run.enemies.length < 14) {
          spawnEnemy(data.pattern === "summonSplit" ? "splitter" : "supportling", true);
          enemy.summonIn = 4;
        } else enemy.summonIn -= dt;
      } else if (data.pattern === "mine") {
        if (enemy.pulseIn <= 0 && enemy.explode <= 0) enemy.explode = 0.8;
        if (enemy.explode > 0) {
          enemy.vx *= Math.exp(-6 * dt);
          enemy.vy *= Math.exp(-6 * dt);
          enemy.explode -= dt;
          if (enemy.explode <= 0) {
            if (distance < 120) damagePlayer(1);
            enemy.pulseIn = 2.4;
          }
        } else {
          if (Math.hypot(enemy.wanderTarget.x - enemy.x, enemy.wanderTarget.y - enemy.y) < 24) {
            enemy.wanderTarget = { x: 55 + Math.random() * 690, y: 55 + Math.random() * 690 };
          }
          moveToward(enemy, enemy.wanderTarget.x, enemy.wanderTarget.y, Math.max(18, enemy.speed * 0.35), dt * slow);
        }
      } else if (data.pattern === "quake") {
        moveToward(enemy, player.x + Math.sign(enemy.x - player.x) * 170, player.y + Math.sign(enemy.y - player.y) * 170, enemy.speed * 0.3, dt * slow);
        if (enemy.pulseIn <= 0) {
          enemy.explode = 0.8;
          if (distance < 170) pulsePlayer(enemy, true);
          enemy.pulseIn = 3;
        }
        if (enemy.explode > 0) enemy.explode -= dt;
      }
      enemy.leechCooldown = Math.max(0, (enemy.leechCooldown || 0) - dt);
      enemy.shieldTime = Math.max(0, enemy.shieldTime - dt);
      const customPositionUpdate = ["teleport", "phantomTeleport", "stot"].includes(data.pattern) && !enemy.leaving;
      if (!customPositionUpdate && enemy.charging <= 0) {
        enemy.x += enemy.vx * dt * slow;
        enemy.y += enemy.vy * dt * slow;
      }
      if (data.pattern === "bounce" && !enemy.leaving) {
        enemy.x = Math.max(6, Math.min(794, enemy.x));
        enemy.y = Math.max(6, Math.min(794, enemy.y));
      }
      const invisible = data.pattern === "phantom" ? enemy.phantomTime > 1.25 : data.pattern === "phantomTeleport" && enemy.telegraph > 0;
      if (data.damage > 0 && !invisible && Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.radius + enemy.radius) {
        if (damagePlayer(data.damage) && data.pattern === "leech") enemy.health = Math.min(enemy.maxHealth, enemy.health + 2);
      }
      if (enemy.x < -40 || enemy.x > 840 || enemy.y < -40 || enemy.y > 840) {
        escapeEnemy(enemy);
        const index = run.enemies.indexOf(enemy);
        if (index >= 0) run.enemies.splice(index, 1);
      }
    }
    function mergeAvailable(recipe) {
      return save.unlockedZone >= recipe.zone && run.zone >= recipe.zone && run.wave >= recipe.wave;
    }
    function fuseEnemies(first, second, recipe) {
      const firstIndex = run.enemies.indexOf(first), secondIndex = run.enemies.indexOf(second);
      if (firstIndex < 0 || secondIndex < 0) return false;
      const x = (first.x + second.x) / 2, y = (first.y + second.y) / 2;
      run.enemies.splice(Math.max(firstIndex, secondIndex), 1);
      run.enemies.splice(Math.min(firstIndex, secondIndex), 1);
      if (first.id === "merger") rewardEnemy(first);
      if (second.id === "merger") rewardEnemy(second);
      spawnEnemy(recipe.result);
      const merged = run.enemies[run.enemies.length - 1];
      merged.x = x;
      merged.y = y;
      merged.merged = true;
      merged.health = Math.ceil(ENEMY_BY_ID[recipe.result].hp * currentZone().hp);
      merged.maxHealth = merged.health;
      announce(`${ENEMY_BY_ID[recipe.result].name} formed`);
      playTone(350, 0.16, "triangle");
      return true;
    }
    function nearestMergeFor(target, excluded = null) {
      let nearest = null;
      MERGES.forEach(recipe => {
        if (!mergeAvailable(recipe)) return;
        const partnerId = recipe.a === target.id ? recipe.b : recipe.b === target.id ? recipe.a : null;
        if (!partnerId) return;
        run.enemies.forEach(partner => {
          if (partner === target || partner === excluded || partner.id !== partnerId || partner.mini || partner.leaving) return;
          const distance = Math.hypot(partner.x - target.x, partner.y - target.y);
          if (!nearest || distance < nearest.distance) nearest = { partner, recipe, distance };
        });
      });
      return nearest;
    }
    function mergeEnemies() {
      run.enemies.slice().filter(enemy => enemy.id === "merger" && !enemy.leaving).forEach(merger => {
        if (!run.enemies.includes(merger)) return;
        const touched = run.enemies.find(other => other !== merger && !other.mini && !other.leaving
          && Math.hypot(other.x - merger.x, other.y - merger.y) < merger.radius + other.radius);
        if (!touched) return;
        const match = nearestMergeFor(touched);
        if (match) fuseEnemies(touched, match.partner, match.recipe);
        if (run.enemies.includes(merger)) {
          run.enemies.splice(run.enemies.indexOf(merger), 1);
          rewardEnemy(merger);
        }
      });
      run.enemies.slice().filter(enemy => enemy.id === "mergeRepulser" && !enemy.leaving).forEach(rep => {
        if (!run.enemies.includes(rep)) return;
        const touched = run.enemies.find(other => other !== rep && !other.mini && !other.leaving
          && Math.hypot(other.x - rep.x, other.y - rep.y) < rep.radius + other.radius);
        if (!touched) return;
        const match = nearestMergeFor(touched, rep);
        if (match) fuseEnemies(touched, match.partner, match.recipe);
      });
      for (let i = 0; i < run.enemies.length; i++) {
        const first = run.enemies[i];
        if (first.mini || first.leaving || first.merged || first.age < 2) continue;
        const recipe = MERGES.find(item => mergeAvailable(item)
          && ((item.a === first.id && run.enemies.some(other => other !== first && other.id === item.b && !other.mini && !other.leaving))
            || (item.b === first.id && run.enemies.some(other => other !== first && other.id === item.a && !other.mini && !other.leaving))));
        if (!recipe) continue;
        const second = run.enemies.find(other => other !== first && !other.mini && !other.leaving
          && other.id === (recipe.a === first.id ? recipe.b : recipe.a)
          && Math.hypot(other.x - first.x, other.y - first.y) < Math.max(first.radius + other.radius + 8, 70 + upgradeLevel("magnet") * 12));
        if (second && fuseEnemies(first, second, recipe)) break;
      }
    }
    function bossAttack(dt) {
      if (!run.boss) return;
      const boss = run.boss;
      boss.age += dt;
      boss.x = 400 + Math.sin(boss.age * 0.28) * 125;
      run.bossAttack -= dt;
      if (run.bossTell) {
        run.bossTell.time -= dt;
        if (run.bossTell.time <= 0) {
          const attack = run.bossTell.type;
          run.bossTell = null;
          if (attack === "burst") {
            const base = Math.atan2(player.y - boss.y, player.x - boss.x);
            for (let i = -2; i <= 2; i++) fire(boss.x, boss.y, boss.x + Math.cos(base + i * 0.22) * 140, boss.y + Math.sin(base + i * 0.22) * 140, 205, boss.color, { bossShot: true, bounces: 2, bossDamage: 10 });
          } else if (attack === "circle") {
            for (let i = 0; i < 12; i++) {
              const angle = Math.PI * 2 * i / 12 + boss.age * 0.2;
              fire(boss.x, boss.y, boss.x + Math.cos(angle) * 130, boss.y + Math.sin(angle) * 130, 165, boss.color, { bossShot: true, bounces: 2, radius: 5, bossDamage: 8 });
            }
          } else if (attack === "target") {
            const point = run.bossTellTarget || { x: player.x, y: player.y };
            fire(boss.x, boss.y, point.x, point.y, 400, boss.color, { bossShot: true, bounces: 2, radius: 7, bossDamage: 12 });
            run.bossTellTarget = null;
          } else {
            const pool = waveCandidates(run.zone, Math.min(9, run.wave));
            spawnEnemy(pool[0], true);
            if (run.zone > 1) spawnEnemy(pool[Math.min(1, pool.length - 1)], true);
            announce(`${currentZone().boss} summoned help`);
          }
          run.bossAttack = 2.5;
        }
      } else if (run.bossAttack <= 0) {
        const attacks = ["burst", "circle", "target", "summon"];
        const type = attacks[run.bossAttackStep % attacks.length];
        run.bossAttackStep++;
        run.bossTell = { type, time: type === "target" ? 1 : 0.85 };
        if (type === "target") run.bossTellTarget = { x: player.x, y: player.y };
      }
    }
    function updateShots(dt) {
      const slow = player.slowTime > 0 ? 0.55 : 1;
      for (let i = run.shots.length - 1; i >= 0; i--) {
        const shot = run.shots[i];
        const step = dt * slow;
        shot.age += step;
        const oldX = shot.x, oldY = shot.y;
        shot.x += shot.vx * step;
        shot.y += shot.vy * step;
        shot.distance += Math.hypot(shot.x - oldX, shot.y - oldY);
        if (shot.bossShot && run.boss && shot.bounced > 0 && Math.hypot(shot.x - run.boss.x, shot.y - run.boss.y) < run.boss.radius + shot.radius) {
          const increase = 1 + upgradeLevel("reflectionPower") * 0.1;
          run.boss.hp -= shot.bossDamage * increase;
          run.shots.splice(i, 1);
          playTone(290, 0.07);
          if (run.boss.hp <= 0) { run.boss.hp = 0; drawHud(); winBoss(); return; }
          continue;
        }
        if (Math.hypot(shot.x - player.x, shot.y - player.y) < shot.radius + player.radius) {
          const hit = damagePlayer(shot.damage);
          if (hit && shot.effect === "slow") player.slowedTime = Math.max(player.slowedTime, 1.7);
          if (hit && shot.effect === "poison") { player.poisonTime = Math.max(player.poisonTime, 2.2); player.poisonTick = Math.min(player.poisonTick || 1, 1); }
          run.shots.splice(i, 1);
          if (run.state === "defeat") return;
          continue;
        }
        const outside = shot.x < 5 || shot.x > 795 || shot.y < 5 || shot.y > 795;
        if (outside && shot.bounces > shot.bounced) {
          if (shot.x < 5 || shot.x > 795) shot.vx *= -1;
          if (shot.y < 5 || shot.y > 795) shot.vy *= -1;
          shot.x = Math.max(5, Math.min(795, shot.x));
          shot.y = Math.max(5, Math.min(795, shot.y));
          shot.bounced++;
          if (shot.bossShot && run.boss) {
            const dx = run.boss.x - shot.x, dy = run.boss.y - shot.y;
            const length = Math.hypot(dx, dy) || 1;
            const speed = Math.hypot(shot.vx, shot.vy);
            shot.vx = dx / length * speed;
            shot.vy = dy / length * speed;
          }
        } else if (outside || shot.age > 7) run.shots.splice(i, 1);
      }
    }
    function update(dt) {
      if (run.state === "idle" || run.state === "victory" || run.state === "defeat" || run.paused) return;
      if (run.toastTimer > 0) {
        run.toastTimer -= dt;
        if (run.toastTimer <= 0) document.getElementById("toast").classList.remove("show");
      }
      if (run.state === "transition") {
        run.transitionTimer -= dt;
        if (run.transitionTimer <= 0) {
          if (run.wave >= 10) startWave(1, run.zone);
          else startWave(run.wave + 1, run.zone);
        }
        return;
      }
      if (run.state === "countdown") {
        run.countdown -= dt;
        setStateLabel(`START IN ${Math.max(1, Math.ceil(run.countdown))}`);
        if (run.countdown <= 0) {
          if (run.wave === 10) startBoss();
          else { run.state = "active"; setStateLabel("SURVIVE"); }
        }
        drawHud();
        return;
      }
      updatePlayer(dt);
      run.clock += dt;
      if (run.state === "active") {
        const enemyLimit = Math.min(60, 14 + run.waveSpawns.length * 8);
        run.waveSpawns.forEach(wave => {
          wave.spawnClock -= dt;
          if (wave.spawned < wave.total && wave.spawnClock <= 0 && run.enemies.length < enemyLimit) {
            spawnEnemy(wave.candidates[Math.floor(Math.random() * wave.candidates.length)]);
            wave.spawned++;
            wave.spawnClock = Math.max(0.8, 1.9 - wave.wave * 0.065) * (0.82 + Math.random() * 0.36);
          }
        });
        run.waveSpawns = run.waveSpawns.filter(wave => wave.spawned < wave.total);
        run.enemies.slice().forEach(enemy => updateEnemy(enemy, dt));
        if (run.state === "defeat") return;
        mergeEnemies();
        updateShots(dt);
        if (run.waveSpawns.length === 0 && run.enemies.length === 0) completeWave();
      } else if (run.state === "boss") {
        const enemyLimit = Math.min(60, 14 + run.waveSpawns.length * 8);
        run.waveSpawns.forEach(wave => {
          wave.spawnClock -= dt;
          if (wave.spawned < wave.total && wave.spawnClock <= 0 && run.enemies.length < enemyLimit) {
            spawnEnemy(wave.candidates[Math.floor(Math.random() * wave.candidates.length)]);
            wave.spawned++;
            wave.spawnClock = Math.max(0.8, 1.9 - wave.wave * 0.065) * (0.82 + Math.random() * 0.36);
          }
        });
        run.waveSpawns = run.waveSpawns.filter(wave => wave.spawned < wave.total);
        bossAttack(dt);
        run.enemies.slice().forEach(enemy => updateEnemy(enemy, dt));
        if (run.state === "defeat" || run.state === "victory") return;
        mergeEnemies();
        updateShots(dt);
        if (run.boss && Math.hypot(player.x - run.boss.x, player.y - run.boss.y) < player.radius + run.boss.radius) damagePlayer(1);
      }
      drawHud();
    }
    function draw() {
      ctx.clearRect(0, 0, 800, 800);
      ctx.fillStyle = "#121521";
      ctx.fillRect(0, 0, 800, 800);
      ctx.strokeStyle = "#b8c2ec0c";
      ctx.lineWidth = 1;
      for (let i = 50; i < 800; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 800); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(800, i); ctx.stroke();
      }
      ctx.strokeStyle = "#78f0c22a";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, 792, 792);
      if (run.bossTell && run.boss) {
        const alpha = 0.5 + Math.sin(performance.now() / 65) * 0.25;
        ctx.strokeStyle = `rgba(255, 80, 130, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (run.bossTell.type === "target" && run.bossTellTarget) {
          ctx.moveTo(run.boss.x, run.boss.y);
          ctx.lineTo(run.bossTellTarget.x, run.bossTellTarget.y);
        } else {
          ctx.arc(run.boss.x, run.boss.y, 62 + Math.sin(performance.now() / 70) * 5, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fillStyle = "#ffb2c7";
        ctx.font = "14px Consolas, monospace";
        ctx.fillText(run.bossTell.type.toUpperCase(), run.boss.x - 30, run.boss.y - 62);
      }
      for (const enemy of run.enemies) {
        const data = ENEMY_BY_ID[enemy.id];
        const invisible = data.pattern === "phantom" ? enemy.phantomTime > 1.25 : data.pattern === "phantomTeleport" && enemy.telegraph > 0;
        if (enemy.telegraph > 0) {
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 13, 0, Math.PI * 2);
          ctx.strokeStyle = `${enemy.color}bb`; ctx.lineWidth = 2; ctx.stroke();
        }
        if (invisible) ctx.globalAlpha = 0.2;
        if (enemy.marked && data.pattern.includes("snipe")) {
          ctx.beginPath(); ctx.moveTo(enemy.x, enemy.y); ctx.lineTo(enemy.marked.x, enemy.marked.y);
          ctx.strokeStyle = "#ff77d288"; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.stroke(); ctx.setLineDash([]);
        }
        if (enemy.marked && ["charge", "explosiveCharge"].includes(data.pattern)) {
          ctx.beginPath(); ctx.moveTo(enemy.x, enemy.y); ctx.lineTo(enemy.marked.x, enemy.marked.y);
          ctx.strokeStyle = "#ffad6777"; ctx.lineWidth = 2; ctx.setLineDash([4, 7]); ctx.stroke(); ctx.setLineDash([]);
        }
        if (enemy.explode > 0) {
          const radius = data.pattern === "mine" ? 120 : data.pattern === "quake" ? 170 : 96;
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 166, 75, ${0.08 + Math.sin(performance.now() / 55) * 0.035})`;
          ctx.fill(); ctx.strokeStyle = "#ffc667a0"; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color; ctx.fill();
        ctx.strokeStyle = enemy.shieldTime > 0 ? "#fff" : "#ffffff99"; ctx.lineWidth = enemy.mini ? 1 : 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(enemy.x - enemy.radius * 0.28, enemy.y - enemy.radius * 0.28, Math.max(2, enemy.radius * 0.17), 0, Math.PI * 2);
        ctx.fillStyle = "#fff9"; ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (run.boss) {
        const boss = run.boss;
        ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.radius + 11, 0, Math.PI * 2);
        ctx.strokeStyle = `${boss.color}66`; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
        ctx.fillStyle = boss.color; ctx.fill();
        ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.radius * 0.54, 0, Math.PI * 2);
        ctx.fillStyle = "#211a35"; ctx.fill();
        ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.radius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "#fff"; ctx.fill();
      }
      for (const shot of run.shots) {
        ctx.beginPath(); ctx.arc(shot.x, shot.y, shot.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = `${shot.color}24`; ctx.fill();
        ctx.beginPath(); ctx.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2);
        ctx.fillStyle = shot.color; ctx.fill();
      }
      if (player.slowTime > 0 || player.slowedTime > 0 || player.phaseTime > 0 || player.poisonTime > 0) {
        ctx.beginPath(); ctx.arc(player.x, player.y, player.radius + 14 + Math.sin(performance.now() / 90) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = player.phaseTime > 0 ? "#9deaff" : player.poisonTime > 0 ? "#a6e66d" : player.slowedTime > 0 ? "#75dafa" : "#b39bff";
        ctx.lineWidth = 2; ctx.stroke();
      }
      if (!(player.invulnerable > 0 && Math.floor(performance.now() / 70) % 2)) {
        ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.phaseTime > 0 ? "#bcf4ff" : "#78f0c2"; ctx.fill();
        ctx.strokeStyle = "#f4fff9"; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    function frame(time) {
      if (!lastFrame) lastFrame = time;
      const dt = Math.min((time - lastFrame) / 1000, 0.04);
      lastFrame = time;
      update(dt);
      draw();
      animationId = requestAnimationFrame(frame);
    }
    function onKeyDown(event) {
      const key = event.key.toLowerCase();
      const target = event.target;
      const typing = target instanceof HTMLElement
        && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);
      if (!typing && run.state === "idle" && !run.rebind && /^[a-z]$/.test(key)) {
        testerCodeInput = (testerCodeInput + key).slice(-6);
        if (testerCodeInput === "tester" && !testerMode) {
          testerMode = true;
          mainMenu();
          announce("Tester mode enabled");
        }
      }
      if (run.rebind) {
        event.preventDefault();
        const duplicate = Object.keys(save.keybinds).find(id => id !== run.rebind.id && save.keybinds[id] === key);
        if (duplicate) {
          run.rebind.button.textContent = "Already used";
          return;
        }
        save.keybinds[run.rebind.id] = key;
        run.rebind = null;
        persist();
        openKeybindSettings();
        return;
      }
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
      if (key === "escape" || key === save.keybinds.pause) {
        if (run.paused) resumeGame();
        else pauseGame();
        return;
      }
      held.add(key);
      if (!event.repeat) {
        const action = Object.keys(save.keybinds).find(id => save.keybinds[id] === key);
        if (action === "skipWave") skipWave();
        else if (action) useAbility(action);
      }
    }
    function onKeyUp(event) { held.delete(event.key.toLowerCase()); }
    function canvasPoint(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: (event.clientX - rect.left) / rect.width * 800, y: (event.clientY - rect.top) / rect.height * 800 };
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", event => {
      ensureAudio();
      player.touchTarget = canvasPoint(event);
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", event => {
      if (player.touchTarget) player.touchTarget = canvasPoint(event);
    });
    canvas.addEventListener("pointerup", () => { player.touchTarget = null; });
    canvas.addEventListener("pointercancel", () => { player.touchTarget = null; });
    document.getElementById("pauseButton").addEventListener("click", () => {
      if (run.paused) resumeGame();
      else pauseGame();
    });
    autoDodgeToggle.addEventListener("change", () => {
      save.autoDodgeEnabled = autoDodgeToggle.checked;
      persist();
    });
    const saveCodeInput = document.getElementById("saveCodeInput");
    document.getElementById("generateSaveCode").addEventListener("click", () => {
      try {
        const snapshot = {
          ...save,
          currencies: { ...save.currencies },
          upgrades: { ...save.upgrades },
          discovered: [...save.discovered],
          keybinds: { ...save.keybinds },
          currentHp: ["idle", "victory", "defeat"].includes(run.state) ? save.currentHp : player.hp
        };
        saveCodeInput.value = encodeSaveCode(snapshot);
        showStorageStatus("Save code generated");
      } catch (error) {
        showStorageStatus("Could not generate save code", true);
        console.error("Could not generate Little Box save code:", error);
      }
    });
    document.getElementById("copySaveCode").addEventListener("click", () => {
      if (!saveCodeInput.value.trim()) {
        showStorageStatus("Generate or paste a code first", true);
        return;
      }
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        showStorageStatus("Select the code and copy it manually", true);
        return;
      }
      navigator.clipboard.writeText(saveCodeInput.value).then(
        () => showStorageStatus("Save code copied"),
        error => {
          showStorageStatus("Select the code and copy it manually", true);
          console.error("Could not copy Little Box save code:", error);
        }
      );
    });
    document.getElementById("importSaveCode").addEventListener("click", () => {
      let importedSave;
      try {
        importedSave = decodeSaveCode(saveCodeInput.value);
      } catch (error) {
        showStorageStatus("Could not import save code", true);
        console.error("Could not import Little Box save code:", error);
        return;
      }
      if (!window.confirm("Importing replaces this browser's save. Continue?")) return;
      const previousSave = save;
      save = importedSave;
      if (!persist()) {
        save = previousSave;
        return;
      }
      skipPagehideSave = true;
      showStorageStatus("Save imported; reloading");
      window.location.reload();
    });
    document.getElementById("discoveryToast").addEventListener("click", () => { window.location.href = "shop.html#enemy-index"; });
    document.addEventListener("visibilitychange", () => { if (document.hidden) pauseGame(); });
    window.addEventListener("blur", pauseGame);

    setMusicForWave(0);
    drawHud();
    mainMenu();
    animationId = requestAnimationFrame(frame);
    window.addEventListener("pagehide", () => {
      if (!skipPagehideSave && !["idle", "victory", "defeat"].includes(run.state)) {
        save.currentHp = player.hp;
        persist();
      }
      cancelAnimationFrame(animationId);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    }, { once: true });
  }
})();
