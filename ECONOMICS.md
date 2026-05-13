# Unit Economics — CredexAudit

> Cost analysis and revenue model for CredexAudit as a Credex growth tool

## Cost Structure (Monthly)

CredexAudit is designed to run near-zero marginal cost per audit:

| Item | Cost | Notes |
|------|------|-------|
| **Vercel hosting** | $0 | Free tier: 100GB bandwidth, 100k edge invocations |
| **Supabase** | $0 | Free tier: 500MB database, 50k auth users |
| **Cerebras API** | ~$0.50/1k audits (order-of-magnitude) | Llama 3.1 8B: short summaries (~150 tokens); check [Cerebras pricing](https://inference-docs.cerebras.ai/) for current rates |
| **Resend email** | $0 | Free tier: 100 emails/day (3k/mo) |
| **Domain** | ~$12/year | Optional — currently on Vercel subdomain |

**Total cost at 1,000 audits/month: ~$1.50**

The key economic insight: AI summary costs are negligible because we use Cerebras's fast-inference LLaMA models (not GPT-4 or Claude), and summaries are short (~120 words). The template fallback means we pay $0 when the API is unavailable.

## Revenue Model

CredexAudit is a **lead generation tool**, not a revenue product. It monetizes through Credex marketplace conversions:

### Credex Revenue Per Lead

Credex earns a margin on discounted AI credit transactions. Conservative estimates:

| Scenario | Monthly credit purchase | Credex margin (est. 8%) | Annual revenue |
|----------|------------------------|------------------------|----------------|
| Small team (3 devs) | $200/mo | $16/mo | $192 |
| Mid team (10 devs) | $800/mo | $64/mo | $768 |
| Growth team (25 devs) | $2,500/mo | $200/mo | $2,400 |

### Funnel Economics

```
1,000 audits/month
  → 250 leads captured (25% conversion)
  → 38 Credex marketplace clicks (15% of leads)
  → 8 credit purchases (20% close rate)
  → avg $500/mo credit purchase
  → $40/mo Credex margin per customer
  → $320/mo incremental revenue
  → $3,840/year from 1k monthly audits
```

### Customer Acquisition Cost (CAC)

- **Cost to acquire 1,000 audits:** ~$1.50 (infrastructure) + ~$0 (organic distribution)
- **Cost per lead:** $0.006
- **Cost per paying customer:** $0.19
- **LTV:CAC ratio:** $480 LTV (12 months × $40/mo) ÷ $0.19 CAC = **~2,500x**

This is an extreme ratio because the tool is free and distribution is organic. Even at 10x the infrastructure cost and adding $500/mo for content marketing, the ratio remains >50x.

## Break-Even Analysis

CredexAudit breaks even at **1 Credex conversion per month** (~$40/mo revenue vs ~$1.50/mo cost). Every conversion above that is pure margin for Credex's marketplace business.

## Scaling Economics

At 10,000 audits/month:

| Item | Cost |
|------|------|
| Vercel Pro | $20/mo |
| Supabase Pro | $25/mo |
| Cerebras API | ~$5/mo |
| Resend Pro | $20/mo |
| **Total** | **$70/mo** |

Revenue at 10k audits (same conversion rates): **$3,200/mo**. Margin: **97.8%**.

## Why This Model Works

1. **Zero marginal cost per audit** — The audit engine is a pure function (no API calls). Only the optional AI summary costs money.
2. **Pre-qualified leads** — Every lead has already quantified their AI spend and seen that savings exist. This is dramatically warmer than cold outreach.
3. **Natural Credex integration** — The "save with Credex credits" recommendation is a genuine audit finding, not an ad. Users trust it because the rest of the audit was honest.
4. **Compounding returns** — Shareable audit URLs mean each audit can generate 2–3 additional audits through social sharing, at zero incremental cost.
