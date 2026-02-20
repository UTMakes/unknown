# 📋 TODO — Upload Labs: Network Empire

> **Project:** Cyberpunk network management idle game  
> **Deployment:** Vercel  
> **Build Tool:** Vite (dev only)  
> **Repo:** GitHub  
> **Current Version:** 12.1

---

## ✅ Completed

### Features

- [x] Add a fun but practical new node to gameplay — _Task 1_

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
- [x] **Keep everything up to date** — _Task 10 (Maintenance)_
  > - Updated version 12.0 → 12.1
  > - Updated welcome screen panels with v12.1 content

### Bug Fixes

- [x] Work on incomplete functions in the game — _Task 4_
- [x] Fix broken cloud functions and game breakage after semi-modular refactor — _Task 5_
- [x] Fix all red-lined code errors — _Task 6_
- [x] **Fix Vercel deployment: game content not loading** — _Task 7_
- [x] **Fix anything that is not currently working** — _Task 8_

---

## 🔧 In Progress / Pending

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
