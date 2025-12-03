import React, { useState, useEffect, useRef } from 'react';
import { JOB_DATA } from '../constants';
import { JobItem, QuoteTotals } from '../types';

export const TestDrive = () => {
    // Stage Management
    const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1); 
    const sectionRef = useRef<HTMLElement>(null);
    
    // Builder State
    const [items, setItems] = useState<JobItem[]>([]);
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generationTime, setGenerationTime] = useState(0);
    const [finalTime, setFinalTime] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    // Modal State
    const [acceptDate, setAcceptDate] = useState('');
    const [acceptTime, setAcceptTime] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Animation State
    const [animStep, setAnimStep] = useState(0); // 0: loading, 1: done

    // SMS Form State
    const [leadName, setLeadName] = useState('');
    const [leadTrade, setLeadTrade] = useState('');
    const [smsSending, setSmsSending] = useState(false);
    const [smsSent, setSmsSent] = useState(false);

    // Derived
    const calculateTotals = (currentItems: JobItem[]): QuoteTotals => {
        const subtotal = currentItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
        const gst = subtotal * 0.1;
        return {
            subtotal: Number(subtotal.toFixed(2)),
            gst: Number(gst.toFixed(2)),
            total: Number((subtotal + gst).toFixed(2))
        };
    };
    const totals = calculateTotals(items);

    // Handlers
    const handleAddItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key = e.target.value;
        if (!key) return;
        const newItem = JOB_DATA[key];
        if (!items.find(i => i.sku === newItem.sku)) {
            setItems([...items, newItem]);
        }
        e.target.value = ''; 
    };

    const handleGenerate = () => {
        setGenerating(true);
        const startTime = Date.now();
        timerRef.current = window.setInterval(() => {
            setGenerationTime((Date.now() - startTime) / 1000);
        }, 100);

        setTimeout(() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setFinalTime(((Date.now() - startTime) / 1000).toFixed(1));
            setGenerating(false);
            setStage(2);
        }, 1500);
    };

    const handleConfirmBooking = () => {
        if (!termsAccepted) {
            alert("Please accept terms");
            return;
        }
        setStage(4);
        
        // Fix: Prevent jump by scrolling to start of section
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Animation Sequence for Stage 4
    const [loadingText, setLoadingText] = useState("Connecting to Calendar...");
    const [progress, setProgress] = useState(5);

    useEffect(() => {
        if (stage === 4) {
            setAnimStep(0);
            const seq = [
                { t: 800, txt: "Generating Invoice...", p: 45 },
                { t: 1800, txt: "Syncing with Stripe...", p: 70 },
                { t: 2800, txt: "Sending SMS...", p: 90 },
                { t: 3500, txt: "Done!", p: 100 }
            ];

            let timeouts: number[] = [];
            
            seq.forEach(step => {
                const tm = window.setTimeout(() => {
                    setLoadingText(step.txt);
                    setProgress(step.p);
                }, step.t);
                timeouts.push(tm);
            });

            const finalTm = window.setTimeout(() => {
                setAnimStep(1);
            }, 3800);
            timeouts.push(finalTm);

            return () => timeouts.forEach(window.clearTimeout);
        }
    }, [stage]);

    const handleSmsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSmsSending(true);

        const formData = {
            customer: {
                name: leadName || 'Demo Lead',
                trade: leadTrade,
                phone: mobile, 
                email: email
            },
            quote: {
                currency: 'AUD',
                items: items.map(it => ({
                    sku: it.sku,
                    name: it.name,
                    qty: Number(it.qty),
                    rate: Number(it.rate),
                    lineTotal: Number((Number(it.qty) * Number(it.rate)).toFixed(2))
                })),
                subtotal: totals.subtotal,
                gst: totals.gst,
                total: totals.total
            },
            meta: {
                source: 'react-app-demo',
                timestamp: new Date().toISOString()
            }
        };

        try {
             // Accessing the env variable for Vite safely
             let webhookUrl = '';
             try {
                // @ts-ignore
                if (import.meta && import.meta.env) {
                    // @ts-ignore
                    webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
                }
             } catch (e) {
                console.warn("Env variable access failed", e);
             }
             
             if (!webhookUrl) {
                 console.warn("Webhook URL is missing, strictly simulating success.");
                 // Fallback or just simulate success
             } else {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }).catch(err => console.error("Webhook error", err));
             }
            setSmsSent(true);
        } catch (e) {
            console.error(e);
            setSmsSent(true); 
        } finally {
            setSmsSending(false);
        }
    };

    return (
        <section id="test-drive" ref={sectionRef} className="py-16 md:py-24 bg-navy text-white overflow-hidden relative transition-all min-h-[700px]">
            <div className="container mx-auto px-5 max-w-[1100px]">
                
                {/* STAGE 1: Builder */}
                {stage === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 md:gap-16 items-start">
                        <div className="text-center md:text-left">
                            <div className="mb-8">
                                <span className="inline-block bg-orange text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-2">INTERACTIVE DEMO</span>
                                <h2 className="text-[28px] md:text-[42px] font-black leading-[1.2] mb-4">See it work in 30s.</h2>
                                <p className="text-base opacity-90 mb-5 leading-relaxed">We'll send a real quote to your phone right now. No signup needed.</p>
                            </div>

                            {generating && (
                                <div className="mt-4 mb-6 p-3 bg-white/10 rounded-xl grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[11px] font-semibold opacity-70 mb-1 uppercase">Old Way</div>
                                        <div className="text-xl md:text-3xl font-mono font-black text-red-500">15:23</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-semibold opacity-70 mb-1 uppercase">Flowio</div>
                                        <div className="text-xl md:text-3xl font-mono font-black text-green">⚡ {generationTime.toFixed(1)}s</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mock Sheet Card */}
                        <div className="bg-white text-navy rounded-2xl shadow-2xl overflow-hidden w-full">
                            <div className="bg-[#0F9D58] text-white p-3 flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="8"/></svg>
                                <span className="font-semibold text-[13px] truncate">Flowio QuoteBuilder <span className="opacity-70 font-normal ml-1">(Demo Mode)</span></span>
                            </div>
                            
                            <div className="p-4 md:p-6">
                                {/* Context Bar */}
                                <div className="bg-bg-off p-2.5 rounded-lg text-[13px] text-text-muted mb-4 border border-border flex items-center justify-between">
                                    <span><strong>Quote #Q0004</strong></span>
                                    <span>Sean Miller (Sydney)</span>
                                </div>
                                
                                {/* Form Fields */}
                                <div className="flex flex-col gap-3 mb-5">
                                    <input 
                                        type="tel" 
                                        className="w-full bg-white border border-border p-3.5 text-navy text-base focus:bg-white focus:outline-none focus:ring-2 ring-orange/20 focus:border-orange transition-all rounded-md"
                                        placeholder="Enter your mobile (for SMS)..."
                                        onChange={(e) => setMobile(e.target.value)}
                                        value={mobile}
                                    />
                                    <input 
                                        type="email" 
                                        className="w-full bg-white border border-border p-3.5 text-navy text-base focus:bg-white focus:outline-none focus:ring-2 ring-orange/20 focus:border-orange transition-all rounded-md"
                                        placeholder="Enter your email (for PDF)..."
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </div>

                                {/* SKU Selector */}
                                <div className="mb-4">
                                    <label className="text-[11px] font-bold text-text-muted uppercase block mb-1.5">Add Items From Price List:</label>
                                    <select onChange={handleAddItem} className="w-full p-3 border-2 border-border rounded-md text-base bg-white focus:border-orange outline-none">
                                        <option value="">-- Tap to Select Item --</option>
                                        {Object.entries(JOB_DATA).map(([key, item]) => (
                                            <option key={key} value={key}>{item.sku} · {item.name} (${item.rate})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Items Table */}
                                <div className="border border-border rounded-lg overflow-hidden mb-4 mt-0">
                                    {items.length === 0 ? (
                                        <div className="p-5 text-center text-text-muted text-[13px] bg-bg-off">Items will appear here...</div>
                                    ) : (
                                        <table className="w-full text-[13px]">
                                            <tbody className="block">
                                                {items.map((item, idx) => (
                                                    <tr key={idx} className="block border-b border-border last:border-0 p-3">
                                                        <td className="flex justify-between py-1">
                                                            <span className="font-semibold text-text-muted text-xs w-[40px]">SKU</span>
                                                            <span className="text-right">{item.sku}</span>
                                                        </td>
                                                        <td className="flex justify-between py-1">
                                                            <span className="font-semibold text-text-muted text-xs w-[40px]">Item</span>
                                                            <span className="text-right">{item.name}</span>
                                                        </td>
                                                        <td className="flex justify-between py-1">
                                                            <span className="font-semibold text-text-muted text-xs w-[40px]">Qty</span>
                                                            <span className="text-right">{item.qty}</span>
                                                        </td>
                                                        <td className="flex justify-between py-1 font-bold text-navy">
                                                            <span className="font-semibold text-text-muted text-xs w-[40px]">Total</span>
                                                            <span className="text-right">${(item.qty * item.rate).toFixed(2)}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="mt-4 pt-3 border-t-2 border-border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] text-text-muted">Total (Inc GST)</span>
                                        <span className="font-mono text-xl font-extrabold text-navy">${totals.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleGenerate}
                                    disabled={items.length === 0 || generating}
                                    className="w-full mt-5 bg-green text-white py-4 rounded-lg font-bold text-base hover:bg-[#0B844A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                                >
                                    {generating ? '⚡ Generating...' : '⚡ Generate Quote'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STAGE 2: Preview */}
                {stage === 2 && (
                    <div className="animate-fade-in">
                         <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] p-6 md:p-8 rounded-2xl border-2 border-green text-navy mb-10 shadow-lg">
                            <div className="w-12 h-12 bg-green text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">✓</div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-extrabold mb-1">Quote Generated!</h3>
                                <p className="text-text-muted">That took <strong>{finalTime} seconds</strong>. Your Word doc takes 15 minutes.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 md:gap-16 items-start">
                            <div className="text-center md:text-left">
                                <div className="mb-3">
                                    <span className="inline-block bg-orange text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-3">STAGE 2</span>
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
                                        <div className="text-base font-semibold">Sean Miller<br/>{email || 'sean@example.com'}<br/>{mobile || '04XX XXX XXX'}<br/>Sydney, NSW</div>
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
                                        <button onClick={() => setStage(3)} className="bg-green hover:bg-[#059669] text-white px-6 py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg active:scale-95 transform">Accept quote →</button>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-border text-xs text-text-muted">
                                        <strong>Terms and Conditions</strong><br/>14 days validity.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STAGE 3: Accept Modal Overlay */}
                {stage === 3 && (
                    <div className="fixed inset-0 bg-navy/95 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center p-4" onClick={() => setStage(2)}>
                        <div className="bg-white w-full max-w-[600px] rounded-t-[20px] md:rounded-[20px] p-6 md:p-12 max-h-[90vh] overflow-y-auto pb-28 md:pb-12 text-navy relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setStage(2)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-off text-text-muted flex items-center justify-center text-xl hover:bg-slate-200">×</button>
                            
                            <span className="inline-block bg-orange text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-2">DEMO MODE</span>
                            <h2 className="text-2xl font-black text-navy mb-2">Accept Quote #Q0004</h2>
                            <p className="text-text-muted text-sm mb-6">Sean Miller · Sydney, NSW</p>

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
                        </div>
                    </div>
                )}

                {/* STAGE 4: Automation Showcase */}
                {stage === 4 && (
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
                            <p className="mb-4 text-base text-white">Experience the client view in 10 seconds.</p>
                            <button onClick={() => setStage(5)} className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-xl font-bold text-lg shadow-btn-primary transition-all">Send Me The Demo Link</button>
                        </div>
                    </div>
                )}

                 {/* STAGE 5: SMS Form */}
                 {stage === 5 && (
                    <div className="animate-fade-in max-w-[500px] mx-auto bg-white rounded-2xl shadow-2xl p-8 text-navy">
                        {!smsSent ? (
                            <>
                                <h3 className="text-2xl font-extrabold text-center mb-4 text-navy">Get the real experience</h3>
                                <p className="text-text-muted text-center mb-6">Enter your number and we'll send you an actual quote link.</p>
                                
                                <form onSubmit={handleSmsSubmit} className="flex flex-col gap-4">
                                    <div>
                                        <label className="font-semibold text-[15px] block mb-1.5 text-navy">Name</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="John Smith" 
                                            className="w-full bg-white border-2 border-border p-3 rounded-lg text-base min-h-[48px]"
                                            value={leadName}
                                            onChange={(e) => setLeadName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-[15px] block mb-1.5 text-navy">Trade</label>
                                        <select 
                                            required 
                                            className="w-full bg-white border-2 border-border p-3 rounded-lg text-base min-h-[48px]"
                                            value={leadTrade}
                                            onChange={(e) => setLeadTrade(e.target.value)}
                                        >
                                            <option value="">Select your trade</option>
                                            <option value="Electrician">Electrician</option>
                                            <option value="Plumber">Plumber</option>
                                            <option value="HVAC">HVAC</option>
                                            <option value="Handyman">Handyman</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="font-semibold text-[15px] block mb-1.5 text-navy">Mobile</label>
                                        <input 
                                            type="tel" 
                                            required 
                                            placeholder="04XX XXX XXX" 
                                            className="w-full bg-white border-2 border-border p-3 rounded-lg text-base min-h-[48px]"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-[15px] block mb-1.5 text-navy">Email</label>
                                        <input 
                                            type="email" 
                                            required 
                                            placeholder="you@company.com" 
                                            className="w-full bg-white border-2 border-border p-3 rounded-lg text-base min-h-[48px]"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={smsSending}
                                        className="btn btn-primary w-full justify-center min-h-[56px] mt-2"
                                    >
                                        {smsSending ? 'Sending...' : 'Send me the quote →'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center p-6 bg-bg-off rounded-xl">
                                <div className="text-5xl mb-3">📲</div>
                                <h3 className="text-xl font-bold text-green mb-2">Check your phone & inbox!</h3>
                                <p className="text-text-muted mb-4 text-sm">We just sent you a demo quote. Next step: Book a 10-minute walkthrough.</p>
                                <a href="https://calendly.com/" target="_blank" rel="noreferrer" className="btn btn-navy w-full justify-center min-h-[56px]">Book 10-min walkthrough</a>
                            </div>
                        )}
                    </div>
                 )}
            </div>
        </section>
    );
};
