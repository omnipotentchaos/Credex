"use client";

import { useState, useEffect, useCallback } from "react";
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
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import type { AuditResult, ToolAuditResult, Recommendation } from "@/lib/audit-engine";

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
    <div className="result-card glass-card">
      <button className="result-card-header" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <div className="result-card-left">
          <div className="result-tier-dot" style={{ background: tierColor(result.savingsTier) }} />
          <div>
            <h3 className="result-tool-name">{result.toolName}</h3>
            <p className="result-plan-info">
              {result.currentPlan} · {result.currentSeats} seat{result.currentSeats > 1 ? "s" : ""} · ${result.currentMonthlySpend}/mo
            </p>
          </div>
        </div>
        <div className="result-card-right">
          {result.totalMonthlySavings > 0 ? (
            <span className="result-savings-badge savings-warn" style={{ background: `${tierColor(result.savingsTier)}15`, color: tierColor(result.savingsTier) }}>
              Save ${result.totalMonthlySavings}/mo
            </span>
          ) : (
            <span className="result-savings-badge savings-ok">✓ Optimized</span>
          )}
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="result-card-body">
          {result.recommendations.length === 0 ? (
            <div className="result-optimal">
              <CheckCircle2 size={24} color="#0AD87D" />
              <p>Your {result.toolName} setup looks well-optimized! No actionable savings found.</p>
            </div>
          ) : (
            <div className="result-recs">
              {result.recommendations.map((rec, i) => (
                <RecommendationRow key={i} rec={rec} />
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .result-card { overflow: hidden; }
        .result-card-header {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem; background: none; border: none;
          color: var(--text-primary); cursor: pointer; text-align: left; gap: 1rem;
          transition: background var(--transition-fast);
        }
        .result-card-header:hover { background: rgba(0, 0, 0, 0.015); }
        .result-card-left { display: flex; align-items: center; gap: 0.875rem; }
        .result-tier-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .result-tool-name { font-size: 1.05rem; font-weight: 700; margin: 0; }
        .result-plan-info { font-size: 0.8rem; color: var(--text-tertiary); margin: 0.125rem 0 0; }
        .result-card-right { display: flex; align-items: center; gap: 0.75rem; color: var(--text-tertiary); }
        .result-savings-badge { font-size: 0.8rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 999px; white-space: nowrap; }
        .savings-ok { background: rgba(10, 216, 125, 0.1); color: #0AD87D; }
        .result-card-body {
          padding: 0 1.5rem 1.5rem; border-top: 1px solid var(--border-primary);
          margin-top: 0; padding-top: 1.25rem;
        }
        .result-optimal {
          display: flex; align-items: center; gap: 0.75rem; padding: 1rem;
          background: rgba(10, 216, 125, 0.05); border-radius: var(--radius-md);
          color: var(--text-secondary); font-size: 0.9rem;
        }
        .result-recs { display: flex; flex-direction: column; gap: 0.75rem; }
      `}</style>
    </div>
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
          transition: border-color var(--transition-fast);
        }
        .rec-row:hover { border-color: var(--border-secondary); }
        .rec-icon {
          width: 32px; height: 32px; border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 0.125rem;
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
// Main Results Page
// ============================================================
export default function AuditResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState(false);

  // AI Summary state
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarySource, setSummarySource] = useState<"ai" | "template" | null>(null);

  // Lead capture state
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadHoneypot, setLeadHoneypot] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("burnlens-audit-result");
      if (stored) {
        const parsed = JSON.parse(stored) as AuditResult;
        setResult(parsed);
        // Fetch AI summary
        fetchSummary(parsed);
      } else {
        router.replace("/audit");
      }
    } catch {
      router.replace("/audit");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchSummary = async (auditResult: AuditResult) => {
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/audit/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: auditResult }),
      });
      const data = await res.json();
      setSummary(data.summary || null);
      setSummarySource(data.source || "template");
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

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
          auditSavings: result?.totalMonthlySavings,
          savingsTier: result?.savingsTier,
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
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="results-loading">
        <div className="loading-spinner" />
        <style jsx>{`
          .results-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .loading-spinner { width: 40px; height: 40px; border: 3px solid var(--border-card); border-top-color: var(--credex-green-dark); border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* Nav */}
      <nav className="results-nav">
        <div className="container results-nav-inner">
          <Link href="/audit" className="results-nav-back">
            <ArrowLeft size={18} />
            <Zap size={20} color="#0FF395" />
            <span>Burn<span style={{ color: "#0AD87D" }}>Lens</span></span>
          </Link>
          <button className="btn-secondary results-share" onClick={handleCopyLink}>
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </nav>

      <main className="container results-main">
        {/* Hero stats */}
        <div className="results-hero">
          <div className="results-hero-label">YOUR AI SPEND AUDIT</div>
          <h1 className="results-hero-title">
            You could save{" "}
            <span className="gradient-text">${result.totalAnnualSavings.toLocaleString()}</span>
            <span className="results-hero-period">/year</span>
          </h1>
          <p className="results-hero-subtitle">
            across {result.toolResults.length} tool{result.toolResults.length > 1 ? "s" : ""} · ${result.totalCurrentSpend.toLocaleString()}/mo current spend
          </p>
        </div>

        {/* Stats row */}
        <div className="results-stats-row">
          <div className="teal-card results-stat">
            <div className="results-stat-value">${result.totalCurrentSpend.toLocaleString()}</div>
            <div className="results-stat-label">Monthly Spend</div>
          </div>
          <div className="teal-card results-stat">
            <div className="results-stat-value" style={{ color: "#0FF395" }}>-${result.totalMonthlySavings.toLocaleString()}</div>
            <div className="results-stat-label">Monthly Savings</div>
          </div>
          <div className="teal-card results-stat">
            <div className="results-stat-value" style={{ color: tierColor(result.savingsTier) }}>
              {tierLabel(result.savingsTier)}
            </div>
            <div className="results-stat-label">Optimization Score</div>
          </div>
        </div>

        {/* Tool results */}
        <div className="results-cards">
          {result.toolResults.map((tr) => (
            <ToolResultCard key={tr.toolId} result={tr} />
          ))}
        </div>

        {/* AI Summary */}
        <div className="summary-card glass-card">
          <div className="summary-header">
            <MessageSquare size={20} color="#0AD87D" />
            <h3 className="summary-title">AI Audit Summary</h3>
            {summarySource && (
              <span className="badge" style={{ fontSize: "0.7rem" }}>
                {summarySource === "ai" ? "Cerebras AI" : "Auto-generated"}
              </span>
            )}
          </div>
          {summaryLoading ? (
            <div className="summary-loading">
              <Loader2 size={20} className="spin" />
              <span>Generating personalized summary...</span>
            </div>
          ) : summary ? (
            <p className="summary-text">{summary}</p>
          ) : (
            <p className="summary-text" style={{ color: "var(--text-tertiary)" }}>
              Summary unavailable. Check your Cerebras API key.
            </p>
          )}
        </div>

        {/* Lead Capture */}
        {!leadSubmitted ? (
          <div className="lead-card glass-card">
            <div className="lead-header">
              <Mail size={20} color="#0AD87D" />
              <div>
                <h3 className="lead-title">Get your full report by email</h3>
                <p className="lead-subtitle">We&apos;ll send a detailed breakdown + savings tips.</p>
              </div>
            </div>
            <form className="lead-form" onSubmit={handleLeadSubmit}>
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="website"
                value={leadHoneypot}
                onChange={(e) => setLeadHoneypot(e.target.value)}
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="lead-fields">
                <input
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Company (optional)"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                />
                <button type="submit" className="btn-primary" disabled={leadLoading}>
                  {leadLoading ? <Loader2 size={16} className="spin" /> : <Mail size={16} />}
                  Send Report
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lead-card glass-card lead-success">
            <CheckCircle2 size={24} color="#0AD87D" />
            <div>
              <h3 className="lead-title">Report sent!</h3>
              <p className="lead-subtitle">Check your inbox for a detailed breakdown of your audit.</p>
            </div>
          </div>
        )}

        {/* Credex CTA */}
        <div className="credex-cta teal-card">
          <div className="credex-cta-content">
            <Sparkles size={24} color="#0FF395" />
            <div>
              <h3 className="credex-cta-title">Save even more with Credex credits</h3>
              <p className="credex-cta-text">
                Credex sources verified AI credits at 10-30% below retail from companies that overforecast. Same plans, same features — just cheaper.
              </p>
            </div>
          </div>
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="btn-green credex-cta-btn">
            Explore Credex Credits
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Re-run */}
        <div className="results-rerun">
          <Link href="/audit" className="btn-secondary">
            <ArrowLeft size={16} />
            Edit & Re-run Audit
          </Link>
        </div>
      </main>

      <style jsx>{`
        .results-page { min-height: 100vh; padding-bottom: 4rem; background: var(--bg-primary); }

        .results-nav {
          position: sticky; top: 0; z-index: 50; padding: 1rem 0;
          background: rgba(244, 247, 250, 0.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-card);
        }
        .results-nav-inner { display: flex; align-items: center; justify-content: space-between; }
        .results-nav-back {
          display: flex; align-items: center; gap: 0.5rem;
          text-decoration: none; color: var(--text-primary); font-weight: 700; font-size: 1.1rem;
        }
        .results-share { font-size: 0.8rem; padding: 0.4rem 0.875rem; }

        .results-main { padding-top: 3rem; }
        .results-hero { text-align: center; margin-bottom: 2.5rem; }
        .results-hero-label {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--credex-green-dark); font-weight: 600; margin-bottom: 0.75rem;
        }
        .results-hero-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 0.5rem; }
        .results-hero-period { font-size: 0.5em; color: var(--text-tertiary); font-weight: 500; }
        .results-hero-subtitle { color: var(--text-secondary); font-size: 1rem; }

        .results-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .results-stat { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
        .results-stat-value { font-size: 1.25rem; font-weight: 800; color: white; }
        .results-stat-label { font-size: 0.75rem; color: var(--text-on-dark-secondary); margin-top: 0.25rem; }

        .results-cards { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }

        /* Summary */
        .summary-card { padding: 1.5rem; margin-bottom: 1.5rem; }
        .summary-header { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1rem; }
        .summary-title { font-size: 1rem; font-weight: 700; margin: 0; }
        .summary-loading { display: flex; align-items: center; gap: 0.75rem; color: var(--text-tertiary); font-size: 0.9rem; }
        .summary-text { font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Lead capture */
        .lead-card { padding: 1.5rem; margin-bottom: 1.5rem; }
        .lead-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
        .lead-title { font-size: 1rem; font-weight: 700; margin: 0; }
        .lead-subtitle { font-size: 0.85rem; color: var(--text-tertiary); margin: 0.125rem 0 0; }
        .lead-form { position: relative; }
        .lead-fields { display: flex; gap: 0.75rem; align-items: stretch; }
        .lead-fields .input-field { flex: 1; }
        .lead-fields .btn-primary { white-space: nowrap; padding: 0.75rem 1.5rem; font-size: 0.9rem; }
        .lead-success { display: flex; align-items: center; gap: 0.75rem; }

        .credex-cta {
          padding: 2rem; display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; margin-bottom: 2rem;
        }
        .credex-cta-content { display: flex; align-items: flex-start; gap: 1rem; }
        .credex-cta-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.375rem; color: white; }
        .credex-cta-text { font-size: 0.85rem; color: var(--text-on-dark-secondary); margin: 0; max-width: 500px; line-height: 1.6; }
        .credex-cta-btn { white-space: nowrap; text-decoration: none; }

        .results-rerun { text-align: center; }

        @media (max-width: 768px) {
          .results-stats-row { grid-template-columns: 1fr; }
          .credex-cta { flex-direction: column; text-align: center; }
          .credex-cta-content { flex-direction: column; align-items: center; }
          .lead-fields { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
