import React, { useEffect, useMemo, useState } from "react";
<meta name="robots" content="noindex, nofollow" />
type FormState = {
  workspace_admin_email: string;
  business_name: string;
  primary_mobile: string;
  call_answerer: string;
  trade: string;

  confirm_access: boolean;
  consent: boolean;

  pricebook_file_names: string[];
  pricebook_sheet_link: string;
  pricebook_text: string;

  abn: string;
  business_address: string;
  service_area: string;
  business_hours: string;

  quote_examples_names: string[];

  deposit_enabled: boolean;
  deposit_amount: string;
  deposit_when: string;
  deposit_policy: string;

  calendar_name: string;
  booking_restrictions: string;

  logo_file_names: string[];

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

  pricebook_file_names: [],
  pricebook_sheet_link: "",
  pricebook_text: "",

  abn: "",
  business_address: "",
  service_area: "",
  business_hours: "",

  quote_examples_names: [],

  deposit_enabled: false,
  deposit_amount: "",
  deposit_when: "",
  deposit_policy: "",

  calendar_name: "",
  booking_restrictions: "",

  logo_file_names: [],

  token: "",
  pid: "",
};

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
  lines.push(`FLOWIO PRE-INSTALL CHECKLIST`);
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
  lines.push(`- Upload file(s): ${obj.pricebook_file_names?.length ? obj.pricebook_file_names.join(", ") : "-"}`);
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

export default function Preinstall() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitError, setSubmitError] = useState<string>("");
  const [pricebookError, setPricebookError] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");

  // pull token/personId from URL if present
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t = qs.get("t") || "";
    const pid = qs.get("pid") || "";
    setForm((prev) => ({ ...prev, token: t, pid }));
  }, []);

  // load draft once
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      setForm((prev) => ({
        ...prev,
        ...obj,
        // never try to restore file inputs as actual files; keep names only
        pricebook_file_names: Array.isArray(obj.pricebook_file_names) ? obj.pricebook_file_names : prev.pricebook_file_names,
        quote_examples_names: Array.isArray(obj.quote_examples_names) ? obj.quote_examples_names : prev.quote_examples_names,
        logo_file_names: Array.isArray(obj.logo_file_names) ? obj.logo_file_names : prev.logo_file_names,
      }));
    } catch {
      // ignore
    }
  }, []);

  // autosave draft on any change
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form]);

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
    const hasFile = (form.pricebook_file_names || []).length > 0;
    const hasText = !!form.pricebook_text.trim();
    const hasLink = !!form.pricebook_sheet_link.trim();
    return hasFile || hasText || hasLink;
  }, [form]);

  const mailtoHref = useMemo(() => {
    if (!summary) return "#";
    const subject = encodeURIComponent(`Flowio Pre-Install Checklist — ${form.business_name || "Business"}`);
    const body = encodeURIComponent(summary + "\n\n(Attached files: please add manually if you uploaded any.)");
    return `mailto:?subject=${subject}&body=${body}`;
  }, [summary, form.business_name]);

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
      // preserve URL token/pid if present
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

    // essentials validation
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

    // keep draft
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }

    // scroll to summary
    setTimeout(() => {
      const el = document.getElementById("summaryWrap");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <div className="min-h-screen" style={{ background: BG, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">Flowio Pre-Install Checklist</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Fill this once. We install Flowio in your Google Workspace and you can start quoting the same day.
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
                You give us the basics. We install Flowio inside your Google Workspace so you can send a quote → customer accepts → job gets booked.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveDraftNow}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-sm"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <div className="font-extrabold text-gray-900">Step 1</div>
              <div className="text-gray-600">Fill the Essentials (required)</div>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <div className="font-extrabold text-gray-900">Step 2</div>
              <div className="text-gray-600">Upload pricebook OR paste items</div>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <div className="font-extrabold text-gray-900">Step 3</div>
              <div className="text-gray-600">Submit → you get a summary to send us</div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <span className="font-bold">Tip:</span> If you’re busy, do only the fields marked with a red star. That’s enough for us to start.
          </div>
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
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ boxShadow: "none" }}
                  placeholder="admin@yourdomain.com"
                />
                <p className="mt-1 text-xs text-gray-500">We use this to confirm ownership and set permissions correctly.</p>
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
                  placeholder="Balnora Home Comfort"
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
                <p className="mt-1 text-xs text-gray-500">We use this to test the SMS flow with you.</p>
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
                      <span className="text-red-500">*</span> I confirm I can access Google Sheets, Drive, Calendar (and Gmail if used).
                    </div>
                    <div className="text-xs text-gray-600">If you’re unsure, still tick it and we’ll verify during install.</div>
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
                <p className="text-sm text-gray-600">Upload a CSV/Sheet, or paste 10–30 common line items.</p>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 3 minutes</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="font-extrabold text-gray-900 text-sm">Option A — Upload price list</div>
                <p className="text-xs text-gray-600 mt-1">CSV is ideal. Google Sheet link is also fine (paste below if easier).</p>

                <label className="mt-3 block">
                  <input
                    name="pricebook_file"
                    type="file"
                    accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg"
                    onChange={updateFiles("pricebook_file_names")}
                    className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-extrabold file:text-white hover:file:bg-gray-800"
                  />
                </label>

                <div className="mt-3">
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Pricebook Sheet Link (optional)</label>
                  <input
                    name="pricebook_sheet_link"
                    type="url"
                    value={form.pricebook_sheet_link}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                </div>
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
                  Please provide a pricebook via upload or pasted items (or a sheet link).
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
                  <input
                    name="abn"
                    type="text"
                    value={form.abn}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="00 000 000 000"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Address</label>
                  <input
                    name="business_address"
                    type="text"
                    value={form.business_address}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="Street, suburb, state"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Service Area</label>
                  <input
                    name="service_area"
                    type="text"
                    value={form.service_area}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="e.g. Western Sydney, Blue Mountains"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Hours</label>
                  <input
                    name="business_hours"
                    type="text"
                    value={form.business_hours}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="Mon–Fri 7am–5pm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Current Quote Template (optional upload)</label>
                  <input
                    name="quote_examples"
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={updateFiles("quote_examples_names")}
                    className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-extrabold file:text-white hover:file:bg-gray-800"
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
                      <input
                        name="deposit_amount"
                        type="text"
                        value={form.deposit_amount}
                        onChange={updateText}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                        placeholder="e.g. 20% or $200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">When Charged</label>
                      <input
                        name="deposit_when"
                        type="text"
                        value={form.deposit_when}
                        onChange={updateText}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                        placeholder="e.g. on booking"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Refund / Cancellation</label>
                      <textarea
                        name="deposit_policy"
                        rows={3}
                        value={form.deposit_policy}
                        onChange={updateText}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                        placeholder="e.g. Refundable with 24h notice. Otherwise $80 admin fee."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Calendar Name</label>
                  <input
                    name="calendar_name"
                    type="text"
                    value={form.calendar_name}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="Jobs"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Booking Restrictions</label>
                  <input
                    name="booking_restrictions"
                    type="text"
                    value={form.booking_restrictions}
                    onChange={updateText}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none"
                    placeholder="No bookings after 4:30pm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Logo (optional)</label>
                  <input
                    name="logo_file"
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={updateFiles("logo_file_names")}
                    className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-extrabold file:text-white hover:file:bg-gray-800"
                  />
                </div>
              </div>
            </details>
          </section>

          {/* SUBMIT */}
          <section className="p-6 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(17,24,39,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Submit</h3>
                <p className="text-sm text-gray-600">After submit, you’ll get a clean summary you can copy/paste into an email or message to us.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={downloadJson}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-extrabold text-sm"
                >
                  Download JSON
                </button>
                <button
                  type="button"
                  onClick={copySummary}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-extrabold text-sm"
                >
                  Copy Summary
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white font-extrabold text-sm"
                  style={{ background: BRAND }}
                >
                  Submit Checklist
                </button>
              </div>
            </div>

            {submitError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {submitError}
              </div>
            )}

            {summary && (
              <div id="summaryWrap" className="mt-4">
                <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Your summary</div>
                <pre className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                  {summary}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-extrabold text-sm"
                  >
                    Email this summary
                  </a>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Note: file uploads can’t be emailed automatically from a static page. If you uploaded files, attach them to your email manually.
                </p>
              </div>
            )}
          </section>
        </form>

        <footer className="py-6 text-center text-xs text-gray-500">
          Flowio installs are limited to 3 per week. We’ll confirm your slot after the phone check.
        </footer>
      </main>

      {/* minimal focus ring behavior */}
      <style>{`
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${BRAND}; box-shadow: 0 0 0 3px rgba(74,124,89,0.20); background:#fff; }
      `}</style>
    </div>
  );
}
