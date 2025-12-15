import React, { useState, useEffect, useRef } from 'react';
import { JOB_DATA as FALLBACK_JOB_DATA } from '../constants';
import { JobItem, QuoteTotals } from '../types';
import { AcceptFlow } from './AcceptFlow';
import { getStoredAttribution, getOrCreateLeadId } from '../hooks/useAttribution';

export const TestDrive = () => {
    // Stage Management
    // 1: Builder
    // 2: Sent Screen (QR Code / Success Message)
    // "gate": Intermediate state where the blurred preview is shown
    const [stage, setStage] = useState<1 | 'gate' | 2 >(1); 
    const sectionRef = useRef<HTMLElement>(null);
    const isFirstRender = useRef(true); // Track initial mount
    
    // Switch to external Accept Flow component
    const [showAcceptFlow, setShowAcceptFlow] = useState(false);

    // Dynamic Pricebook State
    type PriceItem = { sku: string; name: string; rate: number };
    const [pricebook, setPricebook] = useState<PriceItem[]>(
      Object.values(FALLBACK_JOB_DATA).map((x: any) => ({
        sku: x.sku,
        name: x.name,
        rate: x.rate
      }))
    );

    // Fetch Pricebook from Google Script
    useEffect(() => {
      const url = "https://script.google.com/macros/s/AKfycby01i3vP2zR2_zA5dDMPrrsFMnTHsM15yAaIlOPV-_qqZhmZ5LX-boS752IVjb3vZq4/exec?a=pricebook";
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data?.ok && Array.isArray(data.items) && data.items.length) {
            setPricebook(data.items);
          }
        })
        .catch(() => {
          // keep fallback, zero UX change
          console.log("Using fallback pricebook");
        });
    }, []);

    // Builder State
    const [items, setItems] = useState<JobItem[]>([]);
    
    const [generating, setGenerating] = useState(false);
    const [generationTime, setGenerationTime] = useState(0);
    const [finalTime, setFinalTime] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    // SMS/Lead Form State
    const [leadName, setLeadName] = useState('');
    const [leadTrade, setLeadTrade] = useState('');
    const [formMobile, setFormMobile] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [smsSending, setSmsSending] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    // Derived Totals
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

    // Scroll Focus Logic
    useEffect(() => {
        // STOP: Do not scroll on the very first render (page load)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            if (sectionRef.current) {
                // Smoothly scroll to the top of the section on stage change
                sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50); 

        return () => clearTimeout(timeoutId);
    }, [stage, showAcceptFlow]);

    // Handlers
    const handleAddItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSku = e.target.value;
        if (!selectedSku) return;

        const selected = pricebook.find(x => x.sku === selectedSku);
        if (!selected) { e.target.value = ""; return; }

        setItems((prev) => {
            const idx = prev.findIndex(p => p.sku === selected.sku);
            if (idx >= 0) {
                // Increment Quantity if exists
                const next = [...prev];
                next[idx] = { ...next[idx], qty: Number(next[idx].qty || 0) + 1 };
                return next;
            }
            if (prev.length >= 4) return prev;

            return [...prev, { sku: selected.sku, name: selected.name, rate: selected.rate, qty: 1 } as any];
        });

        e.target.value = "";
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
            
            // Go to Gate (Blurred Background + Form)
            setStage('gate');
        }, 1500);
    };

    const handleGateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSmsSending(true);

        const attrib = getStoredAttribution();

        // Updated Payload Structure to match User requirements
        const formData = {
            action: "demoLead",
            timestamp: new Date().toISOString(),
            leadId: getOrCreateLeadId(), // Use persistent Lead ID

            name: leadName || "Demo Lead",
            trade: leadTrade || "",
            phone: formMobile || "",
            email: formEmail || "",

            // Only send SKU and Qty as requested
            items: (Array.isArray(items) ? items : [items])
                .filter(i => Number(i.qty) > 0)
                .map(i => ({ sku: i.sku, qty: Number(i.qty) })),

            total: totals?.total ?? "",

            // Flattened Attribution
            ...attrib
        };

        // Fallback hardcoded URL + Environment Variable check
        let webhookUrl = 'https://hook.us2.make.com/iowm5ja7jqtluqu6geuxu39ski3g9u2j';
        
        // Try to load from env if available (prevents hardcoding issues if you change it later)
        // @ts-ignore
        if (import.meta.env && import.meta.env.VITE_MAKE_WEBHOOK_URL) {
            // @ts-ignore
            webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
        }

        console.log("Sending payload to:", webhookUrl, formData);

        try {
             const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                console.log("Webhook Success");
            } else {
                console.warn("Webhook returned status:", response.status);
            }
             
             // Move to Sent Screen regardless of webhook outcome to not block user
             setStage(2);
             
        } catch (e) {
            console.error("Webhook Failed:", e);
            // Still proceed to demo experience
            setStage(2);
        } finally {
            setSmsSending(false);
        }
    };
    
    const handleResend = () => {
        setResendStatus('Sending...');
        setTimeout(() => setResendStatus('Sent!'), 1500);
    };

    const launchAcceptFlow = () => {
        setShowAcceptFlow(true);
    };

    return (
        <section id="test-drive" ref={sectionRef} className="py-16 md:py-24 bg-navy text-white overflow-hidden relative transition-all min-h-[700px]">
            <div className="container mx-auto px-5 max-w-[1100px]">
                
                {/* RENDER ACCEPT FLOW IF ACTIVE */}
                {showAcceptFlow ? (
                    <AcceptFlow 
                        items={items} 
                        totals={totals} 
                        customer={{
                            name: leadName,
                            trade: leadTrade,
                            email: formEmail,
                            phone: formMobile
                        }} 
                    />
                ) : (
                    <>
                        {/* STAGE 1: Builder */}
                        {stage === 1 && (
                            <div id="stage-1" className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 md:gap-16 items-start">
                                <div className="text-center md:text-left">
                                    <div className="mb-8">
                                        <span className="inline-block bg-orange text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-2">INTERACTIVE DEMO</span>
                                        <h2 className="text-[24px] md:text-[42px] font-black leading-[1.2] mb-4">Send a real quote in 30s.</h2>
                                        <p className="text-base opacity-90 mb-5 leading-relaxed">Pick 1–4 items → we’ll text you a real client ‘Accept’ link + email the PDF.</p>
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
                                <div className="w-full">
                                    {/* Progress Strip */}
                                    <div className="flex items-center gap-3 mb-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/50">
                                        <span className="text-orange flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center text-[10px]">1</span>
                                            Pick Items
                                        </span>
                                        <span className="w-4 h-px bg-white/20"></span>
                                        <span>2. Generate</span>
                                        <span className="w-4 h-px bg-white/20"></span>
                                        <span>3. Send</span>
                                    </div>

                                    <div className="bg-white text-navy rounded-2xl shadow-2xl overflow-hidden w-full">
                                        <div className="bg-[#0F9D58] text-white p-3 flex items-center gap-2">
                                            <svg width="16" height="16" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="8"/></svg>
                                            <span className="font-semibold text-[13px] truncate">Flowio QuoteBuilder <span className="opacity-70 font-normal ml-1">(Demo Mode)</span></span>
                                        </div>
                                        
                                        <div className="p-4 md:p-6">
                                            {/* Context Bar */}
                                            <div className="bg-bg-off p-2.5 rounded-lg text-[13px] text-text-muted mb-4 border border-border flex items-center justify-between">
                                                <span><strong>Quote #Q0004</strong></span>
                                                <span className="bg-orange/10 text-orange px-2 py-0.5 rounded text-[10px] font-bold uppercase">Draft</span>
                                            </div>
                                            
                                            {/* Demo Client Summary */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[11px] font-bold text-text-muted uppercase">Client</span>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase">Demo</span>
                                                </div>
                                                <div className="font-bold text-navy text-sm">Sean Miller (Sydney)</div>
                                                <div className="text-xs text-text-muted font-mono mt-0.5">04••• ••• •• · s•••@gmail.com</div>
                                                <div className="text-[10px] text-slate-400 mt-2 italic">Real client details collected next.</div>
                                            </div>

                                            {/* SKU Selector */}
                                            <div className="mb-4">
                                                <label className="text-[11px] font-bold text-text-muted uppercase block mb-1.5">Add Items From Price List:</label>
                                                <select onChange={handleAddItem} className="w-full p-3 border-2 border-border rounded-md text-base bg-white focus:border-orange outline-none cursor-pointer">
                                                    <option value="">-- Tap to Select Item --</option>
                                                    {pricebook.map((item) => (
                                                        <option key={item.sku} value={item.sku}>{item.sku} · {item.name} (${item.rate})</option>
                                                    ))}
                                                </select>
                                                <p className="text-[11px] text-text-muted mt-1.5 ml-1">
                                                    Pick up to 4 common items. Total updates automatically.
                                                </p>
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
                                                className="w-full mt-5 bg-green text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0B844A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg active:translate-y-0.5"
                                            >
                                                {generating ? '⚡ Generating...' : 'Send demo link →'}
                                            </button>
                                            
                                            <p className="text-center text-[11px] font-semibold text-text-muted mt-3">
                                                You’ll get: SMS link + PDF + accept page (10 sec).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STAGE: GATE (Form Overlay with Blurred Background) */}
                        {stage === 'gate' && (
                            <div className="relative animate-fade-in min-h-[500px] flex items-center justify-center">
                                {/* FIXED OVERLAY FORM */}
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                    <div className="absolute inset-0" />
                                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-navy w-full max-w-[480px] border border-border animate-fade-in-up relative z-10">
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-black text-navy mb-2">Almost there!</h3>
                                            <p className="text-text-muted text-sm leading-relaxed">
                                                Your quote is ready. Tell us where to send the live demo link so you can experience the mobile customer view.
                                            </p>
                                        </div>

                                        <form onSubmit={handleGateSubmit} className="flex flex-col gap-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="font-semibold text-xs block mb-1 text-navy">Name</label>
                                                    <input 
                                                        type="text" required placeholder="John" 
                                                        className="w-full bg-bg-off border border-border p-3 rounded-lg text-sm focus:border-orange outline-none"
                                                        value={leadName} onChange={(e) => setLeadName(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="font-semibold text-xs block mb-1 text-navy">Trade</label>
                                                    <select 
                                                        required 
                                                        className="w-full bg-bg-off border border-border p-3 rounded-lg text-sm focus:border-orange outline-none"
                                                        value={leadTrade} onChange={(e) => setLeadTrade(e.target.value)}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="Electrician">Electrician</option>
                                                        <option value="Plumber">Plumber</option>
                                                        <option value="HVAC">HVAC</option>
                                                        <option value="Handyman">Handyman</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="font-semibold text-xs block mb-1 text-navy">Mobile (for SMS demo)</label>
                                                <input 
                                                    type="tel" required 
                                                    className="w-full bg-bg-off border border-border p-3 rounded-lg text-sm focus:border-orange outline-none"
                                                    value={formMobile} onChange={(e) => setFormMobile(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="font-semibold text-xs block mb-1 text-navy">Email (for PDF demo)</label>
                                                <input 
                                                    type="email" required 
                                                    className="w-full bg-bg-off border border-border p-3 rounded-lg text-sm focus:border-orange outline-none"
                                                    value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                                                />
                                            </div>

                                            <button 
                                                type="submit" disabled={smsSending}
                                                className="bg-navy text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-navy-light shadow-btn-navy transition-all flex justify-center items-center"
                                            >
                                                {smsSending ? 'Sending...' : 'Send my demo link →'}
                                            </button>
                                        </form>
                                        <p className="text-[10px] text-text-muted text-center mt-4 opacity-70">
                                            You’ll get: SMS accept link + PDF email (10 sec).
                                        </p>
                                    </div>
                                </div>

                                {/* BLURRED BACKGROUND CONTENT */}
                                <div className="w-full blur-md opacity-50 select-none pointer-events-none">
                                     <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] p-6 md:p-8 rounded-2xl border-2 border-green text-navy mb-10 shadow-lg">
                                        <div className="w-12 h-12 bg-green text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">✓</div>
                                        <div className="text-center md:text-left">
                                            <h3 className="text-2xl font-extrabold mb-1">Quote Generated!</h3>
                                            <p className="text-text-muted">That took <strong>{finalTime} seconds</strong>. Your Word doc takes 15 minutes.</p>
                                        </div>
                                    </div>
                                    {/* Simplified Placeholder for Preview */}
                                    <div className="bg-white rounded-xl h-[400px] w-full max-w-[800px] mx-auto opacity-30"></div>
                                </div>
                            </div>
                        )}

                        {/* STAGE 2: SENT SCREEN */}
                        {stage === 2 && (
                            <div id="stage-2" className="flex items-center justify-center min-h-[400px] animate-fade-in py-6">
                                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center max-w-[510px] w-full mx-4 border border-border">
                                     <div className="w-8 h-8 bg-green/10 text-green rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">✓</div>
                                     <h2 className="text-2xl font-black text-navy mb-2">Sent. Check your phone.</h2>
                                     <p className="text-text-muted text-sm mb-4 leading-relaxed">
                                        We've texted the real client <strong>'Accept Quote'</strong> link and emailed the PDF to <strong>{formEmail || 'you'}</strong>.
                                     </p>

                                     {/* QR Code */}
                                     <div className="hidden md:inline-block bg-white border-2 border-dashed border-border rounded-xl p-2 mb-3 relative group cursor-default shadow-sm">
                                        <div className="w-[75px] h-[75px] bg-navy relative overflow-hidden flex items-center justify-center">
                                             <svg viewBox="0 0 100 100" fill="white" className="w-full h-full p-2 opacity-90">
                                                <path d="M10,10 h30 v30 h-30 z M50,10 h30 v30 h-30 z M10,50 h30 v30 h-30 z M50,50 h10 v10 h-10 z M70,50 h10 v10 h-10 z M50,70 h10 v10 h-10 z M70,70 h10 v10 h-10 z" />
                                                <rect x="20" y="20" width="10" height="10" fill="black"/>
                                                <rect x="60" y="20" width="10" height="10" fill="black"/>
                                                <rect x="20" y="60" width="10" height="10" fill="black"/>
                                             </svg>
                                        </div>
                                        <div className="mt-2 text-[6px] font-bold text-text-muted uppercase tracking-wide leading-tight">
                                            Scan with phone<br/>to open
                                        </div>
                                     </div>

                                     <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={launchAcceptFlow} 
                                            className="w-full bg-navy text-white py-3 rounded-xl font-bold text-base hover:bg-navy-light shadow-btn-navy transition-all active:translate-y-0.5"
                                        >
                                            Open the client link now →
                                        </button>
                                        
                                        <div className="flex justify-center gap-3 text-[10px] font-semibold text-text-muted mt-1">
                                            <button 
                                                onClick={handleResend}
                                                className={`hover:text-orange underline ${resendStatus === 'Sent!' ? 'text-green' : ''}`}
                                                disabled={resendStatus === 'Sent!'}
                                            >
                                                {resendStatus || "Didn't get SMS? Resend"}
                                            </button>
                                            <span>•</span>
                                            <button onClick={launchAcceptFlow} className="hover:text-navy underline">
                                                Open from email PDF
                                            </button>
                                        </div>

                                        <p className="text-[10px] text-text-muted mt-3 border-t border-border pt-3 opacity-80">
                                            No phone handy? Preview the client page here.
                                        </p>
                                     </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};
