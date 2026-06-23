# Student Dashboard — Gamification Scaffold

Foundation UI shell for a gamification system. Recreates the sidebar app layout:
a **Student Dashboard** with three collapsible navigation groups, where every
activity links to its own page with a **Complete Activity** button. Completing an
activity is tracked and persisted (localStorage), laying the groundwork for points,
streaks, and badges later.

## Stack
React + Vite + TypeScript + Tailwind CSS + React Router.

## Getting started
```bash
npm install
npm run dev      # start the dev server (open the printed URL)
npm run build    # type-check + production build
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
