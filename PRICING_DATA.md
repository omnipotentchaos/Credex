# PRICING_DATA.md — Verified AI Tool Pricing

> Last updated: **2026-05-13** — Cursor, Copilot, Claude, ChatGPT, Windsurf, and Anthropic “Latest models” cross-checked against **your May 2026 screenshots**; Gemini API table still aligned to Google doc **2026-05-08 UTC**.

## 1. Cursor (Anysphere)
**Source**: [cursor.com/pricing](https://www.cursor.com/pricing) — figures below match **May 2026** pricing page captures (monthly vs yearly toggle).

| Plan | Monthly (USD) | Yearly equivalent (USD) | Notes |
|------|----------------|---------------------------|--------|
| Hobby | Free | Free | No card; limited agent + tab completions |
| Individual **Pro** | **$20**/user/mo | **~$16**/user/mo | Pro / Pro+ / Ultra are sub-tiers on Individual; screenshot showed **$20** with **Pro** selected (monthly) and **~$16** with yearly billing |
| Individual **Pro+** | **$60**/user/mo | — (toggle yearly on cursor.com) | Higher usage vs Pro; 3× on OpenAI, Claude, Gemini (vendor copy) |
| Individual **Ultra** | **$200**/user/mo | — (toggle yearly on cursor.com) | Top Individual quota; 20× vs Pro (vendor copy) |
| **Teams** | **$40**/user/mo | **~$32**/user/mo | Everything in Individual + team admin, SSO, analytics, centralized billing |
| Enterprise | Custom | Custom | Pooled usage, invoice/PO, SCIM, audit logs, priority support |

---

## 2. GitHub Copilot (GitHub / Microsoft)
**Source**: [github.com/features/copilot/plans](https://github.com/features/copilot/plans) — **May 2026** screenshots (“For individuals” / “For businesses”).

**Individuals**

| Plan | Price/seat/mo | Notes |
|------|---------------|--------|
| Free | $0 | 50 agent/chat requests/mo, 2,000 completions/mo; Haiku 4.5, GPT-5 mini, etc. |
| Pro | **$10** | Cloud agent, code review, Claude & Codex, 300 premium requests (screenshot noted **upgrade pauses** while billing changes — verify before purchase) |
| Pro+ | **$39** | All models incl. Claude Opus 4.7, ~5× premium requests vs Pro |

**Business**

| Plan | Price/seat/mo | Notes |
|------|---------------|--------|
| Business | **$19** | Same headline features as Pro + org controls, unlimited agent/chat with GPT-5 mini, SAML, metrics |
| Enterprise | **$39** (“Best value” in capture) | More premium requests vs Business, GitHub Spark, etc. |

---

## 3. Claude (Anthropic)
**Source**: [anthropic.com/pricing](https://www.anthropic.com/pricing) — **May 2026** captures (Individual / Team & Enterprise toggles).

**Individual**

| Plan | Price | Notes |
|------|-------|--------|
| Free | $0 | Chat on web, iOS, Android, desktop |
| Pro | **$20/mo** billed monthly, or **$17/mo** effective when billed **annually** ($200/yr upfront in screenshot) | Claude Code, Cowork, more usage than Free |
| Max | **From $100/mo** | 5× or 20× more usage than Pro; higher limits + priority |

**Team & Enterprise (screenshot)**

| Plan | Price | Notes |
|------|-------|--------|
| Team — **Standard** seat | **$25**/seat/mo monthly · **$20**/seat/mo if billed annually | Claude Code & Cowork; M365/Slack connectors; enterprise search |
| Team — **Premium** seat | **$125**/seat/mo monthly · **$100**/seat/mo if billed annually | ~5× usage vs standard seats |
| Enterprise | **$20**/seat + usage at API rates | Spend limits, SCIM, audit logs, Google Docs cataloging (per capture) |

---

## 4. ChatGPT (OpenAI)
**Source**: [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing) — **May 2026** individual pricing capture + business plans capture.

**Individual**

| Plan | Price/seat/mo | Notes |
|------|---------------|--------|
| Free | $0 | Limited GPT-5.5 Instant, messages, uploads, images, memory, Codex |
| **Go** | **$8** | More GPT-5.5 Instant, messages, uploads, images, longer memory |
| Plus | **$20** | GPT-5.5 Thinking, expanded limits, deeper research / agent mode |
| Pro | **From $100** | 5×/20× usage tiers, GPT-5.5 Pro, max Codex (capture showed time-limited Codex promo to **2026-05-31**) |

**Business & Enterprise (second capture)**

| Plan | Price | Notes |
|------|-------|--------|
| Business **Codex** | Usage-based, **no fixed seat fee** | Pay-as-you-go for dev teams |
| Business **ChatGPT & Codex** | **$20**/user/mo | Workspace, SAML, MFA, 60+ apps, no training on data |
| Enterprise | Custom | SCIM, EKM, data residency, 24/7 support, invoicing |

---

## 5. Anthropic API (“Latest models” — May 2026 screenshot)
**Source**: [anthropic.com/pricing#api](https://www.anthropic.com/pricing#api)

Per **1M tokens USD** (Standard list from capture):

| Model | Input | Output | Prompt cache write / read (per MTok) |
|-------|-------|--------|----------------------------------------|
| **Opus 4.7** | $5 | $25 | Write $6.25 · Read $0.50 |
| **Sonnet 4.6** | $3 | $15 | Write $3.75 · Read $0.30 |
| **Haiku 4.5** | $1 | $5 | Write $1.25 · Read $0.10 |

Older docs often cited Haiku/Sonnet/Opus **3.x** rates; treat the table above as the **current** list for new builds.

---

## 6. OpenAI API
**Source**: [openai.com/pricing](https://openai.com/pricing)

Usage-based pricing. Key rates (per 1M tokens):
- GPT-5 mini: ~$0.15 input / $0.60 output
- GPT-5: ~$5 input / $15 output
- GPT-5.4: ~$2.50 input / $10 output

---

## 7. Gemini (Google)
**Source**: [ai.google.dev/pricing](https://ai.google.dev/pricing) — page footer **Last updated 2026-05-08 UTC**; spot-checked against live docs **2026-05-13**.

### API account tiers (Gemini Developer API)
| Tier | What you pay | Notes |
|------|----------------|-------|
| **Free** | $0 | Limited models; free input/output tokens on supported models; content may be used to improve products (see Google terms). |
| **Paid** | Prepaid / pay-as-you-go | Higher limits, context caching, batch API (~50% vs standard on supported calls), advanced models; content not used to improve products (per Google’s paid-tier description). |
| **Enterprise** | Custom | Sales-led: security, compliance, provisioned throughput, volume discounts, etc. |

### Paid tier — selected model rates (**Standard**, per **1M tokens USD**)
Figures below are from Google’s pricing tables on **2026-05-08** (same as your export). *Batch / Flex / Priority* modes and caching/grounding extras are omitted here; see the official page for full matrices.

| Model id (examples) | Input | Output (incl. thinking where noted) |
|---------------------|-------|--------------------------------------|
| **gemini-3.1-flash-lite** | $0.25 (text/image/video), $0.50 (audio) | $1.50 |
| **gemini-3.1-pro-preview** | $2.00 (prompts ≤200k tok), $4.00 (&gt;200k) | $12.00 (≤200k), $18.00 (&gt;200k) |
| **gemini-3.1-flash-lite-preview** | Same as flash-lite above | Same output |
| **gemini-3-flash-preview** | $0.50 (text/image/video), $1.00 (audio) | $3.00 |
| **gemini-2.5-pro** | $1.25 (≤200k), $2.50 (&gt;200k) | $10.00 (≤200k), $15.00 (&gt;200k) |
| **gemini-2.5-flash** | $0.30 (text/image/video), $1.00 (audio) | $2.50 |
| **gemini-2.5-flash-lite** | $0.10 (text/image/video), $0.30 (audio) | $0.40 |

**Deprecation (Google):** `gemini-2.0-flash` and `gemini-2.0-flash-lite` are marked deprecated with shutdown **2026-06-01** — migrate to 2.5 / 3.x families.

### Consumer / Google One (not the same as API list above)
**Source**: [one.google.com/about/plans](https://one.google.com/about/plans) (verify locally — product naming changes).

| Product | Typical list | Notes |
|---------|--------------|--------|
| **Google One AI Premium** (“Gemini Advanced”) | **$19.99/mo** (often billed as **~$20/mo**) | Bundled consumer subscription (2TB, Gemini in apps, etc.) — **not** token-identical to API “Gemini 2.5 Pro” pricing. |

### CredexAudit implementation note
The app’s **audit engine does not ingest per-model API token prices**. Plans flagged `isApi: true` in `pricing-data.ts` are treated as **usage-based / unpredictable spend** (no automated $/token savings math). Only **fixed monthly per-seat** style plans drive downgrade/right-size recommendations.

---

## 8. Windsurf (Cognition AI)
**Source**: [windsurf.com/pricing](https://windsurf.com/pricing) — **May 2026** capture (“Individual” + “Team” sections).

| Plan       | Price/seat/mo | Notes                                    |
|------------|---------------|------------------------------------------|
| Free       | $0            | Light agent quota, limited models, unlimited tab completions |
| Pro        | **$20**       | POPULAR; 2-week trial in capture; frontier OpenAI, Claude, Gemini; SWE-1.6 |
| Max        | **$200**      | NEW badge; much higher quotas            |
| Teams      | **$40**       | Everything in Pro + centralized billing, admin, analytics |
| Enterprise | Custom        | Contact us; RBAC, SSO, hybrid deployment |

---

## Methodology

1. **Primary sources**: Official pricing URLs + **May 2026 UI screenshots** (Cursor, Copilot, Claude consumer + API cards, ChatGPT individual + business, Windsurf).
2. **Cross-validation**: Where screenshots conflict with older markdown, **screenshots win** for this revision.
3. **API prices**: Gemini and Anthropic API sections use **per-million-token** figures from vendor tables / captures; CredexAudit still treats `isApi` plans as non–seat-based for automated savings math.
4. **Custom plans**: Marked `-1` in code; excluded from deterministic savings totals.
5. **Screenshots on disk**: If you add PNGs under `docs/pricing-screenshots/`, link them here for reviewers.
