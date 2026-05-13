"use client";

import Link from "next/link";
import {
  Zap,
  ArrowDownCircle,
  TrendingDown,
  CheckCircle2,
  Repeat2,
  Sparkles,
  Share2,
  Check,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import type { AuditResult, ToolAuditResult, Recommendation } from "@/lib/audit-engine";
import { CredexCta } from "@/components/CredexCta";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ============================================================
// Props
// ============================================================
interface SharedAuditClientProps {
  shareId: string;
  result: AuditResult;
  aiSummary: string | null;
  createdAt: string;
}

// ============================================================
// Helpers (same as results page)
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
// Recommendation Row
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
// Tool Result Card
// ============================================================
function ToolCard({ result }: { result: ToolAuditResult }) {
  return (
    <Card className="overflow-hidden rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: tierColor(result.savingsTier) }} />
          <div>
            <h3 className="text-[1.05rem] font-bold m-0">{result.toolName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 m-0">
              {result.currentPlan} · {result.currentSeats} seat{result.currentSeats > 1 ? "s" : ""} · ${result.currentMonthlySpend}/mo
            </p>
          </div>
        </div>
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
      </div>

      {result.recommendations.length > 0 && (
        <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-border">
          {result.recommendations.map((rec, i) => (
            <RecommendationRow key={i} rec={rec} />
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================
// Shared Audit Client Component
// ============================================================
export default function SharedAuditClient({ shareId, result, aiSummary, createdAt }: SharedAuditClientProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/audit/share/${shareId}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen pb-16 bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 py-4 bg-background/90 backdrop-blur-xl border-b print:hidden">
        <div className="container mx-auto flex items-center justify-between px-6 max-w-4xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-[1.1rem] text-foreground no-underline">
            <Zap size={20} color="#0FF395" />
            <span>Credex<span className="text-[#0AD87D]">Audit</span></span>
          </Link>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-full" 
              onClick={handleCopy}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button size="sm" asChild className="rounded-full">
              <Link href="/audit">Run Your Own Audit</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 max-w-4xl pt-8">
        {/* Shared badge */}
        <div className="text-center mb-4">
          <Badge variant="secondary" className="font-medium text-muted-foreground bg-secondary/80">
            Shared Audit · {date}
          </Badge>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold mb-2">
            This team could save{" "}
            <span className="text-[#0AD87D]">${result.totalAnnualSavings.toLocaleString()}</span>
            <span className="text-[0.5em] text-muted-foreground font-medium">/year</span>
          </h1>
          <p className="text-base text-muted-foreground">
            across {result.toolResults.length} tool{result.toolResults.length > 1 ? "s" : ""} · ${result.totalCurrentSpend.toLocaleString()}/mo current spend
          </p>
        </div>

        {/* Stats */}
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

        {/* AI Summary */}
        {aiSummary && (
          <Card className="p-6 mb-6 rounded-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <MessageSquare size={20} className="text-[#0AD87D]" />
              <h3 className="text-base font-bold m-0">AI Audit Summary</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground m-0">{aiSummary}</p>
          </Card>
        )}

        {/* Tool Cards */}
        <div className="flex flex-col gap-4 mb-8">
          {result.toolResults.map((tr) => (
            <ToolCard key={tr.toolId} result={tr} />
          ))}
        </div>

        <CredexCta
          monthlySavings={result.totalMonthlySavings}
          savingsTier={result.savingsTier}
        />

        {/* CTA */}
        <Card className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 mt-8 bg-primary text-primary-foreground rounded-3xl border-transparent text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5">Want to find your own savings?</h3>
            <p className="text-sm text-primary-foreground/70 max-w-[500px] leading-relaxed m-0">
              Run a free CredexAudit audit on your AI tool stack — takes under 2 minutes.
            </p>
          </div>
          <Button size="lg" asChild className="rounded-full shrink-0 bg-[#0FF395] text-[#112F34] hover:bg-[#0AD87D]">
            <Link href="/audit">
              Audit My AI Spend — Free
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </Card>
      </main>
    </div>
  );
}
