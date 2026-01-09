import React, { useEffect, useMemo, useState } from "react";

type FormState = {
  workspace_admin_email: string;
  business_name: string;
  primary_mobile: string;
  call_answerer: string;
  trade: string;

  confirm_access: boolean;
  consent: boolean;

  // Pricebook (required) 
  pricebook_sheet_link: string; // share link to sheet/drive/dropbox/etc
  pricebook_text: string; // paste items

  // Optional business context
  abn: string;
  business_address: string;
  service_area: string;
  business_hours: string;

  // Optional links (replaces file uploads)
  quote_template_link: string;
  logo_link: string;

  // Deposit prefs (optional)
  deposit_enabled: boolean;
  deposit_amount: string;
  deposit_when: string;
  deposit_policy: string;

  // Calendar prefs (optional)
  calendar_name: string;
  booking_restrictions: string;

  // from URL
  token: string; // onboardingToken from ?t=
  pid: string;   // personId from ?pid=
};

const BRAND = "#4A7C59";
const BG = "#FDFBF7";
const DRAFT_KEY = "flowio_preinstall_draft_v2";

const initialState: FormState = {
  workspace_admin_email: "",
  business_name: "",
  primary_mobile: "",
  call_answerer: "",
  trade: "",

  confirm_access: false,
  consent: false,

  pricebook_sheet_link: "",
  pricebook_text: "",

  abn: "",
  business_address: "",
  service_area: "",
  business_hours: "",

  quote_template_link: "",
  logo_link: "",

  deposit_enabled: false,
  deposit_amount: "",
  deposit_when: "",
  deposit_policy: "",

  calendar_name: "",
  booking_restrictions: "",

  token: "",
  pid: "",
};

function looksLikeEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
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

  const essentialTotal = 7;
  const essentialFilled = useMemo(() => {
    let filled = 0;
    if (form.workspace_admin_email.trim()) filled++;
    if (form.business_name.trim()) filled++;
    if (form.primary_mobile.trim()) filled++;
    if (form.call_answerer.trim()) filled++;
    if (form.trade.trim()) filled++;
    if (form.confirm_access) filled++;
    if (form.consent) filled++;
    return filled;
  }, [form]);

  const essentialsPct = Math.round((essentialFilled / essentialTotal) * 100);

  const pricebookProvided = useMemo(() => {
    const hasText = !!form.pricebook_text.trim();
    const hasLink = !!form.pricebook_sheet_link.trim();
    return hasText || hasLink;
  }, [form]);

  function updateText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setSubmitError("");
    setPricebookError(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setSubmitError("");
    setPricebookError(false);
    setForm((prev) => ({ ...prev, [name]: checked }));
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
      setSubmitError('Missing token. Please use the preinstall link we emailed you (it contains "?t=").');
      return;
    }

    // Essentials validation
    const missing: string[] = [];
    if (!form.workspace_admin_email.trim() || !looksLikeEmail(form.workspace_admin_email)) missing.push("Google Workspace Admin Email");
    if (!form.business_name.trim()) missing.push("Business Name");
    if (!form.primary_mobile.trim()) missing.push("Primary Mobile");
    if (!form.call_answerer.trim()) missing.push("Who Answers Calls");
    if (!form.trade.trim()) missing.push("Trade");
    if (!form.confirm_access) missing.push("Confirm access checkbox");
    if (!form.consent) missing.push("Consent checkbox");

    if (!pricebookProvided) {
      setPricebookError(true);
      setSubmitError("");
      return;
    }

    if (missing.length) {
      setSubmitError("Missing required fields. Please complete the Essentials section (red star fields and checkboxes).");
      setPricebookError(false);
      return;
    }

    // POST to GAS
    const endpoint = (import.meta as any).env?.VITE_GSCRIPT_URL || "";
    if (!endpoint) {
      setSubmitError("Missing VITE_GSCRIPT_URL in your site environment variables.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setPricebookError(false);

    try {
      const payload = {
        event: "preinstall_submitted",
        timestamp: new Date().toISOString(),
        token: form.token,
        pid: form.pid,
        essentialsPct,
        form, // store full payload
      };

      // Use x-www-form-urlencoded to avoid CORS preflight/OPTIONS headaches
      const body = new URLSearchParams();
      body.set("event", "preinstall_submitted");
      body.set("token", form.token);
      if (form.pid) body.set("pid", form.pid);
      body.set("payload", JSON.stringify(payload));

      //const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: body.toString(),
      });

       const raw = await res.text();
      console.log("GAS raw response:", raw);
      
      let ok = false;
      try {
        ok = !!JSON.parse(raw)?.ok;
      } catch {
        // if it's not JSON, ok stays false
      }
      
      if (!ok) {
        throw new Error(`GAS response not ok: ${raw}`);
      }


      // Success
      localStorage.removeItem(DRAFT_KEY);
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(`Submit failed. ${err?.message || "Unknown error"}`);
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
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">All good — received.</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your pre-install info is sent to TradeAnchor. We’ll use it to prep your Flowio install inside your Google Workspace.
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
            <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">What happens next</div>
            <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>We review your pricebook + setup choices</li>
              <li>We build your install pack</li>
              <li>We confirm the install time</li>
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

  return (
    <div className="min-h-screen" style={{ background: BG, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">Flowio Pre-Install Checklist</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Fill this once. We install Flowio in your Google Workspace so you can start quoting the same day.
            </p>
          </div>

          <div className="min-w-[160px] text-right">
            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Essentials</div>
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
                You give us the basics. We install Flowio inside YOUR Google Workspace so you can send a quote → customer accepts → job gets booked.
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
              Missing token in URL. Use the link we emailed you (it includes <b>?t=</b>).
            </div>
          )}
        </section>

        {/* Form */}
        <form className="space-y-6" noValidate onSubmit={onSubmit}>
          {/* ESSENTIALS */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)] border-l-4" style={{ borderLeftColor: BRAND }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Essentials (required)</h3>
                <p className="text-sm text-gray-600">If you fill only this section, we can proceed.</p>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 2 minutes</span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  <span className="text-red-500">*</span> Google Workspace Admin Email
                </label>
                <input
                  name="workspace_admin_email"
                  type="email"
                  autoComplete="email"
                  value={form.workspace_admin_email}
                  onChange={updateText}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                  placeholder="admin@yourdomain.com"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  <span className="text-red-500">*</span> Business Name
                </label>
                <input
                  name="business_name"
                  type="text"
                  value={form.business_name}
                  onChange={updateText}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                  placeholder="Your Business Pty Ltd"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  <span className="text-red-500">*</span> Primary Mobile (SMS)
                </label>
                <input
                  name="primary_mobile"
                  type="tel"
                  inputMode="tel"
                  value={form.primary_mobile}
                  onChange={updateText}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                  placeholder="04xx xxx xxx"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  <span className="text-red-500">*</span> Who Answers Calls?
                </label>
                <input
                  name="call_answerer"
                  type="text"
                  value={form.call_answerer}
                  onChange={updateText}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                  placeholder="Sam (7am–5pm)"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  <span className="text-red-500">*</span> Trade
                </label>
                <select
                  name="trade"
                  value={form.trade}
                  onChange={updateText}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select…</option>
                  <option>Electrician</option>
                  <option>HVAC</option>
                  <option>Plumber</option>
                  <option>Handyman</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="confirm_access"
                    type="checkbox"
                    checked={form.confirm_access}
                    onChange={updateCheckbox}
                    className="mt-1 h-5 w-5"
                    style={{ accentColor: BRAND }}
                  />
                  <div>
                    <div className="font-extrabold text-gray-900 text-sm">
                      <span className="text-red-500">*</span> I can access Google Sheets, Drive, Calendar (and Gmail if used).
                    </div>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  <span className="text-red-500">*</span> Consent
                </label>
                <div className="mt-1 rounded-lg text-white p-4" style={{ background: BRAND }}>
                  <p className="text-sm italic opacity-95">
                    “I consent to Flowio sending SMS/email to customers on my behalf for quotes, booking confirmations and reminders.”
                  </p>
                  <label className="mt-3 flex items-center gap-3 cursor-pointer rounded-lg p-3 hover:opacity-95" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <input
                      name="consent"
                      type="checkbox"
                      checked={form.consent}
                      onChange={updateCheckbox}
                      className="h-5 w-5"
                      style={{ accentColor: "white" }}
                    />
                    <span className="font-extrabold text-sm">Yes, I consent</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* PRICEBOOK */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)] border-l-4 border-gray-600">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Pricebook (required)</h3>
                <p className="text-sm text-gray-600">Paste items or drop a share link.</p>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 3 minutes</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="font-extrabold text-gray-900 text-sm">Option A — Share link</div>
                <p className="text-xs text-gray-600 mt-1">Google Sheet / Drive / Dropbox. Make sure it’s accessible.</p>

                <label className="mt-3 block">
                  <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Pricebook link</span>
                  <input
                    name="pricebook_sheet_link"
                    type="url"
                    value={form.pricebook_sheet_link}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                </label>
              </div>

              <div className="text-center text-xs font-extrabold text-gray-400">— OR —</div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="font-extrabold text-gray-900 text-sm">Option B — Paste items</div>
                <p className="text-xs text-gray-600 mt-1">
                  One per line. Format: <span className="font-mono">SKU, Name, Price, Default Qty (optional)</span>
                </p>

                <textarea
                  name="pricebook_text"
                  rows={6}
                  value={form.pricebook_text}
                  onChange={updateText}
                  className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                  placeholder={`ELEC-001, Call-out (incl GST), 120, 1\nELEC-002, Power point supply+install, 165, 1\nGEN-002, Labour (per hour), 110, 2`}
                />
              </div>

              {pricebookError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  Please provide a pricebook via link or pasted items.
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
                    <p className="text-sm text-gray-600">If you skip this, we’ll confirm on the phone.</p>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color: BRAND }}>
                    Expand
                  </span>
                </div>
              </summary>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">ABN</label>
                  <input name="abn" type="text" value={form.abn} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Address</label>
                  <input name="business_address" type="text" value={form.business_address} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Service Area</label>
                  <input name="service_area" type="text" value={form.service_area} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Hours</label>
                  <input name="business_hours" type="text" value={form.business_hours} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Current Quote Template (link)</label>
                  <input
                    name="quote_template_link"
                    type="url"
                    value={form.quote_template_link}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="https://drive.google.com/… or https://dropbox.com/…"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Logo (link)</label>
                  <input
                    name="logo_link"
                    type="url"
                    value={form.logo_link}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="https://drive.google.com/…"
                  />
                </div>

                <div className="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-extrabold text-gray-900 text-sm">Deposits (optional)</div>
                      <p className="text-xs text-gray-600 mt-1">If you’re unsure, leave OFF for now.</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        name="deposit_enabled"
                        type="checkbox"
                        checked={form.deposit_enabled}
                        onChange={updateCheckbox}
                        className="h-5 w-5"
                        style={{ accentColor: BRAND }}
                      />
                      <span className="font-extrabold text-sm text-gray-900">Enable</span>
                    </label>
                  </div>

                  <div className={`mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 ${form.deposit_enabled ? "" : "opacity-50 pointer-events-none"}`}>
                    <div>
                      <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Amount / %</label>
                      <input name="deposit_amount" type="text" value={form.deposit_amount} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="e.g. 20% or $200" />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">When Charged</label>
                      <input name="deposit_when" type="text" value={form.deposit_when} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="e.g. on booking" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Refund / Cancellation</label>
                      <textarea name="deposit_policy" rows={3} value={form.deposit_policy} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Refundable with 24h notice. Otherwise $80 admin fee." />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Calendar Name</label>
                  <input name="calendar_name" type="text" value={form.calendar_name} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none" placeholder="Jobs" />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Booking Restrictions</label>
                  <input name="booking_restrictions" type="text" value={form.booking_restrictions} onChange={updateText} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none" placeholder="No bookings after 4:30pm" />
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

            {submitError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {submitError}
              </div>
            )}
          </section>
        </form>

        <footer className="py-6 text-center text-xs text-gray-500">
          Flowio installs are limited to 3 per week. We’ll confirm your slot after the phone check.
        </footer>
      </main>

      <style>{`
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${BRAND}; box-shadow: 0 0 0 3px rgba(74,124,89,0.20); background:#fff; }
      `}</style>
    </div>
  );
}
