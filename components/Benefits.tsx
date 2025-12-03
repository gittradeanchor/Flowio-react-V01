import React from 'react';

// Reusable Bento Card Component
const BentoCard = ({ 
    title, 
    desc, 
    imgSrc, 
    imgAlt, 
    span = 1, 
    padded = false 
}: { 
    title: string, 
    desc: string, 
    imgSrc: string, 
    imgAlt: string, 
    span?: number,
    padded?: boolean 
}) => (
    <div className={`bg-white rounded-[24px] border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col ${span === 2 ? 'md:col-span-2' : 'md:col-span-1'}`}>
        {/* Increased height to 300px to better fit high-res screenshots/graphics */}
        <div className={`bg-bg-off border-b border-border h-[240px] md:h-[300px] relative overflow-hidden order-first flex items-center justify-center`}>
            <img 
                src={imgSrc} 
                alt={imgAlt}
                className={`w-full h-full transition-transform duration-700 hover:scale-105 ${padded ? 'object-contain p-6' : 'object-cover'}`}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
            />
            {/* Fallback Placeholder if image missing */}
            <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                 <svg className="w-10 h-10 mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <div className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded border border-slate-200 break-all max-w-[80%]">
                    {imgSrc}
                 </div>
                 <div className="text-[10px] mt-2 font-bold tracking-wider text-slate-300 uppercase">Image Missing</div>
             </div>
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <div className="text-xl font-extrabold text-navy mb-3 flex items-center gap-2 leading-tight">{title}</div>
            <div className="text-[15px] text-text-muted leading-relaxed font-medium">{desc}</div>
        </div>
    </div>
);

export const Benefits = () => {
    return (
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-5 max-w-[1100px]">
                
                {/* RISK REVERSAL / TRUST BANNER */}
                <div className="bg-white border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-2xl p-6 md:p-8 mb-20 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto transform -translate-y-12 md:-translate-y-6">
                    <div className="shrink-0">
                        {/* Shield Icon SVG */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange/10 flex items-center justify-center animate-float">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-orange" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl md:text-3xl font-black text-navy mb-2 tracking-tight">100% Results Guarantee</h3>
                        <p className="text-[17px] text-text-muted font-medium">Save 5hrs/week in your first 30 days or we refund every cent. No questions asked.</p>
                    </div>
                    <div className="hidden md:flex flex-col gap-2 items-center opacity-40 grayscale">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure With</div>
                         <div className="flex gap-3">
                             <div className="text-xl font-bold text-slate-400 flex items-center gap-1">
                                <span className="tracking-tighter">Google</span>
                             </div>
                             <div className="w-[1px] h-6 bg-slate-300"></div>
                             <div className="text-xl font-bold text-slate-400 flex items-center gap-1">
                                <span className="tracking-tighter">Stripe</span>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-[32px] md:text-5xl font-black text-navy mb-6 tracking-tight leading-[1.1]">
                        Built for tradies who<br className="hidden md:block" /> hate computers.
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto font-medium">The power of a $50k enterprise app, inside a simple Google Sheet you already know how to use.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Card 1: 1-Tap Automation (Wide) */}
                    {/* Image Size: 2752x1376 (2:1 Ratio). Padded=true requests slightly smaller look. */}
                    <BentoCard 
                        title="⚡ 1-Tap Automation" 
                        desc="From quote to paid in one tap. Your process runs on autopilot so you can focus on the tools, not the paperwork." 
                        span={2}
                        imgSrc="/images/flow-diagram.jpg"
                        imgAlt="One tap automation workflow"
                        padded={true}
                    />

                    {/* Card 2: Zero Learning Curve (Narrow) */}
                    {/* Image from user attachment. */}
                    <BentoCard 
                        title="🎯 Zero Learning Curve" 
                        desc="It's just a spreadsheet. If you can use Excel, you're already an expert." 
                        span={1} 
                        imgSrc="/images/zero-learning-curve.jpg"
                        imgAlt="Google Sheets Interface"
                    />

                    {/* Card 3: Own, Don't Rent (Narrow) */}
                    {/* Swapped to span 1. Image Size: 2048x1536 (4:3 Ratio) */}
                    <BentoCard 
                        title="🔒 Own, Don't Rent" 
                        desc="Stop paying monthly subscriptions for data you should own. One-time setup, yours forever." 
                        span={1} 
                        imgSrc="/images/renting-vs-owning.jpg"
                        imgAlt="Lifetime ownership comparison"
                    />

                    {/* Card 4: Mobile Companion (Wide) */}
                    {/* Swapped to span 2. Image Size: 2752x1536 (Wide Ratio) */}
                    <BentoCard 
                        title="📲 Mobile Companion" 
                        desc="Manage jobs, send quotes, and check payments from anywhere." 
                        span={2} 
                        imgSrc="/images/app-preview.png"
                        imgAlt="Mobile app view"
                    />
                </div>
            </div>
        </section>
    );
};
