import React, { useState } from 'react';
import { useAttribution } from '../hooks/useAttribution';

export const QuotingAudit = () => {
    const attribution = useAttribution();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        trade: 'Electrician',
        quotesPerWeek: '',
        minutesPerQuote: '',
        hourlyRate: '120',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.quotesPerWeek || !formData.minutesPerQuote) {
            setError('Please fill in all fields.');
            return;
        }

        setIsSubmitting(true);

        // Calculate waste stats for the payload
        const quotesWeek = Number(formData.quotesPerWeek);
        const minsQuote = Number(formData.minutesPerQuote);
        const rate = Number(formData.hourlyRate);
        const annualHoursWasted = (quotesWeek * minsQuote * 52) / 60;
        const annualCostWasted = annualHoursWasted * rate;

        try {
            const webhookUrl = import.meta.env.VITE_MARKETING_ENGINE_URL || import.meta.env.VITE_AUDIT_WEBHOOK_URL || import.meta.env.VITE_MAKE_WEBHOOK_URL;

            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'audit_lead',
                    ...formData,
                    quotesPerWeek: quotesWeek,
                    minutesPerQuote: minsQuote,
                    hourlyRate: rate,
                    annualHoursWasted: Math.round(annualHoursWasted),
                    annualCostWasted: Math.round(annualCostWasted),
                    ...attribution,
                }),
            });

            setIsSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-5 max-w-[600px] text-center">
                    <div className="bg-white rounded-3xl border border-border shadow-lg p-10">
                        <div className="text-5xl mb-4">📧</div>
                        <h3 className="text-2xl font-black text-navy mb-3">Check your email!</h3>
                        <p className="text-text-muted font-medium leading-relaxed">
                            Your personalised Quoting Cost Audit is being generated. You'll receive it within a few minutes.
                        </p>
                        <div className="mt-6 bg-orange/5 rounded-xl p-4 border border-orange/10">
                            <p className="text-sm font-bold text-navy">
                                While you wait — <a href="#test-drive" className="text-orange underline underline-offset-2 hover:no-underline">try the live Test Drive</a> to see Flowio in action.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-5 max-w-[1000px]">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                    {/* Left: Value prop */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-orange/10 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            Free Tool
                        </div>
                        <h2 className="text-[28px] md:text-4xl font-black text-navy mb-4 tracking-tight leading-tight">
                            How much is quoting costing you?
                        </h2>
                        <p className="text-text-muted font-medium leading-relaxed mb-6">
                            Most tradies waste 200+ hours a year on quoting admin. Get a free personalised report showing exactly how much time and money you're losing — and how to fix it.
                        </p>
                        <div className="flex flex-col gap-3 text-sm text-navy font-medium">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                Personalised to your trade & volume
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                PDF report emailed in minutes
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                No sales call required
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="md:w-1/2 w-full">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border shadow-lg p-6 md:p-8 space-y-4">
                            <div>
                                <label className="text-navy font-bold text-sm block mb-1.5">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. James"
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                                />
                            </div>

                            <div>
                                <label className="text-navy font-bold text-sm block mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                                />
                            </div>

                            <div>
                                <label className="text-navy font-bold text-sm block mb-1.5">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="04XX XXX XXX"
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                                />
                            </div>

                            <div>
                                <label className="text-navy font-bold text-sm block mb-1.5">Your Trade</label>
                                <select
                                    name="trade"
                                    value={formData.trade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
                                >
                                    <option>Electrician</option>
                                    <option>Plumber</option>
                                    <option>HVAC</option>
                                    <option>Builder</option>
                                    <option>Painter</option>
                                    <option>Landscaper</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-navy font-bold text-sm block mb-1.5">Quotes / week</label>
                                    <input
                                        type="number"
                                        name="quotesPerWeek"
                                        value={formData.quotesPerWeek}
                                        onChange={handleChange}
                                        placeholder="e.g. 15"
                                        min="1"
                                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                                    />
                                </div>
                                <div>
                                    <label className="text-navy font-bold text-sm block mb-1.5">Mins / quote</label>
                                    <input
                                        type="number"
                                        name="minutesPerQuote"
                                        value={formData.minutesPerQuote}
                                        onChange={handleChange}
                                        placeholder="e.g. 10"
                                        min="1"
                                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-navy font-bold text-sm block mb-1.5">Hourly Rate</label>
                                <select
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
                                >
                                    <option value="80">$80/hr</option>
                                    <option value="100">$100/hr</option>
                                    <option value="120">$120/hr</option>
                                    <option value="150">$150/hr</option>
                                    <option value="180">$180/hr</option>
                                </select>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-medium">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-orange hover:bg-orange-hover text-white rounded-xl font-bold text-base uppercase tracking-wide shadow-btn-primary active:shadow-btn-primary-active active:translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Generating...' : 'Get My Free Audit →'}
                            </button>

                            <p className="text-xs text-text-muted text-center opacity-60">
                                No spam. Just your report + one follow-up.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
