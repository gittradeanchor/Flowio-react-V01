import React, { useEffect, useMemo, useState } from "react";

// Every answer on this form maps to a TradeAnchor licence profile field or a PriceBook line:
//   workspace_admin_email -> Email, SupportEmail (and alert email unless alert_email is given)
//   business_name -> CompanyName          abn -> ABN (required, 11 digits)
//   business_address -> CompanyAddress    company_phone -> CompanyPhone (blank: primary mobile)
//   primary_mobile -> TradieAlertMobile   alert_email -> TradieAlertEmail
//   gst_mode -> GSTPercent, prices before or after GST, "GST separated" on quotes
//   working_days -> WorkingDays           business_hours (start-end) -> WorkingHours
//   logo_link -> CompanyLogoUrl           pricebook_text / pricebook_sheet_link -> PriceBook lines
//   booking_notes -> BlockedBookingDates (set by hand after the phone check)
type FormState = {
  workspace_admin_email: string;
  business_name: string;
  abn: string;
  primary_mobile: string;
  trade: string;

  gst_mode: string; // "exclude" | "include" | "not_registered"
  gst_registered: string; // derived: "yes" | "no"
  prices_include_gst: string; // derived: "yes" | "no"

  confirm_access: boolean;
  consent: boolean;
  consent_text: string;

  pricebook_sheet_link: string;
  pricebook_text: string;

  business_address: string;
  company_phone: string;
  alert_email: string;
  working_days: string; // "Mon,Tue,Wed,Thu,Fri"
  working_start: string;
  working_end: string;
  business_hours: string; // derived "07:00-17:00"
  logo_link: string;
  booking_notes: string;

  token: string; // onboardingToken from ?t=
  pid: string;   // personId from ?pid=
};

const BRAND = "#4A7C59";
const BG = "#FDFBF7";
const DRAFT_KEY = "tradeanchor_preinstall_draft_v3";
const CONSENT_TEXT = "I consent to TradeAnchor sending SMS and email to my customers on my behalf for quotes and booking confirmations, and sending job alerts to me by SMS and email.";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = Array.from({ length: 31 }, (_, i) => {
  const minutes = 5 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});

const initialState: FormState = {
  workspace_admin_email: "",
  business_name: "",
  abn: "",
  primary_mobile: "",
  trade: "",

  gst_mode: "",
  gst_registered: "",
  prices_include_gst: "",

  confirm_access: false,
  consent: false,
  consent_text: CONSENT_TEXT,

  pricebook_sheet_link: "",
  pricebook_text: "",

  business_address: "",
  company_phone: "",
  alert_email: "",
  working_days: "Mon,Tue,Wed,Thu,Fri",
  working_start: "07:00",
  working_end: "17:00",
  business_hours: "07:00-17:00",
  logo_link: "",
  booking_notes: "",

  token: "",
  pid: "",
};

function looksLikeEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
}

function abnDigits(s: string) {
  return (s || "").replace(/\D+/g, "");
}

function looksLikeAuMobile(s: string) {
  const digits = (s || "").replace(/[^0-9+]/g, "").replace(/^[+]?61/, "0");
  return /^04\d{8}$/.test(digits);
}

function derivedGst(mode: string) {
  if (mode === "include") return { gst_registered: "yes", prices_include_gst: "yes" };
  if (mode === "not_registered") return { gst_registered: "no", prices_include_gst: "no" };
  if (mode === "exclude") return { gst_registered: "yes", prices_include_gst: "no" };
  return { gst_registered: "", prices_include_gst: "" };
}

export default function Preinstall() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitError, setSubmitError] = useState<string>("");
  const [pricebookError, setPricebookError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Pull token/personId from URL
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t = qs.get("t") || "";
    const pid = qs.get("pid") || "";
    setForm((prev) => ({ ...prev, token: t, pid }));
  }, []);

  // Load draft once
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      setForm((prev) => ({
        ...prev,
        ...obj,
        // preserve token/pid from URL (URL wins)
        token: prev.token || obj.token || "",
        pid: prev.pid || obj.pid || "",
        consent_text: CONSENT_TEXT,
      }));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave draft on any change
  useEffect(() => {
    if (isSubmitted) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form, isSubmitted]);

  const essentialTotal = 9;
  const essentialFilled = useMemo(() => {
    let filled = 0;
    if (form.workspace_admin_email.trim()) filled++;
    if (form.business_name.trim()) filled++;
    if (abnDigits(form.abn).length === 11) filled++;
    if (form.primary_mobile.trim()) filled++;
    if (form.trade.trim()) filled++;
    if (form.gst_mode) filled++;
    if (form.confirm_access) filled++;
    if (form.consent) filled++;
    if (form.pricebook_text.trim() || form.pricebook_sheet_link.trim()) filled++;
    return filled;
  }, [form]);

  const essentialsPct = Math.round((essentialFilled / essentialTotal) * 100);

  const pricebookProvided = useMemo(() => {
    const hasText = !!form.pricebook_text.trim();
    const hasLink = !!form.pricebook_sheet_link.trim();
    return hasText || hasLink;
  }, [form]);

  const priceLabel = form.gst_mode === "include" ? "Price including GST" : form.gst_mode === "not_registered" ? "Price" : "Price before GST";

  function updateText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setSubmitError("");
    setPricebookError(false);
    setForm((prev) => {
      const next = { ...prev, [name]: value } as FormState;
      if (name === "gst_mode") Object.assign(next, derivedGst(value));
      if (name === "working_start" || name === "working_end") next.business_hours = `${next.working_start}-${next.working_end}`;
      return next;
    });
  }

  function updateCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setSubmitError("");
    setPricebookError(false);
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  function toggleDay(day: string) {
    setSubmitError("");
    setForm((prev) => {
      const current = prev.working_days.split(",").filter(Boolean);
      const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
      return { ...prev, working_days: DAYS.filter((d) => next.includes(d)).join(",") };
    });
  }

  function clearAll() {
    if (!confirm("Clear this form and remove saved draft?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setSubmitError("");
    setPricebookError(false);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setForm((prev) => ({
      ...initialState,
      token: prev.token,
      pid: prev.pid,
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // HARD REQUIREMENT: token must exist (unique per customer)
    if (!form.token.trim()) {
      setSubmitError('Missing token. Please use the setup link we sent you (it contains "?t=").');
      return;
    }

    // Essentials validation
    const missing: string[] = [];
    if (!form.workspace_admin_email.trim() || !looksLikeEmail(form.workspace_admin_email)) missing.push("Google account email");
    if (!form.business_name.trim()) missing.push("Business name");
    if (abnDigits(form.abn).length !== 11) missing.push("ABN (11 digits)");
    if (!looksLikeAuMobile(form.primary_mobile)) missing.push("Mobile (Australian, 04xx xxx xxx)");
    if (!form.trade.trim()) missing.push("Trade");
    if (!form.gst_mode) missing.push("GST");
    if (!form.confirm_access) missing.push("Access tick");
    if (!form.consent) missing.push("Consent tick");

    if (missing.length) {
      setSubmitError(`Please complete: ${missing.join(", ")}.`);
      setPricebookError(false);
      return;
    }

    if (!pricebookProvided) {
      setPricebookError(true);
      setSubmitError("");
      return;
    }

    const optionalProblems: string[] = [];
    if (form.alert_email.trim() && !looksLikeEmail(form.alert_email)) optionalProblems.push("alert email");
    if (form.company_phone.trim() && (form.company_phone.replace(/\D+/g, "").length < 8)) optionalProblems.push("business phone");
    if (!form.working_days.trim()) optionalProblems.push("working days (tick at least one)");
    if (form.working_start >= form.working_end) optionalProblems.push("working hours (start must be before finish)");
    if (optionalProblems.length) {
      setSubmitError(`Please check: ${optionalProblems.join(", ")}.`);
      return;
    }

    // POST to GAS
    const endpoint = (import.meta as any).env?.VITE_GSCRIPT_URL || "";
    if (!endpoint) {
      setSubmitError("This form is not connected yet. Please tell us and we will fix it.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setPricebookError(false);

    try {
      const submitted = { ...form, ...derivedGst(form.gst_mode), business_hours: `${form.working_start}-${form.working_end}`, consent_text: CONSENT_TEXT, consent_version: "2026-10-29" };
      const payload = {
        event: "preinstall_submitted",
        timestamp: new Date().toISOString(),
        token: form.token,
        pid: form.pid,
        essentialsPct,
        form: submitted, // store full payload
      };

      // Use x-www-form-urlencoded to avoid CORS preflight/OPTIONS headaches
      const body = new URLSearchParams();
      body.set("event", "preinstall_submitted");
      body.set("token", form.token);
      if (form.pid) body.set("pid", form.pid);
      body.set("payload", JSON.stringify(payload));

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: body.toString(),
      });

      const raw = await res.text();

      let ok = false;
      try {
        ok = !!JSON.parse(raw)?.ok;
      } catch {
        // if it's not JSON, ok stays false
      }

      if (!ok) {
        throw new Error("The server did not accept it.");
      }

      // Success
      localStorage.removeItem(DRAFT_KEY);
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(`Submit failed. ${err?.message || "Unknown error"} Please try again, or reply to our message.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Thank-you screen (after successful POST)
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: BG, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
        <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 shadow-[0_12px_40px_rgba(17,24,39,0.10)] p-8 text-center">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black" style={{ background: BRAND }}>
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">All good, received.</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your setup details are with TradeAnchor. We will use them to prepare your install inside your Google Workspace.
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
            <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">What happens next</div>
            <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>We check your details and price list</li>
              <li>We call you for a quick check (about 10 minutes)</li>
              <li>We confirm your install time</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => window.close()}
            className="mt-6 px-5 py-2 rounded-lg text-white font-extrabold text-sm"
            style={{ background: BRAND }}
          >
            Done
          </button>

          <p className="mt-3 text-xs text-gray-500">
            If this tab doesn’t close, you can just leave it.
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none";
  const labelClass = "text-xs font-extrabold text-gray-600 uppercase tracking-wider";

  return (
    <div className="min-h-screen" style={{ background: BG, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">TradeAnchor Setup Form</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Fill this once. We install TradeAnchor in your Google Workspace so you can start quoting the same day.
            </p>
          </div>

          <div className="min-w-[160px] text-right">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Required</div>
            <div className="flex items-center justify-end gap-3 mt-1">
              <div className="text-lg font-extrabold" style={{ color: BRAND }}>
                {essentialsPct}%
              </div>
              <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-300" style={{ width: `${essentialsPct}%`, background: BRAND }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Top instructions */}
        <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">What this does (10 seconds)</h2>
              <p className="text-sm text-gray-600 mt-1">
                You give us the basics. We install TradeAnchor inside YOUR Google Workspace so you can send a quote → customer accepts → job gets booked.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {!form.token && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Missing token in URL. Use the setup link we sent you (it includes <b>?t=</b>).
            </div>
          )}
        </section>

        {/* Form */}
        <form className="space-y-6" noValidate onSubmit={onSubmit}>
          {/* ESSENTIALS */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)] border-l-4" style={{ borderLeftColor: BRAND }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Your business (required)</h3>
                <p className="text-sm text-gray-600">These go straight onto your quotes and set up your account.</p>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 2 minutes</span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="text-red-500">*</span> Google account email (the account that will own your TradeAnchor Sheet)
                </label>
                <input
                  name="workspace_admin_email"
                  type="email"
                  autoComplete="email"
                  value={form.workspace_admin_email}
                  onChange={updateText}
                  className={inputClass}
                  placeholder="you@yourbusiness.com.au or you@gmail.com"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="text-red-500">*</span> Business name
                </label>
                <input name="business_name" type="text" value={form.business_name} onChange={updateText} className={inputClass} placeholder="Your Business Pty Ltd" />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="text-red-500">*</span> ABN
                </label>
                <input name="abn" type="text" inputMode="numeric" value={form.abn} onChange={updateText} className={inputClass} placeholder="11 digits, e.g. 12 345 678 901" />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="text-red-500">*</span> Your mobile (we text you job alerts)
                </label>
                <input name="primary_mobile" type="tel" inputMode="tel" value={form.primary_mobile} onChange={updateText} className={inputClass} placeholder="04xx xxx xxx" />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="text-red-500">*</span> Trade
                </label>
                <select name="trade" value={form.trade} onChange={updateText} className={inputClass}>
                  <option value="">Select…</option>
                  <option>Electrician</option>
                  <option>HVAC</option>
                  <option>Plumber</option>
                  <option>Handyman</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="text-red-500">*</span> GST
                </label>
                <select name="gst_mode" value={form.gst_mode} onChange={updateText} className={inputClass}>
                  <option value="">Select…</option>
                  <option value="exclude">I am registered for GST and my prices EXCLUDE GST (GST is added on the quote)</option>
                  <option value="include">I am registered for GST and my prices INCLUDE GST</option>
                  <option value="not_registered">I am not registered for GST</option>
                </select>
              </div>

              <div className="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input name="confirm_access" type="checkbox" checked={form.confirm_access} onChange={updateCheckbox} className="mt-1 h-5 w-5" style={{ accentColor: BRAND }} />
                  <div>
                    <div className="font-extrabold text-gray-900 text-sm">
                      <span className="text-red-500">*</span> I can sign in to Google Sheets, Drive and Calendar with the account above.
                    </div>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="text-red-500">*</span> Consent
                </label>
                <div className="mt-1 rounded-lg text-white p-4" style={{ background: BRAND }}>
                  <p className="text-sm italic opacity-95">“{CONSENT_TEXT}”</p>
                  <label className="mt-3 flex items-center gap-3 cursor-pointer rounded-lg p-3 hover:opacity-95" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <input name="consent" type="checkbox" checked={form.consent} onChange={updateCheckbox} className="h-5 w-5" style={{ accentColor: "white" }} />
                    <span className="font-extrabold text-sm">Yes, I consent</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* PRICE LIST */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)] border-l-4 border-gray-600">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Price list (required)</h3>
                <p className="text-sm text-gray-600">Paste your items, or share a link. Pasting is fastest.</p>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 3 minutes</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="font-extrabold text-gray-900 text-sm">Option A: paste items</div>
                <p className="text-xs text-gray-600 mt-1">
                  One per line. Format: <span className="font-mono">Code, Name, {priceLabel}</span>
                </p>

                <textarea
                  name="pricebook_text"
                  rows={6}
                  value={form.pricebook_text}
                  onChange={updateText}
                  className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                  placeholder={`ELEC-001, Call-out, 120\nELEC-002, Power point supply and install, 165\nGEN-002, Labour (per hour), 110`}
                />
              </div>

              <div className="text-center text-xs font-extrabold text-gray-400">OR</div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="font-extrabold text-gray-900 text-sm">Option B: share a link</div>
                <p className="text-xs text-gray-600 mt-1">Google Sheet, Drive or Dropbox link. Make sure anyone with the link can view it.</p>
                <label className="mt-3 block">
                  <span className={labelClass}>Price list link</span>
                  <input name="pricebook_sheet_link" type="url" value={form.pricebook_sheet_link} onChange={updateText} className={inputClass} placeholder="https://docs.google.com/spreadsheets/d/..." />
                </label>
              </div>

              {pricebookError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  Please add your price list: paste items or share a link.
                </div>
              )}
            </div>
          </section>

          {/* OPTIONAL */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)]">
            <details>
              <summary className="cursor-pointer select-none">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Optional (helps us install faster)</h3>
                    <p className="text-sm text-gray-600">Skip anything you like. We confirm the rest on the phone.</p>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color: BRAND }}>
                    Expand
                  </span>
                </div>
              </summary>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Business address (shown on quotes)</label>
                  <input name="business_address" type="text" value={form.business_address} onChange={updateText} className={inputClass} placeholder="12 Example St, Suburb NSW 2000" />
                </div>

                <div>
                  <label className={labelClass}>Business phone on quotes</label>
                  <input name="company_phone" type="tel" inputMode="tel" value={form.company_phone} onChange={updateText} className={inputClass} placeholder="Leave blank to use your mobile" />
                </div>

                <div>
                  <label className={labelClass}>Email for job alerts</label>
                  <input name="alert_email" type="email" value={form.alert_email} onChange={updateText} className={inputClass} placeholder="Leave blank to use your Google account email" />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Days customers can book you</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const on = form.working_days.split(",").includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          aria-pressed={on}
                          className="min-w-[56px] px-3 py-2 rounded-lg border text-sm font-extrabold"
                          style={on ? { background: BRAND, color: "white", borderColor: BRAND } : { background: "white", color: "#374151", borderColor: "#d1d5db" }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Customers can book from</label>
                  <select name="working_start" value={form.working_start} onChange={updateText} className={inputClass}>
                    {TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Until</label>
                  <select name="working_end" value={form.working_end} onChange={updateText} className={inputClass}>
                    {TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Logo link (public image)</label>
                  <input name="logo_link" type="url" value={form.logo_link} onChange={updateText} className={inputClass} placeholder="https://yourwebsite.com.au/logo.png" />
                  <p className="mt-1 text-xs text-gray-500">A link to a PNG or JPG that opens without signing in. A Google Drive link will not work. No logo? Leave it blank and we will sort it on the call.</p>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Days off or times to avoid</label>
                  <input name="booking_notes" type="text" value={form.booking_notes} onChange={updateText} className={inputClass} placeholder="e.g. away 14 to 18 Nov, no Friday afternoons" />
                </div>
              </div>
            </details>
          </section>

          {/* SUBMIT */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Submit</h3>
                <p className="text-sm text-gray-600">This sends your info straight to TradeAnchor.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-white font-extrabold text-sm disabled:opacity-60"
                style={{ background: BRAND }}
              >
                {isSubmitting ? "Sending…" : "Send to TradeAnchor"}
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              We use these details only to set up your TradeAnchor account and send you job alerts. See our <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">privacy policy</a>.
            </p>

            {submitError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {submitError}
              </div>
            )}
          </section>
        </form>

        <footer className="py-6 text-center text-xs text-gray-500">
          TradeAnchor installs are limited to 3 per week. We’ll confirm your slot after the phone check.
        </footer>
      </main>

      <style>{`
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${BRAND}; box-shadow: 0 0 0 3px rgba(74,124,89,0.20); background:#fff; }
      `}</style>
    </div>
  );
}
