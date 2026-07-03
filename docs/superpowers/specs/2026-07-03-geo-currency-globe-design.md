# Geo-detected Currency and Globe Focus

**Date:** 2026-07-03
**Status:** Approved by Jerom (design review in Claude Code session)
**Scope:** rexindynamics.com homepage Global section (`src/app/page.tsx`, `src/components/rx/GlobeNetwork.tsx` untouched unless noted)
**Depends on:** branch `feat/motion-pass-phase1` (builds on its page.tsx state)

## Goal

Detect the visitor's country and automatically preselect their invoice currency chip, update the invoice card, and fly the globe to their region with the ring pulse and the 💸/📄 emoji arcs, using the existing focus mechanics. Alongside this, expand the billed-currency list from six to ten.

## Currency expansion

New full list (order as shown in chips): USD, CAD, AED, GBP, EUR, INR, AUD, SGD, NZD, CHF.

- New entries in `CURRENCIES` (code, name, region, symbol, emoji): AUD "Australian Dollar" / Australia / A$ / 💵; SGD "Singapore Dollar" / Singapore / S$ / 💵; NZD "New Zealand Dollar" / New Zealand / NZ$ / 💵; CHF "Swiss Franc" / Switzerland / empty `sym` (the chip renders just "CHF"; a "CHF CHF" chip would be wrong) / no emoji (flyer falls back to 💸, as AED and INR already do).
- New `CURRENCY_FOCUS` targets: AUD → Sydney (-33.87, 151.21), SGD → Singapore (1.35, 103.82), NZD → Auckland (-36.85, 174.76), CHF → Zurich (47.37, 8.54).
- Copy updates required for honesty (Jerom confirmed all ten are receivable via Wise/Skydo/Infinity):
  - Hero stat "5+" currencies → "10".
  - FAQ answers listing currencies ("USD, CAD, AED, GBP, EUR and INR") → the ten-currency list, in both FAQ entries that mention it.
  - No change to the invoice-card sentence template; it already interpolates code/region.

## Detection (Option A: Cloudflare trace + timezone fallback)

1. On mount, fetch same-origin `/cdn-cgi/trace` (plain text; parse the `loc=XX` line). Cloudflare serves this on the production domain; nothing is stored, country-level only, no consent banner needed.
2. If the fetch fails or the response has no `loc` (localhost, non-Cloudflare hosting, ad blockers), fall back to mapping `Intl.DateTimeFormat().resolvedOptions().timeZone` to a country code via a small IANA-zone-to-country table covering the mapped countries only (e.g. "Australia/Sydney" → AU, "Europe/Paris" → FR). Unknown timezone → no detection.
3. Map country code → currency: US→USD, CA→CAD, AE→AED, GB→GBP, IN→INR, AU→AUD, SG→SGD, NZ→NZD, CH→CHF, and the 20 Eurozone codes (AT BE HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES) → EUR.
4. Unmatched or undetected → no change: USD stays selected, globe keeps idle rotation, no auto-flight (today's behavior).

## Behavior

- Detection runs once on page load and stores a detected currency + flight target in state.
- The currency chip and invoice card reflect the detected currency immediately (no waiting for scroll).
- The globe flight (pointOfView + rings + emoji arcs) fires only when the Global section first enters the viewport (IntersectionObserver, once), so the visitor sees the sequence. Implementation: hold the `focus` prop null until the section is in view, then set it.
- User override always wins: if the visitor clicks any currency chip before detection resolves or after auto-selection, their pick is authoritative and auto-detection never reasserts (a `userPicked` guard, same pattern as HeroFormation's chips).
- Eurozone nicety: EUR visitors fly to their own capital via a country→capital coordinate table for the 20 Eurozone countries; the EUR chip's manual click still flies to Berlin as today.
- Reduced motion: existing GlobeNetwork behavior already handles it (instant pointOfView, no dash animation, no emoji flyers). No new motion added.

## Component/code shape

- New module `src/lib/geo.ts`: pure data + functions, no React. Exports `detectCountry(): Promise<string | null>` (trace then timezone fallback), `currencyForCountry(cc: string): string | null`, `focusForCountry(cc: string, currency: string): { lat, lng }` (Eurozone capitals table, else the currency's canonical city).
- `page.tsx`: one `useEffect` calling `detectCountry()` guarded by `userPicked`; an IntersectionObserver on the `#global` section to release the auto-focus; existing `currency` / `pickedCurrency` state reused.
- `GlobeNetwork.tsx`: no changes expected (focus prop mechanics already do the work).

## Error handling

All failure paths degrade to today's behavior (USD, idle globe). The trace fetch gets a short timeout (~3s) via AbortController so slow networks never delay anything visible; detection is fire-and-forget.

## Testing and verification

- `npm run lint && npm run build` pass.
- Browser checks: simulate detection by stubbing the trace response (dev has no /cdn-cgi/trace, so the timezone fallback path is the naturally testable one; Kochi timezone → IN → INR chip preselected, globe flies to Delhi when the section scrolls in). Chip override after auto-selection sticks. Unmatched-country path leaves USD idle. 375 px layout with ten chips wraps acceptably.
- Production sanity check after deploy: visit with a VPN or ask an overseas contact to confirm the auto-selection.

## Out of scope

City-level geolocation, IP lookup services, storing any location data, currency conversion rates, changes to legal pages or bank-details page.
