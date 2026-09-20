import React from 'react';

/**
 * /pilot: the one page a prospect gets after a "yes" on the call.
 * Payment link comes from VITE_STRIPE_PILOT_LINK (placeholder until the Stripe link exists).
 * Sequence (D06): call, payment, intake form, install.
 */
const PAY_LINK: string = (import.meta as any).env?.VITE_STRIPE_PILOT_LINK || '';

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
                <a href="/" className="text-xl font-black tracking-tighter text-navy no-underline">Trade<span className="text-orange">Anchor</span></a>
            </div>
        </nav>
        <main className="max-w-[720px] mx-auto px-5 py-8 pb-16">
            <h1 className="text-[30px] md:text-4xl font-black leading-tight">Your Flowio pilot: next steps</h1>
            <p className="text-text-muted mt-2 text-[15px] leading-relaxed">Four steps, in this order. You pay after we've spoken, not before.</p>

            <div className="bg-white border border-border rounded-md p-6 mt-6">
                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-black tracking-tighter">$390</span>
                    <span className="text-xs font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded uppercase tracking-tight">One-time, inc GST</span>
                </div>
                <p className="mt-3 text-sm font-bold bg-green/10 text-green-800 border border-green/20 rounded-md p-3">30-day money-back guarantee, from the day your install is finished. No reason needed.</p>

                {PAY_LINK ? (
                    <a href={PAY_LINK} className="mt-5 flex items-center justify-center w-full py-4 bg-navy hover:bg-navy-light text-white rounded-xl font-bold text-lg shadow-btn-navy">
                        Pay $390 securely with Stripe
                    </a>
                ) : (
                    <div className="mt-5 flex items-center justify-center w-full py-4 bg-slate-200 text-text-muted rounded-xl font-bold text-lg" aria-disabled="true">
                        Payment link to be added
                    </div>
                )}
                <p className="text-xs text-text-muted mt-2 text-center">You'll get a tax invoice with our ABN straight after paying.</p>
            </div>

            <ol className="space-y-6 mt-8">
                <Step n={1} title="Pay the pilot fee">Use the button above. Refund terms are in the <a className="underline" href="/refund">refund policy</a>.</Step>
                <Step n={2} title="Confirm the terms">Reply "agreed" to the email we sent, or read them first in the <a className="underline" href="/terms">terms</a>. In return for the pilot price I ask for your quoting numbers before and after, one 20-minute chat at the end, and your OK to share results (named or anonymous).</Step>
                <Step n={3} title="Fill in the intake form">A short form: your business details, how you quote, and your price list. It arrives by email after you pay.</Step>
                <Step n={4} title="I set it up, and we send your first real quote">I build it in your own Google account, then we send your first real quote together on the phone.</Step>
            </ol>

            <div className="bg-white border border-border rounded-md p-5 mt-8">
                <div className="font-black">Not live yet, so you know upfront</div>
                <ul className="list-disc pl-5 mt-2 text-[15px] leading-relaxed text-text-muted space-y-1">
                    <li>Deposit collection.</li>
                    <li>Automatic rescheduling. If your customer can't make the time, you ring them.</li>
                    <li>Quoting from your phone. You quote from your Google Sheet.</li>
                </ul>
            </div>

            <p className="text-sm text-text-muted mt-8">Questions? <a className="underline" href="mailto:hello@tradeanchor.com.au">hello@tradeanchor.com.au</a></p>
        </main>
    </div>
);
