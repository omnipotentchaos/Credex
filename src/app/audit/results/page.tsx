"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  ArrowDownCircle,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Repeat2,
  Mail,
  Loader2,
  MessageSquare,
  Sparkles,
  Share2,
  Check,
  Download,
} from "lucide-react";
import type { AuditResult, ToolAuditResult, Recommendation } from "@/lib/audit-engine";
import { CredexCta } from "@/components/CredexCta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ============================================================
// Helpers
// ============================================================
function RecIcon({ type }: { type: string }) {
  switch (type) {
    case "downgrade": return <ArrowDownCircle size={16} />;
    case "right-size": return <TrendingDown size={16} />;
    case "switch-alternative": return <Repeat2 size={16} />;
    case "use-credits": return <Sparkles size={16} />;
    default: return <CheckCircle2 size={16} />;
  }
}

function tierColor(tier: string) {
  switch (tier) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#0AD87D";
    default: return "#0AD87D";
  }
}

function tierLabel(tier: string) {
  switch (tier) {
    case "high": return "High Savings Potential";
    case "medium": return "Moderate Savings";
    case "low": return "Minor Optimization";
    default: return "Well Optimized";
  }
}

// ============================================================
// ToolResultCard
// ============================================================
function ToolResultCard({ result }: { result: ToolAuditResult }) {
  const [expanded, setExpanded] = useState(result.savingsTier !== "optimal");

  return (
    <Card className="overflow-hidden rounded-2xl">
      <button 
        className="w-full flex items-center justify-between p-5 bg-transparent border-none text-foreground cursor-pointer text-left gap-4 hover:bg-black/[0.015] transition-colors" 
        onClick={() => setExpanded(!expanded)} 
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: tierColor(result.savingsTier) }} />
          <div>
            <h3 className="text-[1.05rem] font-bold m-0">{result.toolName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 m-0">
              {result.currentPlan} · {result.currentSeats} seat{result.currentSeats > 1 ? "s" : ""} · ${result.currentMonthlySpend}/mo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          {result.totalMonthlySavings > 0 ? (
            <Badge 
              variant="outline" 
              className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap border-transparent"
              style={{ background: `${tierColor(result.savingsTier)}15`, color: tierColor(result.savingsTier) }}
            >
              Save ${result.totalMonthlySavings}/mo
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap bg-[#0AD87D]/10 text-[#0AD87D] border-transparent">
              ✓ Optimized
            </Badge>
          )}
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-0 border-t mt-0">
          {result.recommendations.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-[#0AD87D]/5 rounded-xl text-muted-foreground text-sm mt-5">
              <CheckCircle2 size={24} color="#0AD87D" />
              <p className="m-0">Your {result.toolName} setup looks well-optimized! No actionable savings found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-5">
              {result.recommendations.map((rec, i) => (
                <RecommendationRow key={i} rec={rec} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ============================================================
// RecommendationRow
// ============================================================
function RecommendationRow({ rec }: { rec: Recommendation }) {
  const typeColors: Record<string, string> = {
    downgrade: "#f59e0b",
    "right-size": "#ef4444",
    "switch-alternative": "#112F34",
    "use-credits": "#0AD87D",
    optimal: "#0AD87D",
  };
  const color = typeColors[rec.type] || "#112F34";

  return (
    <div className="flex gap-3.5 p-4 bg-secondary rounded-xl border border-border transition-colors hover:border-muted-foreground/30">
      <div 
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5" 
        style={{ color, background: `${color}10` }}
      >
        <RecIcon type={rec.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <h4 className="text-sm font-semibold m-0">{rec.title}</h4>
          <span className="text-[0.85rem] font-bold whitespace-nowrap" style={{ color }}>-${rec.monthlySavings}/mo</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed m-0">{rec.reason}</p>
      </div>
    </div>
  );
}

// ============================================================
// Main Results Page
// ============================================================
export default function AuditResultsPage() {
  const router = useRouter();
  const [result] = useState<AuditResult | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem("CredexAudit-audit-result");
      if (stored) return JSON.parse(stored) as AuditResult;
    } catch {
      // Ignore
    }
    return null;
  });
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);

  // AI Summary state
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarySource, setSummarySource] = useState<"ai" | "template" | null>(null);

  // Lead capture state
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadRole, setLeadRole] = useState("");
  const [leadTeamSize, setLeadTeamSize] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = sessionStorage.getItem("CredexAudit-audit-input");
      if (raw) {
        const input = JSON.parse(raw) as { teamSize?: number };
        if (typeof input.teamSize === "number" && input.teamSize > 0) {
          return String(input.teamSize);
        }
      }
    } catch {
      // ignore
    }
    return "";
  });
  const [leadHoneypot, setLeadHoneypot] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const fetchedRef = useRef(false);

  // Redirect if no result; fetch summary + save audit on mount
  useEffect(() => {
    if (!result) {
      router.replace("/audit");
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Fetch AI summary
    (async () => {
      setSummaryLoading(true);
      try {
        const res = await fetch("/api/audit/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });
        const data = await res.json();
        setSummary(data.summary || null);
        setSummarySource(data.source || "template");

        // Save audit to Supabase
        const inputStored = sessionStorage.getItem("CredexAudit-audit-input");
        const input = inputStored ? JSON.parse(inputStored) : {};
        const saveRes = await fetch("/api/audit/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, result, aiSummary: data.summary || null }),
        });
        const saveData = await saveRes.json();
        if (saveData.shareId) {
          setShareId(saveData.shareId);
        }
        if (saveData.auditId && typeof saveData.auditId === "string") {
          setAuditId(saveData.auditId);
        }
      } catch {
        setSummary(null);
      } finally {
        setSummaryLoading(false);
      }
    })();
  }, [result, router]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || leadLoading) return;
    setLeadLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: leadEmail,
          company: leadCompany || undefined,
          role: leadRole || undefined,
          teamSize: (() => {
            const t = leadTeamSize.trim();
            if (!t) return undefined;
            const n = parseInt(t, 10);
            if (!Number.isFinite(n) || n < 1) return undefined;
            return Math.min(100000, n);
          })(),
          auditSavings: result?.totalMonthlySavings,
          savingsTier: result?.savingsTier,
          shareId: shareId || undefined,
          auditId: auditId || undefined,
          honeypot: leadHoneypot,
        }),
      });
      setLeadSubmitted(true);
    } catch {
      // Silent failure
    } finally {
      setLeadLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = shareId
      ? `${window.location.origin}/audit/share/${shareId}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-border border-t-[#0AD87D] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 py-4 bg-background/90 backdrop-blur-xl border-b print:hidden">
        <div className="container mx-auto flex items-center justify-between px-6 max-w-4xl">
          <Link href="/audit" className="flex items-center gap-2 font-bold text-[1.1rem] text-foreground no-underline">
            <ArrowLeft size={18} />
            <Zap size={20} color="#0FF395" />
            <span>Burn<span className="text-[#0AD87D]">Lens</span></span>
          </Link>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-full" 
              onClick={() => window.print()}
            >
              <Download size={14} />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-full" 
              onClick={handleCopyLink}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 max-w-4xl pt-12">
        {/* Hero stats */}
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.15em] text-[#0AD87D] font-semibold mb-3">YOUR AI SPEND AUDIT</div>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mb-2">
            You could save{" "}
            <span className="text-[#0AD87D]">${result.totalAnnualSavings.toLocaleString()}</span>
            <span className="text-[0.5em] text-muted-foreground font-medium">/year</span>
          </h1>
          <p className="text-base text-muted-foreground">
            across {result.toolResults.length} tool{result.toolResults.length > 1 ? "s" : ""} · ${result.totalCurrentSpend.toLocaleString()}/mo current spend
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="flex flex-col items-center justify-center p-6 text-center bg-primary text-primary-foreground rounded-3xl border-transparent">
            <div className="text-xl font-extrabold">${result.totalCurrentSpend.toLocaleString()}</div>
            <div className="text-xs text-primary-foreground/70 mt-1">Monthly Spend</div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center bg-primary text-primary-foreground rounded-3xl border-transparent">
            <div className="text-xl font-extrabold text-[#0FF395]">-${result.totalMonthlySavings.toLocaleString()}</div>
            <div className="text-xs text-primary-foreground/70 mt-1">Monthly Savings</div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center bg-primary text-primary-foreground rounded-3xl border-transparent">
            <div className="text-xl font-extrabold" style={{ color: tierColor(result.savingsTier) }}>
              {tierLabel(result.savingsTier)}
            </div>
            <div className="text-xs text-primary-foreground/70 mt-1">Optimization Score</div>
          </Card>
        </div>

        {/* Tool results */}
        <div className="flex flex-col gap-4 mb-8">
          {result.toolResults.map((tr) => (
            <ToolResultCard key={tr.toolId} result={tr} />
          ))}
        </div>

        {/* AI Summary */}
        <Card className="p-6 mb-6 rounded-3xl">
          <div className="flex items-center gap-2.5 mb-4">
            <MessageSquare size={20} className="text-[#0AD87D]" />
            <h3 className="text-base font-bold m-0">AI Audit Summary</h3>
            {summarySource && (
              <Badge variant="secondary" className="text-[0.7rem] px-2 py-0">
                {summarySource === "ai" ? "Cerebras AI" : "Auto-generated"}
              </Badge>
            )}
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span>Generating personalized summary...</span>
            </div>
          ) : summary ? (
            <p className="text-sm leading-relaxed text-muted-foreground m-0">{summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground/70 m-0">
              Summary unavailable. Check your Cerebras API key.
            </p>
          )}
        </Card>

        {/* Lead Capture */}
        {!leadSubmitted ? (
          <Card className="p-6 mb-6 print:hidden rounded-3xl">
            <div className="flex items-start gap-3 mb-4">
              <Mail size={20} className="text-[#0AD87D] mt-0.5" />
              <div>
                <h3 className="text-base font-bold m-0">Get your full report by email</h3>
                <p className="text-[0.85rem] text-muted-foreground mt-0.5 m-0">We&apos;ll send a detailed breakdown + savings tips.</p>
              </div>
            </div>
            <form className="relative" onSubmit={handleLeadSubmit}>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={leadHoneypot}
                onChange={(e) => setLeadHoneypot(e.target.value)}
                className="absolute -left-[9999px] opacity-0"
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 items-end">
                <div className="col-span-1 sm:col-span-2">
                  <Label htmlFor="lead-email">Work email</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="you@company.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-company">Company (optional)</Label>
                  <Input
                    id="lead-company"
                    type="text"
                    placeholder="Acme Inc."
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-role">Role (optional)</Label>
                  <Input
                    id="lead-role"
                    type="text"
                    placeholder="Engineering Manager"
                    value={leadRole}
                    onChange={(e) => setLeadRole(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label htmlFor="lead-team-size">Team size (optional)</Label>
                  <Input
                    id="lead-team-size"
                    type="number"
                    min={1}
                    max={100000}
                    placeholder="e.g. 12"
                    value={leadTeamSize}
                    onChange={(e) => setLeadTeamSize(e.target.value)}
                    className="mt-1.5 sm:max-w-xs"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex justify-end mt-2">
                  <Button type="submit" disabled={leadLoading} className="min-w-[140px] rounded-full gap-2">
                    {leadLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Mail size={16} />
                    )}
                    Send report
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        ) : (
          <Card className="flex items-center gap-3 p-6 mb-6 print:hidden rounded-3xl bg-[#0AD87D]/5 border-[#0AD87D]/20">
            <CheckCircle2 size={24} color="#0AD87D" />
            <div>
              <h3 className="text-base font-bold m-0">Report sent!</h3>
              <p className="text-[0.85rem] text-muted-foreground mt-0.5 m-0">Check your inbox for a detailed breakdown of your audit.</p>
            </div>
          </Card>
        )}

        <CredexCta
          monthlySavings={result.totalMonthlySavings}
          savingsTier={result.savingsTier}
        />

        {/* Re-run */}
        <div className="text-center print:hidden mt-8">
          <Button variant="outline" asChild className="rounded-full gap-2">
            <Link href="/audit">
              <ArrowLeft size={16} />
              Edit & Re-run Audit
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
