/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  FLOWIO MARKETING ENGINE v1.3                               ║
 * ║  Bound to: Marketing Command Center Google Sheet             ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
  // Sheet IDs
  COMMAND_CENTER_ID: '1ZdAsJ4uyR22B0Z2U3MBfVbgXdXf1qxWG1EYi8PqgA2o',
  CRM_SHEET_ID: '1aTcY7yul6whuGmFmigCGUfjmlp8InLK14pwrEIcY-TU',

  // Tab names
  PIPELINE_TAB: 'Pipeline',
  DASHBOARD_TAB: 'Dashboard',
  NURTURE_TAB: 'Nurture Status',
  REFERRALS_TAB: 'Referrals',
  SETTINGS_TAB: 'Settings',

  // Email
  OWNER_EMAIL: 'sean@tradeanchor.com.au',
  SENDER_NAME: 'Sean | TradeAnchor',

  // URLs
  SITE_URL: 'https://flowio.tradeanchor.com.au',
  CALENDLY_URL: 'https://calendly.com/billing-tradeanchor/15min',
  WHATSAPP_URL: 'https://wa.me/61494186989',
  TEST_DRIVE_URL: 'https://flowio.tradeanchor.com.au#test-drive',

  // ClickSend SMS (fill in Settings tab or hardcode here)
  CLICKSEND_USERNAME: '', // filled from Settings tab at runtime
  CLICKSEND_API_KEY: '', // filled from Settings tab at runtime

  // Nurture timing (days between steps)
  NURTURE_SCHEDULE: [0, 2, 2, 3], // Day 0, +2=Day 2, +2=Day 4, +3=Day 7

  // Pipeline column indices (0-based) — matches header row
  COL: {
    DATE: 0,           // A
    NAME: 1,           // B
    PHONE: 2,          // C
    EMAIL: 3,          // D
    TRADE: 4,          // E
    SOURCE: 5,         // F
    UTM_SOURCE: 6,     // G
    UTM_MEDIUM: 7,     // H
    UTM_CAMPAIGN: 8,   // I
    STAGE: 9,          // J
    NOTES: 10,         // K
    LAST_CONTACT: 11,  // L
    NEXT_ACTION: 12,   // M
    NURTURE_STEP: 13,  // N
    NURTURE_NEXT: 14,  // O
  }
};

// Pipeline headers
const PIPELINE_HEADERS = [
  'Date', 'Name', 'Phone', 'Email', 'Trade', 'Source',
  'UTM Source', 'UTM Medium', 'UTM Campaign', 'Stage',
  'Notes', 'Last Contact', 'Next Action', 'Nurture Step', 'Nurture Next Date'
];


// ═══════════════════════════════════════════════════════════════
// SETUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Run once — ensures Pipeline tab has correct headers.
 */
function setupSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);

  if (!pipeline) {
    throw new Error('Pipeline tab not found. Create it manually first.');
  }

  // Check if headers exist
  const firstRow = pipeline.getRange(1, 1, 1, PIPELINE_HEADERS.length).getValues()[0];
  const hasHeaders = firstRow[0] !== '';

  if (!hasHeaders) {
    pipeline.getRange(1, 1, 1, PIPELINE_HEADERS.length).setValues([PIPELINE_HEADERS]);
    pipeline.getRange(1, 1, 1, PIPELINE_HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0F172A')
      .setFontColor('#FFFFFF');
    pipeline.setFrozenRows(1);
    Logger.log('Pipeline headers created.');
  } else {
    Logger.log('Pipeline headers already exist: ' + firstRow.join(', '));
  }

  // Setup Dashboard tab
  const dashboard = ss.getSheetByName(CONFIG.DASHBOARD_TAB);
  if (dashboard) {
    const dashFirst = dashboard.getRange('A1').getValue();
    if (dashFirst === '') {
      const metrics = [
        ['Metric', 'Today', 'This Week', 'This Month', 'All Time'],
        ['New Leads', '', '', '', ''],
        ['Test Drives', '', '', '', ''],
        ['Audit Requests', '', '', '', ''],
        ['Calls Booked', '', '', '', ''],
        ['Installs Completed', '', '', '', ''],
        ['Revenue', '', '', '', ''],
        ['Pipeline Value', '', '', '', ''],
        ['Conversion Rate', '', '', '', ''],
      ];
      dashboard.getRange(1, 1, metrics.length, 5).setValues(metrics);
      dashboard.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
      dashboard.setFrozenRows(1);
      Logger.log('Dashboard tab populated.');
    }
  }

  // Setup Settings tab with defaults — always ensures all keys exist
  const settings = ss.getSheetByName(CONFIG.SETTINGS_TAB);
  if (settings) {
    const settingsData = [
      ['Setting', 'Value'],
      ['Owner Email', CONFIG.OWNER_EMAIL],
      ['Calendly URL', CONFIG.CALENDLY_URL],
      ['WhatsApp URL', CONFIG.WHATSAPP_URL],
      ['Site URL', CONFIG.SITE_URL],
      ['CRM Sheet ID', CONFIG.CRM_SHEET_ID],
      ['Command Center Sheet ID', CONFIG.COMMAND_CENTER_ID],
      ['ClickSend Username', ''],
      ['ClickSend API Key', ''],
      ['Google Review Link', ''],
      ['Referral Bonus', '$200/$200'],
      ['Pilot Price', '$390 (inc GST)'],
      ['Payment Plan', '3x $699/mo'],
      ['SMS Enabled', 'false'],
    ];

    // Read existing values to preserve user-entered data (like API keys)
    const existing = {};
    const currentData = settings.getDataRange().getValues();
    for (let i = 1; i < currentData.length; i++) {
      const key = String(currentData[i][0]).trim();
      const val = String(currentData[i][1]).trim();
      if (key && val) existing[key] = val;
    }

    // Merge: keep user values, fill defaults for new keys
    for (let i = 1; i < settingsData.length; i++) {
      const key = settingsData[i][0];
      if (existing[key] && existing[key] !== '') {
        settingsData[i][1] = existing[key];
      }
    }

    settings.clearContents();
    settings.getRange(1, 1, settingsData.length, 2).setValues(settingsData);
    settings.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
    Logger.log('Settings tab populated/updated (' + settingsData.length + ' rows).');
  }

  // Setup Nurture Status headers
  const nurture = ss.getSheetByName(CONFIG.NURTURE_TAB);
  if (nurture) {
    const nurtureFirst = nurture.getRange('A1').getValue();
    if (nurtureFirst === '') {
      const headers = ['Name', 'Email', 'Current Step', 'Next Send Date', 'Last Email Subject', 'Status'];
      nurture.getRange(1, 1, 1, headers.length).setValues([headers]);
      nurture.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
      nurture.setFrozenRows(1);
    }
  }

  // Setup Referrals headers
  const referrals = ss.getSheetByName(CONFIG.REFERRALS_TAB);
  if (referrals) {
    const refFirst = referrals.getRange('A1').getValue();
    if (refFirst === '') {
      const headers = ['Referrer Name', 'Referrer Email', 'Referred Lead', 'Referred Email', 'Date', 'Status', 'Payout Owed', 'Paid?'];
      referrals.getRange(1, 1, 1, headers.length).setValues([headers]);
      referrals.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
      referrals.setFrozenRows(1);
    }
  }

  // Apply dropdowns to all multiple-choice columns
  setupDropdowns();

  Logger.log('✅ Sheet setup complete.');
}


// ═══════════════════════════════════════════════════════════════
// CUSTOM MENU + AUTO-HANDLERS
// ═══════════════════════════════════════════════════════════════

/**
 * Adds "Flowio Engine" menu to the sheet toolbar.
 * Runs automatically when the spreadsheet is opened.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Flowio Engine')
    .addItem('Import Raw Leads', 'importLeads')
    .addItem('Refresh Call List', 'refreshCallList')
    .addItem('Update Dashboard', 'updateDashboard')
    .addSeparator()
    .addItem('Run Nurture Sequence', 'runNurtureSequence')
    .addItem('Run Follow-Up Engine', 'runFollowUpEngine')
    .addItem('Run Cold Outreach', 'runColdOutreach')
    .addItem('Run Post-Install Check', 'runPostInstallCheck')
    .addSeparator()
    .addItem('Send Daily Digest', 'sendDailyDigest')
    .addItem('Run ALL Engines', 'runAllEngines')
    .addSeparator()
    .addItem('Sync Call Results to Pipeline', 'syncCallResultToPipeline_')
    .addSeparator()
    .addSubMenu(ui.createMenu('Setup (run once)')
      .addItem('Setup Sheet Headers', 'setupSheet')
      .addItem('Setup Outbound Tabs', 'setupOutboundTabs')
      .addItem('Setup All Triggers', 'setupTriggers')
      .addItem('Apply Dropdowns', 'setupDropdowns')
      .addItem('Build Guide Tab', 'buildGuideTab_'))
    .addToUi();
}


/**
 * Auto-responds to manual cell edits in Pipeline.
 * Updates Last Contact timestamp and shows toast on stage change.
 * Simple trigger — CANNOT send emails or call external APIs.
 */
function onEdit(e) {
  try {
    const sheet = e.range.getSheet();
    const sheetName = sheet.getName();

    // Only react to Pipeline tab, Stage column (J = column 10)
    if (sheetName !== CONFIG.PIPELINE_TAB) return;
    if (e.range.getColumn() !== 10) return;
    if (e.range.getRow() <= 1) return;

    const newStage = String(e.value || '').toLowerCase().trim();
    const name = sheet.getRange(e.range.getRow(), 2).getValue();

    // Update Last Contact timestamp
    const now = Utilities.formatDate(new Date(), 'Australia/Sydney', 'yyyy-MM-dd HH:mm');
    sheet.getRange(e.range.getRow(), CONFIG.COL.LAST_CONTACT + 1).setValue(now);

    // If moved to "booked" — clear nurture fields
    if (newStage === 'booked') {
      sheet.getRange(e.range.getRow(), CONFIG.COL.NURTURE_STEP + 1).setValue('');
      sheet.getRange(e.range.getRow(), CONFIG.COL.NURTURE_NEXT + 1).setValue('');
    }

    // Toast feedback
    SpreadsheetApp.getActiveSpreadsheet().toast(
      name + ' → ' + newStage, 'Stage Updated', 3
    );
  } catch (err) {
    // Silent fail — onEdit must not throw
  }
}


/**
 * Run once — creates all time-driven triggers.
 * Deletes existing triggers first to prevent duplicates.
 */
function setupTriggers() {
  // Delete all existing triggers for this project
  const existing = ScriptApp.getProjectTriggers();
  existing.forEach(t => ScriptApp.deleteTrigger(t));
  Logger.log('Cleared ' + existing.length + ' existing triggers.');

  const tz = 'Australia/Sydney';

  // 7:30am — morning routine (import, score, refresh, dashboard)
  ScriptApp.newTrigger('morningRoutine_')
    .timeBased()
    .atHour(7)
    .nearMinute(30)
    .everyDays(1)
    .inTimezone(tz)
    .create();

  // 8am — daily digest email
  ScriptApp.newTrigger('sendDailyDigest')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone(tz)
    .create();

  // 9am — nurture sequence
  ScriptApp.newTrigger('runNurtureSequence')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone(tz)
    .create();

  // 9am — post-install check
  ScriptApp.newTrigger('runPostInstallCheck')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone(tz)
    .create();

  // 10am — follow-up engine
  ScriptApp.newTrigger('runFollowUpEngine')
    .timeBased()
    .atHour(10)
    .everyDays(1)
    .inTimezone(tz)
    .create();

  // 11am — cold outreach
  ScriptApp.newTrigger('runColdOutreach')
    .timeBased()
    .atHour(11)
    .everyDays(1)
    .inTimezone(tz)
    .create();

  Logger.log('✅ 6 triggers created (7:30am routine, 8am digest, 9am nurture+post-install, 10am follow-up, 11am cold outreach).');
}


/**
 * Morning routine — runs at 7:30am daily via trigger.
 * Ensures importLeads runs before refreshCallList (order matters).
 */
function morningRoutine_() {
  Logger.log('=== Morning Routine ===');
  importLeads();
  refreshCallList();
  updateDashboard();
  Logger.log('=== Morning Routine Complete ===');
}


// ═══════════════════════════════════════════════════════════════
// WEBHOOK HANDLER (doPost) — replaces S1 + S2 + S6
// ═══════════════════════════════════════════════════════════════

/**
 * Handles all inbound POST requests.
 * Routes by "action" field: demoLead, audit_lead, booking_confirmed, meta_ad, referral_lead
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    // Support both "action" field (new) and "event" field (BookingConfirmed page legacy)
    const action = data.action || data.type || data.event || 'unknown';
    const now = new Date();
    const timestamp = Utilities.formatDate(now, 'Australia/Sydney', 'yyyy-MM-dd HH:mm');

    Logger.log('Received webhook: action=' + action + ', name=' + (data.name || data.full_name || ''));

    const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
    const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);

    // Common fields
    const name = data.name || data.full_name || '';
    let phone = data.phone || data.phone_number || '';
    let email = data.email || '';
    const trade = data.trade || '';

    // UTM attribution
    const utmSource = data.utm_source || data.utmSource || '';
    const utmMedium = data.utm_medium || data.utmMedium || '';
    const utmCampaign = data.utm_campaign || data.utmCampaign || '';

    // Determine source and stage based on action
    let source = action;
    let stage = 'new';
    let notes = '';
    let nurtureStep = 0;
    let nurtureNextDate = Utilities.formatDate(now, 'Australia/Sydney', 'yyyy-MM-dd');

    switch (action) {
      case 'demoLead':
        source = 'test_drive';
        notes = 'Completed Test Drive on website';
        break;

      case 'audit_lead':
        source = 'audit';
        const annualHours = data.annualHoursWasted || 0;
        const annualCost = data.annualCostWasted || 0;
        notes = 'Audit: ' + annualHours + 'h/yr wasted, $' + annualCost + '/yr cost';
        // Send audit results email
        sendAuditEmail_(data, annualHours, annualCost);
        break;

      case 'booking_confirmed':
        source = 'booking';
        stage = 'booked';
        nurtureStep = '';
        nurtureNextDate = '';
        // Extract Calendly booking data if present
        const booking = data.booking || {};
        const eventTime = booking.event_start_time || '';
        notes = 'Fit Call booked via Calendly' + (eventTime ? ' | ' + eventTime : '');
        // BookingConfirmed page sends invitee_email inside booking object
        if (!email && booking.invitee_email) {
          email = booking.invitee_email;
        }
        if (!phone && booking.text_reminder_number) {
          phone = booking.text_reminder_number;
        }
        break;

      case 'meta_ad':
        source = 'meta_ad';
        notes = 'FB Lead Ad: ' + (data.ad_name || data.campaign_name || '');
        // Send welcome email for ad leads
        sendAdLeadWelcomeEmail_(name, email);
        // Log to Ad Tracker tab
        logAdTracker_(ss, data, timestamp);
        break;

      case 'referral_lead':
        source = 'referral';
        var refName = data.referrerName || data.referrer || '';
        var refEmail = data.referrerEmail || data.referrer_email || '';
        notes = 'Referred by: ' + refName;
        // Log referral
        logReferral_(ss, refName, refEmail, name, email);
        break;

      default:
        source = action || 'direct';
        notes = 'Source: ' + action;
    }

    // Check for duplicate (same email in last 24h)
    const isDuplicate = checkDuplicate_(pipeline, email, 24);
    if (isDuplicate && action !== 'booking_confirmed') {
      // Update existing row instead of adding new
      updateExistingLead_(pipeline, email, stage, notes, timestamp);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'updated',
        message: 'Existing lead updated'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Add new row to Pipeline
    const newRow = [
      timestamp,        // Date
      name,             // Name
      phone,            // Phone
      email,            // Email
      trade,            // Trade
      source,           // Source
      utmSource,        // UTM Source
      utmMedium,        // UTM Medium
      utmCampaign,      // UTM Campaign
      stage,            // Stage
      notes,            // Notes
      timestamp,        // Last Contact
      '',               // Next Action
      nurtureStep,      // Nurture Step
      nurtureNextDate,  // Nurture Next Date
    ];

    pipeline.appendRow(newRow);
    Logger.log('✅ Lead added: ' + name + ' (' + source + ')');

    // Instant notification to Sean
    try {
      GmailApp.sendEmail(CONFIG.OWNER_EMAIL,
        'New Lead: ' + name + ' (' + source + ')',
        'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email + '\nTrade: ' + trade + '\nSource: ' + source + '\nNotes: ' + notes + '\n\nOpen Pipeline: https://docs.google.com/spreadsheets/d/' + CONFIG.COMMAND_CENTER_ID + '/edit',
        { name: 'Flowio Engine' }
      );
    } catch (notifErr) {
      Logger.log('Notification email failed (non-critical): ' + notifErr.message);
    }

    // Also sync to CRM sheet's Form Responses if it exists
    syncToCRM_(data, source, timestamp);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Lead captured',
      action: action,
      name: name
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('❌ doPost error: ' + err.message);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Also handle GET requests (for testing / health check)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    engine: 'Flowio Marketing Engine v1.3',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}


// ═══════════════════════════════════════════════════════════════
// S2: AUDIT EMAIL
// ═══════════════════════════════════════════════════════════════

function sendAuditEmail_(data, annualHours, annualCost) {
  const name = data.name || 'there';
  const email = data.email;
  const trade = data.trade || 'tradie';
  const quotesPerWeek = data.quotesPerWeek || data.quotesperweek || 0;
  const minutesPerQuote = data.minutesPerQuote || data.minutesperquote || 0;
  const hourlyRate = data.hourlyRate || data.hourlyrate || 0;

  if (!email) return;

  const subject = name + ', you\'re losing $' + annualCost + '/year on quoting';

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0F172A; font-size: 24px; margin-bottom: 5px;">Trade<span style="color: #F97316;">Anchor</span></h1>
  </div>

  <h2 style="color: #0F172A; font-size: 22px;">Your Quoting Cost Audit</h2>

  <p style="color: #475569; font-size: 16px; line-height: 1.6;">G'day ${name},</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Based on what you told us, here's what your quoting process is actually costing you:</p>

  <div style="background: #FFF7ED; border: 2px solid #FED7AA; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
    <div style="font-size: 42px; font-weight: 900; color: #9A3412;">${annualHours} hours</div>
    <div style="color: #9A3412; font-size: 16px; font-weight: 600;">spent on quoting per year</div>
    <div style="margin-top: 15px; font-size: 42px; font-weight: 900; color: #9A3412;">$${annualCost}</div>
    <div style="color: #9A3412; font-size: 16px; font-weight: 600;">in lost productive time annually</div>
  </div>

  <div style="background: #F0F9FF; border: 2px solid #BAE6FD; border-radius: 12px; padding: 25px; margin: 25px 0;">
    <h3 style="color: #0F172A; margin-top: 0;">Here's the breakdown:</h3>
    <ul style="color: #475569; font-size: 15px; line-height: 2;">
      <li><strong>${quotesPerWeek} quotes/week</strong> × ${minutesPerQuote} mins each = ${quotesPerWeek * minutesPerQuote} mins/week on quoting</li>
      <li>That's <strong>${annualHours} hours/year</strong> of admin work</li>
      <li>At $${hourlyRate}/hour, that's <strong>$${annualCost}/year in lost billable time</strong></li>
    </ul>
  </div>

  <h3 style="color: #0F172A;">What if you could get that time back?</h3>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Flowio automates your entire quoting workflow inside Google Sheets. One tap to generate a professional PDF quote, send it via SMS, and track it automatically. No subscriptions. No learning curve.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${CONFIG.TEST_DRIVE_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">Try the Free Test Drive</a>
  </div>

  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Or if you'd like to chat about how Flowio could work for your ${trade} business:</p>

  <div style="text-align: center; margin: 20px 0;">
    <a href="${CONFIG.CALENDLY_URL}" style="display: inline-block; background: white; color: #0F172A; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; border: 2px solid #0F172A;">Book a 15-Min Fit Call</a>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8; font-size: 13px;">
    <p>Sean Kavan | TradeAnchor<br>Sydney, Australia</p>
  </div>
</div>`;

  GmailApp.sendEmail(email, subject, 'Your quoting audit results - view this email in HTML.', {
    htmlBody: html,
    name: CONFIG.SENDER_NAME,
  });

  Logger.log('✅ Audit email sent to: ' + email);
}


// ═══════════════════════════════════════════════════════════════
// S3: NURTURE SEQUENCE (Daily 9am AEST)
// ═══════════════════════════════════════════════════════════════

function runNurtureSequence() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const today = new Date();
  const todayStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd');
  const C = CONFIG.COL;

  let processed = 0;

  for (let i = 1; i < data.length; i++) { // skip header row
    const row = data[i];
    const stage = String(row[C.STAGE]).toLowerCase().trim();
    const nurtureStep = parseInt(row[C.NURTURE_STEP]) || 0;
    const nurtureNext = String(row[C.NURTURE_NEXT]).trim();
    const email = String(row[C.EMAIL]).trim();
    const name = String(row[C.NAME]).trim();
    const trade = String(row[C.TRADE]).trim();

    // Skip if no email, already booked/paid/installed/cold, or nurture complete
    if (!email || ['booked', 'paid', 'installed', 'cold', 'nurture_complete'].includes(stage)) continue;
    if (nurtureStep >= 4) continue;
    if (!nurtureNext) continue;

    // Check if today >= nurture next date
    if (nurtureNext > todayStr) continue;

    // Send appropriate nurture email
    const templates = getNurtureTemplates_(name, trade);
    const template = templates[nurtureStep];
    const sent = sendNurtureEmail_(name, email, trade, nurtureStep);

    if (sent) {
      const rowNum = i + 1; // 1-based
      const nextStep = nurtureStep + 1;
      const daysUntilNext = CONFIG.NURTURE_SCHEDULE[nextStep] || 0;
      const nextDate = new Date(today);
      nextDate.setDate(nextDate.getDate() + daysUntilNext);

      const nowStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd HH:mm');

      // Update row
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(nowStr);
      pipeline.getRange(rowNum, C.NURTURE_STEP + 1).setValue(nextStep);

      if (nextStep >= 4) {
        pipeline.getRange(rowNum, C.NURTURE_NEXT + 1).setValue('');
        pipeline.getRange(rowNum, C.STAGE + 1).setValue('nurture_complete');
      } else {
        const nextDateStr = Utilities.formatDate(nextDate, 'Australia/Sydney', 'yyyy-MM-dd');
        pipeline.getRange(rowNum, C.NURTURE_NEXT + 1).setValue(nextDateStr);
      }

      // Log to Nurture Status tab
      logNurtureStatus_(ss, name, email, nextStep, template ? template.subject : 'Step ' + nurtureStep);

      processed++;
      Logger.log('Nurture step ' + nurtureStep + ' sent to: ' + email);
    }

    // Throttle to avoid quota issues
    if (processed >= 20) {
      Logger.log('Reached batch limit of 20. Will continue tomorrow.');
      break;
    }
  }

  Logger.log('✅ Nurture sequence complete. Processed: ' + processed);
}


function sendNurtureEmail_(name, email, trade, step) {
  const templates = getNurtureTemplates_(name, trade);
  const template = templates[step];

  if (!template) return false;

  try {
    GmailApp.sendEmail(email, template.subject, template.plainText || '', {
      htmlBody: template.html,
      name: CONFIG.SENDER_NAME,
    });
    return true;
  } catch (err) {
    Logger.log('Email send error for ' + email + ': ' + err.message);
    return false;
  }
}


// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES (rewritten 20 Sept 2026 to the founder's rules)
// Rules: electricians only. Only claims allowed by 02_OFFER. No statistics, testimonials or case studies
// until a pilot supplies them. No scarcity, no trial, no competitor names. Price = $390 inc GST pilot with
// 30-day refund from install finish. Say what is not live. Every email identifies the sender and has an opt-out
// (Spam Act 2003). Cold outreach trigger stays OFF until Gate 1 (checklist rule).
// ═══════════════════════════════════════════════════════════════

function emailShell_(innerHtml) {
  return '<div style="font-family: \'Source Sans 3\', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #292524; font-size: 16px; line-height: 1.65;">' +
    innerHtml +
    emailFooter_() +
    '</div>';
}

function emailFooter_() {
  return '<p style="font-size: 13px; color: #57534E; margin-top: 28px; border-top: 1px solid #E4DCCF; padding-top: 12px;">' +
    CONFIG.SENDER_NAME + ' · TradeAnchor · ABN 45 529 331 663 · Sydney NSW<br>' +
    'Not for you? Reply "no" and I won\'t email you again.</p>';
}

function emailButton_(href, label) {
  return '<a href="' + href + '" style="display: inline-block; background: #B4501A; color: #FFFFFF; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 700;">' + label + '</a>';
}

/**
 * Nurture for ENGAGED leads only (ran a Test Drive, requested an audit or booked a call).
 * 4 steps, spacing from CONFIG.NURTURE_SCHEDULE.
 */
function getNurtureTemplates_(name, trade) {
  const firstName = (name || '').split(' ')[0] || 'there';

  return [
    // Step 0: thanks + the closing question
    {
      subject: firstName + ', thanks for trying the demo',
      html: emailShell_(
        '<p>G\'day ' + firstName + ',</p>' +
        '<p>Thanks for trying the Flowio demo. One question, and just hit reply: how many quotes did you send last month, and how many turned into jobs?</p>' +
        '<p>That number tells me whether this is worth your time or not. If it isn\'t, I\'ll say so.</p>' +
        '<p>' + emailButton_(CONFIG.CALENDLY_URL, 'Book a 15-minute call') + '</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    },

    // Step 1: what it is and what it isn't
    {
      subject: 'What Flowio does, and what it doesn\'t yet',
      html: emailShell_(
        '<p>G\'day ' + firstName + ',</p>' +
        '<p>Here\'s the plain version. Flowio sets up your own Google Sheet so one tap sends a branded PDF quote to your customer by SMS and email with an accept link. Your customer accepts on their phone and asks for a time. You confirm it, and it goes in your Google Calendar.</p>' +
        '<p>What it doesn\'t do yet: deposits, automatic rescheduling, or quoting from your phone. And the quoting engine runs on code I host, so you can\'t rebuild it yourself. Your Sheet, prices and history stay yours.</p>' +
        '<p>' + emailButton_(CONFIG.TEST_DRIVE_URL, 'See your customer\'s side again') + '</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    },

    // Step 2: the pilot in plain terms
    {
      subject: 'The pilot, in plain terms',
      html: emailShell_(
        '<p>G\'day ' + firstName + ',</p>' +
        '<p>I\'m setting Flowio up for a small number of electricians as a pilot. It\'s $390 including GST, one-off, and I do the setup for you.</p>' +
        '<p>You get 30 days from the day your install is finished to ask for your money back, no reason needed. In return I ask for your quoting numbers before and after, one 20-minute chat, and your OK to share the results (named or anonymous).</p>' +
        '<p>' + emailButton_(CONFIG.CALENDLY_URL, 'Book a 15-minute call') + '</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    },

    // Step 3: last note
    {
      subject: 'Last note from me, ' + firstName,
      html: emailShell_(
        '<p>G\'day ' + firstName + ',</p>' +
        '<p>Last note from me. If quoting isn\'t a headache right now, no problem at all.</p>' +
        '<p>If it is, the demo takes about a minute: <a href="' + CONFIG.TEST_DRIVE_URL + '" style="color: #B4501A; font-weight: 700;">try it</a>, or <a href="' + CONFIG.CALENDLY_URL + '" style="color: #1C1917; font-weight: 700;">book a call</a>.</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    }
  ];
}


/**
 * Log/update a lead's nurture status in the Nurture Status tab.
 * Creates a new row if the lead doesn't exist, updates if they do.
 */
function logNurtureStatus_(ss, name, email, step, subject) {
  const tab = ss.getSheetByName(CONFIG.NURTURE_TAB);
  if (!tab) return;

  const data = tab.getDataRange().getValues();
  const now = Utilities.formatDate(new Date(), 'Australia/Sydney', 'yyyy-MM-dd');
  const status = (step >= 4) ? 'completed' : 'active';
  const nextDate = (step >= 4) ? '' : Utilities.formatDate(
    new Date(new Date().getTime() + (CONFIG.NURTURE_SCHEDULE[step] || 0) * 86400000),
    'Australia/Sydney', 'yyyy-MM-dd'
  );

  // Check if lead already has a row (match by email)
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase().trim() === email.toLowerCase().trim()) {
      const row = i + 1;
      tab.getRange(row, 3).setValue(step);        // Current Step
      tab.getRange(row, 4).setValue(nextDate);     // Next Send Date
      tab.getRange(row, 5).setValue(subject);      // Last Email Subject
      tab.getRange(row, 6).setValue(status);       // Status
      return;
    }
  }

  // New row
  tab.appendRow([name, email, step, nextDate, subject, status]);
}


// ═══════════════════════════════════════════════════════════════
// FOLLOW-UP ENGINE (Daily 10am AEST)
// ═══════════════════════════════════════════════════════════════

function runFollowUpEngine() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const today = new Date();
  const C = CONFIG.COL;

  let processed = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const stage = String(row[C.STAGE]).toLowerCase().trim();
    const email = String(row[C.EMAIL]).trim();
    const name = String(row[C.NAME]).trim();
    const phone = String(row[C.PHONE]).trim();
    const trade = String(row[C.TRADE]).trim();
    const nextAction = String(row[C.NEXT_ACTION]).trim();
    const lastContactStr = String(row[C.LAST_CONTACT]).trim();

    // Only process nurture_complete leads
    if (stage !== 'nurture_complete') continue;
    if (!email) continue;

    // Parse last contact date
    const lastContact = new Date(lastContactStr);
    if (isNaN(lastContact.getTime())) continue;

    const daysSinceContact = Math.floor((today - lastContact) / (1000 * 60 * 60 * 24));
    const rowNum = i + 1;
    const nowStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd HH:mm');

    // Stage 1: >2 days, no SMS sent yet → send SMS
    if (daysSinceContact >= 2 && nextAction !== 'sms_sent' && nextAction !== 'final_email_sent') {
      if (phone && isSmsEnabled_()) {
        sendSms_(phone, 'Hey ' + name.split(' ')[0] + ', Sean from TradeAnchor here. Saw you checked out Flowio - want to see how it works for ' + (trade || 'your trade') + '? ' + CONFIG.TEST_DRIVE_URL);
      }
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(nowStr);
      pipeline.getRange(rowNum, C.NEXT_ACTION + 1).setValue('sms_sent');
      processed++;
    }

    // Stage 2: >5 days, SMS already sent → send final email, mark cold
    else if (daysSinceContact >= 5 && nextAction === 'sms_sent') {
      sendFollowUpEmail_(name, email, trade);
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(nowStr);
      pipeline.getRange(rowNum, C.NEXT_ACTION + 1).setValue('final_email_sent');
      pipeline.getRange(rowNum, C.STAGE + 1).setValue('cold');
      processed++;
    }

    if (processed >= 15) break;
  }

  Logger.log('✅ Follow-up engine complete. Processed: ' + processed);
}


function sendFollowUpEmail_(name, email, trade) {
  const firstName = (name || '').split(' ')[0] || 'there';

  const subject = firstName + ', any questions about Flowio?';
  const html = emailShell_(
    '<p>G\'day ' + firstName + ',</p>' +
    '<p>Checking in in case you had questions about Flowio after the demo. Happy to answer them by email, or on a 15-minute call.</p>' +
    '<p>' + emailButton_(CONFIG.CALENDLY_URL, 'Book a 15-minute call') + '</p>' +
    '<p>' + CONFIG.SENDER_NAME + '</p>'
  );

  try {
    GmailApp.sendEmail(email, subject, '', { htmlBody: html, name: CONFIG.SENDER_NAME });
  } catch (err) {
    Logger.log('Follow-up email error: ' + err.message);
  }
}


// ═══════════════════════════════════════════════════════════════
// S5: POST-INSTALL CHECK (Daily 9am AEST)
// ═══════════════════════════════════════════════════════════════

function runPostInstallCheck() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const today = new Date();
  const C = CONFIG.COL;

  let processed = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const stage = String(row[C.STAGE]).toLowerCase().trim();
    const email = String(row[C.EMAIL]).trim();
    const name = String(row[C.NAME]).trim();
    const trade = String(row[C.TRADE]).trim();
    const nextAction = String(row[C.NEXT_ACTION]).trim();
    const lastContactStr = String(row[C.LAST_CONTACT]).trim();

    // Only process installed leads
    if (stage !== 'installed') continue;
    if (!email) continue;

    const lastContact = new Date(lastContactStr);
    if (isNaN(lastContact.getTime())) continue;

    const daysSinceContact = Math.floor((today - lastContact) / (1000 * 60 * 60 * 24));
    const rowNum = i + 1;
    const nowStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd HH:mm');

    // Day 7 check-in (not yet sent)
    if (daysSinceContact >= 7 && nextAction !== 'day7_sent' && nextAction !== 'day14_sent') {
      sendDay7Email_(name, email);
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(nowStr);
      pipeline.getRange(rowNum, C.NEXT_ACTION + 1).setValue('day7_sent');
      processed++;
    }

    // Day 14 review + referral (day7 already sent)
    else if (daysSinceContact >= 7 && nextAction === 'day7_sent') {
      sendDay14Email_(name, email);
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(nowStr);
      pipeline.getRange(rowNum, C.NEXT_ACTION + 1).setValue('day14_sent');
      processed++;
    }

    if (processed >= 10) break;
  }

  Logger.log('✅ Post-install check complete. Processed: ' + processed);
}


function sendDay7Email_(name, email) {
  const firstName = name.split(' ')[0] || 'there';
  const subject = 'How\'s Flowio going, ' + firstName + '?';
  const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
    <p>G'day ${firstName},</p>
    <p>It's been about a week since we set up Flowio for you. How's it going?</p>
    <p>Quick questions:</p>
    <ul>
      <li>Have you sent your first few quotes?</li>
      <li>Anything confusing or not working as expected?</li>
      <li>Any features you wish it had?</li>
    </ul>
    <p>Happy to jump on a quick call if anything needs tweaking. Just reply to this email or <a href="${CONFIG.WHATSAPP_URL}">WhatsApp me</a>.</p>
    <p>Cheers,<br>Sean</p>
  </div>`;

  GmailApp.sendEmail(email, subject, '', { htmlBody: html, name: CONFIG.SENDER_NAME });
}


function sendDay14Email_(name, email) {
  const firstName = name.split(' ')[0] || 'there';
  const subject = 'Quick favour, ' + firstName + '? (+ $200 for you)';
  const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
    <p>G'day ${firstName},</p>
    <p>Hope Flowio's been saving you time!</p>
    <p>I've got two quick asks (both benefit you):</p>

    <h3 style="color: #0F172A;">1. Quick Video Testimonial (60 sec)</h3>
    <p>Would you be open to recording a 60-second selfie video about your experience? Just your phone, casual, no script. Something like:</p>
    <ul>
      <li>What you do and where you're based</li>
      <li>What quoting was like before</li>
      <li>How Flowio has helped</li>
    </ul>

    <h3 style="color: #0F172A;">2. Refer a Mate = $200 Each</h3>
    <p>Know another tradie who's drowning in paperwork? If they sign up for Flowio, you BOTH get $200 off (or $200 cash if you've already paid in full).</p>
    <p>Just have them mention your name when they book:</p>
    <p><a href="${CONFIG.CALENDLY_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Referral Booking Link</a></p>

    <p>Cheers,<br>Sean</p>
  </div>`;

  GmailApp.sendEmail(email, subject, '', { htmlBody: html, name: CONFIG.SENDER_NAME });
}


// ═══════════════════════════════════════════════════════════════
// S7: DAILY DIGEST (Daily 8am AEST)
// ═══════════════════════════════════════════════════════════════

function sendDailyDigest() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const today = new Date();
  const todayStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd');
  const C = CONFIG.COL;

  // Calculate stats
  const stats = {
    total: data.length - 1,
    new: 0,
    engaged: 0,
    booked: 0,
    paid: 0,
    installed: 0,
    cold: 0,
    nurture_complete: 0,
    todayLeads: 0,
    weekLeads: 0,
    pendingNurture: 0,
  };

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = Utilities.formatDate(weekAgo, 'Australia/Sydney', 'yyyy-MM-dd');

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const stage = String(row[C.STAGE]).toLowerCase().trim();
    const dateStr = String(row[C.DATE]).substring(0, 10);
    const nurtureNext = String(row[C.NURTURE_NEXT]).trim();

    // Count by stage
    if (stats.hasOwnProperty(stage)) stats[stage]++;

    // Today's leads
    if (dateStr === todayStr) stats.todayLeads++;

    // This week's leads
    if (dateStr >= weekAgoStr) stats.weekLeads++;

    // Pending nurture
    if (nurtureNext && nurtureNext <= todayStr && !['booked', 'paid', 'installed', 'cold'].includes(stage)) {
      stats.pendingNurture++;
    }
  }

  const dateFormatted = Utilities.formatDate(today, 'Australia/Sydney', 'EEEE, dd MMMM yyyy');
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/' + CONFIG.COMMAND_CENTER_ID + '/edit';

  const subject = 'Flowio Daily Digest - ' + Utilities.formatDate(today, 'Australia/Sydney', 'dd MMM yyyy');

  const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #0F172A; font-size: 22px; margin-bottom: 5px;">Trade<span style="color: #F97316;">Anchor</span> Daily Digest</h1>
    <p style="color: #64748B; margin-top: 0;">${dateFormatted}</p>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0F172A; font-size: 18px;">Pipeline Overview</h3>
      <table style="width: 100%; font-size: 15px; color: #475569; border-collapse: collapse;">
        <tr><td style="padding: 6px 0;">Total leads</td><td style="text-align: right; font-weight: 700;">${stats.total}</td></tr>
        <tr><td style="padding: 6px 0;">🆕 New</td><td style="text-align: right; font-weight: 700;">${stats.new}</td></tr>
        <tr><td style="padding: 6px 0;">🔥 Nurture in progress</td><td style="text-align: right; font-weight: 700;">${stats.nurture_complete}</td></tr>
        <tr><td style="padding: 6px 0;">📅 Booked</td><td style="text-align: right; font-weight: 700;">${stats.booked}</td></tr>
        <tr><td style="padding: 6px 0;">💰 Paid</td><td style="text-align: right; font-weight: 700;">${stats.paid}</td></tr>
        <tr><td style="padding: 6px 0;">✅ Installed</td><td style="text-align: right; font-weight: 700;">${stats.installed}</td></tr>
        <tr><td style="padding: 6px 0;">❄️ Cold</td><td style="text-align: right; font-weight: 700;">${stats.cold}</td></tr>
      </table>
    </div>

    <div style="display: flex; gap: 12px; margin: 20px 0;">
      <div style="flex: 1; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 15px; text-align: center;">
        <div style="font-size: 28px; font-weight: 900; color: #166534;">${stats.todayLeads}</div>
        <div style="font-size: 13px; color: #166534;">Leads today</div>
      </div>
      <div style="flex: 1; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 15px; text-align: center;">
        <div style="font-size: 28px; font-weight: 900; color: #1E40AF;">${stats.weekLeads}</div>
        <div style="font-size: 13px; color: #1E40AF;">Leads this week</div>
      </div>
      <div style="flex: 1; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 12px; padding: 15px; text-align: center;">
        <div style="font-size: 28px; font-weight: 900; color: #9A3412;">${stats.pendingNurture}</div>
        <div style="font-size: 13px; color: #9A3412;">Nurture due</div>
      </div>
    </div>

    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #166534;">Today's Actions</h3>
      <ul style="color: #475569; margin: 0; padding-left: 20px;">
        <li>Check Pipeline tab for new leads</li>
        <li>Send 20-30 DMs on Instagram/Facebook</li>
        <li>Post 1 piece of content</li>
        <li>Follow up on any booked calls</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${sheetUrl}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Open Command Center</a>
    </div>
  </div>`;

  GmailApp.sendEmail(CONFIG.OWNER_EMAIL, subject, '', { htmlBody: html, name: 'Flowio Engine' });
  Logger.log('✅ Daily digest sent.');

  // Also update Dashboard tab with live stats
  try {
    updateDashboard();
  } catch (err) {
    Logger.log('Dashboard update error (non-critical): ' + err.message);
  }
}


// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Check for duplicate email in pipeline (within last N hours)
 */
function checkDuplicate_(pipeline, email, hoursWindow) {
  if (!email) return false;
  const data = pipeline.getDataRange().getValues();
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hoursWindow);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][CONFIG.COL.EMAIL]).toLowerCase().trim() === email.toLowerCase().trim()) {
      const rowDate = new Date(data[i][CONFIG.COL.DATE]);
      if (rowDate >= cutoff) return true;
    }
  }
  return false;
}


/**
 * Update an existing lead row (e.g. when they take a new action)
 */
function updateExistingLead_(pipeline, email, newStage, newNotes, timestamp) {
  const data = pipeline.getDataRange().getValues();
  const C = CONFIG.COL;

  for (let i = data.length - 1; i >= 1; i--) { // search from bottom (most recent)
    if (String(data[i][C.EMAIL]).toLowerCase().trim() === email.toLowerCase().trim()) {
      const rowNum = i + 1;
      const currentStage = String(data[i][C.STAGE]).toLowerCase().trim();

      // Only upgrade stage, never downgrade
      const stageOrder = ['new', 'engaged', 'nurture_complete', 'booked', 'paid', 'installed'];
      const currentIdx = stageOrder.indexOf(currentStage);
      const newIdx = stageOrder.indexOf(newStage);

      if (newIdx > currentIdx) {
        pipeline.getRange(rowNum, C.STAGE + 1).setValue(newStage);
      }

      // Append notes
      const existingNotes = String(data[i][C.NOTES]);
      if (newNotes && !existingNotes.includes(newNotes)) {
        pipeline.getRange(rowNum, C.NOTES + 1).setValue(existingNotes + ' | ' + newNotes);
      }

      // Update last contact
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(timestamp);

      // If booking, clear nurture
      if (newStage === 'booked') {
        pipeline.getRange(rowNum, C.NURTURE_NEXT + 1).setValue('');
        pipeline.getRange(rowNum, C.NURTURE_STEP + 1).setValue('');
      }

      Logger.log('Updated existing lead: ' + email + ' → ' + newStage);
      return;
    }
  }
}


/**
 * Sync lead to CRM sheet — Leads tab
 * Headers: timestamp, source, source_detail, personId, requestId, name, Trade, phone, email,
 *          itemsJSON, total, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
 *          fbclid, gclid, msclkid, wbraid, gbraid, ad_id, adset_id, campaign_id, landing_url, referrer
 */
function syncToCRM_(data, source, timestamp) {
  try {
    const crm = SpreadsheetApp.openById(CONFIG.CRM_SHEET_ID);
    const leadsTab = crm.getSheetByName('Leads');
    if (!leadsTab) {
      Logger.log('CRM sync skipped — "Leads" tab not found.');
      return;
    }

    // Match exact CRM Leads tab column order (26 columns A-Z)
    leadsTab.appendRow([
      timestamp,                                          // A: timestamp
      source,                                             // B: source
      'Marketing Engine',                                 // C: source_detail
      '',                                                 // D: personId
      '',                                                 // E: requestId
      data.name || data.full_name || '',                  // F: name
      data.trade || '',                                   // G: Trade
      data.phone || data.phone_number || '',              // H: phone
      data.email || '',                                   // I: email
      '',                                                 // J: itemsJSON
      '',                                                 // K: total
      data.utm_source || data.utmSource || '',            // L: utm_source
      data.utm_medium || data.utmMedium || '',            // M: utm_medium
      data.utm_campaign || data.utmCampaign || '',        // N: utm_campaign
      data.utm_content || '',                             // O: utm_content
      data.utm_term || '',                                // P: utm_term
      data.fbclid || '',                                  // Q: fbclid
      data.gclid || '',                                   // R: gclid
      data.msclkid || '',                                 // S: msclkid
      data.wbraid || '',                                  // T: wbraid
      data.gbraid || '',                                  // U: gbraid
      data.ad_id || '',                                   // V: ad_id
      data.adset_id || '',                                // W: adset_id
      data.campaign_id || '',                             // X: campaign_id
      data.landing_url || '',                             // Y: landing_url
      data.referrer || data.referredBy || '',             // Z: referrer
    ]);
    Logger.log('Synced to CRM: ' + (data.email || ''));
  } catch (err) {
    Logger.log('CRM sync skipped: ' + err.message);
  }
}


/**
 * Log referral to Referrals tab
 */
function logReferral_(ss, referrerName, referrerEmail, leadName, leadEmail) {
  const referrals = ss.getSheetByName(CONFIG.REFERRALS_TAB);
  if (!referrals) return;

  const today = Utilities.formatDate(new Date(), 'Australia/Sydney', 'yyyy-MM-dd');
  referrals.appendRow([referrerName, referrerEmail, leadName, leadEmail, today, 'pending', '$200', 'No']);
}


/**
 * Send welcome email for Meta ad leads
 */
function sendAdLeadWelcomeEmail_(name, email) {
  if (!email) return;
  const firstName = (name || 'there').split(' ')[0];

  const subject = "G'day " + firstName + ", here's what you asked about";
  const html = emailShell_(
    '<p>G\'day ' + firstName + ',</p>' +
    '<p>Thanks for your interest in Flowio. It sets up your own Google Sheet so one tap sends a branded PDF quote to your customer by SMS and email, with an accept link. Your customer accepts on their phone and asks for a time; you confirm it and it goes in your calendar.</p>' +
    '<p>Not live yet: deposits, automatic rescheduling, and quoting from your phone.</p>' +
    '<p>' + emailButton_(CONFIG.TEST_DRIVE_URL, 'Try the demo (about a minute)') + '</p>' +
    '<p>Or if you\'d rather talk: <a href="' + CONFIG.CALENDLY_URL + '" style="color: #1C1917; font-weight: 700;">book a 15-minute call</a>.</p>' +
    '<p>' + CONFIG.SENDER_NAME + '</p>'
  );

  try {
    GmailApp.sendEmail(email, subject, '', { htmlBody: html, name: CONFIG.SENDER_NAME });
  } catch (err) {
    Logger.log('Ad welcome email error: ' + err.message);
  }
}


// ═══════════════════════════════════════════════════════════════
// SMS via ClickSend API
// ═══════════════════════════════════════════════════════════════

function isSmsEnabled_() {
  const settings = getSettings_();
  return settings['SMS Enabled'] === 'true' && settings['ClickSend Username'] && settings['ClickSend API Key'];
}

function getSettings_() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const settings = ss.getSheetByName(CONFIG.SETTINGS_TAB);
  if (!settings) return {};

  const data = settings.getDataRange().getValues();
  const obj = {};
  for (let i = 1; i < data.length; i++) {
    obj[String(data[i][0]).trim()] = String(data[i][1]).trim();
  }
  return obj;
}

function sendSms_(to, message) {
  const settings = getSettings_();
  const username = settings['ClickSend Username'];
  const apiKey = settings['ClickSend API Key'];

  if (!username || !apiKey) {
    Logger.log('SMS skipped — ClickSend credentials not configured in Settings tab.');
    return false;
  }

  // Normalize AU phone number
  let phone = String(to).replace(/\s/g, '');
  if (phone.startsWith('0')) phone = '+61' + phone.substring(1);
  if (!phone.startsWith('+')) phone = '+' + phone;

  const payload = {
    messages: [{
      from: 'TradeAnchor',
      to: phone,
      body: message,
      source: 'apps-script'
    }]
  };

  try {
    const response = UrlFetchApp.fetch('https://rest.clicksend.com/v3/sms/send', {
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + apiKey),
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    if (code === 200) {
      Logger.log('✅ SMS sent to: ' + phone);
      return true;
    } else {
      Logger.log('SMS error (' + code + '): ' + response.getContentText());
      return false;
    }
  } catch (err) {
    Logger.log('SMS exception: ' + err.message);
    return false;
  }
}


// ═══════════════════════════════════════════════════════════════
// OUTBOUND ENGINE: Lead Import + Scoring + Call List + Cold Email
// ═══════════════════════════════════════════════════════════════

// --- New tab names ---
const RAW_LEADS_TAB = 'Raw Leads';
const CALL_LIST_TAB = 'Call List';

// --- Column indices for Raw Leads tab (0-based) ---
const RAW_COL = {
  NAME: 0,      // A
  PHONE: 1,     // B
  EMAIL: 2,     // C
  TRADE: 3,     // D
  CITY: 4,      // E
  REVIEWS: 5,   // F
  WEBSITE: 6,   // G
  IMPORTED: 7,  // H — "yes" once imported
};

const RAW_LEADS_HEADERS = ['Name', 'Phone', 'Email', 'Trade', 'City', 'Reviews', 'Website', 'Imported'];
const CALL_LIST_HEADERS = ['Name', 'Phone', 'Trade', 'City', 'Reviews', 'Lead Score', 'Email', 'Last Email Status', 'Call Notes', 'Call Result'];

// Target trades for scoring boost
const TARGET_TRADES = ['electrician', 'plumber', 'painter', 'carpenter', 'builder', 'roofer', 'concreter', 'landscaper', 'tiler', 'hvac', 'air con'];


/**
 * Import leads from "Raw Leads" tab into Pipeline.
 * Deduplicates by email. Marks imported rows so they aren't re-processed.
 * Run manually or via trigger after pasting scraped leads.
 */
function importLeads() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const rawSheet = ss.getSheetByName(RAW_LEADS_TAB);
  if (!rawSheet) {
    Logger.log('❌ "Raw Leads" tab not found. Run setupSheet() first.');
    return;
  }

  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const rawData = rawSheet.getDataRange().getValues();
  const pipelineData = pipeline.getDataRange().getValues();
  const now = new Date();
  const timestamp = Utilities.formatDate(now, 'Australia/Sydney', 'yyyy-MM-dd HH:mm');
  const todayStr = Utilities.formatDate(now, 'Australia/Sydney', 'yyyy-MM-dd');

  // Build existing emails set from Pipeline for dedup
  const existingEmails = new Set();
  for (let i = 1; i < pipelineData.length; i++) {
    const em = String(pipelineData[i][CONFIG.COL.EMAIL]).toLowerCase().trim();
    if (em) existingEmails.add(em);
  }

  let imported = 0;
  let skipped = 0;

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    const alreadyImported = String(row[RAW_COL.IMPORTED]).toLowerCase().trim();
    if (alreadyImported === 'yes') continue;

    const name = String(row[RAW_COL.NAME]).trim();
    const phone = String(row[RAW_COL.PHONE]).trim();
    const email = String(row[RAW_COL.EMAIL]).toLowerCase().trim();
    const trade = String(row[RAW_COL.TRADE]).trim();
    const city = String(row[RAW_COL.CITY]).trim();
    const reviews = parseInt(row[RAW_COL.REVIEWS]) || 0;
    const website = String(row[RAW_COL.WEBSITE]).trim();

    // Must have at least a name and (email or phone)
    if (!name || (!email && !phone)) {
      skipped++;
      continue;
    }

    // Dedup by email
    if (email && existingEmails.has(email)) {
      rawSheet.getRange(i + 1, RAW_COL.IMPORTED + 1).setValue('duplicate');
      skipped++;
      continue;
    }

    // Build notes
    const notes = 'Outbound scrape | ' + city + ' | ' + reviews + ' reviews' + (website ? ' | ' + website : '');

    // Add to Pipeline
    const newRow = [
      timestamp,            // Date
      name,                 // Name
      phone,                // Phone
      email,                // Email
      trade,                // Trade
      'outbound_scrape',    // Source
      '',                   // UTM Source
      '',                   // UTM Medium
      '',                   // UTM Campaign
      'new',                // Stage
      notes,                // Notes
      '',                   // Last Contact
      '',                   // Next Action
      0,                    // Nurture Step
      todayStr,             // Nurture Next Date
    ];
    pipeline.appendRow(newRow);

    // Mark as imported
    rawSheet.getRange(i + 1, RAW_COL.IMPORTED + 1).setValue('yes');
    if (email) existingEmails.add(email);
    imported++;
  }

  Logger.log('✅ Import complete. Imported: ' + imported + ', Skipped: ' + skipped);
}


/**
 * Score all Pipeline leads. Adds/updates Lead Score column (P).
 * Scoring:
 *   +3 has phone, +2 has email, +1 has website (in notes)
 *   +3 reviews 20-80, +1 reviews 80+, +2 target trade
 *   +1 source = test_drive or audit (warm), +2 source = booking
 */
function scoreLeads_() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const C = CONFIG.COL;

  // Ensure "Lead Score" header exists in column P (index 15)
  const SCORE_COL = 15; // 0-based = column P
  if (data.length > 0 && String(data[0][SCORE_COL]).trim() !== 'Lead Score') {
    pipeline.getRange(1, SCORE_COL + 1).setValue('Lead Score');
    pipeline.getRange(1, SCORE_COL + 1).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
  }

  const scores = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let score = 0;

    const phone = String(row[C.PHONE]).trim();
    const email = String(row[C.EMAIL]).trim();
    const trade = String(row[C.TRADE]).toLowerCase().trim();
    const source = String(row[C.SOURCE]).toLowerCase().trim();
    const notes = String(row[C.NOTES]).toLowerCase();

    // Contact info
    if (phone) score += 3;
    if (email) score += 2;
    if (notes.includes('http') || notes.includes('www') || notes.includes('.com')) score += 1;

    // Reviews (extracted from notes: "X reviews")
    const reviewMatch = notes.match(/(\d+)\s*review/);
    if (reviewMatch) {
      const reviewCount = parseInt(reviewMatch[1]);
      if (reviewCount >= 20 && reviewCount < 80) score += 3;
      else if (reviewCount >= 80) score += 1; // Big operations less likely to switch
    }

    // Target trade
    if (TARGET_TRADES.some(t => trade.includes(t))) score += 2;

    // Warm source bonus
    if (['test_drive', 'audit'].includes(source)) score += 1;
    if (source === 'booking') score += 2;

    scores.push([score]);
  }

  if (scores.length > 0) {
    pipeline.getRange(2, SCORE_COL + 1, scores.length, 1).setValues(scores);
  }

  Logger.log('✅ Lead scoring complete. Scored ' + scores.length + ' leads.');
}


/**
 * Generate/refresh the "Call List" tab — sorted by lead score desc.
 * Only includes leads with a phone number and active stages.
 */
function refreshCallList() {
  // Save any call results before clearing
  syncCallResultToPipeline_();

  // Score first
  scoreLeads_();

  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const C = CONFIG.COL;
  const SCORE_COL = 15;

  let callList = ss.getSheetByName(CALL_LIST_TAB);
  if (!callList) {
    Logger.log('❌ "Call List" tab not found. Run setupOutboundTabs() first.');
    return;
  }

  // Clear existing data (keep headers)
  const lastRow = callList.getLastRow();
  if (lastRow > 1) {
    callList.getRange(2, 1, lastRow - 1, CALL_LIST_HEADERS.length).clearContent();
  }

  // Collect eligible leads
  const leads = [];
  const activeStages = ['new', 'engaged', 'nurture_complete', 'email_sent'];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const phone = String(row[C.PHONE]).trim();
    const stage = String(row[C.STAGE]).toLowerCase().trim();
    const email = String(row[C.EMAIL]).trim();

    if (!phone) continue;
    if (!activeStages.includes(stage)) continue;

    const name = String(row[C.NAME]).trim();
    const trade = String(row[C.TRADE]).trim();
    const notes = String(row[C.NOTES]);
    const score = parseInt(row[SCORE_COL]) || 0;

    // Extract city from notes (format: "Outbound scrape | City | X reviews")
    let city = '';
    const cityMatch = notes.match(/\|\s*([^|]+?)\s*\|/);
    if (cityMatch) city = cityMatch[1].trim();

    // Extract reviews
    let reviews = '';
    const revMatch = notes.match(/(\d+)\s*review/);
    if (revMatch) reviews = revMatch[1];

    // Get last email status from Next Action column
    const lastEmailStatus = String(row[C.NEXT_ACTION]).trim();

    leads.push([name, phone, trade, city, reviews, score, email, lastEmailStatus, '', '']);
  }

  // Sort by score descending
  leads.sort((a, b) => b[5] - a[5]);

  // Write to Call List
  if (leads.length > 0) {
    callList.getRange(2, 1, leads.length, CALL_LIST_HEADERS.length).setValues(leads);
  }

  Logger.log('✅ Call List refreshed. ' + leads.length + ' leads ready for calling.');
}


/**
 * Sync call notes and results from Call List back to Pipeline.
 * Matches leads by Name + Phone. Updates Pipeline stage based on call result.
 * Run automatically before refreshCallList() clears data, or manually from menu.
 */
function syncCallResultToPipeline_() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const callSheet = ss.getSheetByName(CALL_LIST_TAB);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  if (!callSheet || !pipeline) return;

  const callData = callSheet.getDataRange().getValues();
  const pipeData = pipeline.getDataRange().getValues();
  const C = CONFIG.COL;
  const now = Utilities.formatDate(new Date(), 'Australia/Sydney', 'yyyy-MM-dd HH:mm');

  // Build lookup: "name|phone" → pipeline row index (1-based)
  const pipeMap = {};
  for (let i = 1; i < pipeData.length; i++) {
    const key = String(pipeData[i][C.NAME]).trim().toLowerCase() + '|' + String(pipeData[i][C.PHONE]).trim();
    pipeMap[key] = i + 1;
  }

  let synced = 0;
  // Call List columns: Name(0), Phone(1), Trade(2), City(3), Reviews(4), Lead Score(5), Email(6), Last Email Status(7), Call Notes(8), Call Result(9)
  for (let i = 1; i < callData.length; i++) {
    const callNotes = String(callData[i][8]).trim();
    const callResult = String(callData[i][9]).trim().toLowerCase();
    if (!callNotes && !callResult) continue;

    const key = String(callData[i][0]).trim().toLowerCase() + '|' + String(callData[i][1]).trim();
    const pipeRow = pipeMap[key];
    if (!pipeRow) continue;

    // Append call notes to Pipeline Notes column
    if (callNotes) {
      const existing = String(pipeData[pipeRow - 1][C.NOTES]);
      if (!existing.includes(callNotes)) {
        pipeline.getRange(pipeRow, C.NOTES + 1).setValue(existing + ' | Call: ' + callNotes);
      }
    }

    // Update stage based on call result
    if (callResult === 'booked') {
      pipeline.getRange(pipeRow, C.STAGE + 1).setValue('booked');
      pipeline.getRange(pipeRow, C.NURTURE_STEP + 1).setValue('');
      pipeline.getRange(pipeRow, C.NURTURE_NEXT + 1).setValue('');
    } else if (callResult === 'not interested') {
      pipeline.getRange(pipeRow, C.STAGE + 1).setValue('cold');
    } else if (callResult === 'follow up') {
      pipeline.getRange(pipeRow, C.STAGE + 1).setValue('engaged');
    }

    // Update last contact
    pipeline.getRange(pipeRow, C.LAST_CONTACT + 1).setValue(now);
    synced++;
  }

  Logger.log('✅ Synced ' + synced + ' call results to Pipeline.');
}


/**
 * Cold outreach email templates — shorter, colder than warm nurture.
 * 3-email sequence: Day 0, Day 3, Day 6
 */
function getColdOutreachTemplates_(name, trade, city) {
  const firstName = (name || 'there').split(' ')[0];
  const cityLabel = city || 'your area';

  return [
    // Cold step 0: short, one question, demo link (no pitch, no price)
    {
      subject: firstName + ', quick question about your quoting',
      html: emailShell_(
        '<p>G\'day ' + firstName + ',</p>' +
        '<p>I make quoting easier for electricians in ' + cityLabel + ' who quote from a Google Sheet. Here\'s what your customer would get from you, in about a minute: <a href="' + CONFIG.TEST_DRIVE_URL + '" style="color: #B4501A; font-weight: 700;">try the demo</a>.</p>' +
        '<p>How many quotes did you send last month, and how many turned into jobs?</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    },

    // Cold step 1: day 3 bump
    {
      subject: 'Re: quick question about your quoting',
      html: emailShell_(
        '<p>G\'day ' + firstName + ', quick follow-up in case this got buried. The demo is <a href="' + CONFIG.TEST_DRIVE_URL + '" style="color: #B4501A; font-weight: 700;">here</a>, or reply with a number and I\'ll tell you straight if it\'s worth your time.</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    },

    // Cold step 2: day 7 last note
    {
      subject: 'Last note, ' + firstName,
      html: emailShell_(
        '<p>G\'day ' + firstName + ', last note from me. If quoting isn\'t a headache right now, no problem at all. If it is, the demo above takes about a minute.</p>' +
        '<p>' + CONFIG.SENDER_NAME + '</p>'
      )
    }
  ];
}


/**
 * Run cold outreach for outbound-scraped leads.
 * 3-step email sequence: Day 0, Day 3, Day 6.
 * Respects "Do Not Email" in Next Action column.
 * Daily trigger at 11am AEST recommended.
 */
function runColdOutreach() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const data = pipeline.getDataRange().getValues();
  const today = new Date();
  const todayStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd');
  const C = CONFIG.COL;

  let processed = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const source = String(row[C.SOURCE]).toLowerCase().trim();
    const stage = String(row[C.STAGE]).toLowerCase().trim();
    const email = String(row[C.EMAIL]).trim();
    const name = String(row[C.NAME]).trim();
    const trade = String(row[C.TRADE]).trim();
    const notes = String(row[C.NOTES]);
    const nurtureStep = parseInt(row[C.NURTURE_STEP]) || 0;
    const nurtureNext = String(row[C.NURTURE_NEXT]).trim();
    const nextAction = String(row[C.NEXT_ACTION]).toLowerCase().trim();

    // Only process outbound-scraped leads
    if (source !== 'outbound_scrape') continue;

    // Skip if no email, already booked/paid/installed/cold, or opted out
    if (!email) continue;
    if (['booked', 'paid', 'installed', 'cold', 'do_not_email'].includes(stage)) continue;
    if (nextAction === 'do_not_email') continue;

    // Cold sequence has 3 steps (0, 1, 2)
    if (nurtureStep >= 3) continue;
    if (!nurtureNext) continue;
    if (nurtureNext > todayStr) continue;

    // Extract city from notes
    let city = '';
    const cityMatch = notes.match(/\|\s*([^|]+?)\s*\|/);
    if (cityMatch) city = cityMatch[1].trim();

    // Get cold templates
    const templates = getColdOutreachTemplates_(name, trade, city);
    const template = templates[nurtureStep];
    if (!template) continue;

    try {
      GmailApp.sendEmail(email, template.subject, '', {
        htmlBody: template.html,
        name: CONFIG.SENDER_NAME,
      });

      const rowNum = i + 1;
      const nextStep = nurtureStep + 1;
      const nowStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd HH:mm');

      // Update Pipeline row
      pipeline.getRange(rowNum, C.LAST_CONTACT + 1).setValue(nowStr);
      pipeline.getRange(rowNum, C.NURTURE_STEP + 1).setValue(nextStep);
      pipeline.getRange(rowNum, C.STAGE + 1).setValue('email_sent');

      if (nextStep >= 3) {
        // Cold sequence complete → mark cold
        pipeline.getRange(rowNum, C.NURTURE_NEXT + 1).setValue('');
        pipeline.getRange(rowNum, C.STAGE + 1).setValue('cold');
      } else {
        // Schedule next cold email (3 days apart)
        const nextDate = new Date(today);
        nextDate.setDate(nextDate.getDate() + 3);
        const nextDateStr = Utilities.formatDate(nextDate, 'Australia/Sydney', 'yyyy-MM-dd');
        pipeline.getRange(rowNum, C.NURTURE_NEXT + 1).setValue(nextDateStr);
      }

      processed++;
      Logger.log('Cold email step ' + nurtureStep + ' sent to: ' + email);

    } catch (err) {
      Logger.log('Cold email error for ' + email + ': ' + err.message);
    }

    // Batch limit
    if (processed >= 20) {
      Logger.log('Reached batch limit of 20. Will continue tomorrow.');
      break;
    }
  }

  Logger.log('✅ Cold outreach complete. Processed: ' + processed);
}


/**
 * Update Dashboard tab with live stats from Pipeline.
 * Call after daily digest or manually.
 */
function updateDashboard() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  const dashboard = ss.getSheetByName(CONFIG.DASHBOARD_TAB);

  if (!pipeline || !dashboard) {
    Logger.log('❌ Pipeline or Dashboard tab not found.');
    return;
  }

  const data = pipeline.getDataRange().getValues();
  const today = new Date();
  const todayStr = Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd');
  const C = CONFIG.COL;

  // Date boundaries
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = Utilities.formatDate(weekAgo, 'Australia/Sydney', 'yyyy-MM-dd');

  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthAgoStr = Utilities.formatDate(monthAgo, 'Australia/Sydney', 'yyyy-MM-dd');

  // Initialize counters: [today, week, month, allTime]
  const metrics = {
    'New Leads':        [0, 0, 0, 0],
    'Test Drives':      [0, 0, 0, 0],
    'Audit Requests':   [0, 0, 0, 0],
    'Calls Booked':     [0, 0, 0, 0],
    'Installs Completed': [0, 0, 0, 0],
    'Revenue':          [0, 0, 0, 0],
    'Pipeline Value':   [0, 0, 0, 0],
    'Conversion Rate':  [0, 0, 0, 0],
  };

  const settings = getSettings_();
  const fullPrice = parseFloat(String(settings['Pilot Price'] || '390').replace(/[^0-9.]/g, ''));
  const litePrice = fullPrice; // single pilot price (tiers retired)

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dateStr = String(row[C.DATE]).substring(0, 10);
    const source = String(row[C.SOURCE]).toLowerCase().trim();
    const stage = String(row[C.STAGE]).toLowerCase().trim();

    // Determine time buckets
    const isToday = (dateStr === todayStr);
    const isWeek = (dateStr >= weekAgoStr);
    const isMonth = (dateStr >= monthAgoStr);
    const buckets = [isToday ? 1 : 0, isWeek ? 1 : 0, isMonth ? 1 : 0, 1];

    // New Leads (all)
    for (let b = 0; b < 4; b++) metrics['New Leads'][b] += buckets[b];

    // Test Drives
    if (source === 'test_drive') {
      for (let b = 0; b < 4; b++) metrics['Test Drives'][b] += buckets[b];
    }

    // Audit Requests
    if (source === 'audit') {
      for (let b = 0; b < 4; b++) metrics['Audit Requests'][b] += buckets[b];
    }

    // Calls Booked
    if (stage === 'booked' || source === 'booking') {
      for (let b = 0; b < 4; b++) metrics['Calls Booked'][b] += buckets[b];
    }

    // Installs Completed
    if (stage === 'installed') {
      for (let b = 0; b < 4; b++) metrics['Installs Completed'][b] += buckets[b];
      for (let b = 0; b < 4; b++) metrics['Revenue'][b] += buckets[b] * fullPrice;
    }

    // Paid (but not yet installed)
    if (stage === 'paid') {
      for (let b = 0; b < 4; b++) metrics['Revenue'][b] += buckets[b] * fullPrice;
    }

    // Pipeline Value (active leads × average deal)
    if (['new', 'engaged', 'nurture_complete', 'email_sent', 'booked'].includes(stage)) {
      metrics['Pipeline Value'][3] += litePrice; // conservative estimate
    }
  }

  // Conversion rate: installed / total leads (all time)
  const totalLeads = metrics['New Leads'][3] || 1;
  const installs = metrics['Installs Completed'][3];
  for (let b = 0; b < 4; b++) {
    const periodLeads = metrics['New Leads'][b] || 1;
    const periodInstalls = metrics['Installs Completed'][b];
    metrics['Conversion Rate'][b] = Math.round((periodInstalls / periodLeads) * 100) + '%';
  }

  // Pipeline value: only show all-time
  metrics['Pipeline Value'][0] = '';
  metrics['Pipeline Value'][1] = '';
  metrics['Pipeline Value'][2] = '';
  metrics['Pipeline Value'][3] = '$' + metrics['Pipeline Value'][3].toLocaleString();

  // Format revenue as currency
  for (let b = 0; b < 4; b++) {
    if (typeof metrics['Revenue'][b] === 'number') {
      metrics['Revenue'][b] = '$' + metrics['Revenue'][b].toLocaleString();
    }
  }

  // Write to Dashboard
  const metricRows = [
    ['Metric', 'Today', 'This Week', 'This Month', 'All Time'],
  ];

  for (const [label, values] of Object.entries(metrics)) {
    metricRows.push([label, values[0], values[1], values[2], values[3]]);
  }

  dashboard.getRange(1, 1, metricRows.length, 5).setValues(metricRows);
  dashboard.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');

  // Add last updated timestamp
  const updatedStr = Utilities.formatDate(today, 'Australia/Sydney', 'dd MMM yyyy HH:mm');
  dashboard.getRange(metricRows.length + 2, 1).setValue('Last updated: ' + updatedStr);
  dashboard.getRange(metricRows.length + 2, 1).setFontColor('#94A3B8').setFontSize(10);

  Logger.log('✅ Dashboard updated with live stats.');
}


// ═══════════════════════════════════════════════════════════════
// UPDATED SETUP: Add Raw Leads + Call List tabs
// ═══════════════════════════════════════════════════════════════

/**
 * Extend setupSheet() to also create Raw Leads and Call List tabs.
 * Run this after updating the engine code.
 */
function setupOutboundTabs() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);

  // Raw Leads tab
  let rawSheet = ss.getSheetByName(RAW_LEADS_TAB);
  if (!rawSheet) {
    rawSheet = ss.insertSheet(RAW_LEADS_TAB);
    Logger.log('Created "Raw Leads" tab.');
  }
  const rawFirst = rawSheet.getRange('A1').getValue();
  if (rawFirst === '' || rawFirst === null) {
    rawSheet.getRange(1, 1, 1, RAW_LEADS_HEADERS.length).setValues([RAW_LEADS_HEADERS]);
    rawSheet.getRange(1, 1, 1, RAW_LEADS_HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0F172A')
      .setFontColor('#FFFFFF');
    rawSheet.setFrozenRows(1);
    Logger.log('Raw Leads headers created.');
  }

  // Call List tab
  let callSheet = ss.getSheetByName(CALL_LIST_TAB);
  if (!callSheet) {
    callSheet = ss.insertSheet(CALL_LIST_TAB);
    Logger.log('Created "Call List" tab.');
  }
  const callFirst = callSheet.getRange('A1').getValue();
  if (callFirst === '' || callFirst === null) {
    callSheet.getRange(1, 1, 1, CALL_LIST_HEADERS.length).setValues([CALL_LIST_HEADERS]);
    callSheet.getRange(1, 1, 1, CALL_LIST_HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0F172A')
      .setFontColor('#FFFFFF');
    callSheet.setFrozenRows(1);
    Logger.log('Call List headers created.');
  }

  Logger.log('✅ Outbound tabs setup complete.');
}


// setupOutboundTrigger() — REMOVED in v1.3 (consolidated into setupTriggers)


// ═══════════════════════════════════════════════════════════════
// UTILITY: Manual test functions
// ═══════════════════════════════════════════════════════════════

/**
 * Test the webhook handler with a fake audit lead
 */
function testAuditLead() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'audit_lead',
        name: 'Test User',
        email: CONFIG.OWNER_EMAIL,
        phone: '0400000000',
        trade: 'Electrician',
        quotesPerWeek: 15,
        minutesPerQuote: 30,
        hourlyRate: 120,
        annualHoursWasted: 390,
        annualCostWasted: 46800,
        utm_source: 'test',
        utm_medium: 'manual',
        utm_campaign: 'engine_test',
      })
    }
  };

  const result = doPost(fakeEvent);
  Logger.log('Test result: ' + result.getContent());
}


/**
 * Test the webhook handler with a fake demo lead
 */
function testDemoLead() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'demoLead',
        name: 'Demo Test',
        email: CONFIG.OWNER_EMAIL,
        phone: '0411222333',
        trade: 'Plumber',
        utm_source: 'test',
        utm_medium: 'manual',
      })
    }
  };

  const result = doPost(fakeEvent);
  Logger.log('Test result: ' + result.getContent());
}


/**
 * Manually run all engines (for testing)
 */
function runAllEngines() {
  Logger.log('=== Running all engines ===');
  runNurtureSequence();
  runFollowUpEngine();
  runPostInstallCheck();
  runColdOutreach();
  sendDailyDigest(); // Also updates Dashboard
  Logger.log('=== All engines complete ===');
}


// ═══════════════════════════════════════════════════════════════
// DROPDOWNS (Data Validation)
// ═══════════════════════════════════════════════════════════════

/**
 * Apply dropdown data validation to all multiple-choice columns
 * in both Command Center and CRM sheets.
 * Run once from menu, or automatically via setupSheet().
 */
function setupDropdowns() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  const ROWS = 500;

  // --- Pipeline ---
  const pipeline = ss.getSheetByName(CONFIG.PIPELINE_TAB);
  if (pipeline) {
    applyDropdown_(pipeline, 'E', 2, ROWS, ['Electrician','Plumber','Painter','Carpenter','Builder','Roofer','Concreter','Landscaper','Tiler','HVAC','Air Con','Other']);
    applyDropdown_(pipeline, 'F', 2, ROWS, ['test_drive','audit','booking','meta_ad','referral','outbound_scrape','direct','organic']);
    applyDropdown_(pipeline, 'J', 2, ROWS, ['new','engaged','nurture_complete','email_sent','booked','paid','installed','cold']);
  }

  // --- Referrals ---
  const referrals = ss.getSheetByName(CONFIG.REFERRALS_TAB);
  if (referrals) {
    applyDropdown_(referrals, 'F', 2, ROWS, ['pending','contacted','installed','paid_out']);
    applyDropdown_(referrals, 'H', 2, ROWS, ['Yes','No']);
  }

  // --- Nurture Status ---
  const nurture = ss.getSheetByName(CONFIG.NURTURE_TAB);
  if (nurture) {
    applyDropdown_(nurture, 'F', 2, ROWS, ['active','paused','completed','cold']);
  }

  // --- Call List ---
  const callList = ss.getSheetByName(CALL_LIST_TAB);
  if (callList) {
    applyDropdown_(callList, 'J', 2, ROWS, ['booked','follow up','not interested','no answer','voicemail','callback']);
  }

  // --- Ad Tracker ---
  const adTracker = ss.getSheetByName('Ad Tracker');
  if (adTracker) {
    applyDropdown_(adTracker, 'J', 2, ROWS, ['new','contacted','booked','installed','dead']);
  }

  // --- CRM Sheet ---
  try {
    const crm = SpreadsheetApp.openById(CONFIG.CRM_SHEET_ID);
    const leads = crm.getSheetByName('Leads');
    if (leads) {
      applyDropdown_(leads, 'B', 2, ROWS, ['test_drive','audit','booking','meta_ad','referral','outbound_scrape','direct']);
    }
  } catch (err) {
    Logger.log('CRM dropdown setup skipped: ' + err.message);
  }

  Logger.log('✅ All dropdowns applied.');
}


/**
 * Helper: apply dropdown validation to a column range.
 */
function applyDropdown_(sheet, colLetter, startRow, numRows, values) {
  const col = colLetter.charCodeAt(0) - 64; // A=1, B=2, etc.
  const range = sheet.getRange(startRow, col, numRows, 1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .build();
  range.setDataValidation(rule);
}


// ═══════════════════════════════════════════════════════════════
// AD TRACKER
// ═══════════════════════════════════════════════════════════════

/**
 * Log Meta ad lead to the Ad Tracker tab.
 * Called from doPost() when action = meta_ad.
 */
function logAdTracker_(ss, data, timestamp) {
  const adTracker = ss.getSheetByName('Ad Tracker');
  if (!adTracker) return;

  // Ensure headers exist
  const firstVal = adTracker.getRange('A1').getValue();
  if (!firstVal) {
    const headers = ['Date', 'Campaign', 'Ad Set', 'Ad Name', 'Lead Name', 'Lead Email', 'Lead Phone', 'Platform', 'Cost', 'Status'];
    adTracker.getRange(1, 1, 1, headers.length).setValues([headers]);
    adTracker.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
    adTracker.setFrozenRows(1);
  }

  adTracker.appendRow([
    timestamp,
    data.campaign_name || data.utm_campaign || '',
    data.adset_name || data.adset_id || '',
    data.ad_name || data.ad_id || '',
    data.name || data.full_name || '',
    data.email || '',
    data.phone || data.phone_number || '',
    'Meta',
    data.cost_per_lead || '',
    'new'
  ]);
  Logger.log('✅ Ad tracked: ' + (data.campaign_name || 'unknown campaign'));
}


// ═══════════════════════════════════════════════════════════════
// GUIDE TAB
// ═══════════════════════════════════════════════════════════════

/**
 * Create/rebuild the "Guide" tab with daily operations playbook.
 * Run once from menu.
 */
function buildGuideTab_() {
  const ss = SpreadsheetApp.openById(CONFIG.COMMAND_CENTER_ID);
  let guide = ss.getSheetByName('Guide');
  if (!guide) {
    guide = ss.insertSheet('Guide');
  } else {
    guide.clearContents();
    guide.clearFormats();
  }

  const rows = [
    ['FLOWIO DAILY OPERATIONS GUIDE', '', ''],
    ['Target: 3 installs/week ($6K/week)', '', ''],
    ['', '', ''],
    ['DAILY (Every Morning)', 'Action', 'Notes'],
    ['1', 'Open Dashboard tab — check overnight metrics', 'Auto-updated at 7:30am'],
    ['2', 'Check email for new lead notifications', 'Instant alerts from v1.3+'],
    ['3', 'Open Call List — call top 5 leads by score', 'Highest score = best chance'],
    ['4', 'Log call notes + result in Call List (cols I, J)', 'booked / follow up / not interested / no answer'],
    ['5', 'Flowio Engine menu → Refresh Call List', 'Syncs results back to Pipeline'],
    ['6', 'Send 20-30 DMs to local tradies on Instagram/Facebook', 'Link to test drive'],
    ['7', 'Post 1 content piece (tip, before/after, testimonial)', 'Consistency > perfection'],
    ['', '', ''],
    ['EVERY 2-3 DAYS', 'Action', 'Notes'],
    ['1', 'Paste 10-20 scraped leads into Raw Leads tab', 'Google Maps, HiPages, Yellow Pages'],
    ['2', 'Flowio Engine menu → Import Raw Leads', 'Deduplicates automatically'],
    ['3', 'Flowio Engine menu → Refresh Call List', 'Re-scores and re-sorts'],
    ['4', 'Check Nurture Status tab for stalled leads', 'Manually follow up if stuck'],
    ['5', 'Book calls with high-score engaged leads', 'Warm > cold always'],
    ['', '', ''],
    ['WEEKLY', 'Action', 'Notes'],
    ['1', 'Review Dashboard — check conversion rate trend', 'Are calls converting?'],
    ['2', 'Review cold leads — any worth re-engaging?', 'Change stage to "engaged" to restart nurture'],
    ['3', 'Ask every installed client for a referral', '$200/$200 referral bonus'],
    ['4', 'Plan next week content (2-3 posts)', 'Batch create on Sunday'],
    ['', '', ''],
    ['MONTHLY', 'Action', 'Notes'],
    ['1', 'Review all Pipeline — clean dead leads', 'Archive rows older than 60 days if cold'],
    ['2', 'Update pricebook if needed', 'Adjust to market'],
    ['3', 'A/B test a new cold email subject line', 'Edit getColdOutreachTemplates_() in script'],
    ['4', 'Calculate CAC from ad spend', 'Ad spend / installs = CAC'],
    ['', '', ''],
    ['KEY METRICS', 'Target', 'Why'],
    ['Leads/week', '20-50', 'More leads = more at-bats'],
    ['Call-to-book rate', '30%+', '1 in 3 calls should book a fit call'],
    ['Book-to-install rate', '50%+', 'Half of fit calls should convert'],
    ['Installs/week', '3', '$6K/week = $312K/year revenue'],
    ['CAC (cost per acquisition)', '<$200', 'Keep customer acquisition cost under $200'],
    ['', '', ''],
    ['AUTOMATION SCHEDULE', 'Time (AEST)', 'What Happens'],
    ['Morning Routine', '7:30am', 'Import leads → Score → Refresh Call List → Update Dashboard'],
    ['Daily Digest Email', '8:00am', 'Pipeline summary emailed to you'],
    ['Nurture Sequence', '9:00am', 'Sends next nurture email to warm leads'],
    ['Post-Install Check', '9:00am', 'Day 7/14 emails to installed clients'],
    ['Follow-Up Engine', '10:00am', 'SMS + final email for nurture_complete leads'],
    ['Cold Outreach', '11:00am', 'Sends next cold email to outbound leads'],
    ['Instant Notifications', 'Real-time', 'Email alert whenever a new lead comes in'],
  ];

  guide.getRange(1, 1, rows.length, 3).setValues(rows);

  // Format title
  guide.getRange(1, 1).setFontSize(16).setFontWeight('bold').setFontColor('#0F172A');
  guide.getRange(2, 1).setFontSize(12).setFontColor('#F97316').setFontWeight('bold');

  // Format section headers
  const sectionRows = [4, 13, 20, 26, 32, 38];
  sectionRows.forEach(r => {
    guide.getRange(r, 1, 1, 3).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
  });

  // Column widths
  guide.setColumnWidth(1, 60);
  guide.setColumnWidth(2, 500);
  guide.setColumnWidth(3, 350);
  guide.setFrozenRows(1);

  Logger.log('✅ Guide tab created.');
}
