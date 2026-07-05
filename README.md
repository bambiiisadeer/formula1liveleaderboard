# F1 Live Leaderboard

A single-page React + TypeScript application that simulates a live Formula 1 lap-time leaderboard. Users can add new driver entries through an interactive form, and the leaderboard automatically re-sorts to place the fastest lap at the top.

---

## Features

- Live Formula 1 style leaderboard
- Automatic lap time sorting (fastest lap first)
- Team and driver selection
- Team-colored position indicator
- Driver profile photos and team logos
- Automatic gap calculation from the fastest lap
- Animated highlight for newly added entries
- Driver dropdown filtered by the selected team
- Last updated timestamp
- Maximum of 22 participants

---

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Icons
- Vite

---

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- pnpm

---

## Installation

Extract the zip file, then navigate into the project folder:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Build for Production

```bash
pnpm build
pnpm preview
```

---

## Project Structure

```text
src/
├── assets/                 # Fonts, icons, and images
├── data.ts                 # Team and driver definitions
├── LeaderLiveBoard.tsx     # Main leaderboard component
├── main.tsx
└── index.css
```

---

## Usage

1. Select a team (optional).
2. Choose a driver from the dropdown list.
3. Enter a lap time using the format:

```text
mm : ss . mmm
```

Example:

```text
01 : 32 . 548
```

4. Click **ADD TO LEADERBOARD**.
5. The leaderboard automatically inserts the driver into the correct position based on lap time.
6. The newly added row is briefly highlighted.

---

## Leaderboard Logic

- Entries are automatically sorted by lap time in ascending order.
- The fastest lap is always displayed in **P1**.
- Gap times are calculated relative to the fastest lap.
- The first-place row is highlighted using the driver's team color.
- Driver photos and team logos are displayed when available.
- The **Last Updated** timestamp is refreshed whenever a new entry is added.
- Team color is used in place of a flag, since it maps naturally to each driver's team in Formula 1.

---

## Limitations

- Maximum supported participants: 22
- Lap times are entered manually.
- Data is stored in memory only and will be reset after refreshing the page.