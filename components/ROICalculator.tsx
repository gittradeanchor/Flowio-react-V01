import React, { useState } from 'react';

const CustomSlider = ({ label, value, min, max, unit, prefix = '', onChange }: { label: string, value: number, min: number, max: number, unit: string, prefix?: string, onChange: (val: number) => void }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Gradient logic for the slider track
    const trackGradient = `linear-gradient(to right, #FB923C 0%, #FB923C ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
    
    // Bubble Position Logic
    const bubbleStyle = {
        left: `calc(${percentage}% + ${(0.5 - percentage / 100) * 24}px)`,
    };

    return (
        <div className="mb-8 relative group">
            <label className="block text-gray-800 font-semibold mb-6 text-sm">
                {label}
            </label>

            {/* Floating Bubble Value */}
            <div
                className="absolute top-6 transform -translate-x-1/2 -translate-y-1 z-10 pointer-events-none transition-all duration-75 ease-out"
                style={bubbleStyle}
            >
                <div className="bg-[#FFF4E5] text-gray-800 text-xs font-bold py-1 px-3 rounded-lg shadow-sm border border-orange-100 whitespace-nowrap">
                    {prefix}{value} {unit}
                </div>
                <div className="w-2 h-2 bg-[#FFF4E5] border-r border-b border-orange-100 transform rotate-45 absolute left-1/2 -ml-1 -bottom-1"></div>
            </div>

            {/* Range Input */}
            <div className="relative h-2 w-full rounded-full">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-2 rounded-full appearance-none z-20 focus:outline-none focus:ring-0 cursor-grab active:cursor-grabbing"
                    style={{ background: trackGradient }}
                />
            </div>
            
             {/* Styles for the slider thumb are handled via standard Tailwind + custom css in index.html or here via style tag if needed for webkit-thumb specifics */}
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-top: -8px; /* Corrects vertical alignment */
                }
                input[type=range]::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                 input[type=range]::-webkit-slider-runnable-track {
                     height: 8px;
                     border-radius: 9999px;
                 }
            `}</style>
        </div>
    );
};

export const ROICalculator = () => {
    const [quotesPerWeek, setQuotesPerWeek] = useState(20);
    const [minutesSavedPerQuote, setMinutesSavedPerQuote] = useState(12);
    const [hourlyRate, setHourlyRate] = useState(120);

    // Calculations
    const hoursSavedPerMonth = (quotesPerWeek * minutesSavedPerQuote * 52) / 60 / 12;
    const valueSavedPerMonth = hoursSavedPerMonth * hourlyRate;
    const assumedInvestmentCost = 1040;
    const weeksToPayback = valueSavedPerMonth > 0 ? assumedInvestmentCost / (valueSavedPerMonth / 4.33) : 0;

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-5 max-w-[1100px] flex flex-col items-center">
                 <div className="text-center mb-10">
                    <h2 className="text-[28px] md:text-4xl font-black text-navy mb-3 tracking-tight">Do the Math</h2>
                    <p className="text-[17px] text-text-muted">See exactly how much manual data entry costs you.</p>
                </div>

                <div className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl p-6 md:p-8 relative border border-slate-100">
                    <h1 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
                        Calculate Your<br />
                        Flowio ROI
                    </h1>

                    <div className="mb-8">
                        <CustomSlider label="Quotes / week" value={quotesPerWeek} min={1} max={100} unit="" onChange={setQuotesPerWeek} />
                        <CustomSlider label="Minutes saved per quote" value={minutesSavedPerQuote} min={1} max={60} unit="min" onChange={setMinutesSavedPerQuote} />
                        <CustomSlider label="Hourly rate" value={hourlyRate} min={10} max={500} unit="" prefix="$" onChange={setHourlyRate} />
                    </div>

                    <div className="bg-navy rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-navy py-3 text-center">
                            <h2 className="text-white font-medium text-sm tracking-wide">Potential Savings</h2>
                        </div>
                        <div className="bg-white p-6 flex flex-col items-center text-center gap-6 rounded-b-2xl">
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Hours saved / month</p>
                                <p className="text-orange text-3xl font-bold">{hoursSavedPerMonth.toFixed(1)} hr</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">$ value saved / month</p>
                                <p className="text-orange text-3xl font-bold">${valueSavedPerMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Payback in</p>
                                <p className="text-orange text-3xl font-bold">{weeksToPayback < 1 ? "< 1 week" : `${Math.round(weeksToPayback)} weeks`}</p>
                            </div>
                            <a href="#offer" className="w-full bg-orange hover:bg-orange-hover text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 mt-2 shadow-md text-sm block no-underline">
                                Start your payback journey
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};