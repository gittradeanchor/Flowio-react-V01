import React, { useState } from 'react';


// Optimized Slider Component using Layered Approach for Native Feel
const CustomSlider = ({ label, value, min, max, unit, prefix = '', step = 1, onChange }: { label: string, value: number, min: number, max: number, unit: string, prefix?: string, step?: number, onChange: (val: number) => void }) => {
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
                <div className="absolute left-0 right-0 h-2 bg-border rounded-full overflow-hidden pointer-events-none">
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
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="ta-slider absolute w-full h-full opacity-100 bg-transparent appearance-none cursor-pointer z-10 touch-none focus:outline-none m-0 p-0"
                />
            </div>
        </div>
    );
};

const CheckIcon = () => (
    <svg className="w-5 h-5 md:w-6 md:h-6 text-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
);

const Item = ({ children }: { children: React.ReactNode }) => (
    <li className="flex gap-3 text-sm font-medium items-start text-navy">
        <CheckIcon />
        <span className="leading-snug">{children}</span>
    </li>
);

// Founding offer, Nov 2026 (TradeAnchor-offer-long.pdf). Terms below are consumer-law promises: keep wording
// identical to the PDF, and change it only when the PDF changes.
const OfferCard = () => (
    <>
        <div className="mb-6 mt-2">
            <h3 className="text-lg font-black text-navy mb-2 uppercase tracking-wide opacity-80">Founding sparkie offer</h3>
            <div className="flex flex-row items-baseline gap-3 flex-wrap">
                <span className="text-4xl md:text-5xl font-black text-orange tracking-tighter leading-none">$149</span>
                <span className="text-sm font-bold text-navy">a month, ex GST</span>
            </div>
            <p className="text-sm text-text-muted mt-2 font-medium">Flat price, unlimited users.</p>
        </div>

        <ul className="space-y-3 mb-6">
            <Item><strong>Locked for life</strong> while you stay on</Item>
            <Item><strong>No setup fee</strong>, and your first 30 days are free</Item>
            <Item><strong>10 spots only</strong>, with a maximum of 2 per council area</Item>
        </ul>

        <p className="text-xs text-text-muted leading-snug border-l-2 border-orange/30 pl-3">
            After the founding 10: $490 setup plus $249 a month. All prices ex GST. Free months under the guarantees are capped at 3 in total, after which billing starts unless you cancel.
        </p>
    </>
);

const Guarantee = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-green/10 border border-green/20 rounded-lg p-4">
        <div className="font-black text-navy text-[15px] leading-snug mb-1">{title}</div>
        <p className="text-sm text-text-muted leading-relaxed">{children}</p>
    </div>
);

const ProfitCalculator = () => {
    const [jobValue, setJobValue] = useState(2000);
    const [jobsLost, setJobsLost] = useState(1);
    const lostPerYear = jobValue * jobsLost * 12;
    const yearPrice = 149 * 12;
    const jobsToCover = jobValue * jobsLost > 0 ? yearPrice / jobValue : 0;
    return (
        <>
            <h3 className="text-2xl font-black text-navy mb-2 leading-tight">Do the maths</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">If a third of your quotes go quiet, that's a third of your pipeline gone without anyone saying no. Put in your own numbers. The starting numbers are examples only.</p>

            <CustomSlider label="Average job lost to a quiet quote" value={jobValue} min={500} max={10000} step={100} unit="" prefix="$" onChange={setJobValue} />
            <CustomSlider label="Jobs like that lost per month" value={jobsLost} min={1} max={5} unit="" onChange={setJobsLost} />

            <div className="bg-orange/5 rounded-2xl p-5 border border-orange/10">
                <div className="text-center mb-5">
                    <div className="text-xs uppercase font-bold text-text-muted mb-1 tracking-wider">Walking out the door each year</div>
                    <div className="text-5xl font-black text-navy tracking-tight">${lostPerYear.toLocaleString('en-AU')}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange/10">
                    <div className="text-center">
                        <div className="text-xs uppercase font-bold text-text-muted mb-1">TradeAnchor, per year</div>
                        <div className="text-xl font-black text-orange">${yearPrice.toLocaleString('en-AU')} <span className="text-xs font-bold text-text-muted">ex GST</span></div>
                    </div>
                    <div className="text-center border-l border-orange/10">
                        <div className="text-xs uppercase font-bold text-text-muted mb-1">Jobs to cover a year</div>
                        <div className="text-xl font-black text-orange">{jobsToCover.toFixed(1)}</div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-text-muted mt-4 text-center italic">
                An estimate from your own inputs, not a promise. For comparison, a virtual assistant can cost around $500 a month, and an agency $999 a month plus $5,000 to set up.
            </p>
        </>
    );
};

// Business number confirmed by Flo 15/11/26. Set VITE_SMS_NUMBER on Cloudflare Pages (digits) to override it.
const SMS_RAW: string = ((import.meta as any).env?.VITE_SMS_NUMBER || '0494186989').replace(/\s+/g, '');
const SMS_HREF = SMS_RAW ? `sms:${SMS_RAW.startsWith('0') ? '+61' + SMS_RAW.slice(1) : SMS_RAW}` : '';
const SMS_DISPLAY = SMS_RAW.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');

export const Pricing = () => {
    return (
        <section id="offer" className="py-12 md:py-20 bg-bg-off">
            <div className="container mx-auto px-4 max-w-[1100px]">
                <div className="text-center mb-10">
                    <h2 className="text-[28px] md:text-4xl font-black text-navy leading-tight">10 founding spots. Max 2 per council area.</h2>
                    <p className="text-text-muted mt-3 max-w-xl mx-auto font-medium">$149 a month ex GST, locked for life while you stay on. First 30 days free.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                    <div className="md:order-2 md:w-1/2 bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange/30 flex flex-col ring-2 ring-orange/20">
                        <div className="p-6 md:p-8 flex-1">
                            <OfferCard />
                            <div className="mt-6 space-y-3">
                                <Guarantee title="Live in 24 hours, or your first month's free">
                                    If your price list isn't live within 24 hours of our call, your first paid month is free.
                                </Guarantee>
                                <Guarantee title="A deposit inside your first 30 days, or you owe nothing">
                                    Send 10 real quotes with the deposit switched on. If no customer pays a deposit inside your first 30 days, you owe nothing. Your 30 days start when you go live.
                                </Guarantee>
                                <Guarantee title="Leaving is easy">
                                    Cancel any time, and your Sheet and data stay yours. The quoting tools switch off when you cancel.
                                </Guarantee>
                            </div>
                        </div>
                        <div className="p-6 bg-white border-t border-border text-center">
                            <a href={import.meta.env.VITE_CALENDLY_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full md:max-w-md mx-auto py-4 bg-orange hover:bg-orange-hover text-white rounded-xl shadow-btn-primary hover:shadow-[0_6px_20px_rgba(180,80,26,0.28)] hover:-translate-y-0.5 transition-all duration-200 font-bold text-lg mb-3">
                                Book a fit call <span className="ml-2 text-2xl leading-[0] pb-1">&#9656;</span>
                            </a>
                            <p className="text-sm font-medium text-navy">
                                15-minute phone call. Nothing to pay on the call.
                            </p>
                        </div>
                    </div>

                    <div className="md:order-1 md:w-1/2 bg-white rounded-3xl shadow-lg overflow-hidden border border-border p-6 md:p-8 flex flex-col justify-center">
                        <ProfitCalculator />
                    </div>
                </div>
            </div>

            {/* Funnel CTA block (id kept: AcceptFlow links to #funnel-cta) */}
            <div id="funnel-cta" className="mt-16 bg-navy text-white py-16 md:py-20 text-center">
                <div className="container mx-auto px-5 max-w-[700px]">
                    <h2 className="text-2xl md:text-4xl font-black mb-5 leading-tight">See it on your phone in 90 seconds.</h2>
                    <p className="text-lg opacity-80 mb-8 leading-relaxed max-w-xl mx-auto">
                        {SMS_HREF
                            ? "Text me your last switchboard quote. I'll send it back the way your customer would get it: your logo, an Accept button and the deposit taken."
                            : "Run the demo above and I'll text a real quote to your phone, the way your customer would get it: an Accept button, a day to pick, and the deposit step."}
                    </p>

                    <div className="flex justify-center gap-5 flex-wrap flex-col items-center">
                        {SMS_HREF ? (
                            <a href={SMS_HREF} className="bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg shadow-btn-white hover:bg-bg-off transition-colors">
                                Text your quote to {SMS_DISPLAY}
                            </a>
                        ) : (
                            <a href="#test-drive" className="bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg shadow-btn-white hover:bg-bg-off transition-colors">
                                Try the 1-minute demo <span className="ml-1">&#9656;</span>
                            </a>
                        )}
                        <a href={import.meta.env.VITE_CALENDLY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] text-white/80 hover:text-white text-[15px] font-semibold underline underline-offset-4">
                            Or book a 15-minute fit call
                        </a>
                        <p className="text-sm opacity-80">Rather talk? Ring <a href={`tel:${SMS_RAW}`} className="underline font-bold">{SMS_DISPLAY}</a>.</p>
                    </div>
                    <p className="text-sm opacity-70 mt-10 max-w-md mx-auto italic">Founders: once it's making you money, I'd love a short story and an honest review, whenever you're ready.</p>
                </div>
            </div>
        </section>
    );
};
