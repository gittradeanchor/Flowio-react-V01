import React from 'react';

// FAQ rewritten 15 Nov 2026 for the founding offer (previous version: 20 Sept 2026 pilot).
// Earlier note: FAQ rewritten 20 Sept 2026. Each item answers a B3 objection (13_LANDING_PAGE_AUDIT) using only
// decided facts: D01 (revocation), D02 (90-day email support), D07 (refund), D08 (sheet breakage), 02_OFFER (not sold yet).
// Deliberately NO setup-time claim: "minutes" is unproven until the dry-run install (checklist 1.7) is timed.
const FAQS = [
    {
        id: 'change',
        q: "What do I have to change about how I work?",
        a: "Nothing. You keep quoting from your Google Sheet. I add the part that sends the quote, takes your customer's acceptance and deposit, and hands you the booking to confirm from your phone."
    },
    {
        id: 'own',
        q: "Whose Sheet is it? What if I cancel?",
        a: "Yours. Cancel any time and your Sheet and data stay yours, in your own Google account. The quoting tools that run behind it switch off when your cancellation takes effect."
    },
    {
        id: 'brand',
        q: "Will my customer see your name?",
        a: "Quotes carry your business name and logo, not mine."
    },
    {
        id: 'app',
        q: "Does my customer need an app?",
        a: "No. They get a text and an email with a link. It opens on any phone, with no app, no account and no password."
    },
    {
        id: 'users',
        q: "Can my apprentice or office use it too?",
        a: "Yes. Unlimited users at the same flat price."
    },
    {
        id: 'setup',
        q: "What do I have to do to get set up?",
        a: "Fill in a 10-minute form. I build your price list from it, then one 15-minute call and you're live. If your price list isn't live within 24 hours of our call, your first paid month is free."
    },
    {
        id: 'guarantee',
        q: "What do the guarantees mean in practice?",
        a: "If your price list isn't live within 24 hours of our setup call, your first paid month is free. Send 10 real quotes with the deposit switched on. If no customer pays a deposit by day 30 after you go live, your next month is free. I check this myself on day 29, so you don't need to claim it. It can repeat, up to 3 free months in total across both guarantees. The two guarantees don't stack."
    },
    {
        id: 'billing',
        q: "When am I charged, and will I be warned?",
        a: "Card at signup. Your 30-day free trial starts when you go live and your card is charged automatically on day 31. I text and email you on day 25 with the date, the amount and how to cancel. Cancel before day 31 and you are not charged. Cancel any time, effective at the end of the period you've already paid for."
    },
    {
        id: 'support',
        q: "What if something breaks?",
        a: "Text me if anything breaks. I reply within 4 business hours. Anything stopping quotes or deposits gets fixed the same business day, and everything else within 2 business days. That is included for as long as you're on TradeAnchor. Breaks means sending, the Accept page, deposits and booking. Up to 2 changes a month to your price list or templates are included. More than that is paid work."
    },

    {
        id: 'council',
        q: "Why only 2 per council area?",
        a: "So the founding sparkies aren't all quoting against each other on the same streets. There are 10 founding spots in total."
    },
    {
        id: 'chaser',
        q: "Is Chaser live yet?",
        a: "Not yet. It's the first founder feature to ship, and it's free for founders. I'd rather you know now than find out later."
    }
];

// Split out 23 Sept 2026 (Owner comments.md: "move the founder block to just above pricing").
// FAQ itself stays where it was; only the founder bio moved — see App.tsx render order.
export const FounderBlock = () => {
    return (
        <section className="py-10 md:py-14 bg-white">
            <div className="container mx-auto px-5 max-w-[800px]">
                <div className="bg-bg-off border-t border-border py-12 px-6 md:px-12 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-center text-center md:text-left">
                        {/* Founder Image */}
                        <div className="w-[100px] h-[100px] rounded-full bg-slate-300 border-4 border-white shadow-lg mx-auto md:mx-0 overflow-hidden relative group">
                            <img
                                src="/images/Founder.png"
                                alt="Sean, founder of TradeAnchor"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            {/* Fallback if image fails to load */}
                            <div className="hidden absolute inset-0 bg-navy flex items-center justify-center text-white text-xs">FOUNDER</div>
                        </div>
                        <div>
                            <h3 className="text-navy font-extrabold text-xl mb-2">I'm not a SaaS company. I'm Sean.</h3>
                            <p className="text-text-muted leading-relaxed">I'm a systems engineer based in Sydney. I don't hand you a login and wish you luck. I set up your price list, connect your Google Calendar, and walk you through your first real quote on the phone.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const FAQ = () => {
    return (
        <section id="faq" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-5 max-w-[800px]">
                <div className="text-center mb-10">
                    <h2 className="text-[32px] font-black text-navy">Common Questions</h2>
                </div>

                <div className="flex flex-col gap-4">
                    {FAQS.map((item) => (
                        <details key={item.id} id={item.id} className="group border border-border rounded-lg overflow-hidden">
                            <summary className="bg-bg-off text-navy font-bold p-4 cursor-pointer list-none flex justify-between items-center group-open:bg-navy group-open:text-white transition-colors">
                                {item.q}
                                <span className="text-xl group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="p-4 text-text-muted leading-relaxed border-t border-border">{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};
