"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  TrendingDown,
  Shield,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

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
    <div className="landing">
      {/* ====== NAVBAR ====== */}
      <nav className="nav-wrapper">
        <div className="nav-bar">
          <Link href="/" className="nav-brand">
            <Zap size={22} color="#0FF395" />
            <span className="nav-brand-text">
              Burn<span style={{ color: "#0AD87D" }}>Lens</span>
            </span>
          </Link>

          <div className="nav-center">
            <span className="badge-green badge" style={{ fontSize: "0.75rem" }}>
              BY CREDEX
            </span>
          </div>

          <div className="nav-right">
            <Link href="/audit" className="btn-primary" style={{ padding: "0.625rem 1.5rem", fontSize: "0.9rem" }}>
              Start Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="hero-section">
        <div className="container hero-content">
          {/* Floating tool icons */}
          <div className="hero-tools">
            {TOOLS.slice(0, 4).map((t) => (
              <div key={t.name} className="hero-tool-icon" style={{ background: t.color }}>
                {t.name.charAt(0)}
              </div>
            ))}
          </div>

          <div className="hero-pill badge">
            <span className="badge-green badge" style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem" }}>
              NO OVERSPEND
            </span>
            <span>AI spend audit in 60 seconds</span>
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">Save Up To 40%</span>
            <br />
            On AI Tool Subscriptions
          </h1>

          <p className="hero-subtitle">
            Free audit for your Cursor, Copilot, Claude, ChatGPT, and Gemini spend.
            Find savings and unlock discounted credits through Credex.
          </p>

          <div className="hero-actions">
            <Link href="/audit" className="btn-primary hero-cta">
              Start buying credits
            </Link>
          </div>
        </div>
      </section>

      {/* ====== TRUST MARQUEE ====== */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ====== STATS + INTRO (Credex teal section) ====== */}
      <section className="section">
        <div className="container stats-grid">
          <div className="teal-card stats-intro">
            <span className="section-label" style={{ color: "#0FF395" }}>
              TAP IN
            </span>
            <h2 style={{ color: "white", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Stop overpaying for AI tools you already use
            </h2>
            <p style={{ color: "var(--text-on-dark-secondary)", marginTop: "1rem", lineHeight: 1.7 }}>
              We analyze your current plans across 8 tools, flag waste, and recommend the optimal configuration — same features, lower cost.
            </p>
          </div>

          <div className="stats-numbers">
            <div className="teal-card stat-card">
              <div className="stat-value">$2.4K</div>
              <div className="stat-label">Avg. Annual Savings</div>
            </div>
            <div className="teal-card stat-card">
              <div className="stat-value">8+</div>
              <div className="stat-label">Tools Audited</div>
            </div>
            <div className="teal-card stat-card">
              <div className="stat-value">60s</div>
              <div className="stat-label">Time to Audit</div>
            </div>
            <div className="teal-card stat-card">
              <div className="stat-value">6</div>
              <div className="stat-label">Audit Rules</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <span className="section-label">HOW IT WORKS</span>
          <h2 className="section-title">Three steps to lower your AI bill</h2>

          <div className="steps-grid">
            {[
              {
                num: "01",
                title: "Add Your Tools",
                desc: "Tell us which AI tools you use — Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf — and your current plans and seats.",
                icon: <BarChart3 size={24} />,
              },
              {
                num: "02",
                title: "Get Your Audit",
                desc: "Our engine runs 6 rule-based checks: plan-fit, overpay detection, seat right-sizing, cross-tool alternatives, and Credex credit savings.",
                icon: <TrendingDown size={24} />,
              },
              {
                num: "03",
                title: "Save Money",
                desc: "Act on clear recommendations with dollar amounts. Or save even more with discounted Credex credits — same plans, 10-30% off.",
                icon: <Sparkles size={24} />,
              },
            ].map((step) => (
              <div key={step.num} className="step-card glass-card">
                <div className="step-num">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TOOLS GRID (like Credex credit plans) ====== */}
      <section className="section">
        <div className="container">
          <div className="tools-header">
            <div>
              <span className="section-label">SUPPORTED TOOLS</span>
              <h2 className="section-title">Explore audit coverage</h2>
            </div>
            <Link href="/audit" className="btn-primary" style={{ padding: "0.625rem 1.5rem", fontSize: "0.9rem" }}>
              Start Audit
            </Link>
          </div>

          <div className="tools-grid">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="tool-card glass-card">
                <div className="tool-card-icon" style={{ background: tool.color }}>
                  {tool.name.charAt(0)}
                </div>
                <div className="tool-card-rows">
                  <div className="tool-card-row">
                    <span className="tool-card-label">Product</span>
                    <span className="tool-card-value">{tool.name}</span>
                  </div>
                  <div className="tool-card-row">
                    <span className="tool-card-label">Category</span>
                    <span className="tool-card-value">
                      {tool.name.includes("API") ? "API" : tool.name.includes("Cursor") || tool.name.includes("Copilot") || tool.name.includes("Windsurf") ? "IDE" : "Chat"}
                    </span>
                  </div>
                  <div className="tool-card-row">
                    <span className="tool-card-label">Audit Rules</span>
                    <span className="tool-card-value">6 checks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SAFETY & GUARANTEE ====== */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container guarantee-grid">
          <div>
            <span className="section-label">METHODOLOGY</span>
            <h2 className="section-title">Transparent, rule-based auditing</h2>
            <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
              Every recommendation comes with clear reasoning, dollar savings, and source data. No black boxes.
            </p>

            <div className="guarantee-list">
              {[
                "All pricing verified from official vendor pages",
                "6 independent audit checks per tool",
                "Recommendations include trade-off explanations",
                "Credex credit savings clearly labeled as marketplace offers",
              ].map((item) => (
                <div key={item} className="guarantee-item">
                  <CheckCircle2 size={18} color="#0AD87D" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="teal-card guarantee-cta-card">
            <Shield size={32} color="#0FF395" />
            <h3 style={{ color: "white", marginTop: "1rem" }}>Powered by Credex</h3>
            <p style={{ color: "var(--text-on-dark-secondary)", margin: "0.5rem 0 1.5rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
              BurnLens is built by Credex — the marketplace for discounted AI & cloud credits. Save on the same tools with verified sellers.
            </p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="btn-green">
              Visit Credex
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="section final-cta-section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>
            Ready to audit your AI spend?
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto 2rem", textAlign: "center" }}>
            Free. Instant. No sign-up required. See exactly where your money goes.
          </p>
          <Link href="/audit" className="btn-primary hero-cta">
            Start Your Free Audit
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Zap size={18} color="#0FF395" />
            <span style={{ fontWeight: 700 }}>BurnLens</span>
            <span style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>
              by Credex
            </span>
          </div>
          <div className="footer-links">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
              Credex
            </a>
            <Link href="/audit">Audit</Link>
          </div>
          <p className="footer-copy">
            © 2026 Credex. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ====== SCOPED STYLES ====== */}
      <style jsx>{`
        .landing {
          min-height: 100vh;
        }

        /* Nav */
        .nav-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0.75rem 1.5rem 0;
        }
        .nav-bar {
          max-width: calc(var(--container-max) - 4rem);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1.25rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-full);
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .nav-brand-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .nav-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Hero */
        .hero-section {
          padding: 6rem 0 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          position: relative;
          z-index: 2;
        }
        .hero-tools {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .hero-tool-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: var(--shadow-md);
          transform: rotate(-6deg);
          transition: transform var(--transition-base);
        }
        .hero-tool-icon:nth-child(2) { transform: rotate(4deg); }
        .hero-tool-icon:nth-child(3) { transform: rotate(-3deg); }
        .hero-tool-icon:nth-child(4) { transform: rotate(7deg); }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }
        .hero-title {
          font-size: clamp(2.5rem, 5.5vw, 4.5rem);
          line-height: 1.05;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .hero-cta {
          padding: 1rem 2.5rem;
          font-size: 1.05rem;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .stats-intro {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .stats-numbers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .stat-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .stat-value {
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--text-on-dark-secondary);
          margin-top: 0.25rem;
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .step-card {
          padding: 2rem;
        }
        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--credex-teal);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }
        .step-title {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }
        .step-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Tools grid */
        .tools-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .tool-card {
          padding: 1.5rem;
        }
        .tool-card-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
        }
        .tool-card-rows {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .tool-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .tool-card-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .tool-card-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }
        .tool-card-value {
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* Guarantee */
        .guarantee-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        .guarantee-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .guarantee-item:last-child {
          border-bottom: none;
        }
        .guarantee-cta-card {
          padding: 2.5rem;
        }

        /* Final CTA */
        .final-cta-section {
          border-top: 1px solid var(--border-primary);
        }

        /* Footer */
        .footer {
          padding: 2rem 0;
          border-top: 1px solid var(--border-card);
        }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--text-primary);
        }
        .footer-copy {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        @media (max-width: 768px) {
          .nav-center { display: none; }
          .stats-grid { grid-template-columns: 1fr; }
          .stats-numbers { grid-template-columns: 1fr 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .tools-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .tools-grid { grid-template-columns: 1fr; }
          .guarantee-grid { grid-template-columns: 1fr; }
          .footer-inner { flex-direction: column; gap: 1rem; text-align: center; }
          .hero-tools { display: none; }
        }
      `}</style>
    </div>
  );
}
