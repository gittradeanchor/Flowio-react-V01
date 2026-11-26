/**
 * Pre-install form proxy (Cloudflare Worker). Drafted 26 Nov 2026, NOT deployed.
 *
 * The production backend's POST /preinstall is server-to-server: it refuses anything not signed with a shared
 * secret (HMAC-SHA256 of `${ts}.${payload}`, ts in seconds, within 5 minutes). A browser cannot hold that secret,
 * so the form posts here, and this Worker signs and forwards. The secret never reaches the page.
 *
 * Variables (encrypted, on the Worker):
 *   PREINSTALL_API_URL  full production gateway URL of POST /preinstall
 *   PREINSTALL_SECRET   same value as the backend's secret (FLOWIO_PREINSTALL_SECRET_ID in Secret Manager)
 * Route: tradeanchor.com.au/api/preinstall
 *
 * Body from the form: { token, payload } where payload is the JSON string the form already builds
 * (event, timestamp, token, pid, essentialsPct, form). Response: the backend's JSON, reduced to { ok, status }.
 */
const ALLOWED_ORIGINS = ['https://tradeanchor.com.au', 'https://www.tradeanchor.com.au'];
const MAX_BODY_BYTES = 200000;

const json = (obj, status, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });

async function sign(secret, ts, payload) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${ts}.${payload}`));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

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
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'origin' }, 403, cors);
    if (!env.PREINSTALL_API_URL || !env.PREINSTALL_SECRET) return json({ ok: false, error: 'not_configured' }, 500, cors);

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413, cors);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'json' }, 400, cors); }
    const payload = typeof body.payload === 'string' ? body.payload : '';
    let parsed;
    try { parsed = JSON.parse(payload); } catch { return json({ ok: false, error: 'payload' }, 400, cors); }
    if (!parsed || typeof parsed.token !== 'string' || !parsed.token.trim()) return json({ ok: false, error: 'token' }, 400, cors);

    const ts = String(Math.floor(Date.now() / 1000));
    const signature = await sign(env.PREINSTALL_SECRET, ts, payload);
    const upstream = await fetch(env.PREINSTALL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ts, payload, signature }),
    });
    let result = {};
    try { result = await upstream.json(); } catch { /* non-JSON upstream: treated as failure below */ }
    if (upstream.ok && result && result.ok) return json({ ok: true, status: result.status || 'STAGED' }, 200, cors);
    return json({ ok: false, error: 'upstream', code: String(result && result.code || upstream.status) }, upstream.status === 400 ? 400 : 502, cors);
  },
};
