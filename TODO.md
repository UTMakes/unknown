# 📋 TODO - Upload Labs: Network Empire

> ⚠️ **CRITICAL REMINDER FOR CODERS:** Always check the **Permanent Tasks** section at the bottom of this file. You MUST ensure permanent tasks (like version updates and Ultra Low Performance toggles) are completed if applicable to your current work.

> 📏 **ALWAYS reread the Rules section** before starting any work. It contains versioning guidelines, permanent task policies, and other important conventions.

> 🎓 **TUTORIAL REMINDER:** When adding new, complicated features, you MUST add them to the tutorial! If it's an early-game feature, make it an interactive step. If it's a late-game feature, add a clear explanation or tooltip.

> **Project:** Cyberpunk network management idle game  
> **Deployment:** Vercel  
> **Build Tool:** Vite (dev only)  
> **Repo:** GitHub  
> **Current Version:** 14.1

---

## ✅ Completed

### Features

- [x] Add a fun but practical new node to gameplay - _Task 1_
- [x] **Create a Comprehensive Game Tutorial** - _Task 17_
  > - Built an interactive, step-by-step tutorial for new players.
  > - Explained core mechanics seamlessly: placing nodes, collecting resources, cables, routers, and research.
  > - Added a polished UI for tutorial tooltips and handled centered/targeted positioning.
- [x] **Improve Game Tutorial** - _Task 29_
  > - Expand the existing tutorial to cover more advanced mechanics like node routing, traffic management, and specialization.
  > - **v14.1 Update:** Integrated interactive steps and explanations for **Master Routers**, **Sub-Networks**, **Directional Flow**, **Logic Controllers**, and **Firmware Specialization**.
  > - Added visual indicators, improved UI guidance and visual contrast for nodes during the tutorial.
  > - Enhanced accessibility with tooltips for complex mechanics.
- [x] **Add Console Commands/Fixes Menu** - _Task 18_
  > - Added a premium-styled menu in Settings for debugging and fixing stuck game states.
- [x] **Revamp Prestige: The "Singularity" Skill Tree** - _Task 27_
  > - Change prestige reward to "Singularity Shards" based on total network value.
  > - Create a massive, permanent Skill Tree to spend Shards on game-breaking rules.
  > - Examples: "Wireless Protocol" (no cables needed), "Self-Aware Code" (random free upgrades), "Absolute Zero" (Router never overheats).
- [x] **Develop Node Depth & Meaningful Mechanics** - _Task 23_
  > - **Traffic & Bottlenecks:** Added `bandwidth` property to all 25 node types. Nodes are now clamped to their bandwidth limit (scaled by level). Overloaded nodes show a pulsing amber border and ⚠️ icon. Load Balancers redistribute 30% of their bandwidth to connected nodes.
  > - **Physical Footprints:** 5 high-tier nodes (Server Rack, Quantum Core, Data Warehouse, AI Processor, Crypto Farm) are now 2×1 wide (340px) with 4 connection ports instead of 2.
  > - **Sub-Systems & Specialization:** Server Racks can be permanently "flashed" with firmware ($50k). Three options: Encrypted Database (+200% RP, virus immune), High-Freq Compute (+150% speed, +50% heat), Content Delivery Hub (+100% upload, acts as CDN).
  > - **Placement Effects:** 8 adjacency rules apply when nodes are within 200px proximity (e.g., Overclock near Overclock = +20% heat penalty, Cache near Downloaders = +10% speed, Miners near Miners = -5% competition penalty).
- [x] **Add Logic Controller Node for Automation** - _Task 28_
  > - Introduced a new "Logic Controller" node ($100k, requires `tech_automation`) to automate late-game micro-management.
  > - Players can set up to 4 If/Then rules per controller (e.g., "If Money > $500k, Auto-Buy Server Racks").
  > - Rules are evaluated every second with a 2-second cooldown per rule.
- [x] **Directional Flow & Network Hierarchy (Upstream/Downstream)** - _Task 37_
  > - **Implemented:** Defined 4-tier hierarchy (Source -> Bridge -> Process -> Hub).
  > - **Logic:** Connections now enforce upward flow (T1→T2→T3→T4).
  > - **Feedback:** Added "Invalid Flow" alerts with descriptive tier info and screen shake.
  > - **Clarification:** Added flow tier badges (T1-T4) to all nodes with descriptive names.
  > - **Polished:** Updated tier names (Source/Bridge/Process/Hub), added tier icons to badges.
  > - **Fixed:** Same-tier Bridge (T2) connections now allowed for utility chaining.
  > - **Added:** Flow tier info to tooltips, shop items, and Node Glossary.
  > - **Fixed:** Missing `openNodeGlossary` function (Task 42).
  > - **Fixed:** Firewall flowLevel corrected from T1 to T2 (has in/out ports).
  > - **Added:** `.node-body` CSS styling for better layout.
- [x] **Master Routers & Sub-Networks** - _Task 39_
  > - Allow "Master Router" nodes to open a new, secondary grid (a sub-net) when double-clicked.
  > - Players can build an entire sub-net strictly for crypto-mining or research and consolidated into a single cable leading back to the main map.
  > - Improves late-game organization and performance.
  > - **Tutorial:** Added interactive entry/callback steps.
- [x] **Node Glossary / Encyclopedia (Help Panel)** - _Task 42_
  > - **Implemented:** Added specialized Node Glossary modal accessible from the Help panel.
  > - **Content:** Displays name, tier, cost, yield (with unit formatting), and port configuration for all nodes.
  > - **Benefit:** Helps players plan their hierarchies and understand the purpose of each node.

### Improvements

- [x] **Aesthetic "Glassmorphism" Polish for Shop UI** - _Task 45_
  > - Upgraded the CSS of the `.items-tray` itself to use a modern frosted-glass blur (`backdrop-filter: blur(10px)`) with a slightly translucent border.
  > - Made it look like a high-tech holographic HUD floating over the game canvas.

- [x] **Revamp Research Tree UI** - _Task 30_
  > - Redesigned the Research Tree interface to be more visually engaging.
  > - Improved navigation, readability, and overall user experience when browsing upgrades.
  > - Added satisfying animations, clearer progression paths, and better tooltips.
- [x] **Improve Canvas Zoom for Trackpads** - _Task 33_

  > - Adjusted zoom scaling and sensitivity for trackpad pinch-to-zoom.
  > - Properly handled touchpad events (deltaY scaling) for consistent zoom feel.

- [x] **Heavy UI Polishing** - _Task 34_
  > - Performed a comprehensive visual pass across all menus, panels, and UI elements.
  > - Standardized padding, margins, colors, borders, and animations.
  > - Ensured the Cyberpunk aesthetic is consistent and feels premium throughout the entire interface.
- [x] Modularize the system - start transitioning from monolithic `index.html` while keeping the game deployable - _Task 2_
- [x] **Enhance visuals** - _Task 3_
- [x] **Optimize the codebase using clean code principles** - _Task 9 (prev)_
- [x] **Expand game content and features** - _Task 9_
  > - Added 10 tiered contracts (Tier 1-4) that scale with player progress and prestige level
  > - Added 8 new random events (Crypto Surge, Open Source, Bandwidth Bonus, Tax Refund, Hardware Failure, ISP Throttling, Crypto Crash, Ransomware)
  > - Added 12 new achievements (41 total, up from 29): Billionaire, Tycoon, Enterprise Client, Network Architect, Maxed Out, Senior Developer, Driver Collector, Nobel Prize, Empire Builder, Antivirus Pro, No Life, Megacorp
  > - Expanded milestones from 6 to 15 with early/mid/late/endgame progression goals
- [x] **Improve cloud saves, Firebase, and settings** - _Task 10_
  > - Added 3 new display settings: Particle Effects toggle, Animations toggle (reduce-motion mode), Event Alerts toggle
  > - Added CSS `.reduce-motion` class to disable all animations when toggled off
  > - Settings state persists across sessions via game save
  > - Fixed corrupted emoji characters in cloud save notification messages
  > - Added "Ultra Low Performance" mode for low-end devices
  > - Game loop UI updates are throttled appropriately
- [x] **Keep everything up to date** - _Task 10 (Maintenance)_
  > - Updated version 13.3 → 14.1
  > - Updated welcome screen panels with v14.1 content
- [x] **Update Cloud & Local Saves for Node Depth (Task 23)** - _Task 32_
  > - Extend save/load logic to persist new node data introduced by Task 23 (traffic stats, physical footprints, firmware specialization, adjacency state).
  > - Ensure backward compatibility so existing saves migrate cleanly without data loss.
  > - Update `repairSaveData()` to handle missing or malformed new fields gracefully.
  > - Persist the Ultra Low Performance Mode (ULPM) toggle so the player's preference is remembered across sessions.

### Bug Fixes

- [x] Work on incomplete functions in the game - _Task 4_
- [x] Fix broken cloud functions and game breakage after semi-modular refactor - _Task 5_
- [x] Fix all red-lined code errors - _Task 6_
- [x] **Fix Vercel deployment: game content not loading** - _Task 7_
- [x] **Fix anything that is not currently working** - _Task 8_
- [x] **Create Desktop App (.exe) using Electron** - _Task 11_
  > - Wrapped the existing web game into a standalone Windows executable.
  > - Used Electron, which acts as a bundled Chromium browser that runs the local Vite build.
  > - This requires no backend server. Game logic stays client-side, and saves continue using Firebase.
  > - The Vercel web deployment will remain exactly the same.
- [x] **Add Desktop Download button to Settings panel** - _Task 16_
  > - Added premium-styled download button in the Settings panel
  > - Links to GitHub Releases for the Windows .exe download
- [x] **Expand Coding System mechanics** - _Task 13_
  > - Added Coding Upgrade Tree with 9 upgrades across 3 tiers (Basic, Intermediate, Advanced)
  > - Upgrades boost code speed, reduce conversion costs, enable passive income, and enhance compilers
- [x] **Migrate Tailwind from CDN to Local Vite Build** - _Task 14_
  > - Process Tailwind CSS locally instead of via CDN script to improve production loading speeds
- [x] **Sync Package Versioning** - _Task 15_
  > - Update `package.json` version string from `10.0.0` to `13.0.0` to match the actual game timeline
- [x] **Fix Game Money Cap** - _Task 19_
  > - Resolved an issue where the game stopped giving money at the 10 million cap.
- [x] **Fix Game Initialization Issues** - _Task 20_
  > - Debugged and resolved JavaScript errors related to Firebase initialization that prevented the game from loading.
- [x] **Audit Game Nodes & Fix Scaling** - _Task 21_
  > - Discovered that all "support" nodes (Cache, Analyzer, CDN, Quantum Core, Warehouse, etc.) were totally ignoring their level and only scaling based on whether they existed or not.
  > - Upgraded node scaling logic in `gameLoop` so that their buffs increase with their upgrade level.
  > - Standardized upgrade costs across `upgradeSelectedNode` and `batchUpgrade`.
- [x] **Improve Save Repair System** - _Task 22_
  > - Enhanced `repairSaveData()` to specifically catch and replace `Infinity`, `NaN`, and negative values in resources, money, and stats.
- [x] **Dynamic Resource Breakdown (QoL)** - _Task 41_
  > - Hovering over the total Money/sec or RP/sec reveals a tooltip breaking down exactly what types of nodes or features are generating those resources.
  > - Helps players immediately identify their best earners and decide what to upgrade.

---

## 🔧 In Progress / Pending

### 🚀 Upcoming Features & Improvements

- [ ] **Implement "Dark Net" Layer** - _High Risk, High Reward_ - _Task 24_

  > - Add a toggle for a red/black "Dark Net" view.
  > - Introduce specialized nodes (Botnets, Zero-Day Miners) that generate high profits but increase a new "Threat Level" stat.
  > - Add risks: high Threat Level triggers "Traceroute Attacks" or "Server Raids" that disable nodes or steal money.
  > - Add RP research for "Spoofing" and "Encryption" to mitigate Threat generation.

- [ ] **"Overclock" Active Skill System** - _Task 35_

  > - Introduce a heat/power bar. Players can click an "OVERCLOCK" button that boosts global network speed by 300% for 30 seconds.
  > - **Risk/Reward:** Getting greedy and overclocking too frequently causes nodes to "Melt," requiring a repair cost to bring them back online.

- [ ] **Customizable Server Racks (Visuals)** - _Task 36_

  > - Players can spend "Singularity Shards" (from prestige) or massive amounts of money to buy cosmetic themes for their nodes.
  > - **Benefit:** Switch from the default gritty Cyberpunk UI to a clean "Aperture Science" white, or an animated "Matrix Green" falling code skin.

- [ ] **Interactive "Infection" & Quarantine Events** - _Task 38_

  > - When a "Ransomware" event triggers, it visually infects a single node (e.g., turns it purple).
  > - The infection travels down connected cables to adjacent nodes unless severed/quarantined quickly.
  > - Firewall nodes act as physical barriers the infection cannot cross.

- [ ] **"Smart Buy" Max Upgrade Toggle (QoL)** - _Task 40_

  > - Instead of holding Shift for x10 or x100, add a "Max" button toggle on the upgrade panel.
  > - Clicking calculates exactly how many levels the player can afford and buys all of them instantly in one click to prevent late-game click fatigue.



- [x] **Server-Side Validation & Anti-Cheat (Cloud Saves)** - _Task 43_

  > - **Security Rules:** Add `firestore.rules` to prevent saving impossible stats (NaN, negative money).
  > - **Client Obfuscation:** Add a secret salt to the `generateSaveChecksum` function so players cannot manually edit exported JSON saves.
  > - **Conflict Resolution:** Detect if a cloud save is newer than the local save when switching devices, and prompt the user before overwriting.

- [ ] **Add Corporate Factions & Contracts** - _Task 25_
  > - Introduce Megacorporations (Omnicorp, NeoNet, CyberDyne) offering exclusive contracts.
  > - Each corp provides a unique global buff (e.g., free cables, firewalls produce RP).
  > - Gain Reputation by fulfilling corp-specific demands (e.g., "Upload 1M Video files").
  > - Max Reputation unlocks a unique, powerful end-game Node exclusive to that corp.
- [ ] **Implement Server Rack Customization (RPG Equipment)** - _Task 26_
  > - Add an equipment system for high-tier nodes (Server Rack, Quantum Core).
  > - Nodes get slots: CPU, RAM, Cooling, Storage.
  > - Players find "Hardware Scraps" from events/cleaning viruses.
  > - Craft scraps in the Lab into components of varying rarities (Common to Legendary).
  > - Examples: Legendary Liquid Cooler negates all heat on an overclocked node.

### 📦 Maintenance

| Priority | Task                                  |
| -------- | ------------------------------------- |
| 🟢 Low   | Keep everything up to date            |
| 🟢 Low   | Update Ultra Low Performance features |

- [ ] **Keep everything up to date** - _Task 10 (Maintenance)_ ⚠️ _Permanent task - never remove_
  > - **Note:** Current version: 14.3
  > - Update the version number following the versioning rules
  > - Update the "Latest Changes" panel on the welcome screen
  > - Update the "What's New" panel on the welcome screen
- [ ] **Ultra Low Performance Updates** - _Task 31 (Maintenance)_ ⚠️ _Permanent task - never remove_
  > - Ensure new visual effects or complex UI animations are disabled when Ultra Low Performance is ON.

---

## 📏 Rules

### Versioning

| Change Type               | Increment                 | Example     |
| ------------------------- | ------------------------- | ----------- |
| Small updates & bug fixes | +0.1                      | 13.1 → 13.2 |
| Major updates             | +1.0 (minor resets to .0) | 13.2 → 14.0 |

> **Rule:** For small updates and bug fixes, the version number increments by 0.1 (e.g., 13.1 → 13.2). For major updates, the version number increments by 1 with the minor version resetting to 0 (e.g., 13.2 → 14.0).

### Permanent Tasks

> ⚠️ **Task 10 is a permanent, recurring task - never delete it.** After each update cycle, reset Task 10 to unchecked (`[ ]`) in the Pending section. It tracks: version number updates (always recheck current version before updating!), "Latest Changes" panel, and "What's New" panel on the welcome screen. It must always remain active.

> ⚠️ **Task 31 is a permanent, recurring task - never delete it.** After adding new visual features, ensure they are toggled off or hidden when Ultra Low Performance mode is active.

---

## 📝 Notes

- This is a GitHub repo deployed on Vercel
- The game uses a large monolithic structure (`index.html` ~64KB, `game.js` ~189KB, `styles.css` ~97KB)
- Modularization effort is ongoing (Task 2 completed initial phase)
- Vercel deployment uses static file serving (no build step) - Vite is used for local dev only
- Firebase init was extracted to `js/firebase-init.js` and the tutorial to `js/tutorial.js` for better modularity
- CSS uses Unicode escapes for special characters to avoid encoding issues
- Contracts scale with prestige level for replayability
- Settings include display options (ULPM, particles, animations, event alerts)
