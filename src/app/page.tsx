"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const TRUST_ITEMS = [
  "24×7 support",
  "Verified pricing data",
  "Instant audit results",
  "8+ tools supported",
  "No sign-up required",
  "Credex-backed credits",
  "Transparent methodology",
  "Exportable reports",
];

const TOOLS = [
  { name: "Cursor", color: "#6366f1" },
  { name: "GitHub Copilot", color: "#2b3137" },
  { name: "Claude", color: "#d97706" },
  { name: "ChatGPT", color: "#10a37f" },
  { name: "Gemini", color: "#4285f4" },
  { name: "Windsurf", color: "#06b6d4" },
  { name: "OpenAI API", color: "#10a37f" },
  { name: "Anthropic API", color: "#d97706" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ====== NAVBAR ====== */}
      <div className="sticky top-0 z-50 pt-3 px-6">
        <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border bg-white/85 px-5 py-2.5 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Zap size={22} color="#0FF395" />
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Credex<span className="text-[#0AD87D]">Audit</span>
            </span>
          </Link>

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <Badge variant="secondary" className="bg-[#0FF395]/15 text-[#112F34] border-[#0FF395]/20 font-medium">
              BY CREDEX
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/audit">Start Audit</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden py-24 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <Badge variant="outline" className="mb-6 gap-2 py-1 text-sm bg-white">
            <Badge variant="secondary" className="bg-[#0FF395]/15 text-[#112F34] border-[#0FF395]/20">NO OVERSPEND</Badge>
            AI spend audit in 60 seconds
          </Badge>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="text-[#0AD87D]">Save Up To 40%</span>
            <br />
            On AI Tool Subscriptions
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Free audit for your Cursor, Copilot, Claude, ChatGPT, and Gemini spend.
            Find savings and unlock discounted credits through Credex.
          </p>

          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-10 py-6 text-base font-semibold">
              <Link href="/audit">Start Audit</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ====== TRUST MARQUEE ====== */}
      <div className="overflow-hidden border-y border-border bg-secondary py-3">
        <div className="inline-flex gap-10 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#0FF395]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ====== STATS ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 grid gap-5 md:grid-cols-2">
          <Card className="flex flex-col justify-center border-white/10 bg-primary p-10 text-primary-foreground rounded-3xl">
            <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0FF395]">
              TAP IN
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Stop overpaying for AI tools you already use
            </h2>
            <p className="mt-4 text-primary-foreground/70 leading-relaxed">
              We analyze your current plans across 8 tools, flag waste, and recommend the optimal configuration — same features, lower cost.
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            {[
              { value: "$2.4K", label: "Avg. Annual Savings" },
              { value: "8+", label: "Tools Audited" },
              { value: "60s", label: "Time to Audit" },
              { value: "6", label: "Audit Rules" },
            ].map((stat, i) => (
              <Card key={i} className="flex flex-col items-center justify-center border-white/10 bg-primary p-8 text-center text-primary-foreground rounded-3xl">
                <div className="text-3xl font-extrabold tracking-tight md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-20 bg-secondary">
        <div className="mx-auto max-w-6xl px-6">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">HOW IT WORKS</span>
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">Three steps to lower your AI bill</h2>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Add Your Tools",
                desc: "Tell us which AI tools you use — Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf — and your current plans and seats.",
              },
              {
                num: "02",
                title: "Get Your Audit",
                desc: "Our engine runs 6 rule-based checks: plan-fit, overpay detection, seat right-sizing, cross-tool alternatives, and Credex credit savings.",
              },
              {
                num: "03",
                title: "Save Money",
                desc: "Act on clear recommendations with dollar amounts. Or save even more with discounted Credex credits — same plans, 10-30% off.",
              },
            ].map((step) => (
              <Card key={step.num} className="p-8 rounded-3xl">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {step.num}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TOOLS GRID ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">SUPPORTED TOOLS</span>
              <h2 className="text-3xl font-bold md:text-4xl">Explore audit coverage</h2>
            </div>
            <Button asChild className="rounded-full px-6">
              <Link href="/audit">Start Audit</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <Card key={tool.name} className="p-6 rounded-3xl">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md font-bold text-white" style={{ background: tool.color }}>
                  {tool.name.charAt(0)}
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-semibold">{tool.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold">
                      {tool.name.includes("API") ? "API" : tool.name.includes("Cursor") || tool.name.includes("Copilot") || tool.name.includes("Windsurf") ? "IDE" : "Chat"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Audit Rules</span>
                    <span className="font-semibold">6 checks</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====== GUARANTEE ====== */}
      <section className="py-20 bg-secondary">
        <div className="mx-auto max-w-6xl px-6 grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">METHODOLOGY</span>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Transparent, rule-based auditing</h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Every recommendation comes with clear reasoning, dollar savings, and source data. No black boxes.
            </p>

            <div className="flex flex-col gap-4">
              {[
                "All pricing verified from official vendor pages",
                "6 independent audit checks per tool",
                "Recommendations include trade-off explanations",
                "Credex credit savings clearly labeled as marketplace offers",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b pb-4 text-sm font-medium last:border-0">
                  <CheckCircle2 size={18} className="text-[#0AD87D]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/10 bg-primary p-10 text-primary-foreground rounded-3xl">
            <Shield size={32} className="text-[#0FF395]" />
            <h3 className="mt-4 text-xl font-bold text-white">Powered by Credex</h3>
            <p className="my-4 text-sm leading-relaxed text-primary-foreground/70">
              CredexAudit is built by Credex — the marketplace for discounted AI & cloud credits. Save on the same tools with verified sellers.
            </p>
            <Button asChild variant="secondary" className="rounded-full bg-[#0FF395] text-[#112F34] hover:bg-[#0AD87D]">
              <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
                Visit Credex
                <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </Card>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="border-t py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to audit your AI spend?</h2>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            Free. Instant. No sign-up required. See exactly where your money goes.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 font-semibold">
            <Link href="/audit">
              Start Your Free Audit
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap size={18} color="#0FF395" />
            <span className="font-bold">CredexAudit</span>
            <span className="text-sm text-muted-foreground">by Credex</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              Credex
            </a>
            <Link href="/audit" className="text-muted-foreground hover:text-foreground">
              Audit
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Credex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
