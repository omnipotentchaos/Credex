# CredexAudit — AI Spend Audit

> **Stop overspending on AI tools.** CredexAudit is a free audit tool that helps startups and engineering teams find savings across Cursor, Copilot, Claude, ChatGPT, Gemini, and more — in under 2 minutes.

Built for [Credex](https://credex.rocks) — the marketplace for AI & cloud infrastructure credits.

## 🔗 Live Demo

**[→ Try CredexAudit](https://credex-seven-kappa.vercel.app/)** *(deployed on Vercel)*

## Screenshots

![Landing Page](/docs/screenshots/landing.png)
![Audit Form](/docs/screenshots/form.png)
![Audit Results](/docs/screenshots/results.png)

## Quick Start

```bash
# Clone
git clone https://github.com/omnipotentchaos/Credex.git
cd Credex

# Install
npm install

# Set up environment
cp .env.example .env.local
# Fill in your Supabase, Cerebras, and Resend keys

# Run locally
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict, no `any`) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database | Supabase (Postgres) |
| AI Summary | Cerebras API (Llama 3.1 8B) |
| Email | Resend |
| Testing | Vitest (13 tests, <15ms) |
| CI | GitHub Actions (lint → test → typecheck → build) |
| Deployment | Vercel |

## 5 Trade-Off Decisions

### 1. Client-Side Audit Engine vs. Server-Side API
**Chose:** Client-side (runs in browser)
**Why:** Zero latency, zero marginal cost, offline-capable. The audit engine is a pure function — no API secrets, no database reads. Trade-off: pricing data is bundled in the client (~8KB), but it changes quarterly so staleness isn't a concern.

### 2. Browser Storage vs. Database for Audit Flow
**Chose:** `localStorage` (form) + `sessionStorage` (results), then **Supabase** after results load
**Why:** The audit stays instant and anonymous until the user sees value; `POST /api/audit/save` then stores `input_data`, `result_data`, and a short `share_id` so `/audit/share/[shareId]` and OG tags work. Trade-off: if save fails, share links still work only from the current session until the user retries.

### 3. Template Fallback vs. AI-Only Summary
**Chose:** AI summary with deterministic template fallback
**Why:** The product should never break if the Cerebras API is down. The template uses the same audit data to produce a reasonable summary. A `source` badge ("Cerebras AI" vs "Auto-generated") maintains transparency. Trade-off: template summaries are less personalized.

### 4. Cerebras (Llama 3.1 8B) vs. Claude/GPT for Summaries
**Chose:** Cerebras
**Why:** Ultra-fast inference (~2200 tokens/s), free tier available, OpenAI-compatible API format. For ~120-word summaries, the quality difference vs. Claude Sonnet is negligible. Trade-off: smaller 8B model may hallucinate slightly more on edge cases, but we constrain output with specific prompts and length limits.

### 5. Light-Mode Credex Brand vs. Custom Dark Theme
**Chose:** Credex brand alignment (light mode, teal + green)
**Why:** CredexAudit is a Credex product — visual consistency builds trust and makes the Credex CTA feel native rather than an ad. Trade-off: developer audiences generally prefer dark mode, but brand consistency wins for a B2B tool.

## Documentation

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram, data flow, stack justification, scaling plan |
| [DEVLOG.md](DEVLOG.md) | Daily development log with hours, learnings, blockers |
| [PRICING_DATA.md](PRICING_DATA.md) | Verified pricing for all 8 AI tools with source URLs |
| [TESTS.md](TESTS.md) | All 13 tests documented with how to run |
| [PROMPTS.md](PROMPTS.md) | AI prompt engineering docs with iteration history |
| [GTM.md](GTM.md) | Go-to-market strategy with 5 specific channels |
| [ECONOMICS.md](ECONOMICS.md) | Unit economics with CAC/LTV math |
| [METRICS.md](METRICS.md) | North Star + 3 input metrics + pivot trigger |
| [LANDING_COPY.md](LANDING_COPY.md) | Full landing page copy with FAQs |
| [REFLECTION.md](REFLECTION.md) | 5 reflection questions with honest self-assessment |
| [USER_INTERVIEWS.md](USER_INTERVIEWS.md) | Three real user interviews (required for submission) |

## License

MIT
