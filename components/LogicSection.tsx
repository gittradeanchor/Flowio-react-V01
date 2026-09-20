import React from 'react';

// Comparison rewritten 20 Sept 2026: removed named competitors (ServiceM8/Jobber), "78%", "48 Hrs", and Stripe.
// Every Flowio cell maps to 02_OFFER allowed claims / live features in 05_PRODUCT.
export const LogicSection = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-5 max-w-[1100px]">
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-4xl font-black text-navy mb-4 leading-tight">Keep your Google Sheet.<br className="md:hidden"/> Skip the new app.</h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">Job-management apps ask you to learn something new. Flowio automates the Sheet you already quote from.</p>
                </div>

                <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
                    <table className="w-full min-w-[600px] border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="p-4 md:p-6 bg-navy text-white text-lg font-bold border-b border-border w-1/4">&nbsp;</th>
                                <th className="p-4 md:p-6 bg-orange text-white text-lg font-bold border-b border-border text-center w-1/4">Flowio</th>
                                <th className="p-4 md:p-6 bg-bg-off text-text-muted text-base font-bold border-b border-border w-1/4">A job-management app</th>
                                <th className="p-4 md:p-6 bg-bg-off text-text-muted text-base font-bold border-b border-border w-1/4">Word / Excel by hand</th>
                            </tr>
                        </thead>
                        <tbody className="text-navy">
                            {[
                                { f: 'What you learn', flow: 'Nothing. It\'s your Sheet', saas: 'A new app', old: 'Nothing' },
                                { f: 'Send, accept, book', flow: 'One tap sends PDF, SMS, email and accept link. You confirm the booking', saas: 'Built in', old: 'By hand, every time', badOld: true },
                                { f: 'Setup', flow: 'Done for you', saas: 'You set it up', old: 'Instant' },
                                { f: 'Your data', flow: 'In your Google account', saas: 'In the vendor\'s app', old: 'In your files' }
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-border last:border-0">
                                    <td className="p-4 md:p-6 font-bold">{row.f}</td>
                                    <td className="p-4 md:p-6 text-center font-bold text-green bg-green/5 border-x border-green/10">
                                        <span className="inline-flex items-center justify-center gap-2">
                                            <span className="w-5 h-5 shrink-0 bg-green rounded-full text-white flex items-center justify-center text-xs">✓</span>
                                            {row.flow}
                                        </span>
                                    </td>
                                    <td className="p-4 md:p-6 text-center">{row.saas}</td>
                                    <td className={`p-4 md:p-6 text-center ${row.badOld ? 'text-red-500 font-semibold' : ''}`}>{row.old}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
