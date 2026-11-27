/**
 * Pre-install form proxy (Cloudflare Worker). Written 27 Nov 2026, NOT deployed.
 *
 * The production backend's POST /preinstall is server-to-server and accepts only signed calls. The signature is
 * ECDSA P-256 with SHA-256 over `${ts}.${payload}` (ts in unix seconds, within 300 seconds, each signed message
 * works once), sent as raw 64 byte base64url. A browser must never hold the private key, so the form posts here and
 * this Worker signs and forwards. Contract: /mnt/project-files/ops-dashboard/preinstall-contract-deploy2-20261127.md
 *
 * Variables (encrypted, on the Worker):
 *   PREINSTALL_API_URL      https://flowio-v3-prod-gateway-56butapq.ts.gateway.dev/preinstall
 *   PREINSTALL_PRIVATE_KEY  PKCS8 PEM, installed by Flo with 04_Production tools\set-preinstall-key.js
 * Route: tradeanchor.com.au/api/preinstall
 *
 * Body from the form: { payload } where payload is the JSON string {token, essentialsPct, form}.
 * Response to the form: { ok, status, errors } on success, { ok:false, code } on failure.
 */
const ALLOWED_ORIGINS = ['https://tradeanchor.com.au', 'https://www.tradeanchor.com.au'];
const MAX_BODY_BYTES = 200000;

const json = (obj, status, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

let cachedKey = null;
async function importKey(pem) {
  if (cachedKey && cachedKey.pem === pem) return cachedKey.key;
  const der = Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  cachedKey = { pem, key };
  return key;
}

async function sign(pem, ts, payload) {
  const key = await importKey(pem);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(`${ts}.${payload}`));
  return b64url(sig); // WebCrypto ECDSA output is already raw r||s, 64 bytes
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
    if (!env.PREINSTALL_API_URL || !env.PREINSTALL_PRIVATE_KEY) return json({ ok: false, error: 'not_configured' }, 500, cors);

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413, cors);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'json' }, 400, cors); }
    const payload = typeof body.payload === 'string' ? body.payload : '';
    let parsed;
    try { parsed = JSON.parse(payload); } catch { return json({ ok: false, error: 'payload' }, 400, cors); }
    if (!parsed || typeof parsed.token !== 'string' || !parsed.token.trim()) return json({ ok: false, error: 'token' }, 400, cors);

    const ts = String(Math.floor(Date.now() / 1000));
    const signature = await sign(env.PREINSTALL_PRIVATE_KEY, ts, payload);
    const upstream = await fetch(env.PREINSTALL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ts, payload, signature }),
    });
    let result = {};
    try { result = await upstream.json(); } catch { /* non-JSON upstream: treated as failure below */ }
    if (upstream.ok && result && result.ok) {
      return json({ ok: true, status: result.status || 'STAGED', errors: Array.isArray(result.errors) ? result.errors : [] }, 200, cors);
    }
    const code = String((result && result.code) || upstream.status);
    return json({ ok: false, code }, upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502, cors);
  },
};
