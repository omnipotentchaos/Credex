# DEVLOG — BurnLens

## Day 0 — 2025-05-09

**Hours worked:** 2

**What I did:**
- Set up the project with Next.js 16, TypeScript, and Tailwind CSS
- Designed and implemented the full design system (CSS custom properties, dark mode, typography, animations)
- Built the landing page with hero section, 3-step "How it works", feature grid, tool showcase, and CTA
- Created project structure with all placeholder markdown files
- Set up GitHub repo and deployed initial commit
- Researched the Credex assignment requirements and created a 4-day execution plan

**What I learned:**
- Next.js 16 ships with Tailwind v4 out of the box now, which uses `@import "tailwindcss"` instead of the old `@tailwind` directives
- The assignment weights entrepreneurial thinking at 25% — more than any single engineering dimension. The .md files aren't busywork.

**Blockers / what I'm stuck on:**
- Need to finalize Supabase schema and Cerebras API access before Day 1
- User interviews — sent out DMs, waiting for responses

**Plan for tomorrow:**
- Build the full multi-tool spend input form with localStorage persistence
- Research and document ALL pricing data for 8+ tools
- Start building the audit engine core logic

---

## Day 1 — 2025-05-10

**Hours worked:** 3

**What I did:**
- Fixed CSS import ordering bug (Google Fonts `@import` must precede Tailwind's `@import "tailwindcss"` in v4)
- Researched and verified pricing for all 8 AI tools directly from vendor pricing pages
  - Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf
- Built `src/lib/pricing-data.ts` — complete TypeScript constants with all plans, prices, features, and metadata
- Built `src/lib/audit-engine.ts` — rule-based audit engine with 6 distinct checks:
  1. **Plan-fit** — Detects team plans used by individuals
  2. **Cheaper plan** — Same vendor, lower-tier plan that still fits
  3. **Overpaying** — Actual spend vs retail price discrepancy
  4. **Seat right-sizing** — More seats than team members
  5. **Cross-tool alternatives** — Comparable tools at lower cost
  6. **Credex credits** — Estimated 15% discount via Credex marketplace
- Built full spend input form (`/audit`) with:
  - Dynamic tool selection (8 tools, prevents duplicates)
  - Plan/seats/monthly spend fields with auto-calculation
  - Team size and use case selectors
  - localStorage persistence (auto-save)
  - Summary bar with real-time totals
- Built audit results page (`/audit/results`) with:
  - Hero savings display (annual projection)
  - 3-stat overview row (spend, savings, optimization score)
  - Per-tool expandable cards with recommendation rows
  - Credex CTA banner
- Created `PRICING_DATA.md` with verified URLs, tabular pricing, and methodology notes

**What I learned:**
- Copilot pricing is transitioning to usage-based billing, with Pro+ at $39/mo being the new premium tier
- Windsurf (Cognition AI) now matches Cursor's Pro pricing at $20/mo
- Claude Team is $25/seat vs ChatGPT Team at $25/seat — nearly identical positioning
- OpenAI blocks direct HTTP fetching of pricing pages (403), had to use web search

**Blockers / what I'm stuck on:**
- Need to wire up Supabase for persistent audit storage and shareable URLs
- Cerebras API integration for AI-powered summary still pending (Day 2)

**Plan for tomorrow:**
- Set up Supabase schema (audits table, leads table)
- Build shareable audit URL with server-side rendering
- Integrate Cerebras API for personalized audit summary
- Add lead capture form (email + company)
- Polish landing page with final copy

---

## Day 2 — 2025-05-11

**Hours worked:** 3

**What I did:**
- Wrote 13 unit tests for the audit engine covering all 6 rules + edge cases:
  - Savings tier classification (4 tests)
  - Empty input, plan-fit, overpay, seat right-sizing, cross-tool, Credex credits
  - Optimal scenario, annual calculation, multi-tool aggregation
- Set up Vitest with jsdom environment and `@/` path alias
- Created GitHub Actions CI workflow (lint → test → typecheck → build)
- Built Cerebras API integration (`src/lib/cerebras.ts`):
  - OpenAI-compatible chat completions at `api.cerebras.ai/v1`
  - LLaMA 4 Scout 17B model
  - Robust template fallback when API key missing or call fails
- Built API routes:
  - `POST /api/audit/summary` — AI summary generation
  - `POST /api/leads` — Lead capture with honeypot spam protection
  - Supabase integration when configured, console log fallback for dev
- Added AI Summary card to results page with loading state and source badge
- Added lead capture form to results page (email + company + honeypot)
- Documented all tests in `TESTS.md` (13 tests, how to run, CI integration)
- Documented all prompts in `PROMPTS.md` (system prompt, reasoning, iteration history, fallback strategy)

**What I learned:**
- Cerebras uses the exact OpenAI API format — just change the base URL
- Honeypot fields are a simple, effective anti-spam technique that doesn't annoy real users
- Vitest with jsdom is extremely fast — 13 tests in 11ms

**Blockers / what I'm stuck on:**
- Need to set up actual Supabase tables and test the full lead → email flow
- User interviews still pending


**Plan for tomorrow:**
- Write GTM.md and ECONOMICS.md (entrepreneurial docs)
- Write REFLECTION.md
- Add number animations and polish to results page
- Finalize ARCHITECTURE.md with Mermaid diagram

---

## Day 3 — 2025-05-12

**Hours worked:** 3

**What I did:**
- Wrote GTM.md (600+ words): positioning, target audience, 5 distribution channels (Twitter, Reddit, Product Hunt, LinkedIn, newsletter partnerships), conversion funnel, 30-day metrics goals
- Wrote ECONOMICS.md (500+ words): full cost structure table, revenue model with funnel math, CAC/LTV analysis ($0.19 CAC vs $480 LTV = 2,500x), break-even at 1 conversion/month, scaling economics to 10k audits
- Wrote METRICS.md (400+ words): North Star metric (qualified leads/week), 3 input metrics with targets and reasoning, instrumentation priority, specific pivot trigger
- Wrote LANDING_COPY.md: hero, subheadline, 2 CTAs, value prop cards, how-it-works steps, 5 FAQs, trust signals
- Wrote REFLECTION.md: 5 questions with real stories (CSS import bug, design reversal, Week 2 roadmap, honest AI usage breakdown, self-ratings)
- Finalized ARCHITECTURE.md: Credex-branded Mermaid diagram, accurate data flow (10 steps), 3 key architecture decisions with trade-offs, file structure map, scaling plan
- Updated README.md: 5 trade-off decisions with reasoning, full documentation index, complete quick-start instructions

**What I learned:**
- The entrepreneurial docs forced me to think about Credex's actual business model — every audit that finds savings is a pre-qualified lead
- Writing the economics math revealed that BurnLens has near-zero marginal cost because the audit engine is client-side
- The LTV:CAC ratio for Credex leads is absurdly high because acquisition is organic and the tool is free

**Blockers / what I'm stuck on:**
- User interviews — still need to reach out to 3 real users
- Shareable URLs (Supabase persistence) not yet implemented

**Plan for tomorrow:**
- Take screenshots of all 3 pages for README
- Add number count-up animations to results page
- Polish mobile responsive design
- Set up Vercel deployment

---

## Day 4 — 2026-05-13

**Hours worked:** 4

**What I did:**
- Created `supabase-schema.sql` — full schema for `audit_results` and `leads` tables with RLS policies, indexes, and anonymous read/write for shareable URLs
- Created `src/lib/supabase.ts` — singleton Supabase client with graceful null return when env vars not configured
- Created `POST /api/audit/save` — saves audit to Supabase + returns 10-char nanoid `share_id`; falls back gracefully when Supabase not configured
- Created `GET /api/audit/[shareId]` — fetches public audit by share_id for the share page
- Created `/audit/share/[shareId]` page — server-rendered with dynamic OG + Twitter Card meta tags (title includes savings amount, description includes tool count)
- Created `SharedAuditClient.tsx` — read-only audit view with share button, tool cards, AI summary, and "Run Your Own Audit" CTA
- Updated results page — on mount: saves audit to Supabase, gets `share_id`, copy link uses `share_id` URL, `share_id` passed to lead capture for email deep-link
- Updated leads API — added full Resend email integration with branded HTML template (teal card, green savings number, deep-link back to shared audit)
- Updated leads API — wired up Supabase client for lead persistence
- Added accessibility: skip-to-content link, `theme-color` meta, `focus-visible` outlines, `prefers-reduced-motion` support
- All routes now: `/` `/audit` `/audit/results` `/audit/share/[shareId]` + 4 API routes

**What I learned:**
- Next.js 16 App Router `params` is now a `Promise<{...}>` — must `await params` in server components and API routes
- nanoid was already in the dependency tree (pulled in by another package) — no install needed
- RLS policies for anonymous access in Supabase require both `FOR SELECT` and `FOR INSERT` policies explicitly

**Blockers / what I'm stuck on:**
- Supabase tables not yet created in live project — need to run `supabase-schema.sql` in the dashboard
- Vercel not yet deployed

**Plan for tomorrow:**
- Run `supabase-schema.sql` in Supabase dashboard (user action)
- Deploy to Vercel + set env vars
- Add number count-up animations to results page hero stats
- Take screenshots for README
- Write DEVLOG Day 5
