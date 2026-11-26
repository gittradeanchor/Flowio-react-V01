# Nurture Email & SMS Templates

All templates are personalized with lead name and trade. Sent automatically by Make.com S3 (Nurture Sequence).

---

## Email Sequence (4 emails over 7 days)

### Day 0: Welcome + Value Nudge
**Subject:** `{{name}}, here's what your competitors are doing differently`
**Trigger:** Immediately after Test Drive or Audit completion

```
G'day {{name}},

Thanks for checking out TradeAnchor! Quick question: how many quotes do you
send per week?

Most {{trade}}s we talk to spend 30-45 minutes per quote. That's 20+ hours
a month on paperwork instead of billable work.

Flowio cuts that to under 2 minutes per quote. One tap, professional PDF,
sent via SMS, tracked automatically. All inside Google Sheets.

Want to see it work? Try the free Test Drive:
https://tradeanchor.com.au#test-drive

Or if you'd rather just chat:
https://calendly.com/billing-tradeanchor/15min

Cheers,
Sean | TradeAnchor
```

---

### Day 2: Social Proof / Pain Agitation
**Subject:** `Why 78% of tradies quit their job management software`

```
G'day {{name}},

Here's something wild: 78% of tradies who sign up for job management
software (ServiceM8, Jobber, Tradify) cancel within 12 months.

Why? Three reasons:
- Too complex (takes weeks to learn, half the features go unused)
- Too expensive ($29-$349/month adds up fast)
- You never own your data (cancel and it's gone)

Flowio is different:
- It runs inside Google Sheets — software you already know
- One-time setup fee. No monthly subscriptions. Ever.
- Your data lives in YOUR Google account forever

The average tradie saves 15-20 hours/month on admin after setup.
That's 2-3 extra billable days.

See it in action (takes 2 minutes):
https://tradeanchor.com.au#test-drive

Sean | TradeAnchor
```

---

### Day 4: ROI Breakdown + Booking CTA
**Subject:** `The maths: how Flowio pays for itself in 7 weeks`

```
G'day {{name}},

Let me break down the numbers for a typical {{trade}}:

- Average {{trade}} sends 15 quotes/week, spending ~30 min each
- That's 390 hours/year on quoting alone
- At $80/hour billable rate, that's $31,200 in lost productive time

Flowio costs $1,997 one-time (or 3x $699/mo if you prefer to spread
it out).

At just 5 extra billable hours recovered per week, it pays for itself
in 7 weeks. After that? Pure profit. No monthly fees eating into your
margin.

And if you're not sure about the full system, we also have Flowio Lite
at $497 — just the quoting module. Upgradeable anytime.

Let's run the numbers for YOUR business specifically:
https://calendly.com/billing-tradeanchor/15min
(15 minutes, no obligation, just maths)

Sean | TradeAnchor
```

---

### Day 7: Final Nudge + Urgency
**Subject:** `Last call: 2 install spots left this week`

```
G'day {{name}},

Quick heads up — we've only got 2 DFY install spots left this week.
Each install takes 48 hours of setup + testing, so we cap it at 3
per week to keep quality high.

Here's everything you get with a Flowio Full install ($1,997 one-time):

✅ Professional PDF quotes from Google Sheets (1-tap)
✅ Auto SMS to clients with quote link
✅ Client accepts online → auto calendar booking
✅ Stripe payment collection
✅ Xero invoice sync
✅ Automatic follow-ups for unpaid quotes
✅ Done-for-you setup in 48 hours
✅ Pre-loaded price list for your trade
✅ Full refund if not live in 48 hours

Or start with Flowio Lite ($497) — just the quoting engine,
upgradeable anytime for $1,500.

No monthly fees. No learning curve. Your data, your Google account,
forever.

Grab your spot:
https://calendly.com/billing-tradeanchor/15min

Sean | TradeAnchor
Sydney, Australia
```

---

## SMS Templates (sent by S4 Follow-Up Engine)

### 48h No-Response SMS
```
Hey {{name}}, Sean from TradeAnchor here. Saw you checked out Flowio -
want to see a 60-sec demo of how it works for {{trade}}s?
https://tradeanchor.com.au#test-drive
```

### Post-Install Day 7 SMS (optional, use if email unread)
```
Hey {{name}}, how's Flowio going? Any questions about the setup?
Happy to help — just reply here or WhatsApp me: wa.me/61494186989
```

---

## Post-Install Emails (sent by S5)

### Day 7: Check-In
**Subject:** `How's Flowio going, {{name}}?`

```
G'day {{name}},

It's been about a week since we set up Flowio for you. How's it going?

Quick questions:
- Have you sent your first few quotes?
- Anything confusing or not working as expected?
- Any features you wish it had?

Happy to jump on a quick call if anything needs tweaking. Just reply
to this email or WhatsApp me: https://wa.me/61494186989

Cheers,
Sean
```

### Day 14: Review + Referral Request
**Subject:** `Quick favour, {{name}}? (+ $200 for you)`

```
G'day {{name}},

Hope Flowio's been saving you time!

I've got two quick asks (both benefit you):

1. QUICK VIDEO TESTIMONIAL (60 sec)
Would you be open to recording a 60-second selfie video about your
experience with Flowio? Just your phone, casual, no script needed.
Something like:
- What you do and where you're based
- What quoting was like before
- How Flowio has helped

I'd feature it on the website (with your permission).

2. REFER A MATE = $200 EACH
Know another tradie who's drowning in paperwork? If they sign up for
Flowio, you BOTH get $200 off (or $200 cash if you've already paid
in full).

Just have them mention your name when they book:
https://calendly.com/billing-tradeanchor/15min

Also, if you've got 30 seconds, a Google review would mean the world:
[INSERT YOUR GOOGLE REVIEW LINK]

Cheers,
Sean
```

---

## Audit Results Email (sent by S2)

**Subject:** `{{name}}, you're losing ${{annualCostWasted}}/year on quoting`

*(Full HTML template is in the S2-audit-generator.json blueprint)*

Key data points displayed:
- Annual hours wasted on quoting
- Annual cost of that wasted time
- Breakdown by weekly quotes × time × rate
- CTA to Test Drive + Booking
