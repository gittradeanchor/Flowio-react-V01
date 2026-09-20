# Test Drive proxy: setup (about 15 minutes, you do this)

## What a "shared secret" is (checklist B15)
The Make webhook URL is a public, unguessable address. Anyone who finds it can post to it. A shared secret is a password only two systems know: the Worker adds it to every message, and Make checks for it and ignores anything without it. Even if someone finds the Make URL, they can't use it.

## Steps
1. **Rotate first (B13).** In Make, regenerate the webhook for the Test Drive scenario. You get a new URL.
2. **Create the Worker.** Cloudflare dashboard, Workers & Pages, Create, Worker. Paste `testdrive-proxy.js`. Deploy.
3. **Add two encrypted variables** on the Worker: `MAKE_WEBHOOK_URL` (the new Make URL) and `SHARED_SECRET` (a long random string, e.g. 40+ characters from a password manager).
4. **Route it on your own domain** (no cross-site issues): Worker, Settings, Triggers, add route `flowio.tradeanchor.com.au/api/testdrive*` on the tradeanchor.com.au zone.
5. **Make: check the secret.** After the webhook module, add a filter: header `X-TA-Secret` equals your secret. Unverified: Make's custom webhook has an option to expose request headers ("Get request headers"); turn it on, then filter on that value. If your Make plan or module doesn't expose headers, put the secret in the JSON body instead (edit one line in the Worker: add `body.secret = env.SHARED_SECRET`).
6. **Point the site at it.** Set the site variable `VITE_TESTDRIVE_ENDPOINT` to `/api/testdrive` and redeploy. Leave `VITE_MAKE_WEBHOOK_URL` empty once this works.
7. **Test.** Run the demo with your own mobile. Then post to the Make URL directly without the secret (curl or a REST tool): Make must ignore it.

## Not covered
Rate limiting. If someone hammers the endpoint, add a Cloudflare rate-limiting rule on `/api/testdrive*` (Security, WAF, Rate limiting).
