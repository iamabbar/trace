# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**trace** — a frontend performance analyzer. The user enters a URL, the app sends it to a
backend analysis API, and renders a Lighthouse-style report (category scores, Core Web
Vitals, lab metrics, issues, recommendations, resource breakdown).

This repo is frontend-only; the backend (`/api/analyze`) is a separate service. There is no
router — one page (`AnalyzerPage`) drives the whole idle → running → complete/error flow.

## Commands

```bash
npm run dev            # start Vite dev server
npm run build           # tsc -b && vite build
npm run preview         # preview the production build
npm run typecheck       # tsc -b --noEmit
npm run lint            # eslint .
npm run lint:fix
npm run format           # prettier --write .
npm run format:check
```

There is no test runner configured — do not invent test commands.

A single-file check: `npx tsc -b --noEmit` type-checks the whole project (project-reference
builds don't support single-file scoping); use `npx eslint <path>` to lint one file.

## Environment

`VITE_API_URL` (see `.env`) points at the backend, default `http://localhost:3001`. The
backend must be running separately for `analyzeUrl` (`src/lib/api.ts`) to succeed — there is
no mock fallback in the current code.

## Architecture

### Data flow

`useAnalysis` (`src/features/analysis/useAnalysis.ts`) is the state machine for the whole
flow, built on a single `useMutation` (`analyzeUrl` → `POST /api/analyze`):

- `status` is derived from mutation state: `idle | running | complete | error`.
- While pending, a local `setInterval` drives `elapsedMs` on its own clock to animate the
  4-step progress checklist (`analysisSteps.ts`) — this is cosmetic only and is not fed by
  real server progress.
- On error, `buildAnalysisError(hostOf(request.url))` (`analysisErrors.ts`) maps the failure
  into one of a fixed set of user-facing error variants (invalid URL, site unavailable,
  timeout, blocked, generic) — there's no branching for this in the presentational layer,
  it's a discriminated union rendered by one `AnalysisError`-style component.
- `retry` replays the last request; `reset` clears mutation state but keeps the last
  `request` so the form doesn't lose the URL.

`AnalysisReport` (`src/features/analysis/types.ts`) is the single contract type for the
entire report surface — scores, vitals, lab metrics, issues, recommendations, resources.
Treat this type as the API boundary: changes here imply a backend contract change.

### Status is never color alone

Severity (`good | warn | poor | low`) is encoded redundantly with **shape**, not just color:
circle = good, rounded square = needs improvement, triangle = poor, always paired with a text
label. This is accessibility-load-bearing and is centralized in `StatusMark`
(`src/components/ui/statusMark.tsx`) / `toneColor` / `scoreBand` + `BAND_TONES`
(`src/lib/scoring.ts`) — do not re-derive tone-to-shape or score-to-band mapping elsewhere;
extend these instead.

### Project layout

```
src/
├── components/
│   ├── ui/        generic primitives (Button, StatusMark, CodeBlock, UnderlineTabs)
│   └── layout/     AppShell, AppHeader, AppFooter, BrandMark, ThemeToggle
├── features/analysis/
│   ├── components/   one component per report section (CoreWebVitals, IssueList,
│   │                  RecommendationList, ResourceAnalysis, SummaryScores, ...)
│   ├── lib/           analysisErrors.ts, analysisSteps.ts, urlInput.ts
│   ├── types.ts       AnalysisReport and friends — the UI/API contract
│   └── useAnalysis.ts
├── hooks/useTheme.ts
├── lib/            api.ts (axios client), queryClient.ts, scoring.ts
├── pages/analyzerPage.tsx
└── index.css       @theme tokens, dark variant, base layer
```

Flat layout, no workspaces — a deliberate decision to defer `apps/web`/`apps/api` restructure
until the backend actually lands in this repo (it currently doesn't).

### Styling

Tailwind v4, CSS-first (`@tailwindcss/vite`, no `tailwind.config.js`) — all design tokens live
in `src/index.css` under `@theme` plus a `.dark` override. shadcn/ui-style token names are
used (`background`, `foreground`, `primary`, `accent`, `destructive`) merged with the
project's own blueprint palette; don't introduce a second, competing token vocabulary.

Path alias `@/*` → `./src/*`, declared in both `tsconfig.json` (`paths`, no `baseUrl` — TS 6
deprecated it) and `vite.config.ts` (`resolve.alias`). Keep both in sync if it changes.

### Known constraints

- **TypeScript is pinned to ~6.0.2**, not 7.x: `typescript-eslint@8` only supports `<6.1.0`.
  Don't bump TypeScript without checking `typescript-eslint` support first.
- **ESLint runs the stock Vite preset** (not type-aware rules) — floating-promise bugs won't
  be caught by lint. Worth revisiting once more async logic lands.
- `src/components/ui/**` has `react-refresh/only-export-components` turned off — UI
  primitives intentionally export their `cva` variants alongside the component.
- Recharts is **not installed**. Nearly everything that looks like a chart (score meters,
  threshold bars, share-of-weight bars) is a styled CSS primitive, not a chart library — keep
  it that way unless building actual time-series (e.g. a future run-history trend).
