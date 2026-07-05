````md
#  F1 Live Leaderboard

A single-page React + TypeScript application that simulates a live **Formula 1** lap-time leaderboard. Users can add new driver lap times through an interactive form, and the leaderboard automatically updates by sorting drivers from the fastest to the slowest lap.

---

##  Features

- Live Formula 1 style leaderboard
-  Automatic lap time sorting (fastest lap first)
- Team and driver selection
- Team-colored position indicator
- Driver profile photos and team logos
- Automatic gap calculation from the fastest lap
- Animated highlight for newly added entries
- Driver dropdown filtered by selected team
- Last updated timestamp
- Maximum of **22 participants**

---

##  Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Icons
- Vite

---

##  Prerequisites

Before running the project, make sure you have:

- Node.js **18+**
- npm

---

##  Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the project folder:

```bash
cd <project-folder>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

##  Project Structure

```
src/
├── assets/                 # Fonts, icons, images
├── data.ts                 # Formula 1 teams and driver data
├── LeaderLiveBoard.tsx     # Main leaderboard component
├── main.tsx
└── index.css
```

---

##  Usage

1. Select a Formula 1 team *(optional)*.
2. Choose a driver from the dropdown list.
3. Enter the lap time using the format:

```
mm : ss . mmm
```

Example:

```
01 : 32 . 548
```

4. Click **ADD TO LEADERBOARD**.
5. The new entry is automatically inserted into the correct ranking based on lap time.
6. The newly added row is briefly highlighted to indicate the latest update.

---

##  Leaderboard Logic

- Entries are sorted automatically by lap time (ascending).
- The fastest lap is displayed in **P1**.
- Gap times are calculated relative to the fastest driver.
- The first-place row is highlighted using the driver's team color.
- Each driver's profile picture and team logo are displayed when available.
- The "Last Updated" timestamp refreshes whenever a new entry is added.

---

##  Limitations

- Maximum supported participants: **22**
- Lap times must be entered manually.
- Data is stored only in memory and resets after refreshing the page.


