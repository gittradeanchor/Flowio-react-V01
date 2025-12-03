import React from 'react';

export const TechStack = () => {
    return (
        <section className="py-6 bg-white">
            <div className="container mx-auto px-5 max-w-[1100px]">
                {/* 
                   INSTRUCTIONS FOR USER:
                   1. Create a folder named "images" inside your project's "public" directory.
                   2. Save the logos image you attached as "tech-stack.png" inside that folder.
                   3. The app will automatically display it below.
                */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 flex items-center justify-center">
                    <img 
                        src="/images/tech-stack.png" 
                        alt="Integrated with Google Cloud, Calendar, Sheets, Stripe, and Workspace" 
                        className="w-full max-w-[900px] h-auto object-contain opacity-90 mix-blend-multiply"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    
                    {/* Fallback Placeholder if image is not found */}
                    <div className="hidden w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-white">
                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="font-mono text-sm">Upload image to: /public/images/tech-stack.png</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
