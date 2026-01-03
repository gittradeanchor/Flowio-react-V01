<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Flowio Pre-Install Checklist</title>

  <!-- Tailwind (CDN is OK for a standalone customer form; for your app bundle, compile Tailwind instead) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    :root { --brand:#4A7C59; --bg:#FDFBF7; }
    html, body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: var(--bg); }
    .card { background:#fff; border-radius:14px; box-shadow: 0 6px 20px rgba(17,24,39,0.06); }
    .focus-ring:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(74,124,89,0.20); background:#fff; }
    .req::after { content:" *"; color:#ef4444; font-weight:700; }
  </style>
</head>

<body class="min-h-screen">
  <!-- Sticky Header -->
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
          Flowio Pre-Install Checklist
        </h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Fill this once. We install Flowio in your Google Workspace and you can start quoting the same day.
        </p>
      </div>

      <div class="min-w-[160px] text-right">
        <div class="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Essentials</div>
        <div class="flex items-center justify-end gap-3 mt-1">
          <div class="text-lg font-extrabold text-[color:var(--brand)]" id="progressText">0%</div>
          <div class="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div id="progressBar" class="h-full bg-[color:var(--brand)] transition-all duration-300" style="width:0%"></div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <!-- Top instructions (dead simple) -->
    <section class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-gray-900">What this does (10 seconds)</h2>
          <p class="text-sm text-gray-600 mt-1">
            You give us the basics. We install Flowio inside your Google Workspace so you can send a quote → customer accepts → job gets booked.
          </p>
        </div>
        <div class="flex gap-2">
          <button id="btnSaveDraft" type="button"
            class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-sm">
            Save draft
          </button>
          <button id="btnClearDraft" type="button"
            class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-sm">
            Clear
          </button>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div class="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <div class="font-extrabold text-gray-900">Step 1</div>
          <div class="text-gray-600">Fill the Essentials (required)</div>
        </div>
        <div class="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <div class="font-extrabold text-gray-900">Step 2</div>
          <div class="text-gray-600">Upload pricebook OR paste items</div>
        </div>
        <div class="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <div class="font-extrabold text-gray-900">Step 3</div>
          <div class="text-gray-600">Submit → you get a summary to send us</div>
        </div>
      </div>

      <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <span class="font-bold">Tip:</span> If you’re busy, do only the fields marked with a red star. That’s enough for us to start.
      </div>
    </section>

    <!-- Form -->
    <form id="checklistForm" class="space-y-6" novalidate>
      <!-- ESSENTIALS -->
      <section class="card p-6 border-l-4 border-[color:var(--brand)]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-extrabold text-gray-900">Essentials (required)</h3>
            <p class="text-sm text-gray-600">If you fill only this section, we can proceed.</p>
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 2 minutes</span>
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="req text-xs font-extrabold text-gray-600 uppercase tracking-wider">Google Workspace Admin Email</label>
            <input name="workspace_admin_email" type="email" autocomplete="email"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring"
              placeholder="admin@yourdomain.com"
              data-essential="1" required />
            <p class="mt-1 text-xs text-gray-500">We use this to confirm ownership and set permissions correctly.</p>
          </div>

          <div>
            <label class="req text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Name</label>
            <input name="business_name" type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring"
              placeholder="Balnora Home Comfort"
              data-essential="1" required />
          </div>

          <div>
            <label class="req text-xs font-extrabold text-gray-600 uppercase tracking-wider">Primary Mobile (SMS)</label>
            <input name="primary_mobile" type="tel" inputmode="tel"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring"
              placeholder="04xx xxx xxx"
              data-essential="1" required />
            <p class="mt-1 text-xs text-gray-500">We use this to test the SMS flow with you.</p>
          </div>

          <div>
            <label class="req text-xs font-extrabold text-gray-600 uppercase tracking-wider">Who Answers Calls?</label>
            <input name="call_answerer" type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring"
              placeholder="Sam (7am–5pm)"
              data-essential="1" required />
          </div>

          <div>
            <label class="req text-xs font-extrabold text-gray-600 uppercase tracking-wider">Trade</label>
            <select name="trade" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring"
              data-essential="1" required>
              <option value="" selected>Select…</option>
              <option>Electrician</option>
              <option>HVAC</option>
              <option>Plumber</option>
              <option>Handyman</option>
              <option>Other</option>
            </select>
          </div>

          <div class="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input name="confirm_access" type="checkbox"
                class="mt-1 h-5 w-5 accent-[color:var(--brand)]"
                data-essential="1" required />
              <div>
                <div class="font-extrabold text-gray-900 text-sm">I confirm I can access Google Sheets, Drive, Calendar (and Gmail if used).</div>
                <div class="text-xs text-gray-600">If you’re unsure, still tick it and we’ll verify during install.</div>
              </div>
            </label>
          </div>

          <div class="md:col-span-2">
            <label class="req text-xs font-extrabold text-gray-600 uppercase tracking-wider">Consent</label>
            <div class="mt-1 rounded-lg bg-[color:var(--brand)] text-white p-4">
              <p class="text-sm italic opacity-95">
                “I consent to Flowio sending SMS/email to customers on my behalf for quotes, booking confirmations and reminders.”
              </p>
              <label class="mt-3 flex items-center gap-3 cursor-pointer bg-white/10 rounded-lg p-3 hover:bg-white/15">
                <input name="consent" type="checkbox" class="h-5 w-5 accent-white" data-essential="1" required />
                <span class="font-extrabold text-sm">Yes, I consent</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- PRICEBOOK (REQUIRED: upload OR paste) -->
      <section class="card p-6 border-l-4 border-gray-600">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-extrabold text-gray-900">Pricebook (required)</h3>
            <p class="text-sm text-gray-600">Upload a CSV/Sheet, or paste 10–30 common line items.</p>
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">~ 3 minutes</span>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div class="font-extrabold text-gray-900 text-sm">Option A — Upload price list</div>
            <p class="text-xs text-gray-600 mt-1">CSV is ideal. Google Sheet link is also fine (paste below if easier).</p>

            <label class="mt-3 block">
              <input name="pricebook_file" type="file" accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg"
                class="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-extrabold file:text-white hover:file:bg-gray-800"
                data-pricebook-file="1" />
            </label>

            <div class="mt-3">
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Pricebook Sheet Link (optional)</label>
              <input name="pricebook_sheet_link" type="url"
                class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                />
            </div>
          </div>

          <div class="text-center text-xs font-extrabold text-gray-400">— OR —</div>

          <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div class="font-extrabold text-gray-900 text-sm">Option B — Paste items</div>
            <p class="text-xs text-gray-600 mt-1">One per line. Format: <span class="font-mono">SKU, Name, Price, Default Qty (optional)</span></p>

            <textarea name="pricebook_text" rows="6"
              class="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-ring"
              placeholder="ELEC-001, Call-out (incl GST), 120, 1&#10;ELEC-002, Power point supply+install, 165, 1&#10;GEN-002, Labour (per hour), 110, 2"
              data-pricebook-text="1"></textarea>
          </div>

          <div id="pricebookError" class="hidden rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            Please provide a pricebook via upload or pasted items.
          </div>
        </div>
      </section>

      <!-- OPTIONAL DETAILS (collapsed by default) -->
      <section class="card p-6">
        <details>
          <summary class="cursor-pointer select-none">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-extrabold text-gray-900">Optional (helps us install faster)</h3>
                <p class="text-sm text-gray-600">If you skip this, we’ll confirm on the phone.</p>
              </div>
              <span class="text-sm font-extrabold text-[color:var(--brand)]">Expand</span>
            </div>
          </summary>

          <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">ABN</label>
              <input name="abn" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring" placeholder="00 000 000 000" />
            </div>

            <div>
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Address</label>
              <input name="business_address" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring" placeholder="Street, suburb, state" />
            </div>

            <div>
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Service Area</label>
              <input name="service_area" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring" placeholder="e.g. Western Sydney, Blue Mountains" />
            </div>

            <div>
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Business Hours</label>
              <input name="business_hours" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring" placeholder="Mon–Fri 7am–5pm" />
            </div>

            <div class="md:col-span-2">
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Current Quote Template (optional upload)</label>
              <input name="quote_examples" type="file" multiple accept=".pdf,.png,.jpg,.jpeg"
                class="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-extrabold file:text-white hover:file:bg-gray-800" />
            </div>

            <div class="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="font-extrabold text-gray-900 text-sm">Deposits (optional)</div>
                  <p class="text-xs text-gray-600 mt-1">If you’re unsure, leave OFF for now.</p>
                </div>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input name="deposit_enabled" type="checkbox" class="h-5 w-5 accent-[color:var(--brand)]" id="depositToggle" />
                  <span class="font-extrabold text-sm text-gray-900">Enable</span>
                </label>
              </div>

              <div id="depositFields" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none">
                <div>
                  <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Amount / %</label>
                  <input name="deposit_amount" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-ring" placeholder="e.g. 20% or $200" />
                </div>
                <div>
                  <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">When Charged</label>
                  <input name="deposit_when" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-ring" placeholder="e.g. on booking" />
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Refund / Cancellation</label>
                  <textarea name="deposit_policy" rows="3" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-ring"
                    placeholder="e.g. Refundable with 24h notice. Otherwise $80 admin fee."></textarea>
                </div>
              </div>
            </div>

            <div>
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Calendar Name</label>
              <input name="calendar_name" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring" placeholder="Jobs" />
            </div>

            <div>
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Booking Restrictions</label>
              <input name="booking_restrictions" type="text" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus-ring" placeholder="No bookings after 4:30pm" />
            </div>

            <div class="md:col-span-2">
              <label class="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Logo (optional)</label>
              <input name="logo_file" type="file" accept=".png,.jpg,.jpeg,.svg"
                class="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-extrabold file:text-white hover:file:bg-gray-800" />
            </div>
          </div>
        </details>
      </section>

      <!-- SUBMIT -->
      <section class="card p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 class="text-lg font-extrabold text-gray-900">Submit</h3>
            <p class="text-sm text-gray-600">
              After submit, you’ll get a clean summary you can copy/paste into an email or message to us.
            </p>
          </div>
          <div class="flex gap-2">
            <button id="btnDownloadJson" type="button"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-extrabold text-sm">
              Download JSON
            </button>
            <button id="btnCopySummary" type="button"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-extrabold text-sm">
              Copy Summary
            </button>
            <button id="btnSubmit" type="submit"
              class="px-5 py-2 rounded-lg bg-[color:var(--brand)] hover:bg-[#3d664a] text-white font-extrabold text-sm">
              Submit Checklist
            </button>
          </div>
        </div>

        <div id="submitError" class="hidden mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"></div>

        <div id="summaryWrap" class="hidden mt-4">
          <div class="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Your summary</div>
          <pre id="summaryText" class="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800"></pre>
          <div class="mt-3 flex flex-wrap gap-2">
            <a id="mailtoLink" href="#"
              class="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-extrabold text-sm">
              Email this summary
            </a>
          </div>
          <p class="mt-2 text-xs text-gray-500">
            Note: file uploads can’t be emailed automatically from a static page. If you uploaded files, attach them to your email manually.
          </p>
        </div>
      </section>
    </form>

    <footer class="py-6 text-center text-xs text-gray-500">
      Flowio installs are limited to 3 per week. We’ll confirm your slot after the phone check.
    </footer>
  </main>

  <script>
    // ---------------------------
    // Utilities
    // ---------------------------
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    function safeVal(el) {
      if (!el) return "";
      if (el.type === "checkbox") return el.checked ? "Yes" : "No";
      if (el.type === "file") return (el.files && el.files.length) ? Array.from(el.files).map(f => f.name).join(", ") : "";
      return (el.value || "").trim();
    }

    function formToObject(form) {
      const fd = new FormData(form);
      const obj = {};
      for (const [k, v] of fd.entries()) {
        // For file inputs: store filenames only
        if (v instanceof File) {
          if (!obj[k]) obj[k] = [];
          if (v && v.name) obj[k].push(v.name);
        } else {
          obj[k] = String(v).trim();
        }
      }
      // Normalize checkboxes not present in FormData
      $$("input[type=checkbox]").forEach(cb => {
        if (!(cb.name in obj)) obj[cb.name] = cb.checked ? "Yes" : "No";
      });
      return obj;
    }

    function essentialsProgress() {
      const essentials = $$("[data-essential='1']");
      const total = essentials.length;
      let filled = 0;

      for (const el of essentials) {
        if (el.type === "checkbox") {
          if (el.checked) filled++;
        } else {
          if (safeVal(el)) filled++;
        }
      }
      const pct = total ? Math.round((filled / total) * 100) : 0;
      $("#progressText").textContent = pct + "%";
      $("#progressBar").style.width = pct + "%";
    }

    function pricebookProvided() {
      const fileInput = $("[data-pricebook-file='1']");
      const textArea  = $("[data-pricebook-text='1']");
      const linkInput = $("input[name='pricebook_sheet_link']");
      const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
      const hasText = !!safeVal(textArea);
      const hasLink = !!safeVal(linkInput);
      return hasFile || hasText || hasLink;
    }

    function setVisible(id, show) {
      const el = $(id);
      if (!el) return;
      el.classList.toggle("hidden", !show);
    }

    // ---------------------------
    // Deposit toggle
    // ---------------------------
    const depositToggle = $("#depositToggle");
    const depositFields = $("#depositFields");
    if (depositToggle && depositFields) {
      const updateDepositUI = () => {
        if (depositToggle.checked) {
          depositFields.classList.remove("opacity-50", "pointer-events-none");
        } else {
          depositFields.classList.add("opacity-50", "pointer-events-none");
        }
      };
      depositToggle.addEventListener("change", updateDepositUI);
      updateDepositUI();
    }

    // ---------------------------
    // Autosave (draft)
    // ---------------------------
    const DRAFT_KEY = "flowio_preinstall_draft_v1";

    function saveDraft() {
      const obj = formToObject($("#checklistForm"));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(obj));
    }

    function loadDraft() {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      let obj = null;
      try { obj = JSON.parse(raw); } catch { return; }

      // Fill fields
      for (const [k, v] of Object.entries(obj)) {
        const el = document.querySelector(`[name="${CSS.escape(k)}"]`);
        if (!el) continue;
        if (el.type === "checkbox") {
          el.checked = (v === "Yes");
        } else if (el.type === "file") {
          // cannot set file inputs programmatically
        } else if (Array.isArray(v)) {
          // file names list – ignore
        } else {
          el.value = v;
        }
      }
    }

    $("#btnSaveDraft").addEventListener("click", () => {
      saveDraft();
      alert("Draft saved.");
    });

    $("#btnClearDraft").addEventListener("click", () => {
      if (!confirm("Clear this form and remove saved draft?")) return;
      localStorage.removeItem(DRAFT_KEY);
      $("#checklistForm").reset();
      essentialsProgress();
      setVisible("#summaryWrap", false);
      setVisible("#submitError", false);
      setVisible("#pricebookError", false);
    });

    // Save draft on input changes (lightweight)
    $("#checklistForm").addEventListener("input", () => {
      essentialsProgress();
      saveDraft();
      setVisible("#pricebookError", false);
      setVisible("#submitError", false);
    });

    $("#checklistForm").addEventListener("change", () => {
      essentialsProgress();
      saveDraft();
      setVisible("#pricebookError", false);
      setVisible("#submitError", false);
    });

    // Initial load
    loadDraft();
    essentialsProgress();

    // ---------------------------
    // Summary builder (copy/paste friendly)
    // ---------------------------
    function buildSummary(obj) {
      const lines = [];
      lines.push(`FLOWIO PRE-INSTALL CHECKLIST`);
      lines.push(`----------------------------------------`);
      lines.push(`Business: ${obj.business_name || "-"}`);
      lines.push(`Trade: ${obj.trade || "-"}`);
      lines.push(`Workspace admin: ${obj.workspace_admin_email || "-"}`);
      lines.push(`Primary mobile (SMS test): ${obj.primary_mobile || "-"}`);
      lines.push(`Who answers calls: ${obj.call_answerer || "-"}`);
      lines.push(`Confirm access: ${obj.confirm_access || "No"}`);
      lines.push(`Consent: ${obj.consent || "No"}`);
      lines.push(``);

      lines.push(`PRICEBOOK`);
      lines.push(`- Upload file(s): ${(obj.pricebook_file && obj.pricebook_file.length) ? obj.pricebook_file.join(", ") : "-"}`);
      lines.push(`- Sheet link: ${obj.pricebook_sheet_link || "-"}`);
      lines.push(`- Pasted items: ${obj.pricebook_text ? "Yes (see below)" : "No"}`);
      if (obj.pricebook_text) {
        lines.push(``);
        lines.push(`Pasted items:`);
        lines.push(obj.pricebook_text);
      }

      // Optional section (include only if provided)
      const optionalPairs = [
        ["ABN", obj.abn],
        ["Address", obj.business_address],
        ["Service area", obj.service_area],
        ["Business hours", obj.business_hours],
        ["Calendar name", obj.calendar_name],
        ["Booking restrictions", obj.booking_restrictions],
        ["Deposit enabled", obj.deposit_enabled],
        ["Deposit amount", obj.deposit_amount],
        ["Deposit when", obj.deposit_when],
        ["Deposit policy", obj.deposit_policy],
        ["Quote examples", (obj.quote_examples && obj.quote_examples.length) ? obj.quote_examples.join(", ") : ""],
        ["Logo", (obj.logo_file && obj.logo_file.length) ? obj.logo_file.join(", ") : ""],
      ];

      const hasAnyOptional = optionalPairs.some(([, v]) => v && String(v).trim());
      if (hasAnyOptional) {
        lines.push(``);
        lines.push(`OPTIONAL DETAILS`);
        for (const [label, val] of optionalPairs) {
          if (val && String(val).trim()) lines.push(`- ${label}: ${String(val).trim()}`);
        }
      }

      lines.push(``);
      lines.push(`NEXT STEP: Reply with a preferred time for a 15-minute phone fit check.`);
      return lines.join("\n");
    }

    // ---------------------------
    // Validation + submit (client-side)
    // ---------------------------
    $("#checklistForm").addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate essentials
      const essentials = $$("[data-essential='1']");
      const missing = [];
      for (const el of essentials) {
        if (el.type === "checkbox") {
          if (!el.checked) missing.push(el);
        } else {
          if (!safeVal(el)) missing.push(el);
        }
      }

      if (!pricebookProvided()) {
        setVisible("#pricebookError", true);
        $("textarea[name='pricebook_text']").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (missing.length) {
        setVisible("#submitError", true);
        $("#submitError").textContent =
          "Missing required fields. Please complete the Essentials section (red star fields and checkboxes).";
        missing[0].scrollIntoView({ behavior: "smooth", block: "center" });
        // Focus first missing
        try { missing[0].focus(); } catch {}
        return;
      }

      setVisible("#submitError", false);
      setVisible("#pricebookError", false);

      const obj = formToObject($("#checklistForm"));
      const summary = buildSummary(obj);

      $("#summaryText").textContent = summary;
      setVisible("#summaryWrap", true);

      // Build mailto
      const subject = encodeURIComponent(`Flowio Pre-Install Checklist — ${obj.business_name || "Business"}`);
      const body = encodeURIComponent(summary + "\n\n(Attached files: please add manually if you uploaded any.)");
      $("#mailtoLink").href = `mailto:?subject=${subject}&body=${body}`;

      // Save draft (keeps state)
      saveDraft();
      $("#summaryWrap").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Copy / Download buttons
    $("#btnCopySummary").addEventListener("click", async () => {
      const text = $("#summaryText").textContent || "";
      if (!text) {
        alert("Submit the form first to generate a summary.");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        alert("Summary copied.");
      } catch {
        alert("Could not copy automatically. Please select and copy manually.");
      }
    });

    $("#btnDownloadJson").addEventListener("click", () => {
      const obj = formToObject($("#checklistForm"));
      // Soft check: still allow download even if incomplete
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flowio-preinstall-${(obj.business_name || "customer").toString().replace(/\s+/g, "-").toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  </script>
</body>
</html>
