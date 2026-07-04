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

export function focusForCountry(
  cc: string,
  currency: string,
): { lat: number; lng: number } | null {
  if (currency === "EUR" && EURO_CAPITALS[cc]) return EURO_CAPITALS[cc];
  return CURRENCY_FOCUS[currency] ?? null;
}
