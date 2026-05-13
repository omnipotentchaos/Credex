# 🎯 Credex AI Spend Audit — Battle Plan

> **Deadline**: May 16, 2026 (7 days from May 10)  
> **Today**: May 9, 2026 (night) — Day 0 (prep night)  
> **Submission**: Public GitHub repo + Live deployed URL + Google Form

---

## 📋 Executive Summary

You're building a **free AI spend audit tool** — a "Mint for AI tool spend" — that:
1. Takes user's AI tool spending data
2. Runs an audit engine with defensible logic
3. Shows savings opportunities with beautiful visuals
4. Generates an AI-powered personalized summary
5. Captures leads for Credex
6. Creates shareable audit result URLs

This is NOT a coding exercise. It's a **shippable product** that Credex could launch on Product Hunt.

---

## 🏗️ Technology Stack (with justifications for ARCHITECTURE.md)

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | **Next.js 14 (App Router)** | SSR for OG tags on shareable URLs, API routes eliminate separate backend, built-in image optimization, Vercel deploy is 1-click |
| **Language** | **TypeScript** | Required (strongly preferred), catches bugs, better DX |
| **Styling** | **Tailwind CSS + shadcn/ui** | Rapid development, consistent design system, accessible components out of the box |
| **Database** | **Supabase (Postgres)** | Free tier generous (500MB), real SQL, built-in auth if needed, REST API |
| **Email** | **Resend** | 100 free emails/day, excellent DX, React email templates |
| **AI** | **Anthropic Claude API** | Assignment prefers it, excellent for structured summaries |
| **Deployment** | **Vercel** | Zero-config Next.js deploy, edge functions, analytics |
| **Abuse Protection** | **Rate limiting (Upstash Redis) + honeypot field** | Free tier, simple, effective |
| **Testing** | **Vitest + React Testing Library** | Fast, modern, excellent Next.js support |
| **CI** | **GitHub Actions** | Required by assignment |

---

## 📊 Data Model

```
┌─────────────────────────────┐
│         audit_results       │
├─────────────────────────────┤
│ id          UUID (PK)       │
│ created_at  TIMESTAMP       │
│ input_data  JSONB           │  ← tools, plans, spend, seats
│ result_data JSONB           │  ← audit findings, savings
│ ai_summary  TEXT            │  ← personalized paragraph
│ total_monthly_savings DECIMAL│
│ total_annual_savings  DECIMAL│
│ share_id    VARCHAR (unique)│  ← short shareable ID
│ is_public   BOOLEAN         │
└─────────────────────────────┘

┌─────────────────────────────┐
│           leads             │
├─────────────────────────────┤
│ id          UUID (PK)       │
│ created_at  TIMESTAMP       │
│ email       VARCHAR         │
│ company     VARCHAR (nullable)│
│ role        VARCHAR (nullable)│
│ team_size   INT (nullable)  │
│ audit_id    UUID (FK)       │
│ savings_tier VARCHAR        │  ← 'high' | 'medium' | 'low' | 'optimal'
│ email_sent  BOOLEAN         │
└─────────────────────────────┘
```

---

## 📁 All Required Deliverable Files

### Engineering Files (8)
| File | Status | Notes |
|------|--------|-------|
| `README.md` | Build last day | Screenshots, quick start, 5 trade-offs |
| `ARCHITECTURE.md` | Start Day 1, refine Day 6 | Mermaid diagram, data flow, scale plan |
| `DEVLOG.md` | **Daily** — non-negotiable | 7 entries, honest hours, real blockers |
| `REFLECTION.md` | Day 6-7 | 5 questions, 150-400 words each |
| `TESTS.md` | Day 3-4 | List all tests, how to run |
| `.github/workflows/ci.yml` | Day 3 | Lint + test on push to main |
| `PRICING_DATA.md` | Day 2 | Every number → vendor URL + date |
| `PROMPTS.md` | Day 4 | Full prompts, reasoning, failures |

### Entrepreneurial Files (5)
| File | Status | Notes |
|------|--------|-------|
| `GTM.md` | Day 5-6 | 300-700 words, specific channels |
| `ECONOMICS.md` | Day 5-6 | 300-700 words, unit economics math |
| `USER_INTERVIEWS.md` | **Start reaching out Day 1** | 3 real conversations, direct quotes |
| `LANDING_COPY.md` | Day 5 | Hero, subheadline, CTA, FAQ |
| `METRICS.md` | Day 6 | North Star + 3 input metrics |

---

## 🗓️ 7-Day Execution Schedule

### 🌙 Day 0 — Tonight (May 9, prep)
**Goal**: Set up everything so Day 1 is pure execution

- [ ] Create new GitHub repo (public) with good name
- [ ] Initialize Next.js project with TypeScript + Tailwind + shadcn/ui
- [ ] Set up Supabase project + create tables
- [ ] Get Anthropic API key (apply for free credits if needed)
- [ ] Set up Resend account
- [ ] Set up Vercel project + connect repo
- [ ] Create all placeholder files (DEVLOG.md, ARCHITECTURE.md, etc.)
- [ ] First commit: `chore: initialize project with Next.js, TypeScript, Tailwind`
- [ ] **Start reaching out for user interviews** (DM 10+ people tonight)

> [!IMPORTANT]
> **Name suggestion**: Something memorable like "SpendLens", "AuditAI", "StackSaver", "CostPilot", or "BurnRate" — the name is part of the test.

---

### 📅 Day 1 — May 10 (Saturday)
**Focus**: Landing page + Spend input form + Pricing research  
**Target hours**: 6-8h  
**Commits**: 4-6

#### Morning (3-4h)
- [ ] Design and build landing page (hero, value prop, CTA)
- [ ] Implement the spend input form UI
  - Tool selector (8 tools with their plans)
  - Per-tool: plan dropdown, monthly spend input, number of seats
  - Team size + primary use case (coding/writing/data/research/mixed)
- [ ] Form state persistence via `localStorage`

#### Afternoon (3-4h)
- [ ] Research ALL pricing data for every tool + plan
- [ ] Write `PRICING_DATA.md` with every URL and date
- [ ] Draft `ARCHITECTURE.md` with Mermaid diagram
- [ ] Write DEVLOG Day 1 entry
- [ ] **Follow up on user interview DMs**

#### Commits
```
feat: add landing page with hero section and CTA
feat: implement multi-tool spend input form with plan selection
feat: persist form state across page reloads via localStorage
docs: add PRICING_DATA.md with verified vendor pricing
docs: draft ARCHITECTURE.md with system diagram
docs: add DEVLOG Day 1 entry
```

---

### 📅 Day 2 — May 11 (Sunday)
**Focus**: Audit engine (core business logic)  
**Target hours**: 6-8h  
**Commits**: 4-6

#### Morning (3-4h)
- [ ] Build the audit engine module (`lib/audit-engine.ts`)
- [ ] Implement per-tool analysis:
  - Plan-fit check (is Team plan overkill for 2 users?)
  - Same-vendor cheaper plan recommendation
  - Cross-vendor alternative recommendation
  - Credit discount opportunity (Credex angle)
- [ ] Create pricing data constants (`lib/pricing-data.ts`)

#### Afternoon (3-4h)
- [ ] Write defensible reasoning for each recommendation
- [ ] Build utility functions for savings calculations
- [ ] Write **5+ tests** for the audit engine (Vitest)
- [ ] Set up CI workflow (`.github/workflows/ci.yml`)
- [ ] Write DEVLOG Day 2 entry
- [ ] **Conduct user interview #1** (evening call)

#### Commits
```
feat: implement audit engine with plan-fit and alternative analysis
feat: add pricing data constants with all tool/plan combinations
test: add 5+ audit engine tests covering core scenarios
ci: add GitHub Actions workflow for lint and test
docs: add DEVLOG Day 2 entry
```

---

### 📅 Day 3 — May 12 (Monday)
**Focus**: Audit results page + Visual polish  
**Target hours**: 5-7h  
**Commits**: 3-5

#### Morning (2-3h)
- [ ] Build audit results page
  - Hero: total monthly + annual savings (big, beautiful numbers)
  - Per-tool breakdown cards
  - Current spend → recommendation → savings + reasoning
- [ ] Conditional Credex CTA:
  - \>$500/mo savings: prominent Credex consultation CTA
  - <$100/mo or optimal: honest "you're spending well" + newsletter signup

#### Afternoon (3-4h)
- [ ] Add animations (number count-up, card transitions)
- [ ] Mobile responsive design
- [ ] Implement flow: form → processing animation → results
- [ ] Write DEVLOG Day 3 entry
- [ ] Create `TESTS.md`
- [ ] **Conduct user interview #2**

#### Commits
```
feat: build audit results page with per-tool breakdown
feat: add conditional Credex CTA based on savings tier
style: add animations and responsive design to results
docs: add TESTS.md and DEVLOG Day 3 entry
```

---

### 📅 Day 4 — May 13 (Tuesday)
**Focus**: AI summary + Lead capture + Email  
**Target hours**: 5-7h  
**Commits**: 3-5

#### Morning (2-3h)
- [ ] Build API route for Anthropic Claude integration
- [ ] Generate ~100-word personalized audit summary
- [ ] Implement graceful fallback (templated summary on API failure)
- [ ] Write `PROMPTS.md` with full prompts + reasoning

#### Afternoon (3-4h)
- [ ] Build lead capture form (email + optional company/role/team size)
- [ ] Supabase integration for storing audits + leads
- [ ] Resend integration for transactional confirmation email
- [ ] Implement abuse protection (rate limiting + honeypot)
- [ ] Write DEVLOG Day 4 entry
- [ ] **Conduct user interview #3**

#### Commits
```
feat: integrate Anthropic API for personalized audit summary
feat: add templated fallback for API failures
feat: implement lead capture with Supabase storage
feat: add transactional email via Resend
feat: add rate limiting and honeypot abuse protection
docs: add PROMPTS.md and DEVLOG Day 4 entry
```

---

### 📅 Day 5 — May 14 (Wednesday)
**Focus**: Shareable URLs + OG tags + Entrepreneurial files  
**Target hours**: 5-7h  
**Commits**: 3-5

#### Morning (2-3h)
- [ ] Generate unique share IDs for each audit
- [ ] Build public audit result page (stripped of PII)
- [ ] Implement dynamic Open Graph meta tags (title, description, image)
- [ ] Twitter Card meta tags
- [ ] Test link previews on Twitter/LinkedIn/Slack

#### Afternoon (3-4h)
- [ ] Write `GTM.md` (300-700 words)
- [ ] Write `ECONOMICS.md` (300-700 words, with real math)
- [ ] Write `LANDING_COPY.md` (hero, subheadline, CTA, FAQ)
- [ ] Write `USER_INTERVIEWS.md` (3 interviews with quotes)
- [ ] Write DEVLOG Day 5 entry

#### Commits
```
feat: implement shareable audit URLs with unique IDs
feat: add Open Graph and Twitter Card meta tags
feat: strip PII from public audit views
docs: add GTM.md, ECONOMICS.md, LANDING_COPY.md
docs: add USER_INTERVIEWS.md with 3 real conversations
docs: add DEVLOG Day 5 entry
```

---

### 📅 Day 6 — May 15 (Thursday)
**Focus**: Polish + Documentation + Lighthouse  
**Target hours**: 5-7h  
**Commits**: 3-5

#### Morning (3h)
- [ ] Lighthouse audit — hit Performance ≥85, Accessibility ≥90, Best Practices ≥90
- [ ] Fix any accessibility issues (ARIA labels, contrast, keyboard nav)
- [ ] Performance optimization (lazy loading, image optimization, bundle size)
- [ ] Cross-browser testing

#### Afternoon (3-4h)
- [ ] Write `METRICS.md` (200-500 words)
- [ ] Write `REFLECTION.md` (5 questions, 150-400 words each)
- [ ] Finalize `ARCHITECTURE.md`
- [ ] Add more tests if < 5 passing
- [ ] Write DEVLOG Day 6 entry

#### Commits
```
perf: optimize Lighthouse scores for mobile
fix: resolve accessibility issues for screen readers
docs: add METRICS.md, REFLECTION.md
docs: finalize ARCHITECTURE.md with scale considerations
docs: add DEVLOG Day 6 entry
```

---

### 📅 Day 7 — May 16 (Friday) — DEADLINE
**Focus**: Final polish + README + Screenshots + Submit  
**Target hours**: 4-6h  
**Commits**: 2-4

#### Morning (2-3h)
- [ ] Final end-to-end testing of entire flow
- [ ] Take 3+ screenshots or record 30-sec Loom
- [ ] Write final `README.md` with:
  - 2-3 sentence summary
  - Screenshots/recording
  - Quick start instructions
  - 5 trade-off decisions
  - Deployed URL link
- [ ] Attempt 1 bonus feature if time permits (PDF export or benchmark mode)

#### Afternoon (2-3h)
- [ ] Final deploy to Vercel
- [ ] Verify deployed URL works end-to-end
- [ ] Verify CI is green
- [ ] Run `git log --pretty=format:"%ad" --date=short | sort -u | wc -l` → must show ≥5
- [ ] Write DEVLOG Day 7 entry
- [ ] Submit Google Form
- [ ] **DONE** 🎉

#### Commits
```
docs: add README.md with screenshots and quick start
feat: add PDF export bonus feature (if time)
docs: finalize DEVLOG Day 7 entry
chore: final deploy preparation
```

---

## 🔑 Critical Success Factors

### 1. User Interviews — START TONIGHT
> [!CAUTION]
> Fabricated interviews = **instant reject**. This is the #1 thing that separates you from other candidates.

**Where to find people to interview** (10-15 min each):
- **Twitter/X**: Search "AI tools expensive" or "cursor vs copilot" — DM people who tweet about AI tool costs
- **Reddit**: r/startups, r/SideProject, r/ExperiencedDevs — post asking if anyone has 15 min to chat about AI tool spending
- **Indie Hackers**: Slack/forums — tons of founders tracking costs
- **Your college network**: Any CS friends using Cursor/Copilot/ChatGPT for projects
- **LinkedIn**: Connect with engineering managers at startups (50-200 people)

**Interview script** (keep it natural):
1. "What AI tools does your team pay for?"
2. "How much do you spend monthly on AI tools?"
3. "Have you ever audited whether you're on the right plan?"
4. "Would you use a free tool that told you where you're overspending?"
5. "What would make you trust its recommendations?"

### 2. Pricing Data Accuracy
Every number in your audit engine must trace to a vendor URL. Spot-checked by reviewers.

### 3. Commit Discipline
- **5+ distinct calendar days** (programmatically checked)
- **Conventional commits**: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `style:`, `perf:`
- **Meaningful messages** — describe the *what and why*

### 4. Audit Logic Must Be Defensible
- Don't just say "switch to X." Show the math.
- "You're paying $40/seat × 3 seats = $120/mo for Cursor Business. With 3 developers primarily coding, Cursor Pro at $20/seat × 3 = $60/mo covers the same needs. Savings: $60/mo."
- Be honest when there are no savings to recommend.

### 5. Lighthouse Scores
- Performance ≥ 85 (optimize images, lazy load, minimize JS)
- Accessibility ≥ 90 (ARIA labels, contrast ratios, keyboard nav)
- Best Practices ≥ 90 (HTTPS, no console errors, proper headers)

---

## 🎨 Design Inspiration

The results page is "the page that gets screenshotted and shared." Make it **beautiful**:
- Big hero numbers with count-up animation
- Gradient backgrounds (dark mode preferred)
- Per-tool cards with clear visual hierarchy
- Color-coded savings (green = saving, amber = minor, red = overspending)
- Credex branding subtle but present
- Think: Vercel's dashboard aesthetic meets a financial report

---

## ⚡ Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Anthropic API key issues | Apply tonight; have OpenAI as backup; fallback template always works |
| Supabase free tier limits | 500MB is plenty; monitor usage |
| User interviews not responding | Send 15+ DMs tonight, follow up tomorrow. Have backup channels (college WhatsApp groups) |
| Lighthouse scores too low | Test early (Day 3), fix incrementally |
| Running out of time | MVP features > bonus features. Polish > breadth |
| Git history looks cramped | Commit frequently, even small changes. Never batch a day's work into 1 commit |

---

## 🚀 Tonight's Immediate Action Items (Do NOW)

1. **Create a new project directory** (e.g., `E:\Internshala Projects\credex-ai-audit\`)
2. **Initialize the Next.js project** with TypeScript + Tailwind
3. **Create GitHub repo** (public) — pick a great name
4. **Set up Supabase** project at supabase.com
5. **Get Anthropic API key** at console.anthropic.com
6. **Set up Resend** account at resend.com
7. **Send 10-15 DMs** for user interviews
8. **Create all placeholder .md files** and make your first commit
9. **Connect to Vercel** for auto-deploy

> [!TIP]
> The scoring rubric gives **25/100 points to entrepreneurial thinking** (GTM, economics, interviews, copy, metrics). That's more than any single engineering dimension. Don't treat the .md files as an afterthought — they're a quarter of your grade.

---

## 📊 Scoring Strategy (maximize your 100 points)

| Dimension | Weight | Your Strategy |
|-----------|--------|--------------|
| **Entrepreneurial thinking** | 25 | Start interviews tonight. Write GTM/ECONOMICS with real math, specific channels. This is your highest-leverage area. |
| **Engineering skills** | 15 | CI green, 5+ tests passing, deployed, accessible |
| **Thinking models** | 15 | ARCHITECTURE with Mermaid, REFLECTION with specific stories |
| **Programming skills** | 15 | TypeScript throughout, clean abstractions, no any types |
| **Hard work** | 10 | All 6 MVP features working, attempt 1 bonus |
| **Discipline & consistency** | 10 | 7 DEVLOG entries, commits on 5+ days |
| **Audit logic polish** | 10 | Defensible math, honest when no savings, cited sources |

---

## 🏷️ Product Name Suggestions

Pick one that's memorable, domain-available, and implies "AI spend optimization":

| Name | Vibe |
|------|------|
| **CredexAudit** | "See through your burn rate" — startup-native language |
| **StackAudit** | Clear, professional, says what it does |
| **SpendScope** | Visual metaphor, clean |
| **CostPilot** | Implies guidance, autopilot for costs |
| **TokenTracker** | AI-native (tokens), catchy |

---

*Last updated: May 9, 2026 — Day 0 prep*
