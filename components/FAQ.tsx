import React from 'react';

// FAQ rewritten 20 Sept 2026. Each item answers a B3 objection (13_LANDING_PAGE_AUDIT) using only
// decided facts: D01 (revocation), D02 (90-day email support), D07 (refund), D08 (sheet breakage), 02_OFFER (not sold yet).
// Deliberately NO setup-time claim: "minutes" is unproven until the dry-run install (checklist 1.7) is timed.
const FAQS = [
    {
        id: 'change',
        q: "What do I have to change about how I work?",
        a: "Nothing. You keep quoting from your Google Sheet. I add the part that sends the quote, takes your customer's acceptance and hands you the booking request to confirm."
    },
    {
        id: 'own',
        q: "Whose Sheet is it? What if I stop?",
        a: "Yours. Your Sheet, prices, quote history and customer records live in your Google account and stay with you. The quoting engine that powers it runs on code I host, and you can't rebuild it yourself. The engine is switched off only if you're refunded, or for a pirated or unlicensed copy."
    },
    {
        id: 'brand',
        q: "Will my customer see your name?",
        a: "Quotes carry your business name and logo, not mine."
    },
    {
        id: 'app',
        q: "Do I need to install an app?",
        a: "No. It runs inside Google Sheets. Your customer accepts from a link on their phone, with no app and no login."
    },
    {
        id: 'setup',
        q: "What do I have to do to get set up?",
        a: "Fill in a short form (business details, logo, working hours, your price list). I do the rest, then we send your first real quote together on a phone call."
    },
    {
        id: 'refund',
        q: "What if it doesn't work for me?",
        a: "Ask for your money back within 30 days of your install being finished. No reason needed. I reverse the payment through Stripe within 5 working days, and your Sheet stays yours."
    },
    {
        id: 'notyet',
        q: "What isn't live yet?",
        a: "Deposits and automatic rescheduling. If your customer can't make the time, you ring them and the booking is confirmed by hand. I'd rather you know now than find out later."
    },
    {
        id: 'support',
        q: "What if something breaks?",
        a: "Email support in business hours for 90 days, included. If something breaks during your pilot, I fix it free. After that, fixes are a paid callout."
    }
];

export const FAQ = () => {
    return (
        <section id="faq" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-5 max-w-[800px]">
                <div className="text-center mb-10">
                    <h2 className="text-[32px] font-black text-navy">Common Questions</h2>
                </div>

                <div className="flex flex-col gap-4 mb-20">
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

                <div className="bg-bg-off border-t border-border py-12 px-6 md:px-12 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-center text-center md:text-left">
                        {/* Founder Image */}
                        <div className="w-[100px] h-[100px] rounded-full bg-text-muted border-4 border-white shadow-lg mx-auto md:mx-0 overflow-hidden relative group">
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
                            <p className="text-text-muted leading-relaxed">I'm a systems engineer based in Sydney. I don't hand you a login and wish you luck. I set up your price list, connect your Google Calendar, and walk you through your first real quote on the phone. If it's not for you, you get your money back.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
