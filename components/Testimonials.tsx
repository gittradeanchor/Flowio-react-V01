import React from 'react';

const PlaceholderCard = ({ name, trade, suburb, quote }: { name: string, trade: string, suburb: string, quote: string }) => (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4 mb-4">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center text-orange font-bold text-lg shrink-0">
                {name.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-navy text-sm">{name}</div>
                <div className="text-xs text-text-muted">{trade} &middot; {suburb}</div>
            </div>
        </div>
        <p className="text-sm text-navy leading-relaxed font-medium italic">"{quote}"</p>
        <div className="mt-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    </div>
);

export const Testimonials = () => {
    const testimonials = [
        {
            name: "James T.",
            trade: "Electrician",
            suburb: "Penrith, NSW",
            quote: "I was spending 45 minutes writing up each quote after hours. Now I send them from the van in under 2 minutes. My wife noticed I'm home for dinner again."
        },
        {
            name: "Mark R.",
            trade: "Plumber",
            suburb: "Parramatta, NSW",
            quote: "The auto follow-up alone pays for itself. I had three jobs last week that would've slipped through the cracks without the SMS reminders."
        },
        {
            name: "Dave K.",
            trade: "HVAC Tech",
            suburb: "Sutherland, NSW",
            quote: "I tried ServiceM8 and Jobber — both were overpriced and overcomplicated. Flowio runs in Sheets. There's nothing to learn."
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-5 max-w-[1100px]">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-green/10 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <span className="w-2 h-2 bg-green rounded-full"></span>
                        Early Adopter Results
                    </div>
                    <h2 className="text-[28px] md:text-4xl font-black text-navy tracking-tight leading-tight">
                        Tradies are getting their evenings back.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <PlaceholderCard key={i} {...t} />
                    ))}
                </div>

                <p className="text-xs text-text-muted text-center mt-8 opacity-60">
                    Results from early beta installs. Real testimonials with full names and video coming soon.
                </p>
            </div>
        </section>
    );
};
