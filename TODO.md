# 📋 TODO — Upload Labs: Network Empire

> **Project:** Cyberpunk network management idle game  
> **Deployment:** Vercel  
> **Build Tool:** Vite (dev only)  
> **Repo:** GitHub  
> **Current Version:** 13.3

---

## ✅ Completed

### Features

- [x] Add a fun but practical new node to gameplay — _Task 1_
- [x] **Create a Comprehensive Game Tutorial** — _Task 17_
  > - Built an interactive, step-by-step tutorial for new players.
  > - Explained core mechanics seamlessly: placing nodes, collecting resources, cables, routers, and research.
  > - Added a polished UI for tutorial tooltips and handled centered/targeted positioning.
- [x] **Add Console Commands/Fixes Menu** — _Task 18_
  > - Added a premium-styled menu in Settings for debugging and fixing stuck game states.

### Improvements

- [x] Modularize the system — start transitioning from monolithic `index.html` while keeping the game deployable — _Task 2_
- [x] **Enhance visuals** — _Task 3_
- [x] **Optimize the codebase using clean code principles** — _Task 9 (prev)_
- [x] **Expand game content and features** — _Task 9_
  > - Added 10 tiered contracts (Tier 1-4) that scale with player progress and prestige level
  > - Added 8 new random events (Crypto Surge, Open Source, Bandwidth Bonus, Tax Refund, Hardware Failure, ISP Throttling, Crypto Crash, Ransomware)
  > - Added 12 new achievements (41 total, up from 29): Billionaire, Tycoon, Enterprise Client, Network Architect, Maxed Out, Senior Developer, Driver Collector, Nobel Prize, Empire Builder, Antivirus Pro, No Life, Megacorp
  > - Expanded milestones from 6 to 15 with early/mid/late/endgame progression goals
- [x] **Improve cloud saves, Firebase, and settings** — _Task 10_
  > - Added 3 new display settings: Particle Effects toggle, Animations toggle (reduce-motion mode), Event Alerts toggle
  > - Added CSS `.reduce-motion` class to disable all animations when toggled off
  > - Settings state persists across sessions via game save
  > - Fixed corrupted emoji characters in cloud save notification messages
  > - Added "Ultra Low Performance" mode for low-end devices
  > - Game loop UI updates are throttled appropriately
- [x] **Keep everything up to date** — _Task 10 (Maintenance)_
  > - Updated version 13.0 → 13.1
  > - Updated welcome screen panels with v13.1 content

### Bug Fixes

- [x] Work on incomplete functions in the game — _Task 4_
- [x] Fix broken cloud functions and game breakage after semi-modular refactor — _Task 5_
- [x] Fix all red-lined code errors — _Task 6_
- [x] **Fix Vercel deployment: game content not loading** — _Task 7_
- [x] **Fix anything that is not currently working** — _Task 8_
- [x] **Create Desktop App (.exe) using Electron** — _Task 11_
  > - Wrapped the existing web game into a standalone Windows executable.
  > - Used Electron, which acts as a bundled Chromium browser that runs the local Vite build.
  > - This requires no backend server. Game logic stays client-side, and saves continue using Firebase.
  > - The Vercel web deployment will remain exactly the same.
- [x] **Add Desktop Download button to Settings panel** — _Task 16_
  > - Added premium-styled download button in the Settings panel
  > - Links to GitHub Releases for the Windows .exe download
- [x] **Expand Coding System mechanics** — _Task 13_
  > - Added Coding Upgrade Tree with 9 upgrades across 3 tiers (Basic, Intermediate, Advanced)
  > - Upgrades boost code speed, reduce conversion costs, enable passive income, and enhance compilers
- [x] **Migrate Tailwind from CDN to Local Vite Build** — _Task 14_
  > - Process Tailwind CSS locally instead of via CDN script to improve production loading speeds
- [x] **Sync Package Versioning** — _Task 15_
  > - Update `package.json` version string from `10.0.0` to `13.0.0` to match the actual game timeline
- [x] **Fix Game Money Cap**
  > - Resolved an issue where the game stopped giving money at the 10 million cap.
- [x] **Fix Game Initialization Issues**
  > - Debugged and resolved JavaScript errors related to Firebase initialization that prevented the game from loading.
- [x] **Audit Game Nodes & Fix Scaling**
  > - Discovered that all "support" nodes (Cache, Analyzer, CDN, Quantum Core, Warehouse, etc.) were totally ignoring their level and only scaling based on whether they existed or not.
  > - Upgraded node scaling logic in `gameLoop` so that their buffs increase with their upgrade level.
  > - Standardized upgrade costs across `upgradeSelectedNode` and `batchUpgrade`.
- [x] **Improve Save Repair System**
  > - Enhanced `repairSaveData()` to specifically catch and replace `Infinity`, `NaN`, and negative values in resources, money, and stats.

---

## 🔧 In Progress / Pending

### 🚀 Upcoming Features & Improvements

- [ ] **Implement "Dark Net" Layer** — _High Risk, High Reward_
  > - Add a toggle for a red/black "Dark Net" view.
  > - Introduce specialized nodes (Botnets, Zero-Day Miners) that generate high profits but increase a new "Threat Level" stat.
  > - Add risks: high Threat Level triggers "Traceroute Attacks" or "Server Raids" that disable nodes or steal money.
  > - Add RP research for "Spoofing" and "Encryption" to mitigate Threat generation.
- [ ] **Add Corporate Factions & Contracts**
  > - Introduce Megacorporations (Omnicorp, NeoNet, CyberDyne) offering exclusive contracts.
  > - Each corp provides a unique global buff (e.g., free cables, firewalls produce RP).
  > - Gain Reputation by fulfilling corp-specific demands (e.g., "Upload 1M Video files").
  > - Max Reputation unlocks a unique, powerful end-game Node exclusive to that corp.
- [ ] **Implement Server Rack Customization (RPG Equipment)**
  > - Add an equipment system for high-tier nodes (Server Rack, Quantum Core).
  > - Nodes get slots: CPU, RAM, Cooling, Storage.
  > - Players find "Hardware Scraps" from events/cleaning viruses.
  > - Craft scraps in the Lab into components of varying rarities (Common to Legendary).
  > - Examples: Legendary Liquid Cooler negates all heat on an overclocked node.
- [ ] **Revamp Prestige: The "Singularity" Skill Tree**
  > - Change prestige reward to "Singularity Shards" based on total network value.
  > - Create a massive, permanent Skill Tree to spend Shards on game-breaking rules.
  > - Examples: "Wireless Protocol" (no cables needed), "Self-Aware Code" (random free upgrades), "Absolute Zero" (Router never overheats).
- [x] **Add Logic Controller Node for Automation**
  > - Introduced a new "Logic Controller" node ($100k, requires `tech_automation`) to automate late-game micro-management.
  > - Players can set up to 4 If/Then rules per controller (e.g., "If Money > $500k, Auto-Buy Server Racks").
  > - Rules are evaluated every second with a 2-second cooldown per rule.

### 📦 Maintenance

| Priority | Task                       |
| -------- | -------------------------- |
| 🟢 Low   | Keep everything up to date |

- [ ] **Keep everything up to date** — _Task 10 (Maintenance)_ ⚠️ _Permanent task — never remove_
  > - Update the version number following the versioning rules
  > - Update the "Latest Changes" panel on the welcome screen
  > - Update the "What's New" panel on the welcome screen

---

## 📏 Rules

### Versioning

| Change Type               | Increment                 | Example     |
| ------------------------- | ------------------------- | ----------- |
| Small updates & bug fixes | +0.1                      | 13.1 → 13.2 |
| Major updates             | +1.0 (minor resets to .0) | 13.2 → 14.0 |

> **Rule:** For small updates and bug fixes, the version number increments by 0.1 (e.g., 13.1 → 13.2). For major updates, the version number increments by 1 with the minor version resetting to 0 (e.g., 13.2 → 14.0).

### Permanent Tasks

> ⚠️ **Task 10 is a permanent, recurring task — never delete it.** After each update cycle, reset Task 10 to unchecked (`[ ]`) in the Pending section. It tracks: version number updates, "Latest Changes" panel, and "What's New" panel on the welcome screen. It must always remain active.

---

## 📝 Notes

- This is a GitHub repo deployed on Vercel
- The game uses a large monolithic structure (`index.html` ~64KB, `game.js` ~189KB, `styles.css` ~97KB)
- Modularization effort is ongoing (Task 2 completed initial phase)
- Vercel deployment uses static file serving (no build step) — Vite is used for local dev only
- Firebase init was extracted to `js/firebase-init.js` for better modularity
- CSS uses Unicode escapes for special characters to avoid encoding issues
- Contracts scale with prestige level for replayability
- Settings include display options (particles, animations, event alerts)
