# Student Dashboard — Gamification Scaffold

Foundation UI shell for a gamification system. Recreates the sidebar app layout:
a **Student Dashboard** with three collapsible navigation groups, where every
activity links to its own page with a **Complete Activity** button. Completing an
activity is tracked and persisted (localStorage), laying the groundwork for points,
streaks, and badges later.

## Stack
React + Vite + TypeScript + Tailwind CSS + React Router.

## Getting started

### Prerequisites
Install these on your computer first:

- **[Node.js](https://nodejs.org/) 18 or newer** — includes `npm`. Verify with
  `node -v` and `npm -v`. (On macOS you can also `brew install node`.)
- **[Git](https://git-scm.com/downloads)** — for cloning the repo. Verify with `git --version`.
- A code editor such as **[VS Code](https://code.visualstudio.com/)** (optional but recommended).

The app runs entirely in the browser and persists progress to localStorage. The
only optional piece of configuration is an Anthropic API key for the **Best Next
Task** feature (see below) — everything else works with no setup.

### Optional: Best Next Task (Claude-powered recommendation)
After the Career Discovery Quiz is complete, a **Best Next Task** button appears
next to the Reset button. It asks Claude to recommend the student's single best
next step. To enable it, add an API key:

```bash
cp .env.example .env.local      # then edit .env.local and set ANTHROPIC_API_KEY
```

The key is read **only** by the dev/preview server (`vite.config.ts` →
`vite-plugins/bestNextTaskApi.ts`, exposed at `POST /api/best-next-task`) and is
never bundled into client code. Restart `npm run dev` after editing `.env.local`.
Without a key the button still appears, but generating a recommendation shows a
"key not configured" message.

### 1. Get the code
```bash
git clone https://github.com/KevinCui1/DreamCollege-Team-B.git
cd DreamCollege-Team-B
```
If you already cloned it earlier, pull the latest changes instead:
```bash
git pull
```

### 2. Install dependencies
This reads `package.json` and downloads everything into a local `node_modules/`
folder (git-ignored, so it won't exist on a fresh clone):
```bash
npm install
```

### 3. Run it
```bash
npm run dev      # start the dev server, then open the printed URL (usually http://localhost:5173)
```
The page hot-reloads as you edit files. Stop the server with `Ctrl+C`.

### Other commands
```bash
npm run build    # type-check + produce an optimized production build in dist/
npm run preview  # serve the production build locally to verify it
```

## Structure
- `src/data/navigation.ts` — **single source of truth** for groups and activities.
  Both the sidebar and the routes are generated from this array. Add new activities here.
- `src/context/CompletionContext.tsx` — completion state, persisted to localStorage.
  This is the seam the gamification mechanics plug into (`isComplete`, `complete`,
  `completedCount`, `totalCount`).
- `src/components/Sidebar.tsx`, `NavGroup.tsx` — collapsible sidebar with progress footer.
- `src/pages/DashboardHome.tsx` — landing page with overall progress.
- `src/pages/ActivityPage.tsx` — generic activity page driven by the route slug.

## Navigation groups
- **Career Planning** — Career Discovery Quiz, My Career Tracks, Career Fit Report,
  Explore All Careers, High School Plan
- **College Planning** — College Profile, Positioning Statement, Majors, Colleges,
  Activities, Scholarships, Shortlist
- **College Application** — Application, Recommendation Letter
