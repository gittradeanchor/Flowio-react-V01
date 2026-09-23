import React, { useState } from 'react';

// Payment path appears only when the Stripe link exists (VITE_STRIPE_PILOT_LINK on Cloudflare Pages). No dead ends.
const PAY_LINK: string = (import.meta as any).env?.VITE_STRIPE_PILOT_LINK || '';

// Optimized Slider Component using Layered Approach for Native Feel
const CustomSlider = ({ label, value, min, max, unit, prefix = '', onChange }: { label: string, value: number, min: number, max: number, unit: string, prefix?: string, onChange: (val: number) => void }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
                <label className="text-navy font-bold text-base block">{label}</label>
                <div className="bg-orange/10 text-orange-700 text-sm font-bold py-1 px-3 rounded-lg min-w-[60px] text-center">
                     {prefix}{value} {unit}
                </div>
            </div>

            <div className="relative w-full h-6 flex items-center select-none">
                {/* Visual Track Layer (Background) - Pointer Events None to prevent interference */}
                <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full overflow-hidden pointer-events-none">
                    <div
                        className="h-full bg-orange"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {/* Interaction Layer (Native Input) - Transparent but fully interactive */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="ta-slider absolute w-full h-full opacity-100 bg-transparent appearance-none cursor-pointer z-10 touch-none focus:outline-none m-0 p-0"
                />
            </div>
        </div>
    );
};

// Both static (no dependency on Pricing's state), so they are safe as ordinary module-scope components.
const Item = ({ children, live = true }: { children: React.ReactNode, live?: boolean }) => (
    <li className={`flex gap-3 text-sm font-medium items-start ${live ? 'text-navy' : 'text-text-muted'}`}>
        {live ? <CheckIcon /> : <DashIcon />}
        <span className="leading-snug">{children}</span>
    </li>
);

const PilotCard = () => (
    <>
        <div className="mb-6 mt-2">
            <h3 className="text-lg font-black text-navy mb-2 uppercase tracking-wide opacity-80">Founding Pilot &middot; Done for you</h3>
            <div className="flex flex-row items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-black text-navy tracking-tighter leading-none">$390</span>
                <span className="text-xs font-bold text-navy bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-tight whitespace-nowrap transform -translate-y-1">
                    One-time, inc GST
                </span>
            </div>
        </div>

        {/* Refund always sits with the price (audit A3.2) */}
        <div className="mb-6 bg-green/10 text-green-800 p-3 rounded-xl text-sm font-bold text-center border border-green/20">
            30-day money-back guarantee. No reason needed.
        </div>

        <ul className="space-y-3 mb-6">
            <Item>I set up your Google Sheet quoting for you: your prices, logo and business details</Item>
            <Item>Branded PDF quote sent by SMS and email with an accept link</Item>
            <Item>Your customer accepts on their phone and asks for a time. You confirm it and it goes in your Google Calendar</Item>
            <Item>Confirmation by SMS and email once you confirm</Item>
            <Item>90 days of email support, business hours</Item>
            <Item live={false}>Not live yet: deposit collection</Item>
            <Item live={false}>Not live yet: automatic rescheduling (you ring the customer)</Item>
        </ul>

        <p className="text-xs text-text-muted leading-snug border-l-2 border-orange/30 pl-3">
            In return for the pilot price: your quoting numbers before and after, one 20-minute chat at the end, and your OK to share the results (named or anonymous).
        </p>
    </>
);

// Hoisted out of Pricing() (fix, 22 Sept): it used to be defined INSIDE Pricing's render, so every slider
// drag tick — a state update in the parent — created a brand-new component function and React tore down and
// remounted this whole subtree, including the two <input type=range> elements, mid-drag. That's what "the
// sliders don't slide" was: the DOM node under the user's finger kept getting replaced. State now comes in as
// props instead of being read from a closure over Pricing's hooks.
const ROICalculatorContent = ({
    quotesPerWeek, setQuotesPerWeek, minutesSavedPerQuote, setMinutesSavedPerQuote, hourlyRate, setHourlyRate,
    paybackText, hoursSavedPerMonth, valueSavedPerMonth,
}: {
    quotesPerWeek: number; setQuotesPerWeek: (n: number) => void;
    minutesSavedPerQuote: number; setMinutesSavedPerQuote: (n: number) => void;
    hourlyRate: number; setHourlyRate: (n: number) => void;
    paybackText: string; hoursSavedPerMonth: number; valueSavedPerMonth: number;
}) => (
    <>
        <h3 className="text-2xl font-black text-navy mb-6 leading-tight">What could this save you each month?</h3>

        <div className="mb-8">
            <CustomSlider label="Quotes / week" value={quotesPerWeek} min={1} max={50} unit="" onChange={setQuotesPerWeek} />
            <CustomSlider
                label="Minutes saved / quote"
                value={minutesSavedPerQuote}
                min={1}
                max={60}
                unit="min"
                onChange={setMinutesSavedPerQuote}
            />

            <p className="text-xs text-text-muted mt-2 font-medium mb-6 pl-1 border-l-2 border-orange/30">
                Minutes saved per quote includes: write quote + follow-up + booking.
            </p>

            <div className="mt-6">
                 <label className="text-navy font-bold text-sm block mb-3">Your Hourly Rate</label>
                 <div className="flex gap-3">
                    {[90, 120, 150].map(rate => (
                        <button
                            key={rate}
                            onClick={() => setHourlyRate(rate)}
                            className={`flex-1 min-h-[44px] rounded-lg font-bold text-sm border transition-all ${
                                hourlyRate === rate
                                ? 'bg-navy border-navy text-white shadow-md transform scale-105'
                                : 'bg-white border-border text-text-muted hover:border-navy/30 hover:bg-slate-50'
                            }`}
                        >
                            ${rate}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-orange/5 rounded-2xl p-5 border border-orange/10">
            <div className="text-center mb-5">
                 <div className="text-xs uppercase font-bold text-text-muted mb-1 tracking-wider">Payback on the $390 pilot</div>
                 <div className="text-5xl font-black text-navy tracking-tight">{paybackText}</div>
                 <div className="mt-2 inline-block bg-white border border-orange/20 rounded-full px-3 py-1 text-xs font-medium text-orange-600 shadow-sm">
                    Based on the numbers you set above.
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange/10">
                <div className="text-center">
                    <div className="text-xs uppercase font-bold text-text-muted mb-1">Time Saved</div>
                    <div className="text-xl font-black text-orange">{hoursSavedPerMonth.toFixed(0)} hrs/mo</div>
                </div>
                <div className="text-center border-l border-orange/10">
                    <div className="text-xs uppercase font-bold text-text-muted mb-1">Value Saved</div>
                    <div className="text-xl font-black text-orange">${valueSavedPerMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</div>
                </div>
            </div>
        </div>

        <p className="text-xs text-text-muted mt-4 text-center italic opacity-60">
            An estimate from your own inputs, not a promise. Assumes 4.33 weeks/month.
        </p>
    </>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 md:w-6 md:h-6 text-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
);

const DashIcon = () => (
    <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"/></svg>
);

// Rewritten 20 Sept 2026 to the locked pilot offer (02_OFFER, D05): $390 + refund together, only live features,
// no tiers, no Stripe deposits, no Xero, no scarcity, no unproven response-time promise.
export const Pricing = () => {
    // ROI State (visitor-controlled inputs; result is an estimate from their numbers, not a claim)
    const [quotesPerWeek, setQuotesPerWeek] = useState(15);
    const [minutesSavedPerQuote, setMinutesSavedPerQuote] = useState(10);
    const [hourlyRate, setHourlyRate] = useState(120);

    // ROI Calculations
    const PILOT_PRICE = 390;
    const hoursSavedPerMonth = (quotesPerWeek * minutesSavedPerQuote * 52) / 60 / 12;
    const valueSavedPerMonth = hoursSavedPerMonth * hourlyRate;
    const weeksToPayback = valueSavedPerMonth > 0 ? PILOT_PRICE / (valueSavedPerMonth / 4.33) : 0;
    const roundedWeeks = Math.round(weeksToPayback);
    const paybackText = weeksToPayback < 1 ? "< 1 week" : `${roundedWeeks} ${roundedWeeks === 1 ? 'week' : 'weeks'}`;

    return (
        <section id="offer" className="py-12 md:py-20 bg-bg-off">
            <div className="container mx-auto px-4 max-w-[1100px]">
                <div className="text-center mb-10">
                    <h2 className="text-[28px] md:text-4xl font-black text-navy leading-tight">Get it running on your Sheet</h2>
                    <p className="text-text-muted mt-3 max-w-xl mx-auto font-medium">One price. Money back within 30 days if it's not for you.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                    {/* Offer card (first on mobile, right on desktop) */}
                    <div className="md:order-2 md:w-1/2 bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange/30 flex flex-col ring-2 ring-orange/20">
                        <div className="p-6 md:p-8 flex-1">
                            <PilotCard />
                        </div>
                        <div className="p-6 bg-white border-t border-border text-center">
                            <a href={import.meta.env.VITE_CALENDLY_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full md:max-w-md mx-auto py-4 bg-orange hover:bg-orange-hover text-white rounded-xl shadow-btn-primary hover:shadow-[0_6px_20px_rgba(180,80,26,0.28)] hover:-translate-y-0.5 transition-all duration-200 font-bold text-lg mb-3">
                                Book a fit call &rarr;
                            </a>
                            <p className="text-sm font-medium text-navy">
                                15-minute phone call. Nothing to pay on the call.
                            </p>
                            {PAY_LINK && (
                                <p className="text-sm text-text-muted mt-3">
                                    Already sure?{' '}
                                    <a href="/pilot#pay" className="inline-flex items-center min-h-[44px] font-bold text-navy underline underline-offset-4">Pay the $390 pilot now</a>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ROI calculator */}
                    <div className="md:order-1 md:w-1/2 bg-white rounded-3xl shadow-lg overflow-hidden border border-border p-6 md:p-8 flex flex-col justify-center">
                        <ROICalculatorContent
                            quotesPerWeek={quotesPerWeek} setQuotesPerWeek={setQuotesPerWeek}
                            minutesSavedPerQuote={minutesSavedPerQuote} setMinutesSavedPerQuote={setMinutesSavedPerQuote}
                            hourlyRate={hourlyRate} setHourlyRate={setHourlyRate}
                            paybackText={paybackText} hoursSavedPerMonth={hoursSavedPerMonth} valueSavedPerMonth={valueSavedPerMonth}
                        />
                    </div>
                </div>
            </div>

            {/* Funnel CTA Block (id kept: AcceptFlow links to #funnel-cta) */}
            <div id="funnel-cta" className="mt-16 bg-navy text-white py-16 md:py-20 text-center">
                <div className="container mx-auto px-5 max-w-[700px]">
                    <h2 className="text-2xl md:text-4xl font-black mb-5 leading-tight">Let's talk about your quoting.</h2>
                    <p className="text-lg opacity-80 mb-10 leading-relaxed max-w-xl mx-auto">A 15-minute call. I'll ask how many quotes you send and how many turn into jobs, and we'll see if this fits. No sales pressure.</p>

                    <div className="flex justify-center gap-5 flex-wrap flex-col items-center">
                        <a href={import.meta.env.VITE_CALENDLY_URL} target="_blank" rel="noreferrer" className="bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg shadow-btn-white hover:bg-slate-100 transition-colors flex items-center gap-2">
                             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                             Book a Fit Call
                        </a>
                        {PAY_LINK && (
                            <a href="/pilot#pay" className="inline-flex items-center min-h-[44px] text-white/80 hover:text-white text-[15px] font-semibold underline underline-offset-4">
                                Ready to start? Pay the $390 pilot
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
