import React, { useState } from 'react';

// Optimized Slider Component
const CustomSlider = ({ label, value, min, max, unit, prefix = '', onChange }: { label: string, value: number, min: number, max: number, unit: string, prefix?: string, onChange: (val: number) => void }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Gradient for the track to visualize progress
    const trackBackground = `linear-gradient(to right, #FB923C 0%, #FB923C ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;

    return (
        <div className="mb-8 group">
            <div className="flex justify-between items-end mb-4">
                <label className="text-navy font-bold text-base block">{label}</label>
                <div className="bg-orange/10 text-orange-700 text-sm font-bold py-1 px-3 rounded-lg min-w-[60px] text-center">
                     {prefix}{value} {unit}
                </div>
            </div>
            
            <div className="relative w-full h-6 flex items-center"> 
                <input
                    type="range" 
                    min={min} 
                    max={max} 
                    step={1}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-0"
                    style={{ ['--track' as any]: trackBackground }}

                />
            </div>
            
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #FB923C;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                    margin-top: calc((8px - 24px) / 2); /* centers thumb on 8px track */
                    transition: transform 0.1s;
                }
                    input[type=range]{
                    height: 24px;              /* big hit area */
                    background: transparent;   /* we draw track below */
                    touch-action: pan-x;       /* mobile drag */
                }
                input[type=range]:active::-webkit-slider-thumb {
                    transform: scale(1.1);
                }
                input[type=range]::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #FB923C;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                    transition: transform 0.1s;
                }
                input[type=range]::-webkit-slider-runnable-track{
                height: 8px;
                border-radius: 9999px;
                background: var(--track);  /* set via style prop */
                cursor: pointer;
                }
            `}</style>
        </div>
    );
};

const CheckIcon = () => (
    <svg className="w-5 h-5 md:w-6 md:h-6 text-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
);

export const Pricing = () => {
    // ROI State
    const [quotesPerWeek, setQuotesPerWeek] = useState(15);
    const [minutesSavedPerQuote, setMinutesSavedPerQuote] = useState(10);
    const [hourlyRate, setHourlyRate] = useState(120);

    // ROI Calculations
    const hoursSavedPerMonth = (quotesPerWeek * minutesSavedPerQuote * 52) / 60 / 12;
    const valueSavedPerMonth = hoursSavedPerMonth * hourlyRate;
    const assumedInvestmentCost = 1997; 
    const weeksToPayback = valueSavedPerMonth > 0 ? assumedInvestmentCost / (valueSavedPerMonth / 4.33) : 0;
    const paybackText = weeksToPayback < 1 ? "< 1 week" : `${Math.round(weeksToPayback)} weeks`;

    const PricingCardContent = () => (
        <>
            <div className="absolute top-0 right-0 bg-orange text-white px-4 py-1.5 rounded-bl-xl font-bold text-xs uppercase tracking-wide shadow-sm">2 installs this week</div>
            
            <div className="mb-6 mt-2">
                <h3 className="text-xl font-black text-navy mb-2 uppercase tracking-wide opacity-80">Done-For-You Install</h3>
                {/* Price Row: Price on Left, Label on Right */}
                <div className="flex flex-row items-baseline gap-3">
                     <span className="text-5xl md:text-6xl font-black text-navy tracking-tighter leading-none">$1,997</span>
                     <span className="text-xs md:text-sm font-bold text-navy bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-tight whitespace-nowrap transform -translate-y-1">
                        One-time, Tax Deductible
                    </span>
                </div>
            </div>

            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-base text-navy font-medium items-start">
                    <CheckIcon/> 
                    <span className="leading-snug">Quotes sent as branded PDF + accept link</span>
                </li>
                <li className="flex gap-3 text-base text-navy font-medium items-start">
                    <CheckIcon/> 
                    <span className="leading-snug">Accept → job auto-booked in Google Calendar</span>
                </li>
                <li className="flex gap-3 text-base text-navy font-medium items-start">
                    <CheckIcon/> 
                    <span className="leading-snug">SMS follow-ups + booking confirmation</span>
                </li>
                <li className="flex gap-3 text-base text-navy font-medium items-start">
                    <CheckIcon/> 
                    <span className="leading-snug opacity-80">(Optional) Stripe deposit link</span>
                </li>
            </ul>

            <div className="mb-6">
                <div className="bg-green/10 text-green-800 p-3 rounded-xl text-sm md:text-base font-bold text-center border border-green/20">
                    🛡️ Live in 48 hours or full refund.
                </div>
                <p className="text-xs text-text-muted text-center mt-2 leading-snug px-4 opacity-90">
                    Live = you can send a quote + client can accept + calendar booking + SMS follow-ups works.
                </p>
            </div>

            <div className="text-xs text-text-muted text-center border-t border-dashed border-border pt-4">
                <span className="font-bold text-navy">What you need:</span> Google Workspace + Stripe (optional) + 15 mins.
            </div>
        </>
    );

    const ROICalculatorContent = () => (
        <>
            <h3 className="text-2xl font-black text-navy mb-6 leading-tight">What this saves you each month</h3>
            
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
                                className={`flex-1 py-2.5 rounded-lg font-bold text-sm border transition-all ${
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
                     <div className="text-xs uppercase font-bold text-text-muted mb-1 tracking-wider">Payback Period</div>
                     <div className="text-5xl font-black text-navy tracking-tight">{paybackText}</div>
                     <div className="mt-2 inline-block bg-white border border-orange/20 rounded-full px-3 py-1 text-[10px] font-medium text-orange-600 shadow-sm">
                        Based on your selected hourly rate.
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
                Assumes 4.3 weeks/month.
            </p>
        </>
    );

    const SharedCTA = () => (
        <div className="p-6 bg-white border-t border-border text-center">
            <a href="#funnel-cta" className="flex items-center justify-center w-full md:max-w-md mx-auto py-4 bg-navy hover:bg-navy-light text-white rounded-xl shadow-btn-navy hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-0.5 transition-all duration-200 font-bold text-lg uppercase tracking-wide mb-3">
                Secure your install slot →
            </a>
            <p className="text-sm font-medium text-navy mb-4">
                 We'll message you within 5 minutes.
            </p>
            
            <div className="text-xs text-text-muted">
                 <strong className="text-green">Optional support after 12 months: $299/yr (system keeps running either way).</strong>
            </div>
        </div>
    );

    return (
        <section id="offer" className="py-12 md:py-20 bg-bg-off">
            <div className="container mx-auto px-4 max-w-[1000px]"> 
                
                {/* Mobile: Stacked */}
                <div className="block md:hidden space-y-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
                         <div className="p-6 relative">
                             <PricingCardContent />
                         </div>
                         <SharedCTA />
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-border p-6">
                         <ROICalculatorContent />
                    </div>
                </div>

                {/* Desktop: Side-by-Side */}
                <div className="hidden md:block">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border flex min-h-[600px]">
                        {/* Left: ROI */}
                        <div className="w-[45%] p-10 bg-slate-50/50 flex flex-col justify-center border-r border-border">
                            <ROICalculatorContent />
                        </div>
                        
                        {/* Right: Pricing */}
                        <div className="w-[55%] flex flex-col">
                            <div className="p-10 relative flex-1 flex flex-col justify-center">
                                <PricingCardContent />
                            </div>
                            <SharedCTA />
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Funnel CTA Block */}
            <div id="funnel-cta" className="mt-16 bg-navy text-white py-16 md:py-20 text-center">
                <div className="container mx-auto px-5 max-w-[700px]">
                    <h2 className="text-2xl md:text-4xl font-black mb-5 leading-tight">I only onboard 3 trades per week.</h2>
                    <p className="text-lg opacity-80 mb-10 leading-relaxed max-w-xl mx-auto">Let's chat for 15 minutes. No sales pressure—just a demo of how it works for your specific trade.</p>
                    
                    <div className="flex justify-center gap-5 flex-wrap">
                        <a href="https://calendly.com/" target="_blank" rel="noreferrer" className="bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg shadow-btn-white hover:bg-slate-100 transition-colors flex items-center gap-2">
                             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                             Book A 15-Min Demo Call
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
