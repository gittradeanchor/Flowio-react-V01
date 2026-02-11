
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
                className={`w-full h-full transition-transform duration-700 hover:scale-105 object-center ${padded ? 'object-contain p-6' : 'object-cover'}`}
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
                
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-[32px] md:text-5xl font-black text-navy mb-6 tracking-tight leading-[1.1]">
                        Built for tradies who hate computers.
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto font-medium">Stop fighting with complex software. Get full automation inside the Google Sheets you already own.</p>
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
                    {/* Swapped to span 1. Image Size: 2048x1536 (4:3 Ratio) - padded to prevent crop */}
                    <BentoCard
                        title="🔒 Own, Don't Rent"
                        desc="Stop paying monthly subscriptions for data you should own. One-time setup, yours forever."
                        span={1}
                        imgSrc="/images/renting-vs-owning.jpg"
                        imgAlt="Lifetime ownership comparison"
                        padded={true}
                    />

                    {/* Card 4: Mobile Companion (Wide) */}
                    {/* Swapped to span 2. Image Size: 1460x600 (Wide Ratio) */}
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
