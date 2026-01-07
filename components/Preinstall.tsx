import React, { useEffect, useMemo, useState } from "react";

// --- Types & Configuration (Unchanged) ---
type FormState = {
  workspace_admin_email: string;
  business_name: string;
  primary_mobile: string;
  call_answerer: string;
  trade: string;

  confirm_access: boolean;
  consent: boolean;

  pricebook_sheet_link: string;
  pricebook_text: string;

  abn: string;
  business_address: string;
  service_area: string;
  business_hours: string;


  deposit_enabled: boolean;
  deposit_amount: string;
  deposit_when: string;
  deposit_policy: string;

  calendar_name: string;
  booking_restrictions: string;


  // optional: included if present in URL
  token: string;
  pid: string;
};

const BRAND = "#4A7C59";
const BG = "#FDFBF7";
const DRAFT_KEY = "flowio_preinstall_draft_v1";

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


  deposit_enabled: false,
  deposit_amount: "",
  deposit_when: "",
  deposit_policy: "",

  calendar_name: "",
  booking_restrictions: "",


  token: "",
  pid: "",
};

// --- Helpers (Unchanged Logic) ---

function looksLikeEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
}

function sanitizeFilename(s: string) {
  return (s || "customer")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60) || "customer";
}

function buildSummary(obj: FormState) {
  const lines: string[] = [];
  lines.push(`FLOWIO PRE-INSTALL CHECKLIST1`);
  lines.push(`----------------------------------------`);

  if (obj.pid) lines.push(`PersonId: ${obj.pid}`);
  if (obj.token) lines.push(`Token: ${obj.token}`);

  lines.push(`Business: ${obj.business_name || "-"}`);
  lines.push(`Trade: ${obj.trade || "-"}`);
  lines.push(`Workspace admin: ${obj.workspace_admin_email || "-"}`);
  lines.push(`Primary mobile (SMS test): ${obj.primary_mobile || "-"}`);
  lines.push(`Who answers calls: ${obj.call_answerer || "-"}`);
  lines.push(`Confirm access: ${obj.confirm_access ? "Yes" : "No"}`);
  lines.push(`Consent: ${obj.consent ? "Yes" : "No"}`);
  lines.push(``);

  lines.push(`PRICEBOOK`);
  lines.push(`- Sheet link: ${obj.pricebook_sheet_link || "-"}`);
  lines.push(`- Pasted items: ${obj.pricebook_text ? "Yes (see below)" : "No"}`);
  if (obj.pricebook_text) {
    lines.push(``);
    lines.push(`Pasted items:`);
    lines.push(obj.pricebook_text);
  }

  const optionalPairs: Array<[string, string]> = [
    ["ABN", obj.abn],
    ["Address", obj.business_address],
    ["Service area", obj.service_area],
    ["Business hours", obj.business_hours],
    ["Calendar name", obj.calendar_name],
    ["Booking restrictions", obj.booking_restrictions],
    ["Deposit enabled", obj.deposit_enabled ? "Yes" : ""],
    ["Deposit amount", obj.deposit_amount],
    ["Deposit when", obj.deposit_when],
    ["Deposit policy", obj.deposit_policy],
    ["Quote examples", obj.quote_examples_names?.length ? obj.quote_examples_names.join(", ") : ""],
    ["Logo", obj.logo_file_names?.length ? obj.logo_file_names.join(", ") : ""],
  ];

  const hasAnyOptional = optionalPairs.some(([, v]) => (v || "").trim());
  if (hasAnyOptional) {
    lines.push(``);
    lines.push(`OPTIONAL DETAILS`);
    for (const [label, val] of optionalPairs) {
      if ((val || "").trim()) lines.push(`- ${label}: ${val.trim()}`);
    }
  }

  lines.push(``);
  lines.push(`NEXT STEP: Reply with a preferred time for a 15-minute phone fit check.`);
  return lines.join("\n");
}

// --- Component ---

export default function Preinstall() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitError, setSubmitError] = useState<string>("");
  const [pricebookError, setPricebookError] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");

  // 1. Load URL params
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t = qs.get("t") || "";
    const pid = qs.get("pid") || "";
    setForm((prev) => ({ ...prev, token: t, pid }));
  }, []);

  // 2. Load Draft
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      setForm((prev) => ({
        ...prev,
        ...obj,
        pricebook_file_names: Array.isArray(obj.pricebook_file_names) ? obj.pricebook_file_names : prev.pricebook_file_names,
        quote_examples_names: Array.isArray(obj.quote_examples_names) ? obj.quote_examples_names : prev.quote_examples_names,
        logo_file_names: Array.isArray(obj.logo_file_names) ? obj.logo_file_names : prev.logo_file_names,
      }));
    } catch {
      // ignore
    }
  }, []);

  // 3. Save Draft on Change
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form]);

  // Logic: Progress Calculation
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

  const mailtoHref = useMemo(() => {
    if (!summary) return "#";
    const subject = encodeURIComponent(`Flowio Pre-Install Checklist — ${form.business_name || "Business"}`);
    const body = encodeURIComponent(summary + "\n\n(Attached files: please add manually if you uploaded any.)");
    return `mailto:?subject=${subject}&body=${body}`;
  }, [summary, form.business_name]);

  // Handlers
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

  function updateFiles(name: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files).map((f) => f.name) : [];
      setSubmitError("");
      setPricebookError(false);
      setForm((prev) => ({ ...prev, [name]: files } as FormState));
    };
  }

  function saveDraftNow() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      alert("Draft saved.");
    } catch {
      alert("Could not save draft.");
    }
  }

  function clearAll() {
    if (!confirm("Clear this form and remove saved draft?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setSubmitError("");
    setPricebookError(false);
    setSummary("");
    setForm((prev) => ({
      ...initialState,
      token: prev.token,
      pid: prev.pid,
    }));
  }

  async function copySummary() {
    if (!summary) {
      alert("Submit the form first to generate a summary.");
      return;
    }
    try {
      await navigator.clipboard.writeText(summary);
      alert("Summary copied.");
    } catch {
      alert("Could not copy automatically. Please select and copy manually.");
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flowio-preinstall-${sanitizeFilename(form.business_name)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

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

    setSubmitError("");
    setPricebookError(false);

    const s = buildSummary(form);
    setSummary(s);

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }

    setTimeout(() => {
      const el = document.getElementById("summaryWrap");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  // Styles for clean UI
  const sectionCardClass = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden";
  const headerClass = "px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50";
  const headerTitleClass = "text-lg font-bold text-gray-800";
  const contentClass = "p-6 sm:p-8 space-y-6";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";
  const inputClass = "w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all";
  const helperClass = "mt-1.5 text-xs text-gray-500";

  return (
    <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Flowio Checklist</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Pre-install requirements</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-500" style={{ width: `${essentialsPct}%`, backgroundColor: BRAND }} />
                </div>
                <span className="text-xs font-bold text-green-700">{essentialsPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro Card */}
        <section className={sectionCardClass}>
          <div className="p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Let's get you set up.</h2>
              <p className="text-sm text-gray-600 max-w-lg">
                We need these details to configure your Flowio workspace. 
                It takes about 10 minutes.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2 justify-center">
              <button onClick={saveDraftNow} className="text-xs font-semibold text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors">
                Save Draft
              </button>
              <button onClick={clearAll} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-md transition-colors">
                Reset
              </button>
            </div>
          </div>
        </section>

        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* STEP 1: ESSENTIALS */}
          <section className={sectionCardClass}>
            <div className={headerClass}>
              <h3 className={headerTitleClass}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold mr-2">1</span>
                Essentials
              </h3>
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">Required</span>
            </div>
            
            <div className={contentClass}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="sm:col-span-2">
                  <label className={labelClass}>Google Workspace Admin Email <span className="text-red-500">*</span></label>
                  <input
                    name="workspace_admin_email"
                    type="email"
                    className={inputClass}
                    value={form.workspace_admin_email}
                    onChange={updateText}
                    placeholder="admin@yourcompany.com"
                  />
                  <p className={helperClass}>We need this to verify account ownership.</p>
                </div>

                <div>
                  <label className={labelClass}>Business Name <span className="text-red-500">*</span></label>
                  <input
                    name="business_name"
                    type="text"
                    className={inputClass}
                    value={form.business_name}
                    onChange={updateText}
                    placeholder="e.g. Acme Plumbing"
                  />
                </div>

                <div>
                  <label className={labelClass}>Trade Type <span className="text-red-500">*</span></label>
                  <select name="trade" value={form.trade} onChange={updateText} className={inputClass}>
                    <option value="">Select...</option>
                    <option>Electrician</option>
                    <option>HVAC</option>
                    <option>Plumber</option>
                    <option>Handyman</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Primary Mobile (For SMS Tests) <span className="text-red-500">*</span></label>
                  <input
                    name="primary_mobile"
                    type="tel"
                    className={inputClass}
                    value={form.primary_mobile}
                    onChange={updateText}
                    placeholder="e.g. 0400 000 000"
                  />
                </div>

                <div>
                  <label className={labelClass}>Who Answers Calls? <span className="text-red-500">*</span></label>
                  <input
                    name="call_answerer"
                    type="text"
                    className={inputClass}
                    value={form.call_answerer}
                    onChange={updateText}
                    placeholder="e.g. Sam (Mon-Fri 9-5)"
                  />
                </div>
              </div>

              {/* Deposit Section (Moved from Optional) */}
              <div className="border-t border-b border-gray-100 py-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-700 text-sm">Do you take deposits? <span className="text-red-500">*</span></span>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" name="deposit_enabled" checked={form.deposit_enabled} onChange={updateCheckbox} className="sr-only" />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${form.deposit_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.deposit_enabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-700">{form.deposit_enabled ? 'Yes' : 'No'}</div>
                  </label>
                </div>

                {form.deposit_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className={labelClass}>Amount / %</label>
                      <input name="deposit_amount" type="text" className={inputClass} value={form.deposit_amount} onChange={updateText} placeholder="e.g. 50%" />
                    </div>
                    <div>
                      <label className={labelClass}>When is it charged?</label>
                      <input name="deposit_when" type="text" className={inputClass} value={form.deposit_when} onChange={updateText} placeholder="e.g. On booking" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Cancellation Policy</label>
                      <textarea name="deposit_policy" rows={2} className={inputClass} value={form.deposit_policy} onChange={updateText} placeholder="e.g. Non-refundable within 24h" />
                    </div>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="confirm_access"
                    type="checkbox"
                    checked={form.confirm_access}
                    onChange={updateCheckbox}
                    className="mt-1 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-bold">Access Confirmation:</span> I confirm I can access Google Sheets, Drive, and Calendar. <span className="text-red-500">*</span>
                  </span>
                </label>

                <div className="border-t border-gray-200 my-2"></div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={updateCheckbox}
                    className="mt-1 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-bold">Consent:</span> “I consent to Flowio sending SMS/email to customers on my behalf for quotes, booking confirmations and reminders.” <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* STEP 2: PRICEBOOK */}
          <section className={sectionCardClass}>
            <div className={headerClass}>
              <h3 className={headerTitleClass}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold mr-2">2</span>
                Pricebook
              </h3>
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">Required</span>
            </div>

            <div className={contentClass}>
              <p className="text-sm text-gray-600 mb-4">Please provide your pricing using <strong>one</strong> of the options below.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option A */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 hover:border-green-500 transition-colors bg-gray-50/50">
                  <span className="block text-xs font-bold text-gray-400 uppercase mb-3">Option A: Paste Google Sheet Link</span>
                
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Google Sheets link (view access)</label>
                  <input
                    name="pricebook_sheet_link"
                    type="url"
                    value={form.pricebook_sheet_link}
                    onChange={updateText}
                    className={inputClass}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Make sure link sharing is set to “Anyone with the link can view” (or explicitly shared with us).
                  </p>
                </div>

                {/* Option B */}
                <div className="border-2 border-gray-100 rounded-lg p-5 bg-white">
                  <span className="block text-xs font-bold text-gray-400 uppercase mb-3">Option B: Paste Items Manually</span>
                  <textarea
                    name="pricebook_text"
                    rows={6}
                    value={form.pricebook_text}
                    onChange={updateText}
                    className={inputClass}
                    placeholder={`SKU, Item Name, Price\nELEC01, Call Out, 120\nELEC02, Labour 1h, 110`}
                  />
                  <p className={helperClass}>Enter 10-30 common items.</p>
                </div>
              </div>

              {pricebookError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md font-medium">
                  ⚠️ Please paste a link, or enter items manually.
                </div>
              )}
            </div>
          </section>

          {/* STEP 3: OPTIONAL DETAILS */}
          <section className={sectionCardClass}>
            <details className="group">
              <summary className={`${headerClass} cursor-pointer list-none`}>
                <h3 className={headerTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold mr-2">3</span>
                  Optional Details
                </h3>
                <span className="flex items-center text-xs font-bold text-gray-500 group-open:text-green-600">
                  {form.abn ? "Editing" : "Click to Expand"} 
                  <span className="ml-2 transform group-open:rotate-180 transition-transform">▼</span>
                </span>
              </summary>
              
              <div className={contentClass}>
                <p className="text-sm text-gray-500">
                  Filling this now speeds up installation. If skipped, we will ask you later.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>ABN</label>
                    <input name="abn" type="text" className={inputClass} value={form.abn} onChange={updateText} placeholder="00 000 000 000" />
                  </div>
                  <div>
                    <label className={labelClass}>Business Address</label>
                    <input name="business_address" type="text" className={inputClass} value={form.business_address} onChange={updateText} placeholder="123 Main St" />
                  </div>
                  <div>
                    <label className={labelClass}>Service Area</label>
                    <input name="service_area" type="text" className={inputClass} value={form.service_area} onChange={updateText} placeholder="e.g. Metro Area" />
                  </div>
                  <div>
                    <label className={labelClass}>Business Hours</label>
                    <input name="business_hours" type="text" className={inputClass} value={form.business_hours} onChange={updateText} placeholder="e.g. Mon-Fri 9-5" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Upload Logo</label>
                    <input name="logo_file" type="file" accept="image/*" onChange={updateFiles("logo_file_names")} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Quote Template (PDF/Image)</label>
                    <input name="quote_examples" type="file" multiple accept=".pdf,image/*" onChange={updateFiles("quote_examples_names")} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"/>
                  </div>
                  <div>
                    <label className={labelClass}>Calendar Name</label>
                    <input name="calendar_name" type="text" className={inputClass} value={form.calendar_name} onChange={updateText} placeholder="e.g. 'Work' or 'Jobs'" />
                  </div>
                  <div>
                    <label className={labelClass}>Booking Restrictions</label>
                    <input name="booking_restrictions" type="text" className={inputClass} value={form.booking_restrictions} onChange={updateText} placeholder="e.g. No weekends" />
                  </div>
                </div>

              </div>
            </details>
          </section>

          {/* SUBMIT */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready?</h3>
            <p className="text-sm text-gray-600 mb-6">Click submit to generate your installation summary.</p>
            
            {submitError && (
              <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm font-bold border border-red-100">
                {submitError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 font-bold rounded-lg shadow-md transition-transform transform active:scale-95"
              style={{ backgroundColor: BRAND, color: "#fff" }}
            >
              Submit Checklist
            </button>
            </div>

            {/* Summary Output */}
            {summary && (
              <div id="summaryWrap" className="mt-8 text-left animate-fade-in">
                <div className="bg-gray-900 rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Generated Summary</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={copySummary} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors">Copy</button>
                      <button type="button" onClick={downloadJson} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors">Download JSON</button>
                    </div>
                  </div>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-700">
                    {summary}
                  </pre>
                  <div className="mt-4 text-center">
                    <a href={mailtoHref} className="inline-block bg-white text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      Open in Email App
                    </a>
                    <p className="text-xs text-gray-500 mt-2">Don't forget to attach files manually!</p>
                  </div>
                </div>
              </div>
            )}
          </section>

        </form>

        <footer className="text-center text-xs text-gray-400 py-8">
          Flowio Installation Checklist &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
