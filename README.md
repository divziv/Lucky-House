# Tambola Royal — Housie Game Web Application

A complete, production-grade **Tambola / Housie game web application** built with React, Vite, TypeScript, and Tailwind CSS. Deployable directly as a static frontend application to **GitHub Pages** with zero backend requirements.

---

## What's New in This Update

### 1. Fully Flexible Number Ranges
The host can configure the exact range of numbers played:
- **Starting Number**: Defaults to `1`, but fully customizable (e.g. `10`, `20`, `50`).
- **Last Number**: Fully customizable (e.g. `70`, `75`, `80`, `90`, `100`, up to `1000`).
- **Presets**: Quick-select presets (`1–70`, `1–80`, `1–90`, `1–100`) automatically configure both starting and ending values.
- **Custom Range**: Custom ranges such as `10–75`, `20–80`, or `50–100` are validated and supported across all boards and digital tickets.

### 2. Strictly Ordered Master Board vs Random Calling Pool
- **Visual Board Order**: The Tambola master board **always** renders in ascending numerical order (`start, start + 1, ..., end`). For a 1–90 game, `1` is always in the top-left slot (`board[0] === 1`).
- **Calling Pool**: Generated and shuffled independently via Fisher-Yates shuffle. Numbers are drawn randomly without repetition. The first drawn number is completely random and independent from the board position.

### 3. Family-Friendly Calling Dictionary (`src/data/tambolaCalls.ts`)
A dedicated, wholesome phrase dictionary tailored for families, schools, community gatherings, and senior citizen clubs:
- **Number 1**: *"The leader at the very beginning"*
- **Number 7**: *"Lucky number seven"*
- **Number 13**: *"Thirteen, not so unlucky today!"* (positive and playful)
- **Number 25**: *"Silver Jubilee, twenty-five"*
- **Number 50**: *"Half a century, Silver Jubilee, fifty"*
- **Number 77**: *"Hum Saath Saath Hai, seventy-seven"*
- **Dynamic "Top of the House"**: Automatically assigned to `numberRange.end` (e.g., `70` for 1–70, `90` for 1–90, `75` for 10–75).
- Clean, non-discriminatory, respectful descriptions free of body shaming, superstition, or derogatory humor.

### 4. Calling Styles
Host can configure the caller tone:
- **Simple**: Number + phonetic breakdown only (*"Twenty-two. Double digit, two two, twenty-two."*).
- **Family Friendly** *(default)*: Safe cultural & milestone descriptions.
- **Fun**: Playful enthusiasm for lively parties.
- **Classic**: Balanced traditional calling format.

### 5. Utilities
- **`src/utils/numberToWords.ts`**: Converts integers from `1` up to `1000+` into natural English words (e.g., `105` &rarr; *"one hundred and five"*, `250` &rarr; *"two hundred and fifty"*).
- **`src/utils/digitAnnouncement.ts`**: Builds single-, double-, and triple-digit breakdown phrasing for Web Speech API and UI subtitles.
- **`src/utils/numberRangeUtils.ts`**: Handles board array generation, pool shuffling, and validation constraints.

---

## Core Game Features

- **Web Speech API Voice Announcements**: Dynamic rule announcements and natural voice caller with adjustable rate, pitch, and voice selection.
- **First Five Numbers Pause**: Pauses after 5 numbers are called with a prominent *“CHECK / CONTINUE”* button for players to inspect their tickets.
- **Winner Eligibility Rules**:
  - **Fast Five**: Strictly capped at 1 winner maximum.
  - **First Line, Second Line, Third Line**: Host-configurable winner counts.
  - **Strict Line Rule Enforced**: A player who has won one line cannot subsequently claim another line prize using the same card.
  - **Line Winners Continuing for Full House**: Host can configure whether line winners remain eligible for Full House (*Yes / No*).
  - **Last Five**: Optional bonus prize category.
- **Physical Paper & Virtual Game Modes**:
  - **Physical Mode**: Host acts as caller, board projector, and winner claim verifier.
  - **Virtual Mode**: Digital 15-number cards (3 rows × 5 numbers) with unique column bounds and 8 vibrant color themes.
  - **Multi-Tab / Multi-Device Synchronization**: Built using `BroadcastChannel` and LocalStorage synchronization for live multi-tab play without requiring a server backend.
- **Local Persistence**: Preserves active sessions in `localStorage` with a resume prompt on page reload.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Run unit tests
npm test

# 4. Build for production (GitHub Pages ready)
npm run build
```

---

## License

MIT License. Designed and built for authentic, family-friendly Tambola & Housie entertainment.
