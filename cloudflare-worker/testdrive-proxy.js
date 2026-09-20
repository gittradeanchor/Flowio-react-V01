/**
 * Test Drive proxy (Cloudflare Worker). Written 20 Sept 2026, NOT deployed.
 *
 * Why: the site used to POST straight to the Make webhook, so anyone could read that URL in the browser's
 * network tab and post fake leads (and trigger real SMS). Now the browser posts to THIS Worker. The Make URL and a
 * shared secret live only in the Worker's encrypted variables. Make rejects anything without the secret.
 *
 * Variables to set on the Worker (Settings > Variables, as encrypted secrets):
 *   MAKE_WEBHOOK_URL  the (new, rotated) Make webhook URL
 *   SHARED_SECRET     a long random string (also entered in Make, see README)
 */
const ALLOWED_ORIGINS = ['https://flowio.tradeanchor.com.au', 'https://tradeanchor.com.au'];
const MAX_BODY_BYTES = 5000;

const json = (obj, status, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, cors);

    // Same-site requests (route on flowio.tradeanchor.com.au) may send no Origin; cross-site ones must match.
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'origin' }, 403, cors);

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413, cors);

    let body;
    try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'json' }, 400, cors); }

    // Mobile is required to send a demo (founder rule). Australian mobile formats only.
    const phone = String(body.phone || '').replace(/[\s()-]/g, '');
    if (!/^(\+?61|0)4\d{8}$/.test(phone)) return json({ ok: false, error: 'mobile' }, 422, cors);

    if (!env.MAKE_WEBHOOK_URL || !env.SHARED_SECRET) return json({ ok: false, error: 'not_configured' }, 500, cors);

    const upstream = await fetch(env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TA-Secret': env.SHARED_SECRET },
      body: JSON.stringify(body),
    });

    return upstream.ok ? json({ ok: true }, 200, cors) : json({ ok: false, error: 'upstream' }, 502, cors);
  },
};
