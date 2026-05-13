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
    <div className="rec-row">
      <div className="rec-icon" style={{ color, background: `${color}10` }}>
        <RecIcon type={rec.type} />
      </div>
      <div className="rec-content">
        <div className="rec-header">
          <h4 className="rec-title">{rec.title}</h4>
          <span className="rec-savings" style={{ color }}>-${rec.monthlySavings}/mo</span>
        </div>
        <p className="rec-reason">{rec.reason}</p>
      </div>

      <style jsx>{`
        .rec-row {
          display: flex; gap: 0.875rem; padding: 1rem;
          background: var(--bg-secondary); border-radius: var(--radius-md);
          border: 1px solid var(--border-card);
        }
        .rec-icon {
          width: 32px; height: 32px; border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rec-content { flex: 1; min-width: 0; }
        .rec-header { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.375rem; }
        .rec-title { font-size: 0.9rem; font-weight: 600; margin: 0; }
        .rec-savings { font-size: 0.85rem; font-weight: 700; white-space: nowrap; }
        .rec-reason { font-size: 0.8rem; color: var(--text-tertiary); line-height: 1.5; margin: 0; }
      `}</style>
    </div>
  );
}

// ============================================================
// Tool Result Card
// ============================================================
function ToolCard({ result }: { result: ToolAuditResult }) {
  return (
    <div className="tool-card glass-card">
      <div className="tool-header">
        <div className="tool-left">
          <div className="tool-dot" style={{ background: tierColor(result.savingsTier) }} />
          <div>
            <h3 className="tool-name">{result.toolName}</h3>
            <p className="tool-plan">
              {result.currentPlan} · {result.currentSeats} seat{result.currentSeats > 1 ? "s" : ""} · ${result.currentMonthlySpend}/mo
            </p>
          </div>
        </div>
        {result.totalMonthlySavings > 0 ? (
          <span className="tool-badge" style={{ background: `${tierColor(result.savingsTier)}15`, color: tierColor(result.savingsTier) }}>
            Save ${result.totalMonthlySavings}/mo
          </span>
        ) : (
          <span className="tool-badge" style={{ background: "rgba(10,216,125,0.1)", color: "#0AD87D" }}>✓ Optimized</span>
        )}
      </div>

      {result.recommendations.length > 0 && (
        <div className="tool-recs">
          {result.recommendations.map((rec, i) => (
            <RecommendationRow key={i} rec={rec} />
          ))}
        </div>
      )}

      <style jsx>{`
        .tool-card { overflow: hidden; padding: 1.25rem 1.5rem; }
        .tool-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .tool-left { display: flex; align-items: center; gap: 0.875rem; }
        .tool-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .tool-name { font-size: 1.05rem; font-weight: 700; margin: 0; }
        .tool-plan { font-size: 0.8rem; color: var(--text-tertiary); margin: 0.125rem 0 0; }
        .tool-badge { font-size: 0.8rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 999px; white-space: nowrap; }
        .tool-recs { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border-primary); }
      `}</style>
    </div>
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
    <div className="shared-page">
      {/* Nav */}
      <nav className="shared-nav">
        <div className="container shared-nav-inner">
          <Link href="/" className="shared-nav-brand">
            <Zap size={20} color="#0FF395" />
            <span>Burn<span style={{ color: "#0AD87D" }}>Lens</span></span>
          </Link>
          <div className="shared-nav-actions">
            <button className="btn-secondary" onClick={handleCopy} style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }}>
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </button>
            <Link href="/audit" className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }}>
              Run Your Own Audit
            </Link>
          </div>
        </div>
      </nav>

      <main className="container shared-main">
        {/* Shared badge */}
        <div className="shared-badge-row">
          <span className="badge">Shared Audit · {date}</span>
        </div>

        {/* Hero */}
        <div className="shared-hero">
          <h1 className="shared-hero-title">
            This team could save{" "}
            <span className="gradient-text">${result.totalAnnualSavings.toLocaleString()}</span>
            <span className="shared-period">/year</span>
          </h1>
          <p className="shared-subtitle">
            across {result.toolResults.length} tool{result.toolResults.length > 1 ? "s" : ""} · ${result.totalCurrentSpend.toLocaleString()}/mo current spend
          </p>
        </div>

        {/* Stats */}
        <div className="shared-stats">
          <div className="teal-card shared-stat">
            <div className="shared-stat-value">${result.totalCurrentSpend.toLocaleString()}</div>
            <div className="shared-stat-label">Monthly Spend</div>
          </div>
          <div className="teal-card shared-stat">
            <div className="shared-stat-value" style={{ color: "#0FF395" }}>-${result.totalMonthlySavings.toLocaleString()}</div>
            <div className="shared-stat-label">Monthly Savings</div>
          </div>
          <div className="teal-card shared-stat">
            <div className="shared-stat-value" style={{ color: tierColor(result.savingsTier) }}>
              {tierLabel(result.savingsTier)}
            </div>
            <div className="shared-stat-label">Optimization Score</div>
          </div>
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <div className="summary-card glass-card">
            <div className="summary-header">
              <MessageSquare size={20} color="#0AD87D" />
              <h3 className="summary-title">AI Audit Summary</h3>
            </div>
            <p className="summary-text">{aiSummary}</p>
          </div>
        )}

        {/* Tool Cards */}
        <div className="shared-tools">
          {result.toolResults.map((tr) => (
            <ToolCard key={tr.toolId} result={tr} />
          ))}
        </div>

        {/* CTA */}
        <div className="shared-cta teal-card">
          <div>
            <h3 className="cta-title">Want to find your own savings?</h3>
            <p className="cta-text">Run a free BurnLens audit on your AI tool stack — takes under 2 minutes.</p>
          </div>
          <Link href="/audit" className="btn-green" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
            Audit My AI Spend — Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <style jsx>{`
        .shared-page { min-height: 100vh; padding-bottom: 4rem; background: var(--bg-primary); }

        .shared-nav {
          position: sticky; top: 0; z-index: 50; padding: 1rem 0;
          background: rgba(244, 247, 250, 0.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-card);
        }
        .shared-nav-inner { display: flex; align-items: center; justify-content: space-between; }
        .shared-nav-brand {
          display: flex; align-items: center; gap: 0.5rem;
          text-decoration: none; color: var(--text-primary); font-weight: 700; font-size: 1.1rem;
        }
        .shared-nav-actions { display: flex; gap: 0.5rem; }

        .shared-main { padding-top: 2rem; }
        .shared-badge-row { text-align: center; margin-bottom: 1rem; }

        .shared-hero { text-align: center; margin-bottom: 2.5rem; }
        .shared-hero-title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800; margin-bottom: 0.5rem; }
        .shared-period { font-size: 0.5em; color: var(--text-tertiary); font-weight: 500; }
        .shared-subtitle { color: var(--text-secondary); font-size: 1rem; }

        .shared-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .shared-stat { display: flex; flex-direction: column; align-items: center; padding: 1.5rem; text-align: center; }
        .shared-stat-value { font-size: 1.25rem; font-weight: 800; color: white; }
        .shared-stat-label { font-size: 0.75rem; color: var(--text-on-dark-secondary); margin-top: 0.25rem; }

        .summary-card { padding: 1.5rem; margin-bottom: 1.5rem; }
        .summary-header { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1rem; }
        .summary-title { font-size: 1rem; font-weight: 700; margin: 0; }
        .summary-text { font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); }

        .shared-tools { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }

        .shared-cta {
          padding: 2rem; display: flex; align-items: center; justify-content: space-between;
          gap: 2rem;
        }
        .cta-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.375rem; color: white; }
        .cta-text { font-size: 0.85rem; color: var(--text-on-dark-secondary); margin: 0; max-width: 500px; line-height: 1.6; }

        @media (max-width: 768px) {
          .shared-stats { grid-template-columns: 1fr; }
          .shared-cta { flex-direction: column; text-align: center; }
          .shared-nav-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
