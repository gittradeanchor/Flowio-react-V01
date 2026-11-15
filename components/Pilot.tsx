import { Logo } from './Logo';
import React from 'react';

/**
 * /pilot: the page a prospect gets after a "yes" on the call. Rewritten 15 Nov 2026 for the founding offer
 * (the $390 pilot and its Stripe link are retired). Route kept so old links still land somewhere correct.
 */
const CALL_URL: string = (import.meta as any).env?.VITE_CALENDLY_URL || '';

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
    <li className="flex gap-4">
        <div className="w-8 h-8 shrink-0 rounded-full bg-navy text-white flex items-center justify-center text-sm font-black">{n}</div>
        <div>
            <div className="font-black text-lg leading-tight">{title}</div>
            <div className="text-[15px] leading-relaxed text-text-muted mt-1">{children}</div>
        </div>
    </li>
);

export const Pilot = () => (
    <div className="min-h-screen bg-bg-off font-sans text-navy">
        <nav className="bg-white border-b border-border">
            <div className="max-w-[720px] mx-auto px-5 min-h-[52px] flex items-center">
                <a href="/" className="inline-flex items-center min-h-[44px] no-underline" aria-label="TradeAnchor home"><Logo size={30} /></a>
            </div>
        </nav>
        <main className="max-w-[720px] mx-auto px-5 py-8 pb-16">
            <h1 className="text-[30px] md:text-4xl font-black leading-tight">Your TradeAnchor founding spot: next steps</h1>
            <p className="text-text-muted mt-2 text-[15px] leading-relaxed">Three steps. We set it up. You keep your Google Sheet.</p>

            <div className="bg-white border border-border rounded-md p-6 mt-6">
                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-black tracking-tighter text-orange">$149</span>
                    <span className="text-sm font-bold">a month, ex GST</span>
                </div>
                <p className="mt-2 text-sm text-text-muted">Flat price, unlimited users. Locked for life while you stay on. No setup fee, and your first 30 days are free. 10 founding spots, maximum 2 per council area. After the founding 10: $490 setup plus $249 a month. All prices ex GST.</p>
                <p className="mt-3 text-sm text-navy font-medium">Card at signup. Your 30-day free trial starts when you go live and your card is charged automatically on day 31. I text and email you on day 25 with the date, the amount and how to cancel. Cancel before day 31 and you are not charged.</p>
                <p className="mt-3 text-sm font-bold bg-green/10 text-green border border-green/20 rounded-md p-3">Live in 24 hours or your first month's free. 10 quotes sent and no deposit in 30 days? Your next month's free. <a className="underline" href="/refund">Guarantee details</a>.</p>
                {CALL_URL && (
                    <a href={CALL_URL} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center w-full py-4 bg-orange hover:bg-orange-hover text-white rounded-xl font-bold text-lg shadow-btn-primary">
                        Book a fit call <span className="ml-2 text-2xl leading-[0] pb-1">&#9656;</span>
                    </a>
                )}
                <p className="text-xs text-text-muted mt-2 text-center">15-minute phone call. Nothing to pay on the call.</p>
            </div>

            <ol className="space-y-6 mt-8">
                <Step n={1} title="Book your fit call">A 15-minute call to check it suits how you quote. Read the <a className="underline" href="/terms">terms</a> before you agree.</Step>
                <Step n={2} title="Fill in the 10-minute form">Business details, how you quote, your prices and your logo. I email you the link.</Step>
                <Step n={3} title="We build your price list and you go live">I build a clean price list grouped by job type, then on one 15-minute call we send your first quote and your Dead Quote Revival.</Step>
            </ol>

            <div className="bg-white border border-border rounded-md p-5 mt-8">
                <div className="font-black">Shipping next</div>
                <p className="mt-2 text-[15px] leading-relaxed text-text-muted">Chaser follows up quotes that go quiet, by text and then by call. It is not live yet. It is free for founders when it ships.</p>
            </div>

            <p className="text-sm text-text-muted mt-8">Questions? <a className="underline" href="mailto:hello@tradeanchor.com.au">hello@tradeanchor.com.au</a></p>
        </main>
    </div>
);
