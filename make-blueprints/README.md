# Make.com Scenario Blueprints

## Setup Instructions

### Prerequisites
- Make.com account (sean@tradeanchor.com.au)
- Google connection (ID: 6370955) already configured
- ClickSend SMS connection (ID: 5806821) already configured
- Marketing Command Center Google Sheet created (see below)

### Before Importing

1. **Create the Marketing Command Center Google Sheet** first (see `command-center-setup.md`)
2. **Note the Spreadsheet ID** from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. **Find-and-replace** `{{SPREADSHEET_ID}}` in each blueprint JSON with your actual spreadsheet ID
4. **Delete the "Create Command Center" scenario** that was auto-created (ID: 4111049) — it was a test that couldn't be activated

### Import Order

Import these scenarios in order:

| # | File | Trigger | Description |
|---|------|---------|-------------|
| S1 | `S1-crm-router.json` | Existing webhook (Test Drive) | Routes all leads to Pipeline sheet by action type |
| S2 | `S2-audit-generator.json` | Audit webhook (new) | Calculates quoting waste, emails PDF, adds to CRM |
| S3 | `S3-nurture-sequence.json` | Scheduled (daily 9am AEST) | 4-step email drip: Day 0, 2, 4, 7 |
| S4 | `S4-follow-up-engine.json` | Scheduled (daily 10am AEST) | Auto-chase no-response leads at 48h, 5d, 10d |
| S5 | `S5-post-install.json` | Scheduled (daily 9am AEST) | Day 7 check-in + Day 14 review/referral request |
| S6 | `S6-fb-lead-capture.json` | Facebook Lead Ad webhook | Auto-ingest Meta ad leads into pipeline |
| S7 | `S7-daily-digest.json` | Scheduled (daily 8am AEST) | Morning email summary of pipeline + KPIs |

### How to Import

1. Go to make.com > Scenarios > Create a new scenario
2. Click the "..." menu > Import Blueprint
3. Paste the contents of the JSON file
4. Replace `{{SPREADSHEET_ID}}` with your Command Center sheet ID
5. Verify the Google and ClickSend connections are mapped correctly
6. Save and activate

### Active Scenario Limit

Your Make.com plan limits active scenarios. Current active:
- TestDrive Lead capture (ID: 3554533) — KEEP ACTIVE
- Integration Webhooks (ID: 3323185) — KEEP ACTIVE

**Recommendation:** Upgrade to the Core plan ($10.59/mo) to unlock 5+ active scenarios. Or combine S3+S4+S5 into one scheduled scenario with router logic.

### Webhooks

| Webhook | ID | URL | Used By |
|---------|-----|-----|---------|
| Website Test Drive | 1598724 | `iowm5ja7...` | S1, existing TestDrive scenario |
| Flowio Audit Lead | 1870485 | `3s59ymdocmsidgi1v27otq2ngswu2xu9` | S2 |
| Booking Confirmed | 1701298 | existing | S1 (booking route) |
| Stripe Checkout | 1490539 | existing | Integration Webhooks |

### Connection IDs (for blueprint reference)

- Google OAuth: `6370955`
- ClickSend SMS: `5806821`
