# Marketing Command Center - Google Sheet Setup

## Quick Setup (2 minutes)

A Make.com scenario was already created (ID: 4111049) that can create this sheet automatically, but it needs activation from the Make.com UI. If you prefer, set it up manually:

### Option A: Run the Auto-Create Scenario
1. Go to make.com > Scenarios > "Create Command Center" (ID: 4111049)
2. Click "Run once" (the play button)
3. It will create the full spreadsheet with all 7 tabs
4. Copy the Spreadsheet ID from the URL
5. Delete this scenario after (you only need it once)

### Option B: Create Manually
1. Go to Google Sheets > Create new spreadsheet
2. Name it: **Flowio Marketing Command Center**
3. Create these 7 tabs (rename/add sheets):

---

## Tab 1: Dashboard

| Column | Header |
|--------|--------|
| A | Metric |
| B | Today |
| C | This Week |
| D | This Month |
| E | All Time |

**Pre-fill rows:**
| Metric |
|--------|
| New Leads |
| Test Drives |
| Audit Requests |
| Calls Booked |
| Installs Completed |
| Revenue |
| Pipeline Value |
| Conversion Rate |

*Tip: Use `=COUNTIFS(Pipeline!I:I, "new", Pipeline!A:A, ">="&TODAY())` for Today's new leads.*

---

## Tab 2: Pipeline (AUTO-POPULATED by Make.com)

| Col | Header | Description |
|-----|--------|-------------|
| A | Date | When lead was captured |
| B | Name | Lead name |
| C | Phone | Phone number |
| D | Email | Email address |
| E | Trade | Electrician, Plumber, etc. |
| F | Source | demoLead, booking_confirmed, audit_lead, meta_ad, dm, referral |
| G | UTM Source | facebook, google, instagram, direct |
| H | UTM Medium | cpc, organic, social, referral |
| I | UTM Campaign | Campaign name |
| J | Stage | new, engaged, booked, paid, installed, cold |
| K | Notes | Auto-filled + manual notes |
| L | Last Contact | Last time they were contacted |
| M | Next Action | What to do next (sms_sent, final_email_sent, day7_sent, day14_sent) |
| N | Nurture Step | 0-4 (auto-incremented by S3) |
| O | Nurture Next Date | When next nurture email fires |

**Headers Row 1 (copy-paste into A1:O1):**
```
Date	Name	Phone	Email	Trade	Source	UTM Source	UTM Medium	UTM Campaign	Stage	Notes	Last Contact	Next Action	Nurture Step	Nurture Next Date
```

---

## Tab 3: Nurture Status

| Col | Header |
|-----|--------|
| A | Name |
| B | Email |
| C | Current Step |
| D | Next Send Date |
| E | Last Email Subject |
| F | Opened? |
| G | Clicked? |
| H | Booked? |

*This tab can be auto-populated or used as a manual view. The Pipeline tab's Nurture Step/Date columns drive the automation.*

---

## Tab 4: Ad Tracker

| Col | Header |
|-----|--------|
| A | Week |
| B | Platform |
| C | Campaign |
| D | Spend |
| E | Impressions |
| F | Clicks |
| G | Leads |
| H | Test Drives |
| I | Calls Booked |
| J | Installs |
| K | CPA (Cost/Lead) |
| L | ROAS |

*Manual entry weekly (5 min). Use formulas: K=D/G, L=(J*1997)/D*

---

## Tab 5: Content Calendar

| Col | Header |
|-----|--------|
| A | Date |
| B | Platform |
| C | Post Type |
| D | Topic/Hook |
| E | Status |
| F | Link |
| G | Engagement |

**Post Types:** Reel, Carousel, Story, Group Post, DM Campaign, Email

---

## Tab 6: Referrals

| Col | Header |
|-----|--------|
| A | Referrer Name |
| B | Referrer Email |
| C | Referred Lead |
| D | Referred Email |
| E | Date |
| F | Status |
| G | Payout Owed |
| H | Paid? |

---

## Tab 7: Settings

| Col | Header | Value |
|-----|--------|-------|
| A | Setting | |
| B | Value | |

**Pre-fill:**
| Setting | Value |
|---------|-------|
| Main Webhook URL | https://hook.us2.make.com/iowm5ja7jqtluqu6geuxu39ski3g9u2j |
| Audit Webhook URL | https://hook.us2.make.com/3s59ymdocmsidgi1v27otq2ngswu2xu9 |
| Calendly URL | https://calendly.com/billing-tradeanchor/15min |
| WhatsApp | https://wa.me/61494186989 |
| Site URL | https://tradeanchor.com.au |
| Google Review Link | [ADD YOUR LINK] |
| Referral Bonus | $200/$200 |
| Lite Price | $497 |
| Full Price | $1,997 |
| Payment Plan | 3x $699/mo |

---

## After Setup

1. Copy the **Spreadsheet ID** from the URL bar (the long string after `/d/`)
2. Find-and-replace `{{SPREADSHEET_ID}}` in all S1-S7 blueprint JSON files with this ID
3. Import scenarios into Make.com following the README instructions
