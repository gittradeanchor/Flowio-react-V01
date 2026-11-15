import { Logo } from './Logo';
import React from 'react';

/**
 * Legal pages: Terms, Privacy, Refund. Built 20 Sept 2026 from the Claude Design draft ("Flowio Legal Pages")
 * with the founder's decided rules applied (D01 revocation, D02 support, D05 no dollar figures, D07 refund,
 * D08 sheet breakage, refund window from install finish). Terms and Refund rewritten 15 Nov 2026 for the founding offer. DRAFT: have a lawyer read it before it is linked.
 *
 * Visible routes: /terms /privacy /refund (reviewable now).
 * Footer links stay hidden until LEGAL_READY is true. Set it once every "TO CONFIRM" below is resolved.
 */
export const LEGAL_READY = true; // founder approved A8. NOTE: not yet read by a lawyer (checklist B17)

const CONTACT_EMAIL = 'hello@tradeanchor.com.au';
const REFUND_EMAIL = 'refunds@tradeanchor.com.au'; // confirmed by founder
const RETENTION = '12 months after our last contact, or sooner if you ask me to delete it'; // founder answer: 12 months (asked as a question, confirm)
const UPDATED = '15 November 2026';

const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-black text-navy mt-8 mb-2">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[15px] leading-relaxed text-text-main mb-3">{children}</p>
);
const UL = ({ items }: { items: string[] }) => (
    <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-text-main mb-3">
        {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
);

const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="min-h-screen bg-bg-off font-sans text-navy">
        <nav className="bg-white border-b border-border">
            <div className="max-w-[760px] mx-auto px-5 min-h-[52px] flex items-center justify-between gap-4 flex-wrap">
                <a href="/" className="inline-flex items-center min-h-[44px] no-underline" aria-label="TradeAnchor home"><Logo size={30} /></a>
                <div className="flex items-center gap-4 text-[15px] font-semibold flex-wrap">
                    {/* Explicit, worded way back (22 Sept): a legal page is often opened directly from a search
                        result or a shared link, with no memory of arriving from the site, so a logo alone
                        wasn't a clear enough "you can leave" signal. */}
                    <a href="/" className="min-h-[44px] flex items-center text-text-muted underline-offset-4 hover:underline">&larr; Back to TradeAnchor</a>
                    <span className="text-border" aria-hidden="true">|</span>
                    <a href="/terms" className="min-h-[44px] flex items-center underline-offset-4 hover:underline">Terms</a>
                    <a href="/privacy" className="min-h-[44px] flex items-center underline-offset-4 hover:underline">Privacy</a>
                    <a href="/refund" className="min-h-[44px] flex items-center underline-offset-4 hover:underline">Guarantees and refunds</a>
                </div>
            </div>
        </nav>
        <main className="max-w-[760px] mx-auto px-5 pb-16">
            <article className="bg-white border border-border rounded-md mt-6 p-6 md:p-8">
                <div className="text-xs font-bold uppercase tracking-widest text-text-muted">Legal</div>
                <h1 className="text-[32px] font-black leading-tight mt-2">{title}</h1>
                <p className="text-sm text-text-muted mt-2">TradeAnchor, ABN 45 529 331 663. Sole trader, Sydney NSW. GST registered. Contact: <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Last updated {UPDATED}. Australian law, New South Wales.</p>
                {children}
            </article>
            <p className="text-xs text-text-muted mt-6 text-center">The current price is stated on the site and in section 3 of the terms.</p>
        </main>
    </div>
);

export const Terms = () => (
    <Shell title="Terms of Service">
        <P>Plain-English agreement for TradeAnchor founding customers. Draft: a lawyer review is planned before any public launch.</P>

        <H2>1. Who you are contracting with</H2>
        <P>TradeAnchor, ABN 45 529 331 663, a sole trader business. "I" and "me" mean that sole trader. There is no company, office or staff behind these terms.</P>

        <H2>2. What I supply</H2>
        <P>A done-for-you setup of a quoting and booking workflow inside your own Google account, and continued access to a hosted quoting engine that the workflow calls, for as long as you stay subscribed. You build and send quotes from your Google Sheet. Your customer accepts, pays the deposit if you have switched it on, and picks a day and a morning or afternoon slot. You confirm it from your phone. Nothing is booked without you. Quote documents carry your business name and logo, and you are responsible for the accuracy of the prices, scope and licence details on anything sent under your name.</P>

        <H2>3. Price and billing</H2>
        <P>Founding offer: $149 a month ex GST, flat, for unlimited users. No setup fee. There are 10 founding spots, with a maximum of 2 per council area. After the founding 10 the price is $490 setup plus $249 a month, ex GST.</P>
        <P>Locked for life means your price is fixed while you stay subscribed. I will not change your price while you are subscribed. It ends if you cancel.</P>
        <P>I take your card at signup. Your 30-day free trial starts when you go live, and your card is charged automatically on day 31, then monthly. I text and email you on day 25 with the date, the amount and how to cancel. If you cancel before day 31 you are not charged.</P>

        <H2>4. Guarantees</H2>
        <P>Two guarantees apply, set out on the <a className="underline" href="/refund">guarantees and refunds page</a>, which forms part of these terms. They are conditional, they don't stack, and free months under them are capped at 3 in total.</P>

        <H2>5. Cancelling</H2>
        <P>Cancel any time by emailing {CONTACT_EMAIL}. It takes effect at the end of the period you have already paid for. When it takes effect, billing stops and the quoting tools switch off. Your Sheet and data stay yours. I do not end your service at will. I may stop it only if you do not pay, or if a copy of the engine is pirated or unlicensed.</P>

        <H2>6. Support</H2>
        <P>Text me if anything breaks. I reply within 4 business hours. Anything stopping quotes or deposits is fixed the same business day, and everything else within 2 business days. Support is included for as long as you are on TradeAnchor. "Breaks" means sending, the Accept page, deposits and booking. Up to 2 changes a month to your price list or templates are included. More than that is paid work, and I tell you the cost before I start. Founders get my direct mobile number on the setup call. Later customers get a support number or inbox.</P>

        <H2>7. Your data and your Sheet</H2>
        <P>You own your customer data, your Sheet, your pricebook, your quote history and the documents generated for you. They live in your own Google account and stay there if this agreement ends for any reason, including if I stop trading. I hold quote and customer data on the backend I host only to run the service for you, as the <a className="underline" href="/privacy">privacy notice</a> sets out.</P>
        <P>I request Google access limited to the files this workflow creates and opens. I do not request access to your whole Drive or your email.</P>
        <P>The quoting engine is mine. You get no copy of it and no right to rebuild it. If I stop trading, the engine stops and your own files remain intact and readable.</P>

        <H2>8. What is not included</H2>
        <UL items={[
            'Chaser (automatic follow-up of quotes that go quiet). Not live yet. It is the first founder feature to ship and is free for founders when it does.',
            'Any accounting integration. None is supplied and no date is promised.',
            'Quote building from a phone. You quote from your Google Sheet.',
        ]} />

        <H2>9. Limits on my liability</H2>
        <P>The hosted engine depends on services I do not control, including Google. I do not promise uninterrupted availability or a delivery time for any message the workflow sends. My total liability to you under this agreement is capped at 3 months of the fees you have paid. Nothing in these terms excludes, restricts or modifies any guarantee, right or remedy you have under the Australian Consumer Law that cannot lawfully be excluded, and the cap does not limit those rights.</P>

        <H2>10. Governing law</H2>
        <P>These terms are governed by the law of New South Wales, Australia, and the courts of that state have jurisdiction.</P>
    </Shell>
);

export const Privacy = () => (
    <Shell title="Privacy notice">
        <H2>1. What I collect from you</H2>
        <UL items={[
            'From the demo on the site: your name, your trade, your mobile number, and your email address if you add one, when you ask for the demo quote to be sent to you.',
            'From booking a call: the details the booking tool collects (name, email, phone).',
            'From the setup form: your business name, ABN, licence number, contact details, the Google account to install into, your price list, and your logo if you supply one.',
        ]} />

        <H2>2. What I collect about your customer</H2>
        <P>When you send a quote, your customer's name, contact details, site address and the quote contents pass through the hosted engine and are stored there. You decide what to send and to whom. I hold that data to run the quoting, acceptance and booking-request functions for you.</P>

        <H2>3. I do hold records</H2>
        <P>Quote data does not stay only in your Google account. It passes through and is stored on the backend I host, and I can see it. Your own copies also live in your Google account and stay there if this ends.</P>

        <H2>4. Google access</H2>
        <P>The Google permission requested is limited to the files this workflow creates and opens. I do not request access to your whole Drive and I do not request any permission that would let me read your email.</P>

        <H2>5. Why I hold it, and for how long</H2>
        <P>Your contact details are held so I can reply to you, run the call, install the workflow and support it. Quote data is held so the quoting, acceptance and booking-request functions work.</P>
        <P>Retention: {RETENTION}.</P>

        <H2>6. Who else can see it</H2>
        <P>Nobody buys it and nobody rents it. It is handled by the services this site and the workflow run on: Google (Sheets, Drive, Calendar, Apps Script), Make (automation), ClickSend (text messages), Stripe (payments), Calendly (call booking), Meta (Meta Pixel, advertising measurement — see below) and Cloudflare (website delivery). Some of these process data outside Australia. Make, for example, runs in the United States.</P>
        <P>This site uses the Meta Pixel, which places a cookie in your browser and tells me, in aggregate, whether someone who saw an ad on Facebook or Instagram went on to try the demo, book a call, or request the audit — so I can tell whether that advertising is working. It does not give me your name, email or phone number by itself. You can block or clear this cookie in your browser at any time without breaking the site. This use is disclosed under the Australian Privacy Act 1988 (Cth).</P>

        <H2>7. Messages you receive from me</H2>
        <P>Marketing messages identify me and include a way to opt out. If you ask me to stop contacting you, I stop within five business days and keep only what I need to honour that request.</P>

        <H2>8. Getting a copy, correcting it, or having it deleted</H2>
        <P>Email {CONTACT_EMAIL} and I will give you a copy of what I hold about you, correct it, or delete it, except where I must keep it. If you are unhappy with how I handled that, you can complain to the Office of the Australian Information Commissioner.</P>
    </Shell>
);

export const Refund = () => (
    <Shell title="Guarantees and refunds">
        <H2>1. Live in 24 hours, or your first month's free</H2>
        <P>If your price list isn't live within 24 hours of our setup call, your first paid month is free.</P>

        <H2>2. 10 quotes sent and no deposit in 30 days? Your next month's free</H2>
        <P>Send 10 real quotes with the deposit switched on. If no customer pays a deposit by day 30 after you go live, your next month is free. If you have sent fewer than 10 quotes, this guarantee does not apply. I text you on day 20 to tell you how many you have sent. I check this myself on day 29, so you do not need to claim it. It can repeat each month you qualify, within the cap below.</P>

        <H2>3. Cap, and the guarantees do not stack</H2>
        <P>Free months under both guarantees are capped at 3 in total. If both would apply to the same month, that month is free once, not twice. After the cap, billing continues unless you cancel.</P>

        <H2>4. How a free month is applied</H2>
        <P>I extend your Stripe trial or move your next billing date out by a month. I do not take the money and give it back.</P>

        <H2>5. Cancelling</H2>
        <P>Cancel any time by email to <a className="underline" href={`mailto:${REFUND_EMAIL}`}>{REFUND_EMAIL}</a>. It takes effect at the end of the period you have already paid for. Billing stops, the quoting tools switch off, and your sheet, pricebook, quote history and generated documents stay in your own Google account.</P>

        <H2>6. Your rights under the law</H2>
        <P>Your rights under the Australian Consumer Law are not affected and cannot be excluded by anything here.</P>
    </Shell>
);
