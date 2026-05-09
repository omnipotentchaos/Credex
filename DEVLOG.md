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
