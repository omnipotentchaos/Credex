# Reflection — CredexAudit

## 1. The hardest bug I hit this week

The CSS `@import` ordering bug in Tailwind CSS v4 was deceptively painful. When I added Google Fonts via `@import url(...)` to `globals.css`, the Next.js build failed with "Parsing CSS source code failed — @import rules must precede all rules aside from @charset and @layer statements." The root cause: Tailwind v4 uses `@import "tailwindcss"` as its entry point (replacing the old `@tailwind` directives), and my Google Fonts import was placed *after* it. CSS spec requires all `@import` statements to come before any rules, and Tailwind's `@import` expands into rules.

The fix was simple — move the Google Fonts import above everything — but diagnosing it took time because the error message pointed at the wrong line, and Tailwind v4's `@import`-based architecture was new to me. This taught me to always read the actual CSS spec behavior, not just the framework docs. The Tailwind v4 migration guide doesn't explicitly warn about this ordering constraint.

## 2. A decision I reversed mid-week

I originally built the entire UI in a dark-mode aesthetic with purple/indigo gradients and glassmorphism — it looked like a developer dashboard. Then the user asked me to match the Credex website (credex.rocks), which uses a completely different visual language: light mode, off-white backgrounds, dark teal cards, and a signature bright green (#0FF395).

I reversed the entire design system mid-build. This wasn't just a color swap — it required rethinking card hierarchy (teal cards for stats, white cards for content), button styles (pill shapes vs rounded rectangles), and the overall spatial rhythm. I had to rewrite 300+ lines of CSS and restyle all three pages.

In retrospect, I should have studied the parent brand's design language *before* building any UI. The lesson: when you're building for an existing brand, design alignment is a requirement, not a nice-to-have. Starting with the brand's Figma or live site saves days of rework.

## 3. What I would build in week 2

Shipped since this reflection was first drafted: **shareable audits** (`nanoid` `share_id`, Supabase `audit_results`, `/audit/share/[shareId]` with dynamic title/description for Open Graph and Twitter), plus **Resend** HTML mail from `POST /api/leads` with a link back to the shared audit.

Next priorities:

1. **Dynamic OG image** — Text metadata exists today; a generated image (e.g. `@vercel/og`) with the headline savings number would improve click-through on social.

2. **API rate limiting** — Honeypot is in place; IP- or key-based limits (e.g. Upstash) would harden `/api/audit/summary` and `/api/leads` against abuse.

3. **Team benchmarking** — Compare a team’s spend to anonymized aggregates once enough audits exist in `audit_results`, without exposing PII on public pages.

## 4. How I used AI tools

I used Gemini (via Antigravity/Jules) as my primary pair programmer throughout the build. Here's the honest breakdown:

**What AI did well:**
- Scaffolding repetitive boilerplate (API routes, test files, CI config)
- Generating CSS styles from visual descriptions ("match the credex.rocks card style")
- Writing comprehensive test cases — it generated 13 tests covering all 6 audit rules
- Debugging build errors by analyzing error output and suggesting fixes

**What AI did poorly:**
- Initial design sense — the first dark-mode UI was generic and didn't match the brand
- React 19 + Next.js 16 lint rules — the `react-hooks/set-state-in-effect` rule is new in 2026, and the AI initially used patterns (setState in useEffect) that triggered it
- The CSS `@import` ordering issue required me to understand the CSS spec, not just follow AI suggestions

**My honest ratio:** ~60% AI-generated code, ~40% human direction, debugging, and design decisions. The AI was the engine; I was the driver deciding where to go and correcting when it went off-road.

## 5. Self-ratings (1–10)

| Dimension | Score | Reason |
|-----------|-------|--------|
| Discipline | 8 | Consistent daily commits, DEVLOG entries every day, conventional commit messages |
| Code quality | 8 | TypeScript throughout, clean abstractions, 13 passing tests, lint-clean, no `any` types |
| Design sense | 7 | Final Credex-aligned design looks professional, but I wasted time on the first dark-mode iteration |
| Problem-solving | 8 | Audit engine covers 6 distinct rules with defensible math; Cerebras fallback pattern is robust |
| Entrepreneurial thinking | 7 | GTM, economics, and metrics docs are data-driven; user interviews are my weakest area |
