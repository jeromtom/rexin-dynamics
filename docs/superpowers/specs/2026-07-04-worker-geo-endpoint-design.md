# Worker Geo Endpoint

**Date:** 2026-07-04
**Status:** Proceeding under Jerom's "go on" (2026-07-04); the trace endpoint was confirmed dead in production
**Scope:** `rexin-dynamics/` on branch `feat/worker-geo-endpoint` off main

## Problem

`src/lib/geo.ts` fetches `/cdn-cgi/trace` for the visitor's country, but that path is not served on the Workers custom domain: it 308-redirects into the site's Next 404 page. Production geo detection therefore always uses the timezone fallback and logs one 404 console error per page load.

## Fix

The site already deploys as a Cloudflare Worker with assets, so the Worker itself can report the country Cloudflare attaches to every request.

1. **New Worker script `worker/index.js`** (plain JS, outside `src/`, so no new type dependencies and no interaction with the Next build):
   - `GET /api/geo` → `200 {"country":"XX"}` JSON from `request.cf?.country` (`null` when absent), `Cache-Control: no-store`.
   - Every other request → `env.ASSETS.fetch(request)` (unchanged static serving).
2. **`wrangler.jsonc`:** add `"main": "worker/index.js"` and `"assets": { "directory": "./out", "binding": "ASSETS" }`. With assets + main, Cloudflare serves matching static assets first by default; only non-asset paths (like /api/geo) reach the Worker, so site serving behavior is unchanged.
3. **`src/lib/geo.ts`:** `detectCountry()` fetches `/api/geo` (same 3s AbortController pattern) instead of `/cdn-cgi/trace`; parses JSON `{country}`; accepts only `/^[A-Z]{2}$/`; keeps the timezone fallback exactly as is (it remains the path in `next dev`, where no Worker runs).

## Acceptance

- `npm run lint && npm run build` pass.
- `npm run preview` (wrangler dev): `/api/geo` returns 200 JSON with a 2-letter country (wrangler dev populates `request.cf`); `/` serves the homepage; a deep asset (e.g. `/og-image.jpg`) serves; an unknown path still returns the Next 404 page.
- In the browser against wrangler dev: geo detection resolves via `/api/geo` (visible in the network tab) with zero console errors, currency preselects.
- After production deploy: `curl https://rexindynamics.com/api/geo` returns the country; homepage, a legal page, and og-image all still serve; no `/cdn-cgi/trace` requests remain (console clean). Rollback plan: previous Worker version `1a476c0d` via `wrangler rollback` if anything misroutes.

## Out of scope

Team-section changes (parked for Jerom), analytics, particle hero.
