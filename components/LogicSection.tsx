import React from 'react';

export const LogicSection = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-5 max-w-[1100px]">
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-4xl font-black text-navy mb-4 leading-tight">Why 78% of Tradies<br className="md:hidden"/> Quit SaaS Apps</h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">They are too complicated. Spreadsheets are too manual. Flowio is the best of both worlds.</p>
                </div>

                <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
                    <table className="w-full min-w-[600px] border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="p-4 md:p-6 bg-navy text-white text-lg font-bold border-b border-border w-1/4">Feature</th>
                                <th className="p-4 md:p-6 bg-orange text-white text-lg font-bold border-b border-border text-center w-1/4">Flowio System</th>
                                <th className="p-4 md:p-6 bg-bg-off text-text-muted text-base font-bold border-b border-border w-1/4">ServiceM8 / Jobber</th>
                                <th className="p-4 md:p-6 bg-bg-off text-text-muted text-base font-bold border-b border-border w-1/4">Excel / Word</th>
                            </tr>
                        </thead>
                        <tbody className="text-navy">
                            {[
                                { f: 'Learning Curve', flow: 'Zero (It\'s a Spreadsheet)', saas: 'High (Days of training)', old: 'Medium' },
                                { f: 'Automation', flow: 'Full (SMS, Stripe, Cal)', saas: 'Good', old: 'None', badOld: true },
                                { f: 'Setup Time', flow: 'Done-For-You (48 Hrs)', saas: 'DIY (Weeks)', old: 'Instant' },
                                { f: 'Ownership', flow: 'You Own The Data', saas: 'Rented (Stop paying, lose data)', old: 'You Own It', badSaas: true }
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-border last:border-0">
                                    <td className="p-4 md:p-6 font-bold">{row.f}</td>
                                    <td className="p-4 md:p-6 text-center font-bold text-green bg-green/5 border-x border-green/10 flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 bg-green rounded-full text-white flex items-center justify-center text-xs">✓</span>
                                        {row.flow}
                                    </td>
                                    <td className={`p-4 md:p-6 text-center ${row.badSaas ? 'text-red-500 font-semibold' : ''}`}>{row.saas}</td>
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