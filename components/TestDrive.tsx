import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { JOB_DATA as FALLBACK_JOB_DATA } from '../constants';
import { JobItem, QuoteTotals } from '../types';
import { AcceptFlow } from './AcceptFlow';
import { getStoredAttribution, getOrCreateLeadId } from '../hooks/useAttribution';

// ---------------------------------------------------------------------------
// QuoteSheet: the same real quote document at every width (scaled to fit via ScaledDocument below),
// laid out like the Claude Design quote document. Business fields are placeholders.
// Kept to structures a Google Doc can reproduce (tables, rules, one accent colour).
// ---------------------------------------------------------------------------
const Q_INK = '#171A1D';
const Q_SLATE = '#57534E';
const Q_INFO = '#1C1917';
const Q_RULE = '#E4DCCF';
const qHead: React.CSSProperties = { fontFamily: "'Archivo', 'Source Sans 3', sans-serif" };
const qBody: React.CSSProperties = { fontFamily: "'Source Sans 3', system-ui, sans-serif", color: Q_INK };
const qLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: Q_INFO };
const qMoney = (n: number) => n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Australian mobile only (matches the Cloudflare Worker's server-side check, cloudflare-worker/testdrive-proxy.js).
// Was: any non-empty string passed, so a digit dropped from a real mobile still sent the demo SMS to
// whatever number that left — a stranger's phone, at TradeAnchor's cost and under TradeAnchor's name.
const isValidAuMobile = (raw: string) => /^(\+?61|0)4\d{8}$/.test(raw.replace(/[\s()-]/g, ''));

// Fixed design width the document below is laid out at. A phone doesn't get a smaller, simplified layout —
// it gets the same document, shrunk to fit, the way a PDF viewer or Google Docs mobile shows a real page.
// (Was: a separate condensed "mobile" version with no meta block, header rule or signature line — flagged
// 22 Sept as looking like an app screen, not a realistic quote.)
const QUOTE_DOC_WIDTH = 340;

const ScaledDocument = ({ children }: { children: React.ReactNode }) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [naturalHeight, setNaturalHeight] = useState(0);

    useLayoutEffect(() => {
        const measure = () => {
            if (!outerRef.current || !innerRef.current) return;
            setScale(outerRef.current.offsetWidth / QUOTE_DOC_WIDTH);
            setNaturalHeight(innerRef.current.offsetHeight);
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (outerRef.current) ro.observe(outerRef.current);
        if (innerRef.current) ro.observe(innerRef.current);
        return () => ro.disconnect();
    }, [children]);

    return (
        <div ref={outerRef} style={{ width: '100%', height: naturalHeight ? naturalHeight * scale : undefined, overflow: 'hidden' }}>
            <div ref={innerRef} style={{ width: QUOTE_DOC_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                {children}
            </div>
        </div>
    );
};

const QuoteSheet = ({ items, totals, customerName }: { items: JobItem[]; totals: QuoteTotals; customerName: string }) => {
    const today = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    const forName = customerName || 'Your customer';
    return (
        <ScaledDocument>
            <div className="flex flex-col bg-white border border-[#D8CFC0] shadow-2xl" style={{ ...qBody, padding: '36px 32px' }}>
                <div className="flex justify-between items-end gap-6 pb-3" style={{ borderBottom: `4px solid ${Q_INFO}` }}>
                    <div>
                        <div style={{ ...qHead, fontSize: 22, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.01em' }}>Your Business Name</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: Q_SLATE, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>ABN 00 000 000 000 &nbsp;·&nbsp; Licence 000000C &nbsp;·&nbsp; 04xx xxx xxx</div>
                    </div>
                    <div style={{ ...qHead, fontSize: 18, fontWeight: 700, color: Q_INFO, whiteSpace: 'nowrap' }}>Quotation</div>
                </div>

                <div className="grid grid-cols-3 gap-5" style={{ padding: '16px 0 20px' }}>
                    <div>
                        <div style={qLabel}>Prepared for</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>{forName}<br />Site address<br />Suburb NSW 2000</div>
                    </div>
                    <div>
                        <div style={qLabel}>Site</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>As above<br />Access, business hours</div>
                    </div>
                    <div>
                        <div style={qLabel}>Reference</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 5, fontVariantNumeric: 'tabular-nums' }}>Q-0004 (demo)<br />{today}<br />Valid 30 days</div>
                    </div>
                </div>

                <div className="grid text-white" style={{ gridTemplateColumns: '1fr 40px 76px 84px', background: Q_INFO, padding: '7px 0' }}>
                    <div style={{ ...qLabel, color: '#fff', paddingLeft: 10 }}>Description</div>
                    <div style={{ ...qLabel, color: '#fff', textAlign: 'right' }}>Qty</div>
                    <div style={{ ...qLabel, color: '#fff', textAlign: 'right' }}>Rate</div>
                    <div style={{ ...qLabel, color: '#fff', textAlign: 'right', paddingRight: 10 }}>Amount</div>
                </div>
                {items.map((item, idx) => (
                    <div key={idx} className="grid" style={{ gridTemplateColumns: '1fr 40px 76px 84px', padding: '11px 0', borderBottom: `1px solid ${Q_RULE}`, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                        <div style={{ paddingLeft: 10, paddingRight: 8 }}>{item.name}</div>
                        <div style={{ textAlign: 'right' }}>{item.qty}</div>
                        <div style={{ textAlign: 'right' }}>{qMoney(Number(item.rate))}</div>
                        <div style={{ textAlign: 'right', fontWeight: 700, paddingRight: 10 }}>{qMoney(item.qty * item.rate)}</div>
                    </div>
                ))}

                <div className="flex justify-end" style={{ marginTop: 16 }}>
                    <div style={{ width: 250, fontVariantNumeric: 'tabular-nums' }}>
                        <div className="flex justify-between" style={{ fontSize: 13, padding: '6px 10px' }}><span style={{ color: Q_SLATE }}>Subtotal</span><span>{qMoney(totals.subtotal)}</span></div>
                        <div className="flex justify-between" style={{ fontSize: 13, padding: '6px 10px', borderBottom: `1px solid ${Q_INFO}` }}><span style={{ color: Q_SLATE }}>GST</span><span>{qMoney(totals.gst)}</span></div>
                        <div className="flex justify-between items-baseline" style={{ padding: '12px 10px 0' }}><span style={{ ...qHead, fontSize: 16, fontWeight: 700 }}>Total incl GST</span><span style={{ fontSize: 21, fontWeight: 700 }}>{qMoney(totals.total)}</span></div>
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 160px', gap: 28, paddingTop: 18, marginTop: 28, borderTop: `4px solid ${Q_INFO}` }}>
                    <div>
                        <div style={qLabel}>Terms</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5, marginTop: 5 }}>Quote valid 30 days from the date above. Your payment terms and conditions print here, as you write them.</div>
                    </div>
                    <div>
                        <div style={qLabel}>Accept</div>
                        <div style={{ height: 34, borderBottom: `1px solid ${Q_INK}`, marginTop: 12 }} />
                        <div style={{ fontSize: 11, color: Q_SLATE, marginTop: 5 }}>Signature and date</div>
                    </div>
                </div>
            </div>
        </ScaledDocument>
    );
};

export const TestDrive = () => {
    // Stage Management
    // 1: Builder
    // 2: Sent Screen (success message)
    // "gate": finished quote shown first, then the contact form to deliver it
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
    // Pricebook Loading States (prevents "mixed items" bug)
    const [isPricebookLoading, setIsPricebookLoading] = useState(true);
    const [pricebookError, setPricebookError] = useState(false);
    
    const fetchPricebook = async () => {
      setIsPricebookLoading(true);
      setPricebookError(false);
    
      const url = import.meta.env.VITE_GSCRIPT_PRICEBOOK_URL || '';
      if (!url) {
        setPricebookError(true);
        setIsPricebookLoading(false);
        return;
      }
    
      try {
        const response = await fetch(url);
        const data = await response.json();
    
        if (data?.ok && Array.isArray(data.items) && data.items.length) {
          setPricebook(data.items);
        } else {
          throw new Error('Invalid pricebook response');
        }
      } catch (err) {
        console.warn('Pricebook fetch failed, using fallback items.');
        setPricebookError(true);
        // keep fallback pricebook
      } finally {
        setIsPricebookLoading(false);
      }
    };

    useEffect(() => {
      fetchPricebook();
    }, []);

    // Builder State
    const [items, setItems] = useState<JobItem[]>([]);
    
    const [generating, setGenerating] = useState(false);

    // SMS/Lead Form State
    const [leadName, setLeadName] = useState('');
    const [leadTrade, setLeadTrade] = useState('');
    const [formMobile, setFormMobile] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [smsSending, setSmsSending] = useState(false);
    const [consent, setConsent] = useState(false);
    const [submitError, setSubmitError] = useState('');

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
        // If there was an error, user can tap dropdown to retry
        if (pricebookError && !e.target.value) {
          fetchPricebook();
          return;
        }
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

        setTimeout(() => {
            setGenerating(false);

            // Show the finished quote first; contact details are asked only to deliver it (audit B2.2 / B2.3)
            setStage('gate');
        }, 1200);
    };

    const handleGateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formMobile.trim()) {
            setSubmitError('Add your mobile to get the demo, or just keep your quote above.');
            return;
        }
        if (!isValidAuMobile(formMobile)) {
            setSubmitError("That doesn't look like a full Australian mobile number (04xx xxx xxx). Check the digits and try again.");
            return;
        }
        if (!consent) {
            setSubmitError('Please tick the box so we can send your demo.');
            return;
        }
        setSubmitError('');
        setSmsSending(true);

        const attrib = getStoredAttribution();
        
        const personId = getOrCreateLeadId(); // stable
        const requestId = crypto.randomUUID(); // per submit
        
        // Define acceptUrl BEFORE usage to prevent ReferenceError in automation
        // This link is used by the SMS service to guide the user back to the demo
        const acceptUrl = typeof window !== 'undefined' 
            ? `${window.location.origin}/?demo=accept&id=${requestId}`
            : `${import.meta.env.VITE_SITE_URL}/?demo=accept&id=${requestId}`;
        
        // Updated Payload Structure to match User requirements
        const formData = {
            action: "demoLead",
            timestamp: new Date().toISOString(),
            personId,
            requestId,
            leadId: requestId,
            acceptUrl: acceptUrl,
            source: "website", // hardcode in TestDrive for now
            source_detail: "testdrive", // or "landing:testdrive"
            referrer: document.referrer || "",
            landing_url: window.location.href,
            user_agent: navigator.userAgent,

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

        // Webhook URL (Cloudflare/Vite env baked at build time)
        // Never log the webhook URL or payload (audit A4.4 / checklist 0.8).
        // Prefer the Cloudflare Worker proxy (keeps the Make URL and secret off the page); fall back to the direct hook.
        const webhookUrl = import.meta.env.VITE_TESTDRIVE_ENDPOINT || import.meta.env.VITE_MAKE_WEBHOOK_URL || '';
        const failMsg = "That didn't go through. Please try again, or message me on WhatsApp.";

        if (!webhookUrl) {
          setSubmitError(failMsg);
          setSmsSending(false);
          return;
        }

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          // A failed submit must show a failure, never the success screen (audit B2.8).
          if (!response.ok) {
            setSubmitError(failMsg);
            return;
          }
          setStage(2);
        } catch {
          setSubmitError(failMsg);
        } finally {
          setSmsSending(false);
        }
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
                                        <h2 className="text-[24px] md:text-[42px] font-black leading-[1.2] mb-4">See your customer's quote in about a minute.</h2>
                                        <p className="text-base opacity-90 mb-5 leading-relaxed">Pick 1–4 items, then we'll text you a real client 'Accept' link and email the PDF. It's a real demo, sent to your phone.</p>
                                    </div>
                                </div>

                                {/* Mock Sheet Card */}
                                <div className="w-full">
                                    {/* Progress Strip */}
                                    <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider text-white/50">
                                        <span className="text-orange flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center text-xs">1</span>
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
                                                <span className="bg-orange/10 text-orange px-2 py-0.5 rounded text-xs font-bold uppercase">Draft</span>
                                            </div>
                                            
                                            {/* Demo Client Summary */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold text-text-muted uppercase">Client</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Demo</span>
                                                </div>
                                                <div className="font-bold text-navy text-sm">Sean Miller (Sydney)</div>
                                                <div className="text-xs text-text-muted tabular-nums mt-0.5">04••• ••• •• · s•••@gmail.com</div>
                                                <div className="text-xs text-slate-400 mt-2 italic">Real client details collected next.</div>
                                            </div>

                                            {/* SKU Selector */}
                                            <div className="mb-4">
                                                <label className="text-xs font-bold text-text-muted uppercase block mb-1.5">Add Items From Price List:</label>

                                                <div className="relative">
                                                  <select
                                                    onChange={handleAddItem}
                                                    disabled={isPricebookLoading}
                                                    className={`w-full p-3 border-2 border-border rounded-md text-base bg-white focus:border-orange outline-none cursor-pointer transition-opacity ${
                                                      isPricebookLoading ? 'opacity-60' : 'opacity-100'
                                                    }`}
                                                  >
                                                    {isPricebookLoading ? (
                                                      <option value="">Loading price list...</option>
                                                    ) : pricebookError ? (
                                                      <option value="">Error. Tap to retry.</option>
                                                    ) : (
                                                      <option value="">-- Tap to Select Item --</option>
                                                    )}
                                                
                                                    {!isPricebookLoading &&
                                                      pricebook.map((item) => (
                                                        <option key={item.sku} value={item.sku}>
                                                          {item.name} (${item.rate} ex GST)
                                                        </option>
                                                      ))}
                                                  </select>
                                                
                                                  {isPricebookLoading && (
                                                    <div className="flex items-center gap-2 mt-2 px-1 text-xs text-orange font-bold">
                                                      <svg className="animate-spin h-3 w-3 text-orange" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                      </svg>
                                                      Loading price list...
                                                    </div>
                                                  )}
                                                </div>

                                                
                                                <p className="text-xs text-text-muted mt-1.5 ml-1">
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
                                                                    <td className="flex justify-end">
                                                                        <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="min-h-[44px] px-2 text-xs font-semibold text-red-600 underline">Remove</button>
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
                                                    <span className="tabular-nums text-xl font-extrabold text-navy">${totals.total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleGenerate}
                                                disabled={items.length === 0 || generating || isPricebookLoading}
                                                className="w-full mt-5 bg-[#047857] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#065F46] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg active:translate-y-0.5"
                                            >
                                                {generating ? '⚡ Generating...' : 'Generate My Quote →'}
                                            </button>
                                            
                                            <p className="text-center text-xs font-semibold text-text-muted mt-3">
                                                Add items, tap Generate — see the full quote-to-booking flow.
                                            </p>
                                            <p className="text-center text-xs text-orange font-medium mt-1.5 opacity-80">
                                                Next: We'll text this quote to your phone with a live accept link →
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STAGE: GATE. The quote appears as soon as they generate. Sending to themselves is optional:
                            a mobile number and the consent tick are required to send; email is optional. Nothing is sent otherwise. */}
                        {stage === 'gate' && (
                            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-6 md:gap-10 items-start max-w-[1040px] mx-auto">

                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Your quote, as your customer sees it</div>
                                    <QuoteSheet items={items} totals={totals} customerName={leadName} />
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                        <button type="button" onClick={() => { setStage(1); }} className="min-h-[44px] text-sm font-semibold text-white/80 underline">Change items</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-md shadow-2xl p-5 md:p-6 text-navy border border-border animate-fade-in-up">
                                    <h3 className="text-xl font-black leading-tight mb-1">Send this quote to yourself to experience what your client will see</h3>
                                    <p className="text-text-muted text-sm leading-relaxed mb-4">
                                        You get a text with an accept link, and the PDF by email if you add one. Or skip it. Your quote is yours to look at either way.
                                    </p>

                                    <form onSubmit={handleGateSubmit} className="flex flex-col gap-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="font-semibold text-xs block mb-1 text-navy">Name</label>
                                                <input
                                                    type="text" placeholder="John"
                                                    className="w-full bg-bg-off border border-border p-3 rounded-lg text-base focus:border-orange outline-none"
                                                    value={leadName} onChange={(e) => setLeadName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="font-semibold text-xs block mb-1 text-navy">Trade</label>
                                                <select
                                                    className="w-full bg-bg-off border border-border p-3 rounded-lg text-base focus:border-orange outline-none"
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
                                            <label className="font-semibold text-xs block mb-1 text-navy">Mobile <span className="font-normal text-text-muted">(required to send)</span></label>
                                            <input
                                                type="tel" placeholder="04xx xxx xxx"
                                                className="w-full bg-bg-off border border-border p-3 rounded-lg text-base focus:border-orange outline-none"
                                                value={formMobile} onChange={(e) => setFormMobile(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-semibold text-xs block mb-1 text-navy">Email <span className="font-normal text-text-muted">(optional, for the PDF)</span></label>
                                            <input
                                                type="email" placeholder="you@example.com.au"
                                                className="w-full bg-bg-off border border-border p-3 rounded-lg text-base focus:border-orange outline-none"
                                                value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                                            />
                                        </div>

                                        {/* Consent (audit A4.1). Privacy link points at the new /privacy page. */}
                                        <label className="flex items-start gap-3 text-xs text-text-muted leading-snug cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 mt-0.5 shrink-0"
                                                checked={consent}
                                                onChange={(e) => setConsent(e.target.checked)}
                                            />
                                            <span>I agree to TradeAnchor sending me this demo by SMS (and email if I add one), and contacting me about Flowio. I can opt out at any time. My details are kept for 12 months after our last contact. <a href="/privacy" target="_blank" rel="noreferrer" className="underline">Privacy notice</a>.</span>
                                        </label>

                                        {submitError && (
                                            <p className="text-red-600 text-sm font-medium" role="alert">
                                                {submitError}
                                                {' '}
                                                {import.meta.env.VITE_WHATSAPP_LINK && (
                                                    <a href={import.meta.env.VITE_WHATSAPP_LINK} className="underline">WhatsApp me</a>
                                                )}
                                            </p>
                                        )}

                                        <button
                                            type="submit" disabled={smsSending}
                                            className="bg-orange text-white font-bold py-3.5 rounded-xl mt-1 hover:bg-orange-hover shadow-btn-primary transition-all flex justify-center items-center disabled:opacity-60"
                                        >
                                            {smsSending ? 'Sending...' : 'Send it to my phone →'}
                                        </button>
                                    </form>
                                    <p className="text-xs text-text-muted text-center mt-3">
                                        Nothing is sent unless you add your mobile and tick the box.
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-border text-center">
                                        <button type="button" onClick={launchAcceptFlow} className="min-h-[44px] text-sm font-semibold text-navy underline">Preview the customer's screen here</button>
                                    </div>
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
                                        We've texted the real client <strong>'Accept Quote'</strong> link to your mobile.{formEmail ? <> The PDF is on its way to <strong>{formEmail}</strong> and usually lands within about a minute.</> : null}
                                     </p>

                                     <div className="flex flex-col gap-3">
                                        <button
                                            onClick={launchAcceptFlow}
                                            className="w-full bg-navy text-white py-3 rounded-xl font-bold text-base hover:bg-navy-light shadow-btn-navy transition-all active:translate-y-0.5"
                                        >
                                            Preview the customer's screen here →
                                        </button>

                                        <p className="text-xs text-text-muted mt-1 border-t border-border pt-3">
                                            Nothing yet? Check your spam folder, or{' '}
                                            {import.meta.env.VITE_WHATSAPP_LINK ? (
                                                <a href={import.meta.env.VITE_WHATSAPP_LINK} className="underline hover:text-orange">message me on WhatsApp</a>
                                            ) : 'message me'}
                                            .
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
