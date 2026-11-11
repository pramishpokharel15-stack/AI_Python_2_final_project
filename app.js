(() => {
  "use strict";

  const SAVE_KEY = "little-box-save-v1";
  const CURRENCIES = [
    { id: "chaser", name: "Chaser", icon: "●" },
    { id: "dasher", name: "Dasher", icon: "➤" },
    { id: "shooter", name: "Shooter", icon: "✦" },
    { id: "spinner", name: "Spinner", icon: "✳" },
    { id: "bouncer", name: "Bouncer", icon: "◈" },
    { id: "exploder", name: "Exploder", icon: "✹" },
    { id: "sniper", name: "Sniper", icon: "⌖" },
    { id: "splitter", name: "Splitter", icon: "◇" },
    { id: "speedy", name: "Speedy", icon: "»" },
    { id: "guardian", name: "Boss", icon: "♢" }
  ];

  const ENEMIES = [
    { id: "chaser", name: "Chaser", icon: "●", attack: "Melee", difficulty: "Easy", health: 50, size: 13, speed: 105, speedName: "Medium", description: "Moves directly toward you and tries to make contact.", special: "Persistent pursuit.", tip: "Keep moving; turn sharply when it gets close.", color: "#ff718f" },
    { id: "dasher", name: "Dasher", icon: "➤", attack: "Charging", difficulty: "Medium", health: 25, size: 11, speed: 128, speedName: "Very Fast", description: "Locks onto your last position, warns you, then rushes through it.", special: "Telegraphed charge.", tip: "Wait for the warning, then dodge sideways.", color: "#ffad67" },
    { id: "shooter", name: "Shooter", icon: "✦", attack: "Ranged", difficulty: "Medium", health: 60, size: 14, speed: 70, speedName: "Medium", description: "Keeps its distance and fires a aimed projectile.", special: "Single aimed shots.", tip: "Move perpendicular to the incoming shot.", color: "#c796ff" },
    { id: "spinner", name: "Spinner", icon: "✳", attack: "Area", difficulty: "Medium", health: 70, size: 15, speed: 77, speedName: "Medium", description: "Drifts around while sending rings of projectiles in every direction.", special: "Radial volleys.", tip: "Find a gap between bullets before the ring spreads.", color: "#66d9ff" },
    { id: "bouncer", name: "Bouncer", icon: "◈", attack: "Melee", difficulty: "Medium", health: 45, size: 12, speed: 155, speedName: "Fast", description: "Ricochets around the box on a hard-to-predict path.", special: "Wall rebounds.", tip: "Watch its current direction and avoid its next wall turn.", color: "#72efb3" },
    { id: "exploder", name: "Exploder", icon: "✹", attack: "Explosive", difficulty: "Hard", health: 70, size: 16, speed: 95, speedName: "Fast", description: "Chases you, then flashes and bursts when it gets close.", special: "Close-range blast.", tip: "When it flashes, make distance immediately.", color: "#ffc667" },
    { id: "sniper", name: "Sniper", icon: "⌖", attack: "Ranged", difficulty: "Hard", health: 55, size: 12, speed: 62, speedName: "Slow", description: "Marks your position before firing a very fast shot.", special: "Target warning.", tip: "Do not stay on the marked line.", color: "#ff77d2" },
    { id: "splitter", name: "Splitter", icon: "◇", attack: "Area", difficulty: "Hard", health: 80, size: 15, speed: 82, speedName: "Medium", description: "Follows slowly, then breaks into two smaller pursuers.", special: "Creates extra chasers.", tip: "Make room before it divides; avoid getting boxed in.", color: "#91a0ff" },
    { id: "speedy", name: "Speedy", icon: "»", attack: "Predictive charge", difficulty: "Hard", health: 35, size: 10, speed: 390, speedName: "Very Fast", description: "Launches straight across the box toward where you are about to move.", special: "Fast, one-way predicted charge; never homes in.", tip: "Change direction after it launches, then let it leave the arena for a token.", color: "#f6cf73" },
    { id: "guardian", name: "Orbital Guardian", icon: "⬡", attack: "Area", difficulty: "Very Hard", health: 2000, size: 42, speed: 38, speedName: "Slow", description: "The wave 10 boss uses bursts, target locks, barrages, and summons.", special: "Its own shots can ricochet back into it.", tip: "Stand across the boss from a wall so its missed shots can rebound into it.", color: "#ff698f" }
  ];
  const ENEMY_BY_ID = Object.fromEntries(ENEMIES.map(enemy => [enemy.id, enemy]));

  const UPGRADE_GROUPS = [
    {
      name: "Movement",
      upgrades: [
        { id: "movementSpeed", name: "Movement speed", description: "Move faster while dodging.", effect: "Adds 8% movement speed per level.", currencies: ["chaser", "speedy"], cost: 2 },
        { id: "acceleration", name: "Acceleration", description: "Reach full movement speed more quickly.", effect: "Improves response to each direction change.", currencies: ["chaser", "speedy"], cost: 2 },
        { id: "dash", name: "Dash", description: "Unlock a quick burst of movement with Space.", effect: "Dash is available once purchased.", currencies: ["chaser", "speedy"], cost: 3 },
        { id: "dashCooldown", name: "Dash cooldown", description: "Dash becomes available sooner.", effect: "Reduces dash cooldown by 0.35 seconds.", currencies: ["chaser", "speedy"], cost: 2 },
        { id: "dashDistance", name: "Dash distance", description: "Travel farther during each dash.", effect: "Increases dash duration and distance.", currencies: ["chaser", "speedy"], cost: 2 }
      ]
    },
    {
      name: "Survival",
      upgrades: [
        { id: "maxHealth", name: "Maximum health", description: "Increase your health at the start of each wave.", effect: "Adds 20 maximum health per level.", currency: "chaser", cost: 3 },
        { id: "regeneration", name: "Health regeneration", description: "Slowly recover health while a wave is active.", effect: "Restores 0.6 health per second per level.", currency: "shooter", cost: 3 },
        { id: "damageReduction", name: "Damage reduction", description: "Take less damage from a hit.", effect: "Reduces incoming damage by 5% per level.", currency: "exploder", cost: 2 },
        { id: "shield", name: "Temporary shield", description: "Block one hit at the start of each wave.", effect: "Adds one extra blocked hit per level.", currency: "splitter", cost: 3 },
        { id: "extraLife", name: "Extra life", description: "Once per wave, survive a hit that would end the run.", effect: "Each level gives one wave-saving revive.", currency: "guardian", cost: 2 }
      ]
    },
    {
      name: "Special abilities",
      upgrades: [
        { id: "slowMotion", name: "Slow motion · Q", description: "Temporarily slow enemy movement and projectiles.", effect: "Adds 0.6 seconds of slow motion per level.", currency: "sniper", cost: 2 },
        { id: "energyPulse", name: "Energy pulse · E", description: "Push nearby enemies and projectiles away.", effect: "Increases the pulse radius.", currency: "spinner", cost: 3 },
        { id: "deflection", name: "Projectile deflection · R", description: "Redirect nearby projectiles away from you.", effect: "Increases deflection radius.", currency: "shooter", cost: 3 },
        { id: "phaseShift", name: "Phase shift · F", description: "Briefly become immune to damage.", effect: "Adds 0.2 seconds of immunity per level.", currency: "guardian", cost: 2 },
        { id: "magnet", name: "Magnet", description: "Collect the survival token when an enemy exits.", effect: "Extends the token collection effect.", currency: "splitter", cost: 2 }
      ]
    }
  ];
  const UPGRADES = UPGRADE_GROUPS.flatMap(group => group.upgrades);
  const ZONES = [
    { id: 1, name: "The Quiet Room", boss: "Orbital Guardian", description: "Learn the patterns. Survive ten waves, then turn the Guardian's shots against it." },
    { id: 2, name: "Afterimage Hall", boss: "Prism Warden", description: "A harder echo of the arena, with faster patterns and a new ricochet-hungry boss." }
  ];
  const WAVE_ENEMIES = {
    1: ["chaser"],
    2: ["chaser", "dasher", "speedy"],
    3: ["chaser", "shooter", "speedy"],
    4: ["dasher", "shooter", "bouncer", "speedy"],
    5: ["spinner", "chaser", "dasher"],
    6: ["exploder", "shooter", "bouncer"],
    7: ["sniper", "spinner", "dasher", "speedy"],
    8: ["splitter", "exploder", "shooter"],
    9: ENEMIES.slice(0, 8).map(enemy => enemy.id)
  };
  const defaultSave = () => ({
    currencies: Object.fromEntries(CURRENCIES.map(currency => [currency.id, 0])),
    upgrades: Object.fromEntries(UPGRADES.map(upgrade => [upgrade.id, 0])),
    unlockedZone: 1,
    zone: 1,
    continueWave: 1,
    musicVolume: 35,
    soundVolume: 55
  });

  let save = defaultSave();
  const statusElement = document.getElementById("saveStatus");
  function showStorageStatus(message, failed = false) {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.style.color = failed ? "#ff9db7" : "";
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (!stored || typeof stored !== "object") throw new Error("Save data is not an object.");
      const fresh = defaultSave();
      save = {
        ...fresh,
        ...stored,
        currencies: { ...fresh.currencies, ...(stored.currencies || {}) },
        upgrades: { ...fresh.upgrades, ...(stored.upgrades || {}) }
      };
      save.unlockedZone = Math.max(1, Math.min(2, Number(save.unlockedZone) || 1));
      save.zone = Math.max(1, Math.min(save.unlockedZone, Number(save.zone) || 1));
      save.continueWave = Math.max(1, Math.min(10, Number(save.continueWave) || 1));
      for (const key of Object.keys(save.currencies)) save.currencies[key] = Math.max(0, Number(save.currencies[key]) || 0);
      for (const key of Object.keys(save.upgrades)) save.upgrades[key] = Math.max(0, Math.min(5, Number(save.upgrades[key]) || 0));
    } catch (error) {
      showStorageStatus("Save unavailable", true);
      console.error("Could not read the Little Box save:", error);
    }
  }
  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      showStorageStatus("Saved locally");
    } catch (error) {
      showStorageStatus("Could not save", true);
      console.error("Could not save Little Box progress:", error);
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
    const volume = Number(save.musicVolume) / 100;
    const level = Math.max(0.08, musicIntensity);
    musicOscillator.frequency.setTargetAtTime(82 + level * 92, now, 0.8);
    musicHarmony.frequency.setTargetAtTime(123 + level * 130, now, 0.8);
    musicGain.gain.setTargetAtTime(volume * (0.008 + level * 0.025), now, 1.1);
  }
  function setMusicForWave(wave) {
    musicIntensity = wave <= 3 ? 0.18 : wave <= 6 ? 0.48 : wave <= 9 ? 0.78 : 1;
    updateMusic();
  }
  function playTone(frequency, duration = 0.09, type = "sine") {
    ensureAudio();
    if (!audioContext || Number(save.soundVolume) <= 0) return;
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
  function connectVolumeControls() {
    for (const input of document.querySelectorAll("#musicVolume")) {
      input.value = save.musicVolume;
      input.addEventListener("input", () => {
        save.musicVolume = Number(input.value);
        document.querySelectorAll("#musicVolume").forEach(control => { control.value = input.value; });
        persist();
        updateMusic();
      });
    }
    for (const input of document.querySelectorAll("#soundVolume")) {
      input.value = save.soundVolume;
      input.addEventListener("input", () => {
        save.soundVolume = Number(input.value);
        document.querySelectorAll("#soundVolume").forEach(control => { control.value = input.value; });
        persist();
      });
    }
    document.addEventListener("pointerdown", ensureAudio, { once: true });
  }
  connectVolumeControls();
  if (document.body.dataset.page === "shop") {
    musicIntensity = 0.12;
    updateMusic();
    renderShop();
  } else {
    initGame();
  }

  function renderShop() {
    const currencyList = document.getElementById("currencyList");
    currencyList.innerHTML = CURRENCIES.map(currency => `
      <div class="currency-card">
        <span class="currency-icon">${currency.icon}</span>
        <div><strong>${save.currencies[currency.id] || 0}</strong><span>${currency.name} tokens</span></div>
      </div>`).join("");

    const upgradeGroups = document.getElementById("upgradeGroups");
    upgradeGroups.innerHTML = UPGRADE_GROUPS.map(group => `
      <section class="upgrade-group">
        <h3>${group.name}</h3>
        ${group.upgrades.map(upgrade => {
          const level = save.upgrades[upgrade.id] || 0;
          const cost = upgrade.cost * (level + 1);
          const currencyIds = upgrade.currencies || [upgrade.currency];
          const payment = currencyIds.find(id => (save.currencies[id] || 0) >= cost);
          const currency = CURRENCIES.find(item => item.id === currencyIds[0]);
          const costLabel = currencyIds.length > 1
            ? `${cost} ${currency.name} or Speedy`
            : `${currency.icon} ${cost} ${currency.name}`;
          const canBuy = level < 5 && Boolean(payment);
          return `<article class="upgrade-card">
            <div class="upgrade-head"><h4>${upgrade.name}</h4><span class="level-text">LV ${level} / 5</span></div>
            <p>${upgrade.description} ${upgrade.effect}</p>
            <div class="upgrade-buy-row"><span class="upgrade-cost">${level === 5 ? "MAX LEVEL" : costLabel}</span>
              <button class="button" type="button" data-buy="${upgrade.id}" ${canBuy ? "" : "disabled"}>${level === 5 ? "Maxed" : "Upgrade"}</button></div>
            <div class="level-track" aria-label="Level ${level} of 5">${Array.from({ length: 5 }, (_, index) => `<i class="${index < level ? "on" : ""}"></i>`).join("")}</div>
          </article>`;
        }).join("")}
      </section>`).join("");
    upgradeGroups.onclick = event => {
      const button = event.target.closest("[data-buy]");
      if (!button || button.disabled) return;
      const upgrade = UPGRADES.find(item => item.id === button.dataset.buy);
      if (!upgrade) return;
      const level = save.upgrades[upgrade.id] || 0;
      const cost = upgrade.cost * (level + 1);
      const currencyIds = upgrade.currencies || [upgrade.currency];
      const payment = currencyIds.find(id => (save.currencies[id] || 0) >= cost);
      if (level >= 5 || !payment) return;
      save.currencies[payment] -= cost;
      save.upgrades[upgrade.id] = level + 1;
      persist();
      playTone(680, 0.12);
      renderShop();
    };
    document.getElementById("buyAllUpgrades").onclick = () => {
      UPGRADES.forEach(upgrade => { save.upgrades[upgrade.id] = 5; });
      persist();
      renderShop();
    };

    const attackFilter = document.getElementById("attackFilter");
    const attacks = [...new Set(ENEMIES.map(enemy => enemy.attack))];
    attackFilter.innerHTML += attacks.map(attack => `<option>${attack}</option>`).join("");
    const zoneList = document.getElementById("zoneList");
    zoneList.innerHTML = ZONES.map(zone => {
      const unlocked = zone.id <= save.unlockedZone;
      return `<article class="zone-card ${unlocked ? "unlocked" : ""}">
        <h3>Zone ${String(zone.id).padStart(2, "0")} · ${zone.name}</h3>
        <p>${zone.description}<br>Boss: ${zone.boss}</p>
        ${unlocked
          ? `<a class="button" href="index.html" data-zone="${zone.id}">${save.zone === zone.id ? "Selected" : "Enter zone"}</a>`
          : `<button class="button" type="button" disabled>Defeat the previous boss to unlock</button>`}
      </article>`;
    }).join("");
    zoneList.onclick = event => {
      const link = event.target.closest("[data-zone]");
      if (!link) return;
      event.preventDefault();
      save.zone = Number(link.dataset.zone);
      save.continueWave = 1;
      persist();
      window.location.href = "index.html";
    };
    const search = document.getElementById("enemySearch");
    const difficulty = document.getElementById("difficultyFilter");
    const speed = document.getElementById("speedFilter");
    const health = document.getElementById("healthFilter");
    const filters = [search, attackFilter, difficulty, speed, health];
    filters.forEach(input => input.addEventListener("input", updateEnemies));
    filters.forEach(input => input.addEventListener("change", updateEnemies));
    updateEnemies();
  }

  function updateEnemies() {
    const query = document.getElementById("enemySearch").value.trim().toLowerCase();
    const attack = document.getElementById("attackFilter").value;
    const difficulty = document.getElementById("difficultyFilter").value;
    const speed = document.getElementById("speedFilter").value;
    const maxHealth = Number(document.getElementById("healthFilter").value);
    document.getElementById("healthFilterValue").textContent = maxHealth >= 2000 ? "2000+" : `${maxHealth}`;
    const matches = ENEMIES.filter(enemy => {
      const text = `${enemy.name} ${enemy.attack} ${enemy.difficulty} ${enemy.speedName} ${enemy.description} ${enemy.special} ${enemy.tip}`.toLowerCase();
      return (!query || text.includes(query))
        && (!attack || enemy.attack === attack)
        && (!difficulty || enemy.difficulty === difficulty)
        && (!speed || enemy.speedName === speed)
        && enemy.health <= maxHealth;
    });
    document.getElementById("enemyCount").textContent = `${matches.length} / ${ENEMIES.length}`;
    document.getElementById("emptyEnemies").hidden = matches.length > 0;
    document.getElementById("enemyGrid").innerHTML = matches.map(enemy => {
      const healthWidth = Math.max(5, Math.min(100, enemy.health / 20));
      const sizeWidth = Math.max(5, Math.min(100, enemy.size / 42 * 100));
      return `<article class="enemy-card">
        <div class="enemy-top"><span class="enemy-icon" style="color:${enemy.color}">${enemy.icon}</span><div><h3>${enemy.name}</h3><p>${enemy.attack} · ${enemy.speedName}</p></div><span class="difficulty">${enemy.difficulty}</span></div>
        <p class="enemy-description">${enemy.description}</p>
        <div class="enemy-stats">
          <div class="enemy-stat"><b>${enemy.health.toLocaleString()} HP</b><div class="stat-bar"><i style="width:${healthWidth}%"></i></div></div>
          <div class="enemy-stat"><b>SIZE · ${enemy.size}</b><div class="stat-bar"><i style="width:${sizeWidth}%"></i></div></div>
        </div>
        <p class="enemy-tip"><strong>Special:</strong> ${enemy.special}<br><strong>Tip:</strong> ${enemy.tip}</p>
      </article>`;
    }).join("");
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
    const overlayButtons = document.getElementById("overlayButtons");
    const player = { x: 400, y: 440, vx: 0, vy: 0, hp: 100, maxHp: 100, radius: 27, invulnerable: 0, dashTime: 0, dashCooldown: 0, fireCooldown: 0, shieldHits: 0, livesUsed: 0, slowTime: 0, phaseTime: 0 };
    const run = { state: "idle", wave: save.continueWave, zone: save.zone, paused: false, clock: 0, spawnClock: 0, waveLength: 23, clearTimer: 0, countdown: 3, enemies: [], shots: [], boss: null, bossAttack: 0, bossAttackStep: 0, bossAim: null, rapidShots: 0, rapidClock: 0, toastTimer: 0 };
    const held = new Set();
    let lastFrame = 0;
    let animationId = 0;

    function currentZone() { return ZONES.find(zone => zone.id === run.zone) || ZONES[0]; }
    function maxHealth() { return 100 + (save.upgrades.maxHealth || 0) * 20; }
    function announce(text) {
      const toast = document.getElementById("toast");
      toast.textContent = text;
      toast.classList.add("show");
      run.toastTimer = 1.5;
    }
    function showOverlay(title, text, buttons, eyebrow = "LITTLE BOX") {
      overlayTitle.textContent = title;
      overlayText.textContent = text;
      overlayEyebrow.textContent = eyebrow;
      overlayButtons.replaceChildren();
      buttons.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `button ${item.secondary ? "button-secondary" : ""} ${item.danger ? "button-danger" : ""}`;
        button.textContent = item.label;
        button.addEventListener("click", item.action);
        overlayButtons.append(button);
      });
      overlay.hidden = false;
    }
    function hideOverlay() { overlay.hidden = true; }
    function setStateLabel(text) { document.getElementById("arenaState").textContent = text; }
    function drawHud() {
      document.getElementById("waveLabel").textContent = `${run.wave} / 10`;
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
    }
    function updateZoneHeading() {
      const heading = document.querySelector(".game-heading .eyebrow");
      if (heading) heading.textContent = `ZONE ${String(run.zone).padStart(2, "0")} · ${currentZone().name.toUpperCase()}`;
    }
    function startWave(wave = run.wave, zone = run.zone) {
      ensureAudio();
      run.zone = zone;
      save.zone = zone;
      run.wave = Math.max(1, Math.min(10, wave));
      run.state = "countdown";
      run.paused = false;
      document.getElementById("pauseButton").textContent = "Pause";
      run.clock = 0;
      run.countdown = 3;
      run.spawnClock = 0.5;
      run.waveLength = 21 + run.wave * 1.2;
      run.clearTimer = 8;
      run.enemies = [];
      run.shots = [];
      run.boss = null;
      run.bossAim = null;
      run.bossAttack = 1.4;
      run.bossAttackStep = 0;
      run.rapidShots = 0;
      player.maxHp = maxHealth();
      player.hp = player.maxHp;
      player.x = 400;
      player.y = 440;
      player.vx = 0;
      player.vy = 0;
      player.invulnerable = 0;
      player.dashTime = 0;
      player.dashCooldown = 0;
      player.fireCooldown = 0;
      player.shieldHits = save.upgrades.shield || 0;
      player.livesUsed = 0;
      player.slowTime = 0;
      player.phaseTime = 0;
      save.continueWave = run.wave;
      persist();
      setMusicForWave(run.wave);
      updateZoneHeading();
      setStateLabel("GET READY");
      drawHud();
      run.waitingStart = false;
      hideOverlay();
    }
    function pauseGame() {
      if (run.state === "idle" || run.state === "intermission" || run.state === "victory" || run.state === "defeat" || run.paused) return;
      run.paused = true;
      setStateLabel("PAUSED");
      document.getElementById("pauseButton").textContent = "Resume";
      showOverlay("Paused", "Everything is still. Take a breath before you go back in.", [
        { label: "Resume", action: resumeGame },
        { label: "Restart wave", action: () => startWave(run.wave, run.zone), secondary: true },
        { label: "Main menu", action: mainMenu, secondary: true }
      ], "PAUSE MENU");
    }
    function resumeGame() {
      ensureAudio();
      run.paused = false;
      hideOverlay();
      setStateLabel(run.state === "boss" ? "BOSS FIGHT" : "SURVIVE");
      document.getElementById("pauseButton").textContent = "Pause";
    }
    function mainMenu() {
      run.state = "idle";
      run.paused = false;
      run.waitingStart = false;
      run.enemies = [];
      run.shots = [];
      run.boss = null;
      setMusicForWave(0);
      setStateLabel("READY");
      document.getElementById("pauseButton").textContent = "Pause";
      showOverlay("Ready when you are.", "Dodge every attack. Enemies reward you when they leave the arena.", [
        { label: `Start wave ${save.continueWave}`, action: () => startWave(save.continueWave, save.zone) },
        { label: "Open shop", action: () => { window.location.href = "shop.html"; }, secondary: true }
      ], "A SMALL BOX. A BIG PROBLEM.");
    }
    function openShop() {
      window.location.href = "shop.html";
    }
    function completeWave() {
      run.state = "intermission";
      run.shots = [];
      run.enemies = [];
      save.continueWave = Math.min(10, run.wave + 1);
      persist();
      setMusicForWave(0);
      setStateLabel("WAVE CLEAR");
      playTone(620, 0.2);
      showOverlay(`Wave ${run.wave} cleared`, "You survived. Visit the shop before the next wave, or keep moving.", [
        { label: "Open upgrade shop", action: openShop },
        { label: "Continue", action: () => startWave(save.continueWave, run.zone), secondary: true }
      ], "BREATHING ROOM");
    }
    function winBoss() {
      run.state = "victory";
      run.boss = null;
      run.shots = [];
      run.enemies = [];
      save.currencies.guardian += 25;
      if (run.zone === 1) {
        save.unlockedZone = 2;
        save.zone = 2;
        save.continueWave = 1;
      } else {
        save.continueWave = 1;
      }
      persist();
      setMusicForWave(0);
      setStateLabel("BOSS DEFEATED");
      playTone(880, 0.35, "triangle");
      showOverlay("The boss hit itself.", `+25 Boss tokens. ${run.zone === 1 ? "Afterimage Hall is unlocked." : "You cleared Afterimage Hall."}`, [
        { label: "Open upgrade shop", action: openShop },
        { label: run.zone === 1 ? "Enter Zone 2" : "Play again", action: () => startWave(1, run.zone === 1 ? 2 : 1), secondary: true }
      ], "VICTORY");
    }
    function loseGame() {
      run.state = "defeat";
      run.shots = [];
      setMusicForWave(0);
      setStateLabel("RUN OVER");
      playTone(150, 0.35, "sawtooth");
      showOverlay("The box wins this round.", `You reached wave ${run.wave}. Your earned tokens and upgrades are safe.`, [
        { label: "Retry wave", action: () => startWave(run.wave, run.zone) },
        { label: "Open shop", action: openShop, secondary: true },
        { label: "Main menu", action: mainMenu, secondary: true }
      ], "TRY AGAIN");
    }
    function fire(x, y, tx, ty, speed, color, options = {}) {
      const dx = tx - x;
      const dy = ty - y;
      const length = Math.hypot(dx, dy) || 1;
      run.shots.push({
        x, y, vx: dx / length * speed, vy: dy / length * speed,
        radius: options.radius || 5, color, bossShot: Boolean(options.bossShot),
        bounces: options.bounces || 0, bounced: 0, damage: options.damage || 12,
        age: 0, distance: 0, source: options.source || "enemy"
      });
    }
    function spawnEnemy(id, mini = false) {
      const data = ENEMY_BY_ID[id] || ENEMY_BY_ID.chaser;
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (side === 0) { x = Math.random() * 800; y = -18; }
      if (side === 1) { x = 818; y = Math.random() * 800; }
      if (side === 2) { x = Math.random() * 800; y = 818; }
      if (side === 3) { x = -18; y = Math.random() * 800; }
      const multiplier = run.zone === 2 ? 1.25 : 1;
      run.enemies.push({
        id, x, y, vx: 0, vy: 0, age: 0, radius: mini ? 7 : data.size,
        speed: data.speed * multiplier * (mini ? 1.2 : 1) * (1 + (run.wave - 1) * 0.035),
        health: data.health, mini, rewardId: id, chargeIn: 1.2 + Math.random() * 1.1,
        charging: 0, aim: 0, marked: null, fireIn: 1 + Math.random(),
        splitIn: 4.5 + Math.random() * 1.5, explode: 0, leaving: false,
        leaveTimer: 9 + Math.random() * 3, radialAngle: Math.random() * Math.PI * 2,
        color: data.color
      });
      if (id === "speedy") {
        const enemy = run.enemies[run.enemies.length - 1];
        enemy.speed = data.speed * multiplier * (1 + (run.wave - 1) * 0.035);
        enemy.chargeIn = 0.45;
      }
    }
    function startBoss() {
      const bossName = currentZone().boss;
      document.getElementById("bossHud").querySelector("span").textContent = bossName.toUpperCase();
      const max = run.zone === 2 ? 2600 : 2000;
      run.boss = { x: 400, y: 240, radius: 43, hp: max, maxHp: max, color: run.zone === 2 ? "#a98aff" : "#ff698f", age: 0 };
      run.state = "boss";
      setMusicForWave(10);
      setStateLabel("BOSS FIGHT");
      announce(`${bossName} entered the box`);
      drawHud();
    }
    function rewardEnemy(enemy) {
      const currency = enemy.rewardId || enemy.id;
      if (!save.currencies[currency] && save.currencies[currency] !== 0) save.currencies[currency] = 0;
      save.currencies[currency] += 1;
      persist();
      announce(`+1 ${ENEMY_BY_ID[currency]?.name || currency} token`);
      playTone(530, 0.08);
    }
    function escapeEnemy(enemy) {
      if (enemy.escaped) return;
      enemy.escaped = true;
      rewardEnemy(enemy);
    }
    function beginLeaving(enemy) {
      enemy.leaving = true;
      enemy.exitTarget = [
        { x: 400, y: -70 }, { x: 870, y: 400 }, { x: 400, y: 870 }, { x: -70, y: 400 }
      ].sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0];
    }
    function damagePlayer(amount) {
      if (player.invulnerable > 0 || player.phaseTime > 0 || ["idle", "defeat", "victory", "intermission"].includes(run.state)) return;
      if (player.shieldHits > 0) {
        player.shieldHits -= 1;
        player.invulnerable = 0.7;
        announce("Shield blocked a hit");
        playTone(740, 0.12);
        return;
      }
      const reduction = (save.upgrades.damageReduction || 0) * 0.05;
      player.hp -= amount * (1 - reduction);
      player.invulnerable = 0.85;
      playTone(190, 0.12, "square");
      if (player.hp <= 0) {
        if (player.livesUsed < (save.upgrades.extraLife || 0)) {
          player.livesUsed++;
          player.hp = Math.max(1, player.maxHp * 0.35);
          player.invulnerable = 1.8;
          announce("Extra life used");
        } else {
          player.hp = 0;
          drawHud();
          loseGame();
        }
      }
    }
    function useAbility(key) {
      if (run.state === "idle" || run.state === "intermission" || run.state === "victory" || run.state === "defeat" || run.paused) return;
      const level = id => save.upgrades[id] || 0;
      if (key === "x") {
        shootPlayer();
        return;
      }
      if (key === " " && level("dash") > 0) {
        if (player.dashCooldown > 0) return;
        let dx = (held.has("arrowright") || held.has("d") ? 1 : 0) - (held.has("arrowleft") || held.has("a") ? 1 : 0);
        let dy = (held.has("arrowdown") || held.has("s") ? 1 : 0) - (held.has("arrowup") || held.has("w") ? 1 : 0);
        if (!dx && !dy) { dx = player.vx; dy = player.vy; }
        if (!dx && !dy) dx = 1;
        const length = Math.hypot(dx, dy) || 1;
        player.vx = dx / length * 720;
        player.vy = dy / length * 720;
        player.dashTime = 0.19 + level("dashDistance") * 0.055;
        player.dashCooldown = Math.max(0.75, 3.2 - level("dashCooldown") * 0.35);
        player.invulnerable = Math.max(player.invulnerable, player.dashTime);
        playTone(390, 0.1, "triangle");
        return;
      }
      if (key === "q" && level("slowMotion") > 0) {
        player.slowTime = 2.5 + level("slowMotion") * 0.6;
        announce("Slow motion");
      } else if (key === "e" && level("energyPulse") > 0) {
        const radius = 145 + level("energyPulse") * 22;
        run.enemies.forEach(enemy => {
          const dx = enemy.x - player.x, dy = enemy.y - player.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < radius) { enemy.vx += dx / distance * 260; enemy.vy += dy / distance * 260; }
        });
        run.shots.forEach(shot => {
          const dx = shot.x - player.x, dy = shot.y - player.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < radius) { shot.vx += dx / distance * 190; shot.vy += dy / distance * 190; }
        });
        announce("Energy pulse");
        playTone(260, 0.18, "triangle");
      } else if (key === "r" && level("deflection") > 0) {
        const radius = 120 + level("deflection") * 25;
        run.shots.forEach(shot => {
          if (Math.hypot(shot.x - player.x, shot.y - player.y) > radius) return;
          const target = run.boss || { x: player.x - shot.vx, y: player.y - shot.vy };
          const dx = target.x - shot.x, dy = target.y - shot.y;
          const distance = Math.hypot(dx, dy) || 1;
          const speed = Math.max(shot.speed || 320, Math.hypot(shot.vx, shot.vy));
          shot.vx = dx / distance * speed;
          shot.vy = dy / distance * speed;
          shot.bossShot = Boolean(run.boss);
          shot.bounces = Math.max(shot.bounces, 1);
          shot.bounced = 0;
        });
        announce("Nearby projectiles redirected");
        playTone(570, 0.14, "triangle");
      } else if (key === "f" && level("phaseShift") > 0) {
        player.phaseTime = 0.8 + level("phaseShift") * 0.2;
        announce("Phase shift");
        playTone(820, 0.12);
      } else if (["q", "e", "r", "f"].includes(key)) {
        announce(`Unlock ${key.toUpperCase()} in the shop`);
      }
    }

    function shootPlayer() {
      if (player.fireCooldown > 0 || !["active", "clearing", "boss"].includes(run.state) || run.paused) return;
      const target = run.enemies.reduce((closest, enemy) => {
        const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
        return distance < closest.distance ? { enemy, distance } : closest;
      }, { enemy: null, distance: Infinity }).enemy;
      if (!target) return;
      fire(player.x, player.y, target.x, target.y, 430, "#78f0c2", { radius: 4, damage: 18, source: "player" });
      player.fireCooldown = 0.32;
      playTone(360, 0.06, "triangle");
    }

    function updatePlayer(dt) {
      const accel = 1100 + (save.upgrades.acceleration || 0) * 180;
      const maxSpeed = 330 * (1 + (save.upgrades.movementSpeed || 0) * 0.08);
      let dx = (held.has("arrowright") || held.has("d") ? 1 : 0) - (held.has("arrowleft") || held.has("a") ? 1 : 0);
      let dy = (held.has("arrowdown") || held.has("s") ? 1 : 0) - (held.has("arrowup") || held.has("w") ? 1 : 0);
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
      player.x = Math.max(player.radius + 10, Math.min(790 - player.radius, player.x + player.vx * dt));
      player.y = Math.max(player.radius + 10, Math.min(790 - player.radius, player.y + player.vy * dt));
      player.invulnerable = Math.max(0, player.invulnerable - dt);
      player.dashCooldown = Math.max(0, player.dashCooldown - dt);
      player.fireCooldown = Math.max(0, player.fireCooldown - dt);
      player.phaseTime = Math.max(0, player.phaseTime - dt);
      player.slowTime = Math.max(0, player.slowTime - dt);
      if ((run.state === "active" || run.state === "boss") && save.upgrades.regeneration > 0) {
        player.hp = Math.min(player.maxHp, player.hp + save.upgrades.regeneration * 0.6 * dt);
      }
    }
    function moveToward(enemy, tx, ty, speed, dt) {
      const dx = tx - enemy.x, dy = ty - enemy.y;
      const length = Math.hypot(dx, dy) || 1;
      enemy.vx += (dx / length * speed - enemy.vx) * Math.min(1, dt * 3.2);
      enemy.vy += (dy / length * speed - enemy.vy) * Math.min(1, dt * 3.2);
    }
    function updateEnemies(dt) {
      for (let i = run.enemies.length - 1; i >= 0; i--) {
        const enemy = run.enemies[i];
        enemy.age += dt;
        enemy.fireIn -= dt;
        const away = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        const slow = player.slowTime > 0 ? 0.42 : 1;
        if (!enemy.leaving && enemy.age > enemy.leaveTimer) beginLeaving(enemy);
        if (enemy.leaving) {
          moveToward(enemy, enemy.exitTarget.x, enemy.exitTarget.y, enemy.speed * 1.8, dt * slow);
        } else if (enemy.id === "chaser" || enemy.id === "exploder" || enemy.id === "splitter") {
          moveToward(enemy, player.x, player.y, enemy.speed, dt * slow);
          if (enemy.id === "exploder") {
            if (away < 74 && enemy.explode <= 0) enemy.explode = 0.7;
            if (enemy.explode > 0) {
              enemy.explode -= dt;
              if (enemy.explode <= 0) {
                if (away < 92) damagePlayer(22);
                beginLeaving(enemy);
              }
            }
          }
          if (enemy.id === "splitter" && !enemy.didSplit && enemy.age > enemy.splitIn) {
            enemy.didSplit = true;
            for (let child = 0; child < 2; child++) {
              const mini = { ...enemy, id: "splitter", x: enemy.x + (child ? 16 : -16), y: enemy.y + (child ? 10 : -10), vx: (child ? 1 : -1) * 40, vy: 30, age: 0, radius: 7, speed: enemy.speed * 1.2, mini: true, leaveTimer: 5.5, didSplit: true, leaving: false, escaped: false, explode: 0 };
              run.enemies.push(mini);
            }
            announce("Splitter divided");
          }
        } else if (enemy.id === "bouncer") {
          enemy.x += enemy.vx * dt * slow;
          enemy.y += enemy.vy * dt * slow;
          if (enemy.age < 0.05) { enemy.vx = (Math.random() < 0.5 ? -1 : 1) * enemy.speed; enemy.vy = (Math.random() * 2 - 1) * enemy.speed; }
          if (enemy.x < 18 || enemy.x > 782) enemy.vx *= -1;
          if (enemy.y < 18 || enemy.y > 782) enemy.vy *= -1;
          enemy.x = Math.max(18, Math.min(782, enemy.x));
          enemy.y = Math.max(18, Math.min(782, enemy.y));
        } else if (enemy.id === "speedy") {
          if (!enemy.launched) {
            enemy.chargeIn -= dt;
            if (enemy.chargeIn <= 0) {
              const prediction = 0.65;
              const tx = player.x + player.vx * prediction;
              const ty = player.y + player.vy * prediction;
              const dx = tx - enemy.x, dy = ty - enemy.y;
              const distance = Math.hypot(dx, dy) || 1;
              enemy.vx = dx / distance * enemy.speed;
              enemy.vy = dy / distance * enemy.speed;
              enemy.launched = true;
            }
          }
        } else if (enemy.id === "dasher") {
          if (enemy.charging > 0) {
            enemy.x += enemy.vx * dt * slow;
            enemy.y += enemy.vy * dt * slow;
            enemy.charging -= dt;
          } else if (enemy.chargeIn <= 0) {
            const dx = player.x - enemy.x, dy = player.y - enemy.y;
            const distance = Math.hypot(dx, dy) || 1;
            enemy.vx = dx / distance * enemy.speed * 4;
            enemy.vy = dy / distance * enemy.speed * 4;
            enemy.charging = 0.42;
            enemy.chargeIn = 2.1;
          } else {
            enemy.chargeIn -= dt;
            moveToward(enemy, player.x, player.y, enemy.speed * 0.35, dt * slow);
          }
        } else {
          moveToward(enemy, player.x + Math.sign(enemy.x - player.x) * 100, player.y + Math.sign(enemy.y - player.y) * 100, enemy.speed * 0.45, dt * slow);
          if (enemy.id === "shooter" && enemy.fireIn <= 0) {
            fire(enemy.x, enemy.y, player.x, player.y, 210, enemy.color);
            enemy.fireIn = 2.2;
          } else if (enemy.id === "spinner" && enemy.fireIn <= 0) {
            for (let shot = 0; shot < 8; shot++) {
              const angle = enemy.radialAngle + Math.PI * 2 * shot / 8;
              fire(enemy.x, enemy.y, enemy.x + Math.cos(angle) * 100, enemy.y + Math.sin(angle) * 100, 145, enemy.color, { radius: 4 });
            }
            enemy.radialAngle += 0.2;
            enemy.fireIn = 2.4;
          } else if (enemy.id === "sniper") {
            if (enemy.aim > 0) {
              enemy.aim -= dt;
              if (enemy.aim <= 0 && enemy.marked) {
                fire(enemy.x, enemy.y, enemy.marked.x, enemy.marked.y, 470, enemy.color, { radius: 4, damage: 16 });
                enemy.marked = null;
                enemy.fireIn = 2.4;
              }
            } else if (enemy.fireIn <= 0) {
              enemy.aim = 0.85;
              enemy.marked = { x: player.x, y: player.y };
            }
          }
        }
        enemy.x += enemy.vx * dt * slow;
        enemy.y += enemy.vy * dt * slow;
        if (!enemy.escaped && Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.radius + enemy.radius) damagePlayer(enemy.id === "exploder" ? 20 : 12);
        if (enemy.x < -40 || enemy.x > 840 || enemy.y < -40 || enemy.y > 840) {
          escapeEnemy(enemy);
          run.enemies.splice(i, 1);
        }
      }
    }
    function bossAttack(dt) {
      if (!run.boss) return;
      run.boss.age += dt;
      run.bossAttack -= dt;
      if (run.rapidShots > 0) {
        run.rapidClock -= dt;
        if (run.rapidClock <= 0) {
          fire(run.boss.x, run.boss.y, player.x, player.y, 275, run.boss.color, { bossShot: true, bounces: 1, damage: 15 });
          run.rapidShots -= 1;
          run.rapidClock = 0.28;
        }
      }
      if (run.bossAim) {
        run.bossAim.time -= dt;
        if (run.bossAim.time <= 0) {
          fire(run.boss.x, run.boss.y, run.bossAim.x, run.bossAim.y, 400, run.boss.color, { bossShot: true, bounces: 1, radius: 7, damage: 22 });
          run.bossAim = null;
        }
      }
      if (run.bossAttack > 0) return;
      const attack = run.bossAttackStep % 5;
      run.bossAttackStep++;
      if (attack === 0) {
        const base = Math.atan2(player.y - run.boss.y, player.x - run.boss.x);
        for (let index = -2; index <= 2; index++) {
          const angle = base + index * 0.2;
          fire(run.boss.x, run.boss.y, run.boss.x + Math.cos(angle) * 150, run.boss.y + Math.sin(angle) * 150, 220, run.boss.color, { bossShot: true, bounces: 1 });
        }
        run.bossAttack = 2.2;
      } else if (attack === 1) {
        for (let index = 0; index < 12; index++) {
          const angle = Math.PI * 2 * index / 12 + run.boss.age * 0.35;
          fire(run.boss.x, run.boss.y, run.boss.x + Math.cos(angle) * 130, run.boss.y + Math.sin(angle) * 130, 170, run.boss.color, { bossShot: true, bounces: 1, radius: 5 });
        }
        run.bossAttack = 2.6;
      } else if (attack === 2) {
        run.bossAim = { x: player.x, y: player.y, time: 0.85 };
        run.bossAttack = 2.9;
      } else if (attack === 3) {
        run.rapidShots = 5;
        run.rapidClock = 0.15;
        run.bossAttack = 2.7;
      } else {
        spawnEnemy("chaser");
        spawnEnemy("dasher");
        run.bossAttack = 3.2;
        announce("Guardian summoned help");
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
        if (shot.source === "player") {
          const hitIndex = run.enemies.findIndex(enemy => Math.hypot(shot.x - enemy.x, shot.y - enemy.y) < shot.radius + enemy.radius);
          if (hitIndex !== -1) {
            const enemy = run.enemies[hitIndex];
            enemy.health -= shot.damage;
            run.shots.splice(i, 1);
            if (enemy.health <= 0) {
              run.enemies.splice(hitIndex, 1);
              announce(`${ENEMY_BY_ID[enemy.id]?.name || "Enemy"} broken`);
            }
            continue;
          }
          if (shot.age > 1.8) run.shots.splice(i, 1);
          continue;
        }
        if (shot.bossShot && run.boss && shot.distance > 48 && Math.hypot(shot.x - run.boss.x, shot.y - run.boss.y) < run.boss.radius + shot.radius) {
          run.boss.hp -= shot.damage || 12;
          run.shots.splice(i, 1);
          playTone(290, 0.07);
          if (run.boss.hp <= 0) { run.boss.hp = 0; drawHud(); winBoss(); return; }
          continue;
        }
        if (Math.hypot(shot.x - player.x, shot.y - player.y) < shot.radius + player.radius) {
          if (save.upgrades.magnet > 0 && shot.bossShot && run.boss) {
            const dx = run.boss.x - shot.x, dy = run.boss.y - shot.y, length = Math.hypot(dx, dy) || 1;
            shot.vx = dx / length * 400;
            shot.vy = dy / length * 400;
          } else {
            damagePlayer(shot.damage);
            run.shots.splice(i, 1);
          }
          continue;
        }
        const outside = shot.x < 5 || shot.x > 795 || shot.y < 5 || shot.y > 795;
        if (outside && shot.bounces > shot.bounced) {
          if (shot.x < 5 || shot.x > 795) shot.vx *= -1;
          if (shot.y < 5 || shot.y > 795) shot.vy *= -1;
          shot.x = Math.max(5, Math.min(795, shot.x));
          shot.y = Math.max(5, Math.min(795, shot.y));
          shot.bounced++;
        } else if (outside || shot.age > 7) {
          run.shots.splice(i, 1);
        }
      }
    }
    function handleEnemyExit() {
      for (let i = run.enemies.length - 1; i >= 0; i--) {
        const enemy = run.enemies[i];
        if (enemy.x < -40 || enemy.x > 840 || enemy.y < -40 || enemy.y > 840) {
          escapeEnemy(enemy);
          run.enemies.splice(i, 1);
        }
      }
    }
    function update(dt) {
      if (run.state === "idle" || run.state === "intermission" || run.state === "victory" || run.state === "defeat" || run.paused || run.waitingStart) return;
      if (run.toastTimer > 0) {
        run.toastTimer -= dt;
        if (run.toastTimer <= 0) document.getElementById("toast").classList.remove("show");
      }
      if (run.state === "countdown") {
        run.countdown -= dt;
        if (run.countdown <= 0) {
          if (run.wave === 10) startBoss();
          else {
            run.state = "active";
            setStateLabel("SURVIVE");
          }
        }
      }
      updatePlayer(dt);
      if (run.state === "active") {
        run.clock += dt;
        run.spawnClock -= dt;
        if (run.clock < run.waveLength && run.spawnClock <= 0 && run.enemies.length < 12) {
          const candidates = WAVE_ENEMIES[Math.min(9, run.wave)] || WAVE_ENEMIES[1];
          spawnEnemy(candidates[Math.floor(Math.random() * candidates.length)]);
          run.spawnClock = Math.max(0.9, 2.5 - run.wave * 0.1) * (0.78 + Math.random() * 0.45);
        }
        if (run.clock >= run.waveLength) {
          run.state = "clearing";
          run.clearTimer = 8;
          run.enemies.forEach(beginLeaving);
          setStateLabel("CLEARING");
        }
        updateEnemies(dt);
        updateShots(dt);
        if (run.state === "defeat") return;
      } else if (run.state === "clearing") {
        run.clock += dt;
        run.clearTimer -= dt;
        updateEnemies(dt);
        updateShots(dt);
        if (run.state === "defeat") return;
        if (run.clearTimer <= 0) {
          run.enemies.forEach(escapeEnemy);
          run.enemies = [];
        }
        if (!run.enemies.length) completeWave();
      } else if (run.state === "boss") {
        run.clock += dt;
        bossAttack(dt);
        updateEnemies(dt);
        updateShots(dt);
        if (run.boss) {
          const d = Math.hypot(player.x - run.boss.x, player.y - run.boss.y);
          if (d < player.radius + run.boss.radius) damagePlayer(15);
        }
      }
      handleEnemyExit();
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
      ctx.strokeRect(16, 16, 768, 768);
      if (run.bossAim) {
        ctx.beginPath();
        ctx.moveTo(run.boss.x, run.boss.y);
        ctx.lineTo(run.bossAim.x, run.bossAim.y);
        ctx.strokeStyle = `rgba(255, 80, 130, ${0.45 + Math.sin(performance.now() / 70) * 0.25})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(run.bossAim.x, run.bossAim.y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = "#ff698f"; ctx.stroke();
      }
      for (const enemy of run.enemies) {
        if (enemy.id === "sniper" && enemy.marked) {
          ctx.beginPath(); ctx.moveTo(enemy.x, enemy.y); ctx.lineTo(enemy.marked.x, enemy.marked.y);
          ctx.strokeStyle = "#ff77d288"; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.stroke(); ctx.setLineDash([]);
        }
        if (enemy.id === "exploder" && enemy.explode > 0) {
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, 92, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 166, 75, ${0.08 + Math.sin(performance.now() / 55) * 0.035})`;
          ctx.fill(); ctx.strokeStyle = "#ffc667a0"; ctx.stroke();
        }
        if (enemy.id === "dasher" && enemy.chargeIn < 0.45 && enemy.charging <= 0) {
          ctx.beginPath(); ctx.moveTo(enemy.x, enemy.y); ctx.lineTo(player.x, player.y);
          ctx.strokeStyle = "#ffad6777"; ctx.lineWidth = 2; ctx.setLineDash([4, 7]); ctx.stroke(); ctx.setLineDash([]);
        }
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color; ctx.fill();
        ctx.strokeStyle = "#ffffff99"; ctx.lineWidth = enemy.mini ? 1 : 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(enemy.x - enemy.radius * 0.28, enemy.y - enemy.radius * 0.28, Math.max(2, enemy.radius * 0.17), 0, Math.PI * 2);
        ctx.fillStyle = "#fff9"; ctx.fill();
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
      if (player.slowTime > 0 || player.phaseTime > 0) {
        ctx.beginPath(); ctx.arc(player.x, player.y, player.radius + 14 + Math.sin(performance.now() / 90) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = player.phaseTime > 0 ? "#9deaff" : "#b39bff";
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
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
      if (key === "escape") {
        if (run.paused) resumeGame();
        else pauseGame();
        return;
      }
      held.add(key);
      if (!event.repeat) useAbility(key);
    }
    function onKeyUp(event) { held.delete(event.key.toLowerCase()); }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", shootPlayer);
    document.getElementById("pauseButton").addEventListener("click", () => {
      if (run.paused) resumeGame();
      else pauseGame();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseGame();
    });
    window.addEventListener("blur", pauseGame);

    updateZoneHeading();
    const bossName = currentZone().boss;
    document.getElementById("bossHud").querySelector("span").textContent = bossName.toUpperCase();
    setMusicForWave(0);
    showOverlay("Ready when you are.", `Dodge every attack. Enemies reward you when they leave the arena. Wave ${save.continueWave} is next.`, [
      { label: `Start wave ${save.continueWave}`, action: () => startWave(save.continueWave, save.zone) },
      { label: "Open shop", action: openShop, secondary: true }
    ], "A SMALL BOX. A BIG PROBLEM.");
    document.getElementById("pauseButton").textContent = "Pause";
    drawHud();
    animationId = requestAnimationFrame(frame);
    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    }, { once: true });
  }
})();
