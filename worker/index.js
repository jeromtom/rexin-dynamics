// worker/index.js
/* Serves /api/geo from the country Cloudflare attaches to each request.
   All other paths fall through to the static assets (the exported site). */
const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const noIndex = env.DEPLOY_ENV === "preview";
    if (url.hostname === "www.rexindynamics.com") {
      return new Response(null, {
        status: 308,
        headers: {
          Location: "https://rexindynamics.com/",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }
    if (url.pathname === "/api/geo" || url.pathname === "/api/geo/") {
      if (request.method !== "GET") return new Response(null, { status: 405 });
      const response = new Response(JSON.stringify({ country: request.cf?.country ?? null }), {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
      });
      return noIndex ? withNoIndex(response) : response;
    }
    const response = await env.ASSETS.fetch(request);
    return noIndex ? withNoIndex(response) : response;
  },
};

function withNoIndex(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
export default worker;
