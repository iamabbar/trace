# trace

A frontend performance analyzer. Enter a URL, get a Lighthouse-style report:
category scores, Core Web Vitals, lab metrics, prioritized issues, fix
recommendations, and a resource breakdown.

**Live:** [trace-performance.vercel.app](https://trace-performance.vercel.app)

## Setup

```bash
npm install
```

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:3001   # trace-api, see its own README
```

## Scripts

| Command              | Description                 |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start the dev server         |
| `npm run build`      | Type-check and build         |
| `npm run preview`    | Preview the production build |
| `npm run typecheck`  | Type-check without building  |
| `npm run lint`       | Lint                          |
| `npm run format`     | Format with Prettier          |

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query.

## Deploy

Deployed on Vercel as a static Vite build. `VITE_API_URL` is read at build
time, so it must be set in the Vercel project's environment variables before
building, not after.
