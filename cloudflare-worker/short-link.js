// Short quote links: https://flowio.tradeanchor.com.au/q/CODE  ->  the Flowio quote page.
// The Worker only redirects. The signed quote link stays in Flowio and is looked up from the code, so the SMS stays short
// and nothing secret is stored here. Setup is in README.md (Short quote link).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = /^\/q\/([A-Za-z0-9]{6,12})\/?$/.exec(url.pathname);
    if (!match || !env.FLOWIO_ACCEPT_BASE) return new Response('Not found', { status: 404 });
    const target = new URL(env.FLOWIO_ACCEPT_BASE);
    target.searchParams.set('c', match[1].toLowerCase());
    return Response.redirect(target.toString(), 302);
  },
};
