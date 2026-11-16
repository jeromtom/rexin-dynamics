// src/lib/geo.ts
/* Country detection and currency mapping for the Operations section.
   Pure data + functions; no React. Detection is per-pageview and
   country-level only — nothing is stored. */

const EUROZONE = ["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"] as const;

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD", CA: "CAD", AE: "AED", GB: "GBP", IN: "INR",
  AU: "AUD", SG: "SGD", NZ: "NZD", CH: "CHF",
  ...Object.fromEntries(EUROZONE.map((c) => [c, "EUR"])),
};

/* Fallback when /cdn-cgi/trace is unavailable (localhost, ad blockers):
   map the browser's IANA timezone to a country we bill. Only zones for
   mapped countries are listed; anything else returns null. */
const TZ_TO_COUNTRY: Record<string, string> = {
  // United States
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Phoenix": "US", "America/Los_Angeles": "US", "America/Anchorage": "US",
  "America/Detroit": "US", "Pacific/Honolulu": "US",
  "America/Indiana/Indianapolis": "US", "America/Boise": "US", "America/Kentucky/Louisville": "US",
  // Canada
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA",
  "America/Winnipeg": "CA", "America/Halifax": "CA", "America/St_Johns": "CA",
  "America/Regina": "CA", "America/Whitehorse": "CA",
  // UAE, UK, India
  "Asia/Dubai": "AE",
  "Europe/London": "GB",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  // Australia, Singapore, New Zealand, Switzerland
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
  "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Australia/Hobart": "AU",
  "Australia/Darwin": "AU",
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
  "Atlantic/Madeira": "PT", "Atlantic/Azores": "PT",
  "Asia/Famagusta": "CY",
};

function countryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (tz && TZ_TO_COUNTRY[tz]) || null;
  } catch {
    return null;
  }
}

/* The site's own Worker reports the country Cloudflare attaches to the
   request (see worker/index.js). Unavailable under `next dev`, where the
   timezone fallback below takes over. 3s timeout so slow networks never
   delay anything visible. */
export async function detectCountry(): Promise<string | null> {
  // The /api/geo endpoint only exists in the Cloudflare Worker (see
  // worker/index.js); it is never present under plain `next dev`, so the
  // fetch below always 404s there and Chrome logs a network error. Short-
  // circuit straight to the timezone fallback in dev. `npm run preview` and
  // production both run the built Worker, so this branch never applies
  // there. Next.js inlines NODE_ENV at build time, so the production
  // bundle drops this check entirely and is unaffected.
  if (process.env.NODE_ENV === "development") return countryFromTimezone();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    try {
      const res = await fetch("/api/geo", { signal: ctrl.signal });
      if (res.ok) {
        const data = (await res.json()) as { country?: string | null };
        if (typeof data.country === "string" && /^[A-Z]{2}$/.test(data.country) && data.country !== "XX") {
          return data.country;
        }
      }
    } finally {
      clearTimeout(timer);
    }
  } catch {
    // fall through to timezone fallback
  }
  return countryFromTimezone();
}

export function currencyForCountry(cc: string): string | null {
  return COUNTRY_TO_CURRENCY[cc] ?? null;
}
