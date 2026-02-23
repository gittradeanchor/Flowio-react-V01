/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  FLOWIO MARKETING ENGINE v1.1                               ║
 * ║  Bound to: Marketing Command Center Google Sheet             ║
 * ╚══════════════════════════════════════════════════════════════╝

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
  SITE_URL: 'https://tradeanchor.com.au',
  CALENDLY_URL: 'https://calendly.com/billing-tradeanchor/15min',
  WHATSAPP_URL: 'https://wa.me/61494186989',
  TEST_DRIVE_URL: 'https://tradeanchor.com.au#test-drive',

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
      ['Lite Price', '$497'],
      ['Full Price', '$1,997'],
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

  Logger.log('✅ Sheet setup complete.');
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

  // Daily 9am AEST — nurture sequence
  ScriptApp.newTrigger('runNurtureSequence')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone('Australia/Sydney')
    .create();

  // Daily 10am AEST — follow-up engine
  ScriptApp.newTrigger('runFollowUpEngine')
    .timeBased()
    .atHour(10)
    .everyDays(1)
    .inTimezone('Australia/Sydney')
    .create();

  // Daily 9am AEST — post-install check
  ScriptApp.newTrigger('runPostInstallCheck')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone('Australia/Sydney')
    .create();

  // Daily 8am AEST — digest
  ScriptApp.newTrigger('sendDailyDigest')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone('Australia/Sydney')
    .create();

  Logger.log('✅ 4 triggers created (8am digest, 9am nurture+post-install, 10am follow-up).');
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
    const action = data.action || data.event || 'unknown';
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
        break;

      case 'referral_lead':
        source = 'referral';
        notes = 'Referred by: ' + (data.referrer || '');
        // Log referral
        logReferral_(ss, data.referrer || '', data.referrer_email || '', name, email);
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
    engine: 'Flowio Marketing Engine v1.1',
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


function getNurtureTemplates_(name, trade) {
  const firstName = name.split(' ')[0] || 'there';
  const tradeLabel = trade || 'tradie';

  return [
    // Step 0: Day 0 — Welcome + Value Nudge
    {
      subject: firstName + ', here\'s what your competitors are doing differently',
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Thanks for checking out TradeAnchor! Quick question: how many quotes do you send per week?</p>
        <p>Most ${tradeLabel}s we talk to spend 30-45 minutes per quote. That's 20+ hours a month on paperwork instead of billable work.</p>
        <p>Flowio cuts that to under 2 minutes per quote. One tap, professional PDF, sent via SMS, tracked automatically. All inside Google Sheets.</p>
        <p>
          <a href="${CONFIG.TEST_DRIVE_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Try the Free Test Drive</a>
          &nbsp;&nbsp;
          <a href="${CONFIG.CALENDLY_URL}" style="color: #0F172A; font-weight: 700; text-decoration: underline;">Or book a quick chat</a>
        </p>
        <p>Cheers,<br>${CONFIG.SENDER_NAME}</p>
      </div>`
    },

    // Step 1: Day 2 — Social Proof / Pain Agitation
    {
      subject: 'Why 78% of tradies quit their job management software',
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Here's something wild: 78% of tradies who sign up for job management software (ServiceM8, Jobber, Tradify) cancel within 12 months.</p>
        <p>Why? Three reasons:</p>
        <ul>
          <li>Too complex (takes weeks to learn, half the features go unused)</li>
          <li>Too expensive ($29-$349/month adds up fast)</li>
          <li>You never own your data (cancel and it's gone)</li>
        </ul>
        <p>Flowio is different. It runs inside Google Sheets &mdash; software you already know. One-time setup. No monthly fees. Your data lives in YOUR Google account forever.</p>
        <p><a href="${CONFIG.TEST_DRIVE_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">See it in action (2 min)</a></p>
        <p>${CONFIG.SENDER_NAME}</p>
      </div>`
    },

    // Step 2: Day 4 — ROI Breakdown
    {
      subject: 'The maths: how Flowio pays for itself in 7 weeks',
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Let me break down the numbers for a typical ${tradeLabel}:</p>
        <ul>
          <li>Average ${tradeLabel} sends 15 quotes/week, spending ~30 min each</li>
          <li>That's 390 hours/year on quoting alone</li>
          <li>At $80/hour billable rate, that's $31,200 in lost productive time</li>
        </ul>
        <p>Flowio costs $1,997 one-time (or 3x $699/mo if you prefer to spread it out).</p>
        <p>At just 5 extra billable hours recovered per week, it pays for itself in <strong>7 weeks</strong>. After that? Pure profit. No monthly fees eating into your margin.</p>
        <p>And if you're not sure about the full system, we also have Flowio Lite at $497 &mdash; just the quoting module. Upgradeable anytime.</p>
        <p><a href="${CONFIG.CALENDLY_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Let's run the numbers for YOUR business (15 min)</a></p>
        <p>${CONFIG.SENDER_NAME}</p>
      </div>`
    },

    // Step 3: Day 7 — Final Nudge + Urgency
    {
      subject: 'Last call: 2 install spots left this week',
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Quick heads up &mdash; we've only got 2 DFY install spots left this week (each install takes 48 hours of setup + testing).</p>
        <p>Here's everything you get with a Flowio Full install ($1,997 one-time):</p>
        <ul>
          <li>&#10004; Professional PDF quotes from Google Sheets (1-tap)</li>
          <li>&#10004; Auto SMS to clients with quote link</li>
          <li>&#10004; Client accepts online &rarr; auto calendar booking</li>
          <li>&#10004; Stripe payment collection</li>
          <li>&#10004; Xero invoice sync</li>
          <li>&#10004; Automatic follow-ups for unpaid quotes</li>
          <li>&#10004; Done-for-you setup in 48 hours</li>
          <li>&#10004; Full refund if not live in 48 hours</li>
        </ul>
        <p>Or start with Flowio Lite ($497) &mdash; just the quoting engine, upgradeable for $1,500.</p>
        <p><a href="${CONFIG.CALENDLY_URL}" style="display: inline-block; background: #F97316; color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">Grab Your Spot &rarr;</a></p>
        <p>${CONFIG.SENDER_NAME}<br>Sydney, Australia</p>
      </div>`
    }
  ];
}


// ═══════════════════════════════════════════════════════════════
// S4: FOLLOW-UP ENGINE (Daily 10am AEST)
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
  const firstName = name.split(' ')[0] || 'there';
  const tradeLabel = trade || 'tradie';

  const subject = firstName + ', quick case study from a Sydney ' + tradeLabel;
  const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
    <p>G'day ${firstName},</p>
    <p>Wanted to share a quick win from a recent Flowio install:</p>
    <p><strong>Before:</strong> 45 min per quote, chasing clients for days, losing track of jobs</p>
    <p><strong>After:</strong> 2 min per quote, client accepts + pays online, automatic calendar booking</p>
    <p>The tradie got his first 3 quotes out within an hour of setup. One was accepted same day.</p>
    <p>If you've got 15 minutes, I'd love to show you how this could work for your ${tradeLabel} business:</p>
    <p><a href="${CONFIG.CALENDLY_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Book a Quick Chat</a></p>
    <p>${CONFIG.SENDER_NAME}</p>
  </div>`;

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

  const subject = "G'day " + firstName + " - here's what you asked about";
  const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
    <p>G'day ${firstName},</p>
    <p>Thanks for your interest in Flowio! Here's the quick rundown:</p>
    <p><strong>Flowio</strong> turns Google Sheets into a complete quoting + job management system for tradies. One tap to quote, auto-SMS to clients, online acceptance, calendar booking, and Stripe payments.</p>
    <p>No monthly fees. No learning curve. Done-for-you setup in 48 hours.</p>
    <p><strong>Want to see it in action?</strong></p>
    <p><a href="${CONFIG.TEST_DRIVE_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Try the free interactive demo</a></p>
    <p>Or if you're ready to chat:</p>
    <p><a href="${CONFIG.CALENDLY_URL}" style="color: #0F172A; font-weight: 700; text-decoration: underline;">Book a 15-minute Fit Call</a></p>
    <p>${CONFIG.SENDER_NAME}</p>
  </div>`;

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
 * Cold outreach email templates — shorter, colder than warm nurture.
 * 3-email sequence: Day 0, Day 3, Day 6
 */
function getColdOutreachTemplates_(name, trade, city) {
  const firstName = (name || 'there').split(' ')[0];
  const tradeLabel = trade || 'tradie';
  const cityLabel = city || 'your area';

  return [
    // Cold Step 0: Day 0 — Direct intro
    {
      subject: firstName + ', quick question about your quoting process',
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Found your ${tradeLabel} business in ${cityLabel} and had a quick question — how long does it take you to send a quote?</p>
        <p>I built a tool called <strong>Flowio</strong> that lets tradies send professional PDF quotes in under 2 minutes, straight from Google Sheets. Client gets an SMS with an accept link, pays online, job gets booked to your calendar. All automatic.</p>
        <p>No monthly fees — just a one-time setup starting from $497.</p>
        <p>Worth a quick look?</p>
        <p><a href="${CONFIG.TEST_DRIVE_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Try the 30-second demo</a></p>
        <p>Cheers,<br>${CONFIG.SENDER_NAME}<br><span style="font-size: 13px; color: #94A3B8;">TradeAnchor | Sydney</span></p>
      </div>`
    },

    // Cold Step 1: Day 3 — Social proof nudge
    {
      subject: 'How ' + cityLabel + ' tradies are winning more jobs (without more admin)',
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Following up on my last note. The tradies using Flowio tell us the same thing:</p>
        <ul>
          <li>"I quote in 2 minutes instead of 30"</li>
          <li>"Clients pay the deposit before I even get off the phone"</li>
          <li>"It runs in Google Sheets — nothing new to learn"</li>
        </ul>
        <p>Unlike ServiceM8 or Jobber, there's no monthly subscription. One-time setup, you own everything, runs in the tools you already use.</p>
        <p>If you've got 15 min, happy to run through how it'd work for your ${tradeLabel} business:</p>
        <p><a href="${CONFIG.CALENDLY_URL}" style="display: inline-block; background: #0F172A; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700;">Book a Quick Chat</a></p>
        <p>${CONFIG.SENDER_NAME}</p>
      </div>`
    },

    // Cold Step 2: Day 6 — Final, breakup-style
    {
      subject: 'No worries if not, ' + firstName,
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #475569; font-size: 16px; line-height: 1.7;">
        <p>G'day ${firstName},</p>
        <p>Last note from me — no worries if the timing isn't right.</p>
        <p>Quick summary in case you want to bookmark it for later:</p>
        <ul>
          <li>Flowio = quoting + booking + payments inside Google Sheets</li>
          <li>Done-for-you setup in 48 hours, starting from $497</li>
          <li>No monthly fees, full refund if not live in 48 hrs</li>
        </ul>
        <p>Whenever you're ready: <a href="${CONFIG.TEST_DRIVE_URL}" style="color: #F97316; font-weight: 700;">try the demo</a> or <a href="${CONFIG.CALENDLY_URL}" style="color: #0F172A; font-weight: 700;">book a chat</a>.</p>
        <p>All the best with the business, ${firstName}!</p>
        <p>Sean<br><span style="font-size: 13px; color: #94A3B8;">TradeAnchor | Sydney</span></p>
      </div>`
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
  const fullPrice = parseFloat(String(settings['Full Price'] || '1997').replace(/[^0-9.]/g, ''));
  const litePrice = parseFloat(String(settings['Lite Price'] || '497').replace(/[^0-9.]/g, ''));

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


/**
 * Setup cold outreach trigger (daily 11am AEST).
 * Run once after deploying outbound engine.
 */
function setupOutboundTrigger() {
  // Check if cold outreach trigger already exists
  const existing = ScriptApp.getProjectTriggers();
  const hasOutbound = existing.some(t => t.getHandlerFunction() === 'runColdOutreach');
  if (hasOutbound) {
    Logger.log('Cold outreach trigger already exists.');
    return;
  }

  ScriptApp.newTrigger('runColdOutreach')
    .timeBased()
    .atHour(11)
    .everyDays(1)
    .inTimezone('Australia/Sydney')
    .create();

  Logger.log('✅ Cold outreach trigger created (daily 11am AEST).');
}


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
