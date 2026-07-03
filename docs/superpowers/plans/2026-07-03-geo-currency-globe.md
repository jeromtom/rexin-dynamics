# Geo-detected Currency and Globe Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect the visitor's country, preselect their invoice currency (from an expanded ten-currency list), and fly the globe to their region with rings and emoji arcs when the Global section scrolls into view, per `docs/superpowers/specs/2026-07-03-geo-currency-globe-design.md`.

**Architecture:** A new pure module `src/lib/geo.ts` owns all location data and detection (Cloudflare `/cdn-cgi/trace` with an IANA-timezone fallback). `src/app/page.tsx` wires it into the existing `currency`/focus state with a `userPicked` guard and an IntersectionObserver gate on `#global`. `GlobeNetwork.tsx` is untouched.

**Tech Stack:** Next.js 15 static export, React 19, TypeScript. No new dependencies.

## Global Constraints

- NO new npm dependencies.
- `GlobeNetwork.tsx` must not be modified.
- All failure paths (trace fetch fails, unknown timezone, unmatched country) degrade to today's behavior: USD selected, idle globe, no auto-flight.
- User override always wins: once the visitor clicks any currency chip, auto-detection never changes currency or focus.
- No location data is stored (no cookies, no localStorage); detection is per-pageview, country-level only.
- Copy honesty: hero stat becomes exactly "10" (no "+"), FAQ currency list becomes exactly "USD, CAD, AED, GBP, EUR, INR, AUD, SGD, NZD and CHF".
- This repo has NO test runner and none may be added. Verification per task: `npm run lint && npm run build` pass, plus the browser checks named in the task (dev server may pick a port other than 3000; use what it prints; kill it after).
- Work on branch `feat/geo-currency-globe` (already created, stacked on `feat/motion-pass-phase1`).
- Commit message bodies end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

## Codebase orientation

- `src/app/page.tsx`: `CURRENCIES` array (~line 45), `CURRENCY_FOCUS` map (~line 56), hero stat `{ idx: "04", value: "5", unit: "+", label: "currencies billed" }` (line 32), FAQ currency sentence (line 99), currency chips + `GlobeNetwork` usage in the `#global` section (~lines 515-575). State today: `currency` (chip selection, default "USD"), `pickedCurrency` (string | null; set on chip click; drives the globe `focus` prop via `CURRENCY_FOCUS`).
- `GlobeNetwork` accepts `focus?: { lat, lng, emoji? } | null` and handles fly-to, rings, and emoji arc flyers itself, including reduced motion.

---

### Task 1: `src/lib/geo.ts` — data and detection module

**Files:**
- Create: `src/lib/geo.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces (Task 3 relies on these exact signatures):
  - `detectCountry(): Promise<string | null>` — ISO-3166 alpha-2 uppercase or null.
  - `currencyForCountry(cc: string): string | null` — currency code or null if unmapped.
  - `focusForCountry(cc: string, currency: string): { lat: number; lng: number } | null`
  - `CURRENCY_FOCUS: Record<string, { lat: number; lng: number }>` — canonical city per currency, all ten codes (Task 2 imports this into page.tsx, replacing the local copy).

- [ ] **Step 1: Create the module**

```ts
// src/lib/geo.ts
/* Country detection and currency/geo mapping for the Global section.
   Pure data + functions; no React. Detection is per-pageview and
   country-level only — nothing is stored. */

export const CURRENCY_FOCUS: Record<string, { lat: number; lng: number }> = {
  USD: { lat: 40.71, lng: -74.0 },   // New York
  CAD: { lat: 43.65, lng: -79.38 },  // Toronto
  AED: { lat: 25.2, lng: 55.27 },    // Dubai
  GBP: { lat: 51.51, lng: -0.13 },   // London
  EUR: { lat: 52.52, lng: 13.4 },    // Berlin
  INR: { lat: 28.61, lng: 77.21 },   // Delhi (keeps the Kochi arc visible)
  AUD: { lat: -33.87, lng: 151.21 }, // Sydney
  SGD: { lat: 1.35, lng: 103.82 },   // Singapore
  NZD: { lat: -36.85, lng: 174.76 }, // Auckland
  CHF: { lat: 47.37, lng: 8.54 },    // Zurich
};

const EUROZONE = ["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"] as const;

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD", CA: "CAD", AE: "AED", GB: "GBP", IN: "INR",
  AU: "AUD", SG: "SGD", NZ: "NZD", CH: "CHF",
  ...Object.fromEntries(EUROZONE.map((c) => [c, "EUR"])),
};

/* Eurozone visitors fly to their own capital instead of Berlin. */
const EURO_CAPITALS: Record<string, { lat: number; lng: number }> = {
  AT: { lat: 48.21, lng: 16.37 }, BE: { lat: 50.85, lng: 4.35 },
  HR: { lat: 45.81, lng: 15.98 }, CY: { lat: 35.19, lng: 33.38 },
  EE: { lat: 59.44, lng: 24.75 }, FI: { lat: 60.17, lng: 24.94 },
  FR: { lat: 48.86, lng: 2.35 },  DE: { lat: 52.52, lng: 13.4 },
  GR: { lat: 37.98, lng: 23.73 }, IE: { lat: 53.35, lng: -6.26 },
  IT: { lat: 41.9, lng: 12.5 },   LV: { lat: 56.95, lng: 24.11 },
  LT: { lat: 54.69, lng: 25.28 }, LU: { lat: 49.61, lng: 6.13 },
  MT: { lat: 35.9, lng: 14.51 },  NL: { lat: 52.37, lng: 4.9 },
  PT: { lat: 38.72, lng: -9.14 }, SK: { lat: 48.15, lng: 17.11 },
  SI: { lat: 46.06, lng: 14.51 }, ES: { lat: 40.42, lng: -3.7 },
};

/* Fallback when /cdn-cgi/trace is unavailable (localhost, ad blockers):
   map the browser's IANA timezone to a country we bill. Only zones for
   mapped countries are listed; anything else returns null. */
const TZ_TO_COUNTRY: Record<string, string> = {
  // United States
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Phoenix": "US", "America/Los_Angeles": "US", "America/Anchorage": "US",
  "America/Detroit": "US", "Pacific/Honolulu": "US",
  // Canada
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA",
  "America/Winnipeg": "CA", "America/Halifax": "CA", "America/St_Johns": "CA",
  // UAE, UK, India
  "Asia/Dubai": "AE",
  "Europe/London": "GB",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  // Australia, Singapore, New Zealand, Switzerland
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
  "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Australia/Hobart": "AU",
  "Asia/Singapore": "SG",
  "Pacific/Auckland": "NZ",
  "Europe/Zurich": "CH",
  // Eurozone
  "Europe/Vienna": "AT", "Europe/Brussels": "BE", "Europe/Zagreb": "HR",
  "Asia/Nicosia": "CY", "Europe/Tallinn": "EE", "Europe/Helsinki": "FI",
  "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Athens": "GR",
  "Europe/Dublin": "IE", "Europe/Rome": "IT", "Europe/Riga": "LV",
  "Europe/Vilnius": "LT", "Europe/Luxembourg": "LU", "Europe/Malta": "MT",
  "Europe/Amsterdam": "NL", "Europe/Lisbon": "PT", "Europe/Bratislava": "SK",
  "Europe/Ljubljana": "SI", "Europe/Madrid": "ES",
};

function countryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (tz && TZ_TO_COUNTRY[tz]) || null;
  } catch {
    return null;
  }
}

/* Cloudflare serves /cdn-cgi/trace on the production domain; the `loc=`
   line is the visitor's country. 3s timeout so slow networks never
   delay anything visible. */
export async function detectCountry(): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch("/cdn-cgi/trace", { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      const m = text.match(/(?:^|\n)loc=([A-Z]{2})/);
      if (m && m[1] !== "XX") return m[1];
    }
  } catch {
    // fall through to timezone fallback
  }
  return countryFromTimezone();
}

export function currencyForCountry(cc: string): string | null {
  return COUNTRY_TO_CURRENCY[cc] ?? null;
}

export function focusForCountry(
  cc: string,
  currency: string,
): { lat: number; lng: number } | null {
  if (currency === "EUR" && EURO_CAPITALS[cc]) return EURO_CAPITALS[cc];
  return CURRENCY_FOCUS[currency] ?? null;
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build`
Expected: both pass (the module is not imported yet; the build proves it typechecks).

- [ ] **Step 3: Commit**

```bash
git add src/lib/geo.ts
git commit -m "Add country detection and currency geo mapping module"
```

---

### Task 2: Ten currencies + honest copy

**Files:**
- Modify: `src/app/page.tsx` (CURRENCIES ~line 45, CURRENCY_FOCUS ~line 56, hero stat line 32, FAQ line 99)

**Interfaces:**
- Consumes: `CURRENCY_FOCUS` from `@/lib/geo` (Task 1).
- Produces: the ten-entry `CURRENCIES` array Task 3's detection maps onto.

- [ ] **Step 1: Extend `CURRENCIES` in `page.tsx`**

Append after the INR entry (keeping the existing six unchanged):

```tsx
  { code: "AUD", name: "Australian Dollar", region: "Australia", sym: "A$", emoji: "💵" },
  { code: "SGD", name: "Singapore Dollar", region: "Singapore", sym: "S$", emoji: "💵" },
  { code: "NZD", name: "New Zealand Dollar", region: "New Zealand", sym: "NZ$", emoji: "💵" },
  { code: "CHF", name: "Swiss Franc", region: "Switzerland", sym: "", emoji: "" },
```

(CHF gets empty `sym` so the chip reads "CHF", not "CHF CHF"; empty emoji falls back to 💸 in the flyer, like AED and INR.)

- [ ] **Step 2: Replace the local `CURRENCY_FOCUS` with the shared one**

Delete the local `CURRENCY_FOCUS` constant (and its comment) from `page.tsx` and import instead:

```tsx
import { CURRENCY_FOCUS } from "@/lib/geo";
```

Keep the INR-uses-Delhi comment behavior — it is preserved inside `geo.ts`.

- [ ] **Step 3: Copy updates**

Hero stat (line 32): `{ idx: "04", value: "5", unit: "+", label: "currencies billed" }` → `{ idx: "04", value: "10", unit: "", label: "currencies billed" }`.

FAQ (line 99): replace `We invoice in USD, CAD, AED, GBP, EUR and INR and settle through local bank accounts` with `We invoice in USD, CAD, AED, GBP, EUR, INR, AUD, SGD, NZD and CHF and settle through local bank accounts` (rest of the sentence unchanged).

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`, then in the dev server: the Global section shows ten chips wrapping cleanly at desktop and 375 px; clicking AUD/SGD/NZD/CHF flies the globe to Sydney/Singapore/Auckland/Zurich with arcs; the CHF chip reads "CHF"; hero stat counts to 10 with no "+"; the FAQ answer lists all ten.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "Expand invoice currencies to ten and update copy"
```

---

### Task 3: Detection wiring in page.tsx

**Files:**
- Modify: `src/app/page.tsx` (state block ~line 135, chip onClick ~line 526, GlobeNetwork usage ~line 565, new effects after the existing ones)

**Interfaces:**
- Consumes: `detectCountry`, `currencyForCountry`, `focusForCountry` from `@/lib/geo` (Task 1); ten-currency `CURRENCIES` (Task 2).
- Produces: user-visible behavior only.

- [ ] **Step 1: Extend the geo import and add state**

```tsx
import { CURRENCY_FOCUS, detectCountry, currencyForCountry, focusForCountry } from "@/lib/geo";
```

In `Home()`, alongside the existing state:

```tsx
  const [detected, setDetected] = useState<{ currency: string; lat: number; lng: number } | null>(null);
  const [globalSeen, setGlobalSeen] = useState(false);
  const userPickedCurrency = useRef(false);
```

- [ ] **Step 2: Detection effect (runs once)**

```tsx
  // Preselect the visitor's invoice currency from their country; the
  // globe flight waits until the Global section is on screen.
  useEffect(() => {
    let stale = false;
    detectCountry().then((cc) => {
      if (stale || !cc || userPickedCurrency.current) return;
      const cur = currencyForCountry(cc);
      if (!cur) return;
      const pos = focusForCountry(cc, cur);
      if (!pos) return;
      setCurrency(cur);
      setDetected({ currency: cur, ...pos });
    });
    return () => {
      stale = true;
    };
  }, []);
```

- [ ] **Step 3: Global-section-in-view effect**

```tsx
  // Fire the auto flight only once the visitor can see the globe.
  useEffect(() => {
    const el = document.getElementById("global");
    if (!el || !("IntersectionObserver" in window)) {
      setGlobalSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setGlobalSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
```

- [ ] **Step 4: Focus resolution**

The globe `focus` today derives from `pickedCurrency`. Replace that expression so a manual pick wins, and the detected flight fires once both detection and visibility are in:

```tsx
  const globeFocus = pickedCurrency
    ? {
        ...CURRENCY_FOCUS[pickedCurrency],
        emoji: CURRENCIES.find((c) => c.code === pickedCurrency)?.emoji || "💸",
      }
    : detected && globalSeen
      ? {
          lat: detected.lat,
          lng: detected.lng,
          emoji: CURRENCIES.find((c) => c.code === detected.currency)?.emoji || "💸",
        }
      : null;
```

and pass `focus={globeFocus}` to `<GlobeNetwork />` (replacing the current inline ternary).

- [ ] **Step 5: Mark manual picks**

In the currency chip `onClick`, add `userPickedCurrency.current = true;` as the first line (before `setCurrency` / `setPickedCurrency`). Because `pickedCurrency` takes precedence in `globeFocus`, a manual pick immediately overrides any detected focus.

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`, then in the dev server (localhost has no `/cdn-cgi/trace`, so the timezone fallback drives this — an India timezone maps to INR):
1. Load the page, scroll to Global: INR chip is already active, the invoice card shows Indian Rupee, and as the section enters view the globe flies to Delhi with rings and the 💸/📄 arcs.
2. Reload, click USD before scrolling down: chip stays USD, and the globe flight goes to New York when the section appears (manual pick wins over detection).
3. Simulate an unmapped visitor: in DevTools sensors override timezone to e.g. `America/Sao_Paulo`, reload — USD stays selected, no auto flight, globe idles.
4. Simulate a Eurozone visitor: override timezone to `Europe/Paris`, reload — EUR chip active, flight lands on Paris (not Berlin).
5. Reduced motion emulation: detection still preselects the chip; the globe snaps (no animated flight), no emoji flyers — existing GlobeNetwork behavior.
Kill the dev server after.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "Preselect visitor currency and auto-focus the globe"
```

---

### Task 4: Full verification pass

**Files:**
- No code changes expected (fixes only if checks fail).

- [ ] **Step 1:** `npm run lint && npm run build` clean.
- [ ] **Step 2:** In the dev server, walk Task 3 Step 6's five checks end to end plus: ten chips at 375 px with no horizontal overflow; theme toggle (both themes); the `out/index.html` export still contains the FAQ text (SEO intact).
- [ ] **Step 3:** Push the branch: `git push -u origin feat/geo-currency-globe`. Do NOT open a PR or merge — Jerom walks the diff first.
