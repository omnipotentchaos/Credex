# Metrics — CredexAudit

## North Star Metric

**Qualified leads generated per week** — defined as users who complete an audit showing ≥$100/mo in savings AND submit their email.

This metric directly measures CredexAudit's value to Credex. A qualified lead has self-identified their AI spend pain, seen that savings exist, and opted in for follow-up. It captures both product quality (the audit must be compelling enough to complete) and business value (the lead is pre-qualified for Credex's marketplace).

## Input Metrics

### 1. Audit Completion Rate
**Definition:** % of users who land on `/audit` and reach `/audit/results`
**Target:** ≥60%
**Why it matters:** If users drop off mid-form, the audit UX is broken or the value proposition isn't clear. This is the most controllable lever — improvements to form design directly increase completions. Instrument by tracking `sessionStorage` writes for audit results vs `/audit` page views.

### 2. Savings Found Per Audit (Average $)
**Definition:** Mean `totalMonthlySavings` across all completed audits
**Target:** ≥$80/month
**Why it matters:** If the average savings is too low, either our pricing data is stale, our rules aren't aggressive enough, or users are already well-optimized. This metric tells us whether the product is delivering enough value to drive Credex conversions. Too high might mean our rules are unrealistic; too low means users won't act.

### 3. Credex CTA Click-Through Rate
**Definition:** % of users on the results page who click "Explore Credex Credits"
**Target:** ≥12%
**Why it matters:** This is the direct conversion point for Credex's business. If savings are found but users don't click through, the CTA positioning, copy, or trust level needs work. This metric connects product output to business outcome.

## What to Instrument First

In priority order (first week of launch):

1. **Page view tracking** — Landing → Audit → Results funnel. Use Vercel Analytics (zero-config) to see drop-off points.
2. **Audit result events** — Log `totalMonthlySavings`, `toolCount`, `savingsTier` to Supabase on each completed audit. This is the core data for evaluating product quality.
3. **CTA click events** — Track clicks on "Explore Credex Credits" and "Send Report" buttons via simple `fetch` to a logging endpoint. No external analytics SDK needed.
4. **Email capture rate** — Already tracked in the leads table. Compare leads count vs audit count.

## Pivot Trigger

**If after 500 audits, the average savings found is <$30/month**, the audit engine isn't surfacing enough value. Action plan:

1. First, check if pricing data is outdated (vendors change prices quarterly).
2. Second, add more aggressive rules: duplicate tool detection (Cursor + Copilot overlap), seasonal commitment discounts, annual plan recommendations.
3. Third, if savings are legitimately low for most teams, pivot to a **benchmarking angle**: "Your team spends $X/month on AI tools. Here's how that compares to similar teams." This still generates value and leads even when individual savings are small.
