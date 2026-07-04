# Team Section Update

**Date:** 2026-07-04
**Status:** Approved by Jerom ("yea 2 works": founder-led card + honest AI-engineering note, co-founding history kept)
**Scope:** `src/app/page.tsx` (team section + FAQ founder answer), `src/app/layout.tsx` (JSON-LD founder array), branch `feat/team-section-update`

## Background

Junaid CK (co-founder, CTO) has left the company. Jerom is the sole active founder. The site must reflect the current team truthfully: no fake executives, no AI presented as a human officer, and founding history preserved because it is fact (and matches incorporation records).

## Changes

### 1. Team cards (`page.tsx`, team section)

Replace the two-person array/cards with:

**Card 1 (person, keeps the existing team-card layout):**
- name: `Jerom Tom`, role: `FOUNDER · CEO`, desc: `Leads the vision, strategy and delivery.`, img `/team-jerom.png`, email `jerom@rexindynamics.com`, linkedin `https://linkedin.com/in/jeromtom` (all as today except the role and desc).

**Card 2 (not a person; an honest AI-engineering card):**
- No photo. In place of the 104px avatar, the same-size rounded tile containing `RXIcon name="cpu" size={40}` on `var(--rx-accent-tint)` background with `var(--rx-accent)` color.
- Mono tag (where the role goes): `HOW WE BUILD`
- Title (where the name goes): `AI-native engineering`
- Body: `Engineering at Rexin is led by Jerom and built with AI systems in the loop end to end: Claude works across design, code and review on everything we ship. We build with the tools we sell.`
- No email/linkedin row.

Both cards keep the existing `GlowCard`/`rx-rise` wrappers and grid so the section's look is unchanged.

### 2. FAQ founder answer (`page.tsx`)

Replace: `Rexin Dynamics was founded by Jerom Tom (CEO) and Junaid CK (CTO).`
With: `Rexin Dynamics was co-founded by Jerom Tom and Junaid CK. Today it is led by founder and CEO Jerom Tom, with engineering built around AI systems working alongside him.`

(The FAQ JSON-LD on the page derives from the same array, so it updates automatically.)

### 3. Organization JSON-LD (`layout.tsx`)

In the `founder` array: keep both people (founding is historical fact). Jerom keeps `jobTitle: "CEO"`. Junaid's entry loses `jobTitle: "CTO"` (he no longer holds it) and keeps name + sameAs.

## Constraints

- No other copy changes. No new dependencies. Lint + build pass; `git diff` limited to the two files.
- Verification: dev-server visual check of the team section (desktop + 375 px, both themes); FAQ answer renders; built HTML contains the updated JSON-LD without `"jobTitle":"CTO"`.

## Out of scope

Removing Junaid from git history or credits elsewhere (none exist); the Cloudflare migration (separate work in flight).
