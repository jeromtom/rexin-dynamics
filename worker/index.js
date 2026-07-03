// worker/index.js
/* Serves /api/geo from the country Cloudflare attaches to each request.
   All other paths fall through to the static assets (the exported site). */
const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/geo") {
      if (request.method !== "GET") return new Response(null, { status: 405 });
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
export default worker;
