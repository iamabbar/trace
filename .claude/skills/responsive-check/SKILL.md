---
name: responsive-check
description: Visually verify the app's responsive reflow and light/dark theming at the three design breakpoints (390/834/1440px) via live browser screenshots. Use when asked to check responsiveness, verify a breakpoint, or audit layout/theme across screen sizes.
argument-hint: '[state: idle|loading|report|error] [width]'
---

Visual verification was flagged in `.claude/docs/PLAN.md` as never actually having been done
for this project — markup and generated CSS were checked, the rendered result wasn't. This
skill closes that gap using live screenshots, not code reading.

**Breakpoints (from PLAN.md board definitions):** 390px (mobile), 834px (tablet), 1440px (desktop).
**Themes:** light and dark — `data-theme` attribute on `<html>`, driven by `localStorage['trace-theme']`
(see `src/hooks/useTheme.ts`).

If `$ARGUMENTS` names a specific state or width, scope the run to that; otherwise cover all
three widths × both themes × every reachable state.

## 1. Set up

- Invoke the `claude-in-chrome` skill before touching any `mcp__claude-in-chrome__*` tool.
- Check whether a Vite dev server is already running (e.g. `lsof -i :5173` or check for a
  running `vite` process). If not, start `npm run dev` in the background and capture the
  printed local URL.
- Check backend reachability: `curl -sf "${VITE_API_URL:-http://localhost:3001}"` (or just
  attempt a real analyze later and see what happens). This determines which states are
  reachable:
  - **idle** (the URL form) — always reachable.
  - **loading** — reachable only mid-request; capture it quickly after submitting, before it resolves.
  - **complete / report** — only reachable if the backend is up and returns a real `AnalysisReport`.
  - **error** — reachable on demand by submitting a URL while the backend is down/unreachable, or an invalid URL for the client-side validation error.
- Note which states you could and couldn't reach in the final report — don't fabricate a
  report screenshot if the backend never responded.
- **Capability probe:** `resize_window` once to the first target width, check
  `window.innerWidth` matches. If not, the sandbox can't resize — don't retry,
  ask the user once how to proceed (fixed-width test / static audit / fix tooling).

## 2. For each width × theme combination

1. Resize the browser viewport to the target width.
2. Set the theme: either click the theme toggle button (`aria-label` contains "Switch to …
   theme") or set `localStorage.setItem('trace-theme', '<light|dark>')` and reload.
3. Screenshot the idle state.
4. If the backend is reachable, submit a real URL via the `$ analyze` field, screenshot the
   loading state (progress checklist / elapsed timer), wait for completion, then screenshot
   the full report — scroll and capture in sections if the page is taller than the viewport.
5. Check for horizontal overflow at every width, especially 390px:
   `document.documentElement.scrollWidth > document.documentElement.clientWidth` — this must
   be `false` at 390px per the project's own exit criterion.

## 3. Check against the documented reflow rules

From `.claude/docs/PLAN.md` Phase 8 — confirm these rather than assuming them. Known from
code already (don't re-derive, just confirm visually when possible):

- Score grid / Core Web Vitals reflow — _(fluid auto-fit grid, not breakpoints — likely fine)_
- Resource table → cards — _(confirmed absent, still a `<table>`)_
- Issues → cards — _(moot, never a table)_
- Header collapses/condenses at mobile width.
- Any tab/segmented-control strip scrolls horizontally rather than wrapping or overflowing the page.
- No page-level horizontal scroll at 390px.
- Focus-visible ring is present and legible in both themes (tab through interactive elements and screenshot the focus state at least once).

## 4. Report

List findings as `<width>px × <theme> × <state>` → pass, or a concrete description of what's
wrong (e.g. "resource table still renders as a table at 390px instead of card rows — see
`src/features/analysis/components/resourceAnalysis.tsx`"). Point to the component file
responsible for each failure so the fix is actionable. Don't modify code as part of this
skill — report only, unless the user explicitly asks you to fix what you find.

## 5. Clean up

Close any tabs you opened. If you started the dev server yourself for this check, stop it;
leave it running if it was already running beforehand.
