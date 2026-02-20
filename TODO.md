# 📋 TODO — Upload Labs: Network Empire

> **Project:** Cyberpunk network management idle game  
> **Deployment:** Vercel  
> **Build Tool:** Vite (dev only)  
> **Repo:** GitHub  
> **Current Version:** 12.0

---

## ✅ Completed

### Features

- [x] Add a fun but practical new node to gameplay — _Task 1_

### Improvements

- [x] Modularize the system — start transitioning from monolithic `index.html` while keeping the game deployable — _Task 2_
- [x] **Enhance visuals** — _Task 3_
  > Improved game visual presentation and UI polish:
  >
  > - Added ambient glow effects to canvas background with color-shifting animation
  > - Added cyberpunk scanline overlay on canvas
  > - Enhanced header/toolbar/sidebar with animated gradient border glows
  > - Added type-colored glow effects on node hover (core, download, upload, infra, lab, special, advanced)
  > - Enhanced cable glow effects with drop-shadow filters
  > - Enhanced port hover effects with multi-layered glow
  > - Added working node spinning conic-gradient animation
  > - Enhanced particle variety (multi-colored: blue, purple, cyan, gold)
  > - Added grid breathing animation and drift effect
  > - Enhanced panel hover effects with top glow line
  > - Enhanced shop item hover with radial glow
  > - Enhanced stat box micro-interactions with text glow
  > - Added prestige button spinning conic-gradient effect
  > - Enhanced modal backdrop with radial gradient
  > - Added smooth game container fade-in animation
  > - Enhanced selection box with glow effects
  > - Improved focus states for accessibility
  > - Fixed orphaned CSS properties (broken code at line ~779)
  > - Added font smoothing and text rendering optimization
- [x] **Optimize the codebase using clean code principles** — _Task 9_
  > - Removed duplicate CSS rules (`.modal-header`, `.modal-body`, `.feature-item:last-child`, `.node.selected`)
  > - Removed duplicate JS function (`toggleSetting`)
  > - Extracted repeated inline styles to CSS classes (`.form-input`, `.setting-item`, `.settings-section`)
  > - Applied new CSS classes to HTML form inputs and settings panels
  > - Added focus states and hover effects to extracted CSS classes
- [x] **Keep everything up to date** — _Task 10_
  > - Updated version from 11.3 → 12.0 (major update)
  > - Updated "Latest Changes" panel with v12.0 changelog
  > - Updated "What's New" panel with v12.0 features

### Bug Fixes

- [x] Work on incomplete functions in the game — _Task 4_
- [x] Fix broken cloud functions and game breakage after semi-modular refactor — _Task 5_
- [x] Fix all red-lined code errors — _Task 6_
- [x] **Fix Vercel deployment: game content not loading** — _Task 7_
  > Root cause: Vite build (`vite build`) failed due to inline `<script type="module">` tags and non-module script references that Vite 7.x couldn't process. Vercel was attempting to run the build step, which failed, resulting in missing game content.
  >
  > Fixes applied:
  >
  > - Created `vite.config.js` for local dev server configuration
  > - Updated `vercel.json` with `"framework": null` and `"buildCommand": ""` to serve as static files (no build step needed)
  > - Set `"outputDirectory": "."` to serve from project root
  > - Extracted inline Firebase module script to `js/firebase-init.js` for cleaner architecture and Vite dev compatibility
  > - Added proper caching headers for JS and CSS assets
- [x] **Fix anything that is not currently working** — _Task 8_
  > - Fixed CSS encoding issues: corrupted `▸` bullet character (used Unicode escape `\25B8`)
  > - Fixed CSS encoding issues: corrupted `✓` checkmark character (used Unicode escape `\2713`)
  > - Fixed deprecated `apple-mobile-web-app-capable` meta tag → `mobile-web-app-capable`
  > - Fixed password fields not in `<form>` elements (wrapped in proper `<form>` tags with `autocomplete` attributes)
  > - Fixed false emergency recovery triggering on every page load (added startup grace period + `updateConnectivity()` call in `init()`)

---

## 🔧 In Progress / Pending

_No pending tasks at this time._

---

## 📏 Rules

### Versioning

| Change Type               | Increment                 | Example     |
| ------------------------- | ------------------------- | ----------- |
| Small updates & bug fixes | +0.1                      | 13.1 → 13.2 |
| Major updates             | +1.0 (minor resets to .0) | 13.2 → 14.0 |

> **Rule:** For small updates and bug fixes, the version number increments by 0.1 (e.g., 13.1 → 13.2). For major updates, the version number increments by 1 with the minor version resetting to 0 (e.g., 13.2 → 14.0).

---

## 📝 Notes

- This is a GitHub repo deployed on Vercel
- The game uses a large monolithic structure (`index.html` ~65KB, `game.js` ~188KB, `styles.css` ~95KB)
- Modularization effort is ongoing (Task 2 completed initial phase)
- Vercel deployment uses static file serving (no build step) — Vite is used for local dev only
- Firebase init was extracted to `js/firebase-init.js` for better modularity
- CSS uses Unicode escapes for special characters to avoid encoding issues
