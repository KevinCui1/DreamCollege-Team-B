# Design Decision Record — "The Counselor's Almanac"

The visual system for Dream College's onboarding and progressive information-collection
surfaces. Derived with the `ui-ux-pro-max` design authority and the `frontend-design`
skill. This governs the **collection experience** (first-run welcome, contextual
collectors, the College Profile review hub, and tool missing-info states). The existing
gamified dashboard shell (aurora glow, rank, XP, achievements) is intentionally retained;
the almanac system is the stronger, coherent surface layered on top where the student
actually enters information.

## Concept

A student making consequential college decisions needs the flow to feel **manageable,
encouraging, and credible** — never like administrative paperwork or an AI assistant.
The chosen metaphor is a **trusted college counselor's field almanac**: a warm, paper-
forward editorial notebook that gathers one thoughtful entry at a time, remembers
everything, and never re-asks. It reads as considered and human, not templated SaaS.

## Palette (semantic roles)

Warm, low-glare, high-legibility. Every foreground/background pair meets WCAG AA (≥4.5:1).

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Canvas | `paper` | `#FAF6EE` | App/collection background |
| Surface | `paper-card` | `#FFFDF9` | Cards, sheets, inputs |
| Sunk surface | `paper-deep` | `#F1E9D9` | Wells, reused-field chips, progress track |
| Ink | `graphite` | `#22201C` | Headings & body text |
| Muted ink | `graphite-muted` | `#6B6459` | Secondary text, reason-for-asking notes |
| Soft ink | `graphite-soft` | `#9A9284` | Placeholders, disabled |
| Brand / primary | `evergreen` | `#14504A` | Section markers, links, primary surfaces |
| Accent / "highlighter" | `marigold` | `#C8781E` | The **single** primary action + progress fill |
| Hairline | `line` | `#E7DFD1` | Borders, ruled underlines, dividers |
| Success | `sage` | `#0F766E` | Saved/complete confirmation |
| Danger | `oxblood` | `#B4423A` | Validation errors, destructive |

**One accent rule:** marigold appears at most once per view (the primary CTA or the active
progress). Everything else is ink, evergreen, and paper. No gradients.

## Typography

- **Display / headings:** `Newsreader` (editorial serif) — warmth + credibility, built for
  reading. Weights 400–600.
- **UI / body:** `Public Sans` (humanist sans, US Web Design System) — clean and distinctive,
  deliberately **not** Inter/Roboto.
- **Numerals:** tabular figures (`font-variant-numeric: tabular-nums`) for GPA, scores, counts.
- `font-display: swap`. Scale: Display 30–36 / Section 22–24 / Body 16–17 / Label 13.
  Body line-height 1.6; measure capped ~65ch.

## Spacing & layout

4/8px rhythm. Single-column, generously spaced collection surfaces (max-w ~40rem for a
flow, ~64rem for the review hub). One meaningful decision — or one small coherent cluster
— visible at a time. Reason-for-asking copy sits as a quiet margin/subhead note, never a
modal.

## Interaction language

- **Ruled underlines** under section titles (evergreen hairline) — the almanac motif.
- **Section tabs** in the review hub read like planner dividers, not pill nav.
- **Stamped "Saved"** mark (sage, small caps) for autosave; states: `saving` (quiet
  spinner) → `saved` (stamp) → `error` (oxblood, retry). Non-intrusive, `aria-live=polite`.
- **Progress** as a thin chapter ribbon with marigold fill — calm, not a gamified XP bar.
- **Reused fields** shown as a `paper-deep` chip: "We'll use your GPA: 3.9 · Edit" — never
  re-asked, always correctable.
- Motion 150–250ms ease-out, mostly opacity/transform; **fully disabled under
  `prefers-reduced-motion`** (the paper aesthetic already favors near-instant transitions).

## Component rules

- One primary CTA per view (marigold, filled). Secondary = ghost/ink-outline.
- Inputs: `paper-card` fill, `line` border, evergreen focus ring (2px, visible), ≥44px tall.
- Cards: soft warm shadow, `line` border, radius 12–16px — **not** oversized rounded-white.
- Icons: `lucide-react` only (already in repo), 1.5px stroke, consistent sizing. No emoji.
- Labels always visible (never placeholder-only). Errors inline, below the field, on blur.

## Explicit anti-patterns (do not use)

- ❌ Indigo→purple / purple→pink gradients (the current app look we're replacing here)
- ❌ Glassmorphism, blur-for-decoration
- ❌ Bento-card grids
- ❌ Oversized rounded white SaaS cards
- ❌ Generic Inter / Roboto as the brand type
- ❌ AI sparkles, fake chat bubbles, "assistant" framing
- ❌ Exposing internal LLM terminology to students
- ❌ A skip button used only to justify asking an unnecessary question now
