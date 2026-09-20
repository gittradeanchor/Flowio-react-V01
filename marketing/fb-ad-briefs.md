# Facebook/Meta Ad Campaign Briefs

## Campaign Structure

### Campaign A: Demo Video → Website
**Objective:** Conversions (Booking)
**Budget:** $15-20/day
**Duration:** Ongoing (optimize weekly)

**Targeting:**
- Location: Sydney + 50km radius (Week 1-2), expand to Melbourne/Brisbane (Week 3+)
- Age: 25-55
- Gender: All (skews male in electrical)
- Interests:
  - Electrical contracting
  - ServiceM8, Jobber, Tradify (competitor audiences)
  - Small business owner
  - Trade business
  - Google Sheets (yes, target spreadsheet users!)
- Exclude: People who already booked (custom audience from Calendly)

**Ad Set 1: Video Ad**
- Format: 15-30 second screen recording of Flowio in action
- Hook (first 3 seconds): "Still doing quotes on your phone at 9pm?"
- Body: Show the 1-tap quote generation → PDF → SMS → client receives
- CTA: "Try the free demo"
- Landing: https://flowio.tradeanchor.com.au#test-drive

**Ad Copy Option 1:**
```
Still doing quotes on your phone at 9pm? 🔧

Flowio turns Google Sheets into a complete quoting system for tradies.

✅ 1-tap professional PDF quotes
✅ Auto-SMS to clients
✅ Online acceptance + payment
✅ No monthly fees — ever

Try the free interactive demo (no sign-up needed):
👉 flowio.tradeanchor.com.au
```

**Ad Copy Option 2:**
```
$29-$349/month for job management software you barely use?

There's a better way.

Flowio runs inside Google Sheets — software you already know.
One-time setup. No subscriptions. Your data, forever.

Try it free: flowio.tradeanchor.com.au
```

**Ad Copy Option 3:**
```
How much time do YOU spend on quotes per week?

Most sparkies we talk to say 5-10 hours. That's $400-$800/week
in lost billable time.

Flowio cuts quoting to under 2 minutes. One tap. Done.

See how it works (free demo, no sign-up):
👉 flowio.tradeanchor.com.au
```

---

### Campaign B: Lead Ad (Quoting Audit)
**Objective:** Lead Generation
**Budget:** $10-15/day
**Duration:** Ongoing

**Targeting:** Same as Campaign A

**Ad Format:** Lead Form (stays on Facebook, higher conversion rate)

**Lead Form Fields:**
1. Full Name (pre-filled)
2. Email (pre-filled)
3. Phone Number (pre-filled)
4. Trade (custom question, dropdown: Electrician/Plumber/HVAC/Painter/Other)

**Ad Copy:**
```
How much is your quoting process ACTUALLY costing you? 📊

Take our free 30-second Quoting Cost Audit and find out:
→ How many hours/year you spend on quotes
→ What that costs in lost billable time
→ How to cut it by 90%

Free personalised report sent to your inbox.
```

**Thank You Screen:**
- Message: "Check your email! Your Quoting Cost Audit is on its way."
- CTA Button: "Try the Free Demo" → https://flowio.tradeanchor.com.au#test-drive

**Automation:** Lead Ad webhook → S6 scenario → Pipeline + Welcome email

---

### Campaign C: Retargeting (Week 3+)
**Objective:** Conversions
**Budget:** $5-10/day

**Targeting:**
- Custom Audience: Website visitors (last 30 days) who didn't book
- Custom Audience: Test Drive completers who didn't book
- Lookalike: 1% lookalike of all leads

**Ad Format:** Testimonial video or case study card

**Ad Copy:**
```
"I was spending 2 hours a day on quotes. Now it takes me 5 minutes."
— [Testimonial name], Electrician, Sydney

Flowio turns Google Sheets into your complete quoting system.
No monthly fees. No learning curve. Live in 48 hours.

Only $1,997 one-time (or 3x $699/mo).

👉 Book a 15-min Fit Call: calendly.com/billing-tradeanchor/15min
```

---

## Meta Pixel Setup

Your website already has Meta Pixel tracking with these events:
- **PageView:** Auto-tracked on all pages
- **Schedule:** Fires on `/booking-confirmed` page (Calendly completion)

### Additional Events to Add (future):
- **Lead:** When Test Drive form is submitted
- **ViewContent:** When pricing section is viewed
- **InitiateCheckout:** When "Book a Fit Call" is clicked

### Custom Conversions to Create in Meta:
1. **Booking Completed:** URL contains `/booking-confirmed`
2. **Test Drive Started:** Custom event (add to Test Drive form submit)

---

## Weekly Optimization Checklist

| Day | Action |
|-----|--------|
| Monday | Review weekend performance. Kill any ad sets with CPA > $50 |
| Wednesday | Review mid-week metrics. Adjust budgets toward best performers |
| Friday | Create 1-2 new ad variations for next week. Update retargeting audiences |

### KPIs to Track (in Ad Tracker tab)
| Metric | Target |
|--------|--------|
| Cost per click (CPC) | < $2.00 |
| Cost per lead (CPL) | < $15 |
| Cost per demo completion | < $25 |
| Cost per booking | < $75 |
| Cost per install | < $300 |
| ROAS (at $1,997/install) | > 6x |

### When to Scale
- If CPA < $50 for 3+ days → increase budget by 20%
- If CPA > $80 for 3+ days → pause and test new creative
- If CTR < 1% → test new hooks/thumbnails
- If landing page conversion < 5% → review website copy/CTA
