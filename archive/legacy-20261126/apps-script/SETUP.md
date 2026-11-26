# Flowio Marketing Engine — Setup Guide

## What This Does

One Google Apps Script replaces all 7 Make.com scenarios:
- **Webhook handler** — captures all leads (test drive, audit, FB ads, referrals, bookings)
- **Nurture sequence** — 4-step email drip (Day 0, 2, 4, 7)
- **Follow-up engine** — SMS at 48h, final email at 5d, marks cold
- **Post-install check** — Day 7 check-in + Day 14 review/referral request
- **Daily digest** — 8am AEST pipeline summary email

## Setup Steps (10 minutes)

### 1. Open the Marketing Command Center

Go to: https://docs.google.com/spreadsheets/d/1ZdAsJ4uyR22B0Z2U3MBfVbgXdXf1qxWG1EYi8PqgA2o/edit

### 2. Open Apps Script

`Extensions` → `Apps Script`

### 3. Paste the Code

- Delete any existing code in `Code.gs`
- Copy the entire contents of `MarketingEngine.gs` and paste it in
- Save (Ctrl+S)

### 4. Run Setup

1. In the Apps Script editor, select `setupSheet` from the function dropdown
2. Click ▶️ Run
3. Authorize when prompted (Google will ask for permissions — this is normal)
4. Check: Pipeline tab should now have headers, Settings tab should have defaults

### 5. Configure Settings Tab

Open the **Settings** tab in the spreadsheet and fill in:

| Setting | Value |
|---------|-------|
| ClickSend Username | Your ClickSend email |
| ClickSend API Key | Your ClickSend API key |
| Google Review Link | Your Google Business review link |
| SMS Enabled | `true` (set to `true` when ready to send SMS) |

### 6. Set Up Triggers

1. In Apps Script editor, select `setupTriggers` from dropdown
2. Click ▶️ Run
3. This creates 4 daily triggers:
   - 8:00 AM AEST → `sendDailyDigest`
   - 9:00 AM AEST → `runNurtureSequence`
   - 9:00 AM AEST → `runPostInstallCheck`
   - 10:00 AM AEST → `runFollowUpEngine`

### 7. Deploy as Web App

1. Click `Deploy` → `New deployment`
2. Type: **Web app**
3. Description: "Flowio Marketing Engine v1"
4. Execute as: **Me** (sean@tradeanchor.com.au)
5. Who has access: **Anyone**
6. Click **Deploy**
7. Copy the web app URL (looks like: `https://script.google.com/macros/s/AKfycb.../exec`)

### 8. Update Website Environment

In your `.env` file, replace the webhook URLs:

```
VITE_MARKETING_ENGINE_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_AUDIT_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

The same URL handles ALL lead types — routing is based on the `action` field in the POST body.

### 9. Test

1. In Apps Script, select `testAuditLead` → Run
   - Should add a test lead to Pipeline tab
   - Should send an audit email to sean@tradeanchor.com.au
2. Select `testDemoLead` → Run
   - Should add a demo lead to Pipeline tab
3. Select `sendDailyDigest` → Run
   - Should send a digest email with pipeline stats
4. Visit your website → fill out the Quoting Audit form → verify it appears in Pipeline

### 10. Clean Up Make.com (Optional)

Once the Apps Script is working, you can deactivate/delete these Make.com scenarios:
- "Create Command Center" (ID: 4111049) — test scenario, delete it
- "Read Pipeline Headers" (ID: 4132200) — test scenario, delete it
- Keep "TestDrive Lead capture" and "Integration Webhooks" active until you've verified the Apps Script handles everything

## Architecture

```
Website Forms ──→ doPost() webhook ──→ Pipeline sheet
                       │
                       ├── audit_lead → sends Audit email
                       ├── demoLead → adds to pipeline + nurture queue
                       ├── booking_confirmed → updates stage to "booked"
                       ├── meta_ad → sends welcome email
                       └── referral_lead → logs to Referrals tab

Daily Triggers:
  8am  → sendDailyDigest()      → email summary to Sean
  9am  → runNurtureSequence()   → Day 0/2/4/7 emails
  9am  → runPostInstallCheck()  → Day 7 + Day 14 emails
  10am → runFollowUpEngine()    → SMS + final email chase
```

## How It Connects to Your CRM

The script syncs new leads to your CRM sheet (`11wr33JzinkyRcIUEPu2Zm8FUMEl85PSKzIKtikThGsU`) in the "Form Responses 4" tab. This ensures your existing Flowio workflows (quote generation, etc.) can access the lead data.

## Troubleshooting

- **"Authorization required"**: Run any function manually first to trigger the OAuth consent screen
- **Emails not sending**: Check Gmail sending quota (free accounts: 100/day, Workspace: 1,500/day)
- **SMS not working**: Verify ClickSend credentials in Settings tab and set "SMS Enabled" to "true"
- **Webhook not receiving**: Ensure the web app is deployed with "Anyone" access and the URL matches what's in your .env
- **Trigger errors**: Check Apps Script `Executions` tab for error logs
