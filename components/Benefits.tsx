import React from 'react';

// Reusable Bento Card Component
const BentoCard = ({ title, desc, children, span = 1 }: React.PropsWithChildren<{ title: string, desc: string, span?: number }>) => (
    <div className={`bg-white rounded-[20px] border border-border overflow-hidden shadow-sm flex flex-col ${span === 2 ? 'md:col-span-2' : 'md:col-span-1'}`}>
        <div className="bg-bg-off border-b border-border h-[200px] md:h-[240px] flex items-center justify-center relative overflow-hidden order-first p-6">
            {children}
        </div>
        <div className="p-6 md:p-8 flex-1">
            <div className="text-xl font-extrabold text-navy mb-3 flex items-center gap-2 leading-tight">{title}</div>
            <div className="text-[15px] text-text-muted leading-relaxed">{desc}</div>
        </div>
    </div>
);

export const Benefits = () => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-bg-off">
            <div className="container mx-auto px-5 max-w-[1100px]">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-[32px] md:text-4xl font-black text-navy mb-4 tracking-tight leading-tight">Built for tradies who<br className="hidden md:block"/> hate computers</h2>
                    <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">The power of a $50k enterprise app, inside a simple Google Sheet you already know how to use.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Payment Received */}
                    <BentoCard title="⚡ 1-Tap Automation" desc="From quote to paid in one tap. Your process runs on autopilot so you can focus on the tools." span={2}>
                        <img src="https://placehold.co/600x300/F1F5F9/1E293B?text=One-Tap+Payment+Flow" alt="Payment Flow" className="w-full h-full object-contain" />
                    </BentoCard>

                    {/* Card 2: No Mistakes */}
                    <BentoCard title="🎯 Zero Learning Curve" desc="It's just a spreadsheet. If you can use Excel, you're already an expert." span={1}>
                        <img src="https://placehold.co/400x300/F1F5F9/1E293B?text=Error-Free+Sheet" alt="Sheet Interface" className="w-full h-full object-contain shadow-lg rounded-lg" />
                    </BentoCard>

                    {/* Card 3: Look Professional */}
                    <BentoCard title="📲 Mobile Companion" desc="Manage jobs, send quotes, and check payments from anywhere." span={1}>
                         <img src="https://placehold.co/300x500/F1F5F9/1E293B?text=Mobile+App" alt="Mobile App" className="h-full w-auto object-contain shadow-2xl rounded-lg" />
                    </BentoCard>

                    {/* Card 4: Own Your Data */}
                    <BentoCard title="🔒 Own, Don't Rent" desc="Stop paying monthly subscriptions for data you should own. One-time setup, yours forever." span={2}>
                         <img src="https://placehold.co/600x300/F1F5F9/1E293B?text=SaaS+Renting+vs+Flowio+Owning" alt="SaaS vs Owning Diagram" className="w-full h-full object-contain" />
                    </BentoCard>
                </div>
            </div>
        </section>
    );
};