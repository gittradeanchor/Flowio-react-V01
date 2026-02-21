
import React, { useState, useEffect, useRef } from 'react';
import { JobItem, QuoteTotals } from '../types';

interface AcceptFlowProps {
    items: JobItem[];
    totals: QuoteTotals;
    customer: {
        name: string;
        email: string;
        phone: string;
        trade: string;
    };
}

export const AcceptFlow = ({ items, totals, customer }: AcceptFlowProps) => {
    // Internal Stages: 
    // 1: PDF Preview (Skipped for now)
    // 2: Accept Modal
    // 3: Automation Success
    const [step, setStep] = useState<1 | 2 | 3>(2);
    
    // Modal Inputs
    const [acceptDate, setAcceptDate] = useState('');
    const [acceptTime, setAcceptTime] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Automation Animation State
    const [animStep, setAnimStep] = useState(0);
    const [loadingText, setLoadingText] = useState("Connecting to Calendar...");
    const [progress, setProgress] = useState(5);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to center on mount and step change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [step]);

    // Animation Logic for Step 3
    useEffect(() => {
        if (step === 3) {
            setAnimStep(0);
            const seq = [
                { t: 800, txt: "Generating Invoice...", p: 45 },
                { t: 1800, txt: "Syncing with Stripe...", p: 70 },
                { t: 2800, txt: "Sending SMS...", p: 90 },
                { t: 3500, txt: "Done!", p: 100 }
            ];

            let timeouts: number[] = [];
            
            seq.forEach(s => {
                const tm = window.setTimeout(() => {
                    setLoadingText(s.txt);
                    setProgress(s.p);
                }, s.t);
                timeouts.push(tm);
            });

            const finalTm = window.setTimeout(() => {
                setAnimStep(1);
            }, 3800);
            timeouts.push(finalTm);

            return () => timeouts.forEach(window.clearTimeout);
        }
    }, [step]);

    const handleConfirmBooking = () => {
        if (!termsAccepted) {
            alert("Please accept the terms to proceed.");
            return;
        }
        setStep(3);
    };

    return (
        <div ref={containerRef} className="animate-fade-in w-full max-w-[1100px] mx-auto">
            
            {/* STEP 1: PDF PREVIEW */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 md:gap-16 items-start">
                    <div className="text-center md:text-left">
                        <div className="mb-3">
                            <span className="inline-block bg-orange text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-3">CLIENT VIEW</span>
                            <h3 className="text-2xl font-extrabold mb-2">This is what your customer sees</h3>
                        </div>
                        <p className="opacity-90 mb-4">A professional PDF quote sent directly to their phone. Clean, branded, and easy to read.</p>
                        <p className="font-bold text-white">👉 Tap "Accept Quote" to simulate the customer experience</p>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden shadow-2xl text-navy">
                        {/* Browser Bar Mockup */}
                        <div className="bg-gray-200 p-3 flex items-center gap-3 border-b border-gray-300">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                            </div>
                            <div className="flex-1 bg-white py-1.5 px-3 rounded text-xs text-text-muted font-mono truncate">tradeanchor.com.au/quote/Q0004</div>
                        </div>

                        {/* PDF Content */}
                        <div className="p-6 md:p-10 min-h-[400px] text-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-6 border-b-2 border-border pb-6 mb-6">
                                <div>
                                    <div className="text-xl font-extrabold text-navy mb-2">TradeAnchor</div>
                                    <div className="text-text-muted text-xs">Email: support@tradeanchor.com.au<br/>ABN: 45 529 331 663</div>
                                </div>
                                <div className="w-16 h-16 bg-navy text-white rounded-xl flex items-center justify-center text-3xl">⚓</div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-text-muted uppercase mb-2">Bill To:</h3>
                                <div className="text-base font-semibold">
                                    {customer.name || 'Sean Miller'}<br/>
                                    {customer.email || 'sean@example.com'}<br/>
                                    {customer.phone || '04XX XXX XXX'}<br/>
                                    Sydney, NSW
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {[ {l:'Quote ID',v:'Q0004'}, {l:'Quote Date',v:'22 Nov 2025'}, {l:'Due Date',v:'06 Dec 2025'} ].map((x,i) => (
                                    <div key={i}>
                                        <label className="text-xs text-text-muted uppercase block mb-1">{x.l}</label>
                                        <div className="font-semibold">{x.v}</div>
                                    </div>
                                ))}
                            </div>

                            <table className="w-full mb-8">
                                <thead className="bg-bg-off">
                                    <tr>
                                        <th className="p-3 text-left border-b-2 border-border">Item</th>
                                        <th className="p-3 text-right border-b-2 border-border">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((it, i) => (
                                        <tr key={i} className="border-b border-border">
                                            <td className="p-3">{it.name}<br/><span className="text-xs text-text-muted">Qty: {it.qty} @ ${it.rate}</span></td>
                                            <td className="p-3 text-right font-mono">${(it.qty * it.rate).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex flex-col items-end gap-2 mb-8">
                                <div className="flex justify-between w-[200px]"><span>Subtotal:</span><span className="font-semibold">${totals.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between w-[200px]"><span>GST (10%):</span><span className="font-semibold">${totals.gst.toFixed(2)}</span></div>
                                <div className="flex justify-between w-[200px] text-lg font-extrabold text-navy border-t-2 border-navy pt-2"><span>Total:</span><span>${totals.total.toFixed(2)}</span></div>
                            </div>

                            <div className="text-center">
                                <button onClick={() => setStep(2)} className="bg-green hover:bg-[#059669] text-white px-6 py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg active:scale-95 transform">Accept quote →</button>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-border text-xs text-text-muted">
                                <strong>Terms and Conditions</strong><br/>14 days validity.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: ACCEPT MODAL */}
            {step === 2 && (
                <div className="fixed inset-0 bg-navy/95 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center p-4" onClick={() => setStep(1)}>
                    <div className="bg-white w-full max-w-[600px] rounded-t-[20px] md:rounded-[20px] p-6 md:p-12 max-h-[90vh] overflow-y-auto pb-28 md:pb-12 text-navy relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setStep(1)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-off text-text-muted flex items-center justify-center text-xl hover:bg-slate-200">×</button>
                        
                        <span className="inline-block bg-orange text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-2">DEMO MODE</span>
                        <h2 className="text-2xl font-black text-navy mb-2">Accept Quote #Q0004</h2>
                        <p className="text-text-muted text-sm mb-6">{customer.name || 'Sean Miller'} · Sydney, NSW</p>

                        <div className="bg-bg-off p-5 rounded-xl mb-6">
                            <div className="flex justify-between mb-2 text-sm"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg border-t border-border pt-3 mt-2"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-navy mb-2">Preferred Job Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 border-2 border-border rounded-lg text-base bg-white text-navy cursor-pointer" 
                                    onChange={(e) => setAcceptDate(e.target.value)} 
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                    style={{ colorScheme: 'light' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy mb-2">Start Time</label>
                                <input 
                                    type="time" 
                                    className="w-full p-3 border-2 border-border rounded-lg text-base bg-white text-navy cursor-pointer" 
                                    onChange={(e) => setAcceptTime(e.target.value)} 
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                    style={{ colorScheme: 'light' }}
                                />
                            </div>
                            <div className="flex items-start gap-3">
                                <input type="checkbox" id="terms" className="w-5 h-5 mt-0.5" onChange={(e) => setTermsAccepted(e.target.checked)} />
                                <label htmlFor="terms" className="text-sm text-navy leading-snug">I accept this quote and the Terms & Conditions.</label>
                            </div>
                        </div>

                        <button onClick={handleConfirmBooking} className="w-full bg-navy text-white py-4 rounded-xl font-bold text-base hover:bg-navy-light shadow-btn-navy">Confirm & Book (Demo)</button>

                        {/* Trust Signals — 2×2 grid */}
                        <div className="grid grid-cols-2 gap-2 mt-5">
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted bg-bg-off rounded-lg px-3 py-2 border border-border/50">
                                <span className="shrink-0">🔒</span><span>Secure payment via Stripe</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted bg-bg-off rounded-lg px-3 py-2 border border-border/50">
                                <span className="shrink-0">✅</span><span>Full refund guarantee</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted bg-bg-off rounded-lg px-3 py-2 border border-border/50">
                                <span className="shrink-0">📋</span><span>ABN: 45 529 331 663</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted bg-bg-off rounded-lg px-3 py-2 border border-border/50">
                                <span className="shrink-0">💼</span><span>Tax deductible for your business</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: AUTOMATION SHOWCASE */}
            {step === 3 && (
                <div className="animate-fade-in min-h-[600px] flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-green text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-5 shadow-lg">✓</div>
                        <h2 className="text-[32px] font-black mb-2 tracking-normal">Booking Confirmed!</h2>
                        <p className="text-lg opacity-90">Here's what just happened automatically...</p>
                    </div>

                    {/* Animated Processing Container */}
                    <div className="bg-white rounded-2xl p-0 text-center shadow-2xl max-w-[450px] mx-auto relative overflow-hidden min-h-[500px] text-navy w-full">
                         {/* LOADING STATE */}
                         {animStep === 0 && (
                            <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8">
                                <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin mb-6"></div>
                                <div className="text-xl font-bold text-navy mb-4">{loadingText}</div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden max-w-[200px]">
                                    <div className="h-full bg-orange transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div className="mt-4 text-xs text-text-muted bg-bg-off px-3 py-1 rounded-full border border-border">This will only take 5 seconds</div>
                            </div>
                         )}

                         {/* SUCCESS STATE */}
                         <div className={`p-8 h-full flex flex-col transition-opacity duration-500 ${animStep === 1 ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="mb-6 shrink-0">
                                <div className="w-14 h-14 bg-green text-white rounded-full text-3xl flex items-center justify-center mx-auto mb-3 shadow-lg">✓</div>
                                <h2 className="text-2xl font-black text-navy mb-1 leading-tight">Automation Complete</h2>
                                <p className="text-xs text-text-muted">4 tasks completed in 3.8s</p>
                            </div>

                            <div className="flex flex-col gap-2.5 text-left flex-1">
                                 {[
                                    { i: '📅', t: 'Calendar Event Created', d: 'Job automatically added to your Google Calendar.', c: 'bg-blue-50 text-blue-600', delay: 'delay-[100ms]' },
                                    { i: '📲', t: 'Confirmation SMS', d: 'Customer receives instant confirmation with invite link.', c: 'bg-green-50 text-green-700', delay: 'delay-[300ms]' },
                                    { i: '💳', t: 'Deposit Processed', d: 'Deposit payment captured via Stripe, funds in your account.', c: 'bg-sky-50 text-sky-500', delay: 'delay-[500ms]' },
                                    { i: '🔔', t: 'Reminder Scheduled', d: 'Automatic SMS reminder sent 24 hours before job starts.', c: 'bg-orange-50 text-orange-500', delay: 'delay-[700ms]' }
                                ].map((x, i) => (
                                    <div key={i} className={`bg-white border border-border p-3 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in-up ${x.delay}`}>
                                        <div className={`w-8 h-8 ${x.c} rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5`}>{x.i}</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-navy text-[13px] mb-0.5">{x.t}</div>
                                            <div className="text-[11px] text-text-muted leading-snug">{x.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-dashed border-border flex justify-between items-center animate-fade-in-up delay-[900ms]">
                                <div className="text-left">
                                    <div className="text-[10px] font-bold text-text-muted uppercase">That took</div>
                                    <div className="text-2xl font-black text-green">8 sec</div>
                                </div>
                                <div className="text-right opacity-50">
                                    <div className="text-[10px] font-bold text-text-muted uppercase">Old Way</div>
                                    <div className="text-lg font-bold line-through text-red-500">3h 15m</div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="text-center mt-8">
                        <p className="mb-4 text-base text-white">You've seen the automation. Now let's build yours.</p>
                        <a href="#funnel-cta" className="inline-block bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-xl font-bold text-lg shadow-btn-primary transition-all">
                            Book My Setup Call
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
