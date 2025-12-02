
import React, { useState } from 'react';

// Custom Slider Component
const CustomSlider = ({ label, value, min, max, unit, prefix = '', onChange }: { label: string, value: number, min: number, max: number, unit: string, prefix?: string, onChange: (val: number) => void }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const trackGradient = `linear-gradient(to right, #FB923C 0%, #FB923C ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
    
    // Bubble Position Logic
    const bubbleStyle = { left: `calc(${percentage}% + ${(0.5 - percentage / 100) * 24}px)` };

    return (
        <div className="mb-0 relative group">
            {/* 1. Label Section - Increased bottom margin to make room for bubble */}
            <label className="block text-navy font-bold text-sm mb-14">{label}</label>
            
            {/* 2. Floating Bubble Value - Positioned in the space created by mb-14 */}
            <div className="absolute bottom-6 transform -translate-x-1/2 z-10 pointer-events-none transition-all duration-75 ease-out" style={bubbleStyle}>
                <div className="bg-[#FFF4E5] text-navy text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm border border-orange-100 min-w-[60px] text-center relative">
                    {prefix}{value} {unit}
                    <div className="w-2 h-2 bg-[#FFF4E5] border-r border-b border-orange-100 transform rotate-45 absolute left-1/2 -ml-1 -bottom-1 bg-inherit"></div>
                </div>
            </div>

            {/* 3. Slider Input */}
            <div className="relative h-2 w-full rounded-full">
                <input
                    type="range" min={min} max={max} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-2 rounded-full appearance-none z-30 focus:outline-none focus:ring-0 cursor-pointer"
                    style={{ background: trackGradient }}
                />
            </div>
            
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%;
                    background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: -8px;
                }
                input[type=range]::-moz-range-thumb {
                    height: 24px; width: 24px; border-radius: 50%; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                 input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 9999px; }
            `}</style>
        </div>
    );
};

const CheckIcon = () => (
    <svg className="w-5 h-5 text-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
);

export const Pricing = () => {
    // ROI State
    const [quotesPerWeek, setQuotesPerWeek] = useState(20);
    const [minutesSavedPerQuote, setMinutesSavedPerQuote] = useState(12);
    const [hourlyRate, setHourlyRate] = useState(120);

    // ROI Calculations
    const hoursSavedPerMonth = (quotesPerWeek * minutesSavedPerQuote * 52) / 60 / 12;
    const valueSavedPerMonth = hoursSavedPerMonth * hourlyRate;
    const assumedInvestmentCost = 1997; 
    const weeksToPayback = valueSavedPerMonth > 0 ? assumedInvestmentCost / (valueSavedPerMonth / 4.33) : 0;

    const PricingCardContent = () => (
        <>
            <div className="absolute top-0 right-0 bg-orange text-white px-4 py-1.5 rounded-bl-xl font-bold text-xs uppercase tracking-wide">Pilot Pricing</div>
            
            <h3 className="text-2xl font-black text-navy mb-2">The "Done-For-You" Build</h3>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-navy tracking-tight">$1,997</span>
            </div>
            <div className="text-sm text-text-muted mb-6">One-time Setup Fee (Tax Deductible)</div>

            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-navy font-medium"><CheckIcon/> Custom Branding (Logo & Colors)</li>
                <li className="flex gap-3 text-sm text-navy font-medium"><CheckIcon/> Stripe Payment Integration</li>
                <li className="flex gap-3 text-sm text-navy font-medium"><CheckIcon/> SMS & Calendar Automation</li>
                <li className="flex gap-3 text-sm text-navy font-medium"><CheckIcon/> <strong>Guarantee:</strong> Save 5hrs/week or refund.</li>
            </ul>
        </>
    );

    const ROICalculatorContent = () => (
        <>
            <h3 className="text-2xl font-black text-navy mb-6">Calculate Your ROI</h3>
            <div className="mb-6">
                <CustomSlider label="Quotes / week" value={quotesPerWeek} min={1} max={100} unit="" onChange={setQuotesPerWeek} />
                <CustomSlider label="Minutes saved per quote" value={minutesSavedPerQuote} min={1} max={60} unit="min" onChange={setMinutesSavedPerQuote} />
                <CustomSlider label="Hourly rate" value={hourlyRate} min={10} max={500} unit="" prefix="$" onChange={setHourlyRate} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center bg-white p-4 rounded-xl border border-border shadow-sm">
                <div>
                    <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Hours Saved/Mo</div>
                    <div className="text-xl font-black text-orange">{hoursSavedPerMonth.toFixed(1)}</div>
                </div>
                <div>
                    <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Value Saved/Mo</div>
                    <div className="text-xl font-black text-orange">${valueSavedPerMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-border mt-2 pt-2 md:mt-0 md:pt-0">
                    <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Payback In</div>
                    <div className="text-xl font-black text-orange">{weeksToPayback < 1 ? "< 1 week" : `${Math.round(weeksToPayback)} weeks`}</div>
                </div>
            </div>
        </>
    );

    // Enhanced CTA Button with Navy color leading to Demo Call
    const SharedCTA = () => (
        <div className="p-6 md:p-10 bg-white border-t border-border text-center">
            <a href="#funnel-cta" className="flex items-center justify-center w-full md:max-w-md mx-auto py-5 bg-navy hover:bg-navy-light text-white rounded-xl shadow-btn-navy hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-1 transition-all duration-200 font-bold text-lg uppercase tracking-wide mb-4">
                Book Your Build Now
            </a>
            <div className="text-xs text-text-muted leading-relaxed flex flex-col items-center gap-1">
                <div className="flex items-center justify-center gap-1.5 font-bold text-green">
                    <span className="text-base">🎁</span> 
                    <span>12 Months Tech Management Included FREE</span>
                </div>
                <div className="block">
                    (Save $1,188). Just $99/mo after year 1.
                </div>
            </div>
        </div>
    );

    return (
        <section id="offer" className="py-16 md:py-24 bg-bg-off">
            <div className="container mx-auto px-5 max-w-[1100px]">
                
                {/* MOBILE LAYOUT: Pricing -> CTA -> Header -> ROI */}
                <div className="block md:hidden">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-border mb-12">
                         <div className="p-8 relative">
                             <PricingCardContent />
                         </div>
                         <SharedCTA />
                    </div>

                    <div className="text-center mb-10">
                        {/* Reduced Font Size to fit on one line */}
                        <h2 className="text-2xl font-black text-navy mb-4 leading-tight">The Math Doesn't Lie</h2>
                        <p className="text-lg text-text-muted">See how quickly manual data entry is draining your profit margin.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border p-8">
                         <ROICalculatorContent />
                    </div>
                </div>


                {/* DESKTOP LAYOUT: Header -> Combined Card (ROI | Pricing) -> CTA */}
                <div className="hidden md:block">
                     <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-navy mb-4">The Math Doesn't Lie</h2>
                        <p className="text-lg text-text-muted">See how quickly manual data entry is draining your profit margin.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-border">
                        <div className="grid grid-cols-2">
                            <div className="p-10 bg-slate-50/50">
                                <ROICalculatorContent />
                            </div>
                            <div className="p-10 flex flex-col justify-center relative border-l border-border">
                                <PricingCardContent />
                            </div>
                        </div>
                        <SharedCTA />
                    </div>
                </div>

            </div>
            
            {/* Funnel CTA Block */}
            <div id="funnel-cta" className="mt-20 bg-navy text-white py-16 md:py-24 text-center">
                <div className="container mx-auto px-5 max-w-[700px]">
                    <h2 className="text-[32px] font-black mb-6 leading-tight">I only onboard 3 trades per week.</h2>
                    <p className="text-lg opacity-80 mb-10 leading-relaxed">I want to make sure this is right for you. Let's chat for 15 minutes. No sales pressure—just a demo of how it works for your specific trade.</p>
                    
                    <div className="flex justify-center gap-5 flex-wrap">
                        <a href="https://calendly.com/" target="_blank" rel="noreferrer" className="bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg shadow-btn-white hover:bg-slate-100 transition-colors flex items-center gap-2">
                             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                             Book A 15-Min Demo Call
                        </a>
                    </div>
                    
                    <div className="mt-8 text-lg opacity-70">
                        Or text <strong>"FLOW"</strong> to <strong>0494 186 989</strong><br/>
                        <span className="text-sm">I'll reply with a sample quote so you can see it in action.</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
