
import React from 'react';

export const TechStack = () => {
    return (
        <section className="pb-8 pt-8 md:pt-12 bg-white">
            {/* Caption constrained to container */}
            <div className="container mx-auto px-5 max-w-[1100px] text-center mb-6 md:mb-8">
                <p className="text-lg md:text-2xl font-black text-navy/90 tracking-tight">
                    Works seamlessly with the apps you trust.
                </p>
            </div>

            {/* Image Strip: Edge-to-edge on mobile, contained on desktop */}
            <div className="w-full md:container md:mx-auto md:max-w-[1100px] md:px-5">
                <img 
                    src="/images/tech-stack.png" 
                    alt="Integrated with Google Cloud, Calendar, Sheets, Stripe, and Workspace" 
                    className="w-full h-auto object-contain md:rounded-xl"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                />
                
                {/* Fallback Placeholder */}
                <div className="hidden w-full h-20 md:h-28 border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1 mx-auto">
                    <span className="font-mono text-xs md:text-sm">Upload image to: /public/images/tech-stack.png</span>
                </div>
            </div>
        </section>
    );
};
