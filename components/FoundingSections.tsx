import React from 'react';

// Founding offer sections (Nov 2026). Copy follows TradeAnchor-offer-long.pdf. Styling uses only the
// TradeAnchor design system (Copper & Ink) classes already in tailwind.config.js.

const Tick = () => (
    <svg className="w-5 h-5 text-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
);

const Eyebrow = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[11px] md:text-[12px] uppercase tracking-[0.12em] font-bold ${dark ? 'bg-white/10 border-white/20 text-white' : 'bg-orange/8 border-orange/20 text-orange'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-white' : 'bg-orange'}`}></span>
        {children}
    </span>
);

// Headline bonus
const REVIVE = [
    { job: 'Downlights, 14 x LED', age: '52 days quiet' },
    { job: 'EV charger install', age: '38 days quiet' },
    { job: 'Switchboard upgrade', age: '21 days quiet' },
    { job: 'Power points, kitchen', age: '9 days quiet' },
];

export const DeadQuoteRevival = () => (
    <section id="revival" className="py-16 md:py-24 bg-navy text-white">
        <div className="container mx-auto px-5 max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
                <Eyebrow dark>Headline bonus</Eyebrow>
                <h2 className="text-[32px] md:text-4xl font-black mt-4 mb-4 leading-tight">Dead Quote Revival</h2>
                <p className="text-lg opacity-85 leading-relaxed mb-4">Your quotes from the last 60 days that went nowhere? We resend every one in your brand, with an Accept button and your deposit switched on. You tap Send.</p>
                <p className="font-bold">Anything that comes back is work you'd already written off.</p>
            </div>
            <div className="grid gap-3" role="img" aria-label="Example of old quotes being resent. Sample data.">
                {REVIVE.map(r => (
                    <div key={r.job} className="flex items-center justify-between gap-3 bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-[15px]">
                        <span>{r.job} <span className="text-white/60 text-[13px]">&middot; {r.age}</span></span>
                        <span className="text-[12px] font-bold tracking-wider bg-orange text-white px-2 py-1 rounded">RESEND</span>
                    </div>
                ))}
                <p className="text-[12px] text-white/60 text-center">Sample quotes, example jobs</p>
            </div>
        </div>
    </section>
);

// How you get set up
export const HowItWorks = () => (
    <section id="how" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-5 max-w-[1100px]">
            <div className="text-center mb-10">
                <Eyebrow>How you get set up</Eyebrow>
                <h2 className="text-[32px] md:text-4xl font-black text-navy mt-4 mb-3 leading-tight">Your price list is live before your next quote goes out.</h2>
                <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">You fill in a 10-minute form and we do the rest. We build a clean price list from your form, grouped by job type: switchboards, power points, fault-finding. There's a starting-from price on every line, and your three or four most common jobs sit at the top.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { n: '1', t: 'Fill in a 10-minute form', d: 'Business details, how you quote, your prices and your logo.' },
                    { n: '2', t: 'We build your price list', d: 'Clean, grouped by job type, with a starting-from price on every line.' },
                    { n: '3', t: 'One 15-minute call and you are live', d: "We walk you through your first quote and send your Dead Quote Revival. If your price list isn't live within 24 hours of our setup call, your first paid month is free." },
                ].map(s => (
                    <div key={s.n} className="bg-white border border-border rounded-2xl shadow-sm p-6">
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-black mb-3">{s.n}</div>
                        <div className="text-xl font-extrabold text-navy mb-2 leading-tight">{s.t}</div>
                        <p className="text-[15px] text-text-muted leading-relaxed">{s.d}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// Everything you get + Chaser
const CUSTOMER = [
    'A text and an email from your business, with a branded PDF quote',
    'One big Accept button on their phone. No app, no account, no password',
    'They pay your deposit on their phone',
    'They pick a day and a morning or afternoon slot',
];
const YOU = [
    'Quotes sent by text and email in one click, straight from your Sheet',
    'Every quote saved as a branded PDF in your Google Drive',
    'An alert the second a quote is accepted, with the job dropped into your Google Calendar',
    'Confirm the booking from your phone',
    'A jobs tab that shows where every quote is at',
    'Unlimited users: your partner, your apprentice and your office all get it at the same price',
    'Your price list built for you, plus Dead Quote Revival',
];

export const Included = () => (
    <section id="included" className="py-16 md:py-24 bg-bg-off">
        <div className="container mx-auto px-5 max-w-[1100px]">
            <div className="text-center mb-10">
                <Eyebrow>What's included</Eyebrow>
                <h2 className="text-[32px] md:text-4xl font-black text-navy mt-4 leading-tight">Everything you get</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{ h: 'What your customer gets', items: CUSTOMER }, { h: 'What you get', items: YOU }].map(col => (
                    <div key={col.h} className="bg-white border border-border rounded-2xl shadow-sm p-6 md:p-8">
                        <h3 className="text-xl font-extrabold text-navy mb-4 pb-3 border-b-2 border-navy">{col.h}</h3>
                        <ul className="space-y-3">
                            {col.items.map(i => (
                                <li key={i} className="flex gap-3 text-[15px] text-navy font-medium items-start"><Tick /><span className="leading-snug">{i}</span></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-orange/5 border border-orange/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-start">
                <span className="shrink-0 self-start text-[11px] uppercase tracking-[0.12em] font-bold bg-navy text-white px-2.5 py-1 rounded">Shipping next</span>
                <div>
                    <h3 className="text-xl font-extrabold text-navy mb-2">Chaser: get paid for the quotes that go quiet. Free for founders.</h3>
                    <p className="text-[15px] text-text-muted leading-relaxed">If a third of your quotes go quiet, that's a third of your pipeline gone without anyone saying no. Chaser follows up every unanswered quote automatically, by text and then by call, from your business, until the customer answers. One extra switchboard a month pays for the year. It's the first founder feature to ship, and it's free for founders.</p>
                </div>
            </div>
        </div>
    </section>
);
