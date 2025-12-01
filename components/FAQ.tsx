import React from 'react';

export const FAQ = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-5 max-w-[800px]">
                <div className="text-center mb-10">
                    <h2 className="text-[32px] font-black text-navy">Common Questions</h2>
                </div>
                
                <div className="flex flex-col gap-4 mb-20">
                    {[
                        { q: "How long until I'm live?", a: "48 hours from payment to first quote sent. We handle the entire setup — you just need to provide your logo, company details, and Stripe account." },
                        { q: "Can I try it first?", a: "Yes — we'll send you a demo quote link so you can see exactly what your customers will experience. No payment required for the demo." },
                        { q: "Does it work on mobile?", a: "Yes. Customers accept on their phones (mobile-optimized page). You can create quotes from job sites using our big-button Quick Quote form." },
                        { q: "What if something breaks?", a: "We auto-email you with the error + context. 12 months of break-fix support included (covers Google/Stripe/Xero changes, template fixes, auth issues)." },
                        { q: "Does it work with Xero?", a: "Yes — Xero draft invoice is available on request (optional add-on)." }
                    ].map((item, i) => (
                        <details key={i} className="group border border-border rounded-lg overflow-hidden">
                            <summary className="bg-bg-off text-navy font-bold p-4 cursor-pointer list-none flex justify-between items-center group-open:bg-navy group-open:text-white transition-colors">
                                {item.q}
                                <span className="text-xl group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="p-4 text-text-muted leading-relaxed border-t border-border">{item.a}</p>
                        </details>
                    ))}
                </div>

                <div className="bg-bg-off border-t border-border py-12 px-6 md:px-12 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-center text-center md:text-left">
                        {/* Founder Image Placeholder */}
                        <div className="w-[100px] h-[100px] rounded-full bg-slate-300 border-4 border-white shadow-lg mx-auto md:mx-0 overflow-hidden">
                            <div className="w-full h-full bg-navy flex items-center justify-center text-white text-xs">FOUNDER</div>
                        </div>
                        <div>
                            <h3 className="text-navy font-extrabold text-xl mb-2">I'm not a SaaS Company.</h3>
                            <p className="text-text-muted leading-relaxed">I'm a local Systems Engineer based in Sydney. I don't just send you a login and wish you good luck. I come to your business (or Zoom), I set up your price list, I connect your bank, and I train your team. You get a partner, not just a tool.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};