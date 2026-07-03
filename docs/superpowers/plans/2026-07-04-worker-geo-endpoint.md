# Worker Geo Endpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve visitor country from the site's own Worker (`/api/geo`) and point `detectCountry()` at it, replacing the dead `/cdn-cgi/trace` path. Spec: `docs/superpowers/specs/2026-07-04-worker-geo-endpoint-design.md`.

**Architecture:** One plain-JS Worker script outside `src/`, one wrangler.jsonc addition, one function edit in `src/lib/geo.ts`. Single task.

**Tech Stack:** Cloudflare Workers (assets + main), wrangler 4.x, Next.js 15 static export.

## Global Constraints

- NO new dependencies (worker is plain JS; no workers-types).
- Static site serving must be byte-identical: with assets + main, assets are matched FIRST by default; verify `run_worker_first` is NOT set.
- Timezone fallback in `geo.ts` stays untouched; only the primary fetch changes.
- Commit bodies end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: Endpoint + wiring

**Files:**
- Create: `worker/index.js`
- Modify: `wrangler.jsonc`
- Modify: `src/lib/geo.ts` (detectCountry only)

- [ ] **Step 1: Worker script**

```js
// worker/index.js
/* Serves /api/geo from the country Cloudflare attaches to each request.
   All other paths fall through to the static assets (the exported site). */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/geo") {
      const country = request.cf?.country ?? null;
      return new Response(JSON.stringify({ country }), {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
```

- [ ] **Step 2: wrangler.jsonc**

```jsonc
{
	"name": "rexin-dynamics",
	"compatibility_date": "2024-09-10",
	"main": "worker/index.js",
	"assets": {
		"directory": "./out",
		"binding": "ASSETS"
	}
}
```

- [ ] **Step 3: geo.ts — replace the trace fetch inside `detectCountry()`**

```ts
/* The site's own Worker reports the country Cloudflare attaches to the
   request (see worker/index.js). Unavailable under `next dev`, where the
   timezone fallback below takes over. 3s timeout so slow networks never
   delay anything visible. */
export async function detectCountry(): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch("/api/geo", { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { country?: string | null };
      if (typeof data.country === "string" && /^[A-Z]{2}$/.test(data.country) && data.country !== "XX") {
        return data.country;
      }
    }
  } catch {
    // fall through to timezone fallback
  }
  return countryFromTimezone();
}
```

(Keep `countryFromTimezone` and everything else in the file untouched. Note the previous review found the timer is not cleared when fetch rejects — fix that here with try/finally around the fetch/clearTimeout if straightforward.)

- [ ] **Step 4: Verify locally**

1. `npm run lint && npm run build`.
2. `npm run preview` (wrangler dev; background it, note the port): `curl localhost:PORT/api/geo` → 200 JSON with a 2-letter country or null; `curl -s -o /dev/null -w "%{http_code}" localhost:PORT/` → 200; same for `/og-image.jpg` and `/terms/`; an unknown path (e.g. `/nope`) returns the 404 page.
3. Browser against wrangler dev: load the site, network tab shows `/api/geo` 200, zero console errors, currency chip preselects (wrangler dev may report your real country via `request.cf`).
4. Kill wrangler dev.

- [ ] **Step 5: Commit**

```bash
git add worker/index.js wrangler.jsonc src/lib/geo.ts
git commit -m "Serve visitor country from the Worker, replacing dead trace path"
```

---

### Task 2: Review, deploy, production verify (controller-run)

- [ ] Task review of the diff; then merge to main, deploy (`CLOUDFLARE_ACCOUNT_ID=9f7e4d46cbee40a399480ecd03246d9e script -q /dev/null npm run deploy`), and verify production per the spec's acceptance list. Rollback: previous version `1a476c0d`.
