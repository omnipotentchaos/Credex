"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  TrendingDown,
  Share2,
  Shield,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

/* -------------------------------------------------- */
/*  Landing page – "BurnLens" AI Spend Audit          */
/* -------------------------------------------------- */

const TOOL_LOGOS: { name: string; gradient: string }[] = [
  { name: "Cursor", gradient: "from-violet-500 to-purple-600" },
  { name: "GitHub Copilot", gradient: "from-blue-500 to-cyan-500" },
  { name: "ChatGPT", gradient: "from-emerald-400 to-teal-500" },
  { name: "Claude", gradient: "from-orange-400 to-amber-500" },
  { name: "Gemini", gradient: "from-blue-400 to-indigo-500" },
  { name: "Windsurf", gradient: "from-cyan-400 to-blue-500" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Instant Spend Analysis",
    description:
      "Input your AI tool stack and get a detailed breakdown of where every dollar goes — in under 60 seconds.",
  },
  {
    icon: TrendingDown,
    title: "Actionable Savings",
    description:
      "See exactly which plans to downgrade, which tools to switch, and how much you'll save monthly and annually.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Get a personalized summary written by AI that explains your spending patterns and recommends next steps.",
  },
  {
    icon: Share2,
    title: "Shareable Reports",
    description:
      "Share your audit via a unique link with clean previews. Perfect for presenting savings to your CFO or team lead.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Add your tools",
    description: "Tell us what AI tools you pay for, which plan, and how many seats.",
  },
  {
    step: "02",
    title: "Get your audit",
    description:
      "Our engine analyzes your stack against current pricing and alternatives.",
  },
  {
    step: "03",
    title: "Save money",
    description:
      "See your total savings potential and act on specific recommendations.",
  },
];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="landing-page bg-grid">
      {/* ===================== NAVBAR ===================== */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container navbar-inner">
          <Link href="/" className="navbar-brand" aria-label="BurnLens home">
            <Zap size={24} className="navbar-brand-icon" />
            <span className="navbar-brand-text">
              Burn<span className="gradient-text">Lens</span>
            </span>
          </Link>

          <div className="navbar-actions">
            <Link href="/audit" className="btn-primary" id="nav-start-audit">
              Start Free Audit
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section
        className="hero-section"
        role="banner"
        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        {/* Background orbs */}
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />

        <div className="container hero-container">
          <div className="hero-content">
            <div
              className="badge animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <Shield size={14} />
              Free &middot; No login required
            </div>

            <h1
              className="hero-title animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Stop overspending
              <br />
              on <span className="gradient-text">AI tools</span>
            </h1>

            <p
              className="hero-subtitle animate-fade-in-up"
              style={{ animationDelay: "350ms" }}
            >
              Most teams waste 20-40% of their AI tool budget on wrong plans,
              unused seats, and missed alternatives. BurnLens audits your stack
              in 60 seconds and shows you exactly where to save.
            </p>

            <div
              className="hero-cta-group animate-fade-in-up"
              style={{ animationDelay: "500ms" }}
            >
              <Link href="/audit" className="btn-primary btn-lg" id="hero-start-audit">
                Audit My AI Spend
                <ArrowRight size={18} />
              </Link>
              <span className="hero-cta-note">
                <CheckCircle2 size={14} />
                Takes 2 minutes &middot; No signup needed
              </span>
            </div>

            {/* Social proof placeholder */}
            <div
              className="hero-social-proof animate-fade-in-up"
              style={{ animationDelay: "650ms" }}
            >
              <div className="social-proof-avatars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="social-proof-avatar"
                    style={{
                      background: `hsl(${220 + i * 30}, 70%, 60%)`,
                    }}
                  />
                ))}
              </div>
              <p className="social-proof-text">
                <strong>500+</strong> audits completed this month
                <span className="social-proof-mocked">(mocked)</span>
              </p>
            </div>
          </div>

          {/* Hero visual – tool grid */}
          <div
            className="hero-visual animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
            aria-hidden="true"
          >
            <div className="hero-card glass-card">
              <div className="hero-card-header">
                <span className="hero-card-label">Monthly AI Spend</span>
                <span className="hero-card-amount">$2,847</span>
              </div>
              <div className="hero-card-savings">
                <TrendingDown size={20} />
                <div>
                  <span className="hero-card-savings-label">
                    Potential savings
                  </span>
                  <span className="hero-card-savings-amount gradient-text-savings">
                    $1,140/mo
                  </span>
                </div>
              </div>
              <div className="hero-card-tools">
                {TOOL_LOGOS.map((tool) => (
                  <div key={tool.name} className="hero-card-tool-pill">
                    <div
                      className={`hero-card-tool-dot bg-gradient-to-r ${tool.gradient}`}
                    />
                    {tool.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="steps-section" aria-labelledby="steps-heading">
        <div className="container">
          <h2 id="steps-heading" className="section-heading">
            How it works
          </h2>
          <p className="section-subheading">
            Three steps. Two minutes. Real savings.
          </p>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.step}
                className="step-card glass-card"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className="step-number gradient-text">{step.step}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="features-section" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading" className="section-heading">
            Everything you need to{" "}
            <span className="gradient-text">cut AI costs</span>
          </h2>
          <p className="section-subheading">
            Built for engineering managers, founders, and ops teams who want to
            stop bleeding money on AI subscriptions.
          </p>

          <div className="features-grid">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="feature-card glass-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="feature-icon-wrapper">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TOOLS SUPPORTED ===================== */}
      <section className="tools-section" aria-labelledby="tools-heading">
        <div className="container">
          <h2 id="tools-heading" className="section-heading">
            We audit <span className="gradient-text">every major AI tool</span>
          </h2>
          <div className="tools-marquee">
            {[...TOOL_LOGOS, ...TOOL_LOGOS].map((tool, i) => (
              <div key={`${tool.name}-${i}`} className="tool-chip">
                <div
                  className={`tool-chip-dot bg-gradient-to-r ${tool.gradient}`}
                />
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container cta-container">
          <div className="cta-card">
            <h2 id="cta-heading" className="cta-title">
              Ready to find your savings?
            </h2>
            <p className="cta-subtitle">
              Most teams discover $200–$2,000/month in avoidable AI spend. Yours
              might too.
            </p>
            <Link href="/audit" className="btn-primary btn-lg" id="cta-start-audit">
              Start Free Audit
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Zap size={20} className="navbar-brand-icon" />
            <span className="navbar-brand-text" style={{ fontSize: "1rem" }}>
              Burn<span className="gradient-text">Lens</span>
            </span>
          </div>
          <p className="footer-text">
            Built by{" "}
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Credex
            </a>{" "}
            &middot; The marketplace for AI &amp; cloud credits
          </p>
          <p className="footer-disclaimer">
            Pricing data verified as of May 2026. All savings estimates are
            indicative.
          </p>
        </div>
      </footer>

      {/* ===================== PAGE-SPECIFIC STYLES ===================== */}
      <style jsx>{`
        /* --- Navbar --- */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 0;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-primary);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-primary);
        }
        .navbar-brand-icon {
          color: var(--brand-primary-light);
        }
        .navbar-brand-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        /* --- Hero --- */
        .hero-section {
          position: relative;
          padding: 10rem 0 6rem;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .hero-orb-1 {
          width: 600px;
          height: 600px;
          background: rgba(99, 102, 241, 0.12);
          top: -200px;
          left: -100px;
        }
        .hero-orb-2 {
          width: 500px;
          height: 500px;
          background: rgba(6, 182, 212, 0.08);
          bottom: -200px;
          right: -100px;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-title {
          margin-top: 1.25rem;
          line-height: 1.1;
        }
        .hero-subtitle {
          margin-top: 1.5rem;
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 540px;
        }
        .hero-cta-group {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
        }
        .hero-cta-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        /* --- Social Proof --- */
        .hero-social-proof {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .social-proof-avatars {
          display: flex;
        }
        .social-proof-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--bg-primary);
          margin-left: -8px;
        }
        .social-proof-avatar:first-child {
          margin-left: 0;
        }
        .social-proof-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .social-proof-mocked {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          margin-left: 0.25rem;
        }

        /* --- Hero Card --- */
        .hero-card {
          padding: 2rem;
          position: relative;
        }
        .hero-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: var(--radius-lg);
          padding: 1px;
          background: var(--gradient-brand);
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.3;
        }
        .hero-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1.5rem;
        }
        .hero-card-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .hero-card-amount {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .hero-card-savings {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          color: #10b981;
        }
        .hero-card-savings-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .hero-card-savings-amount {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .hero-card-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .hero-card-tool-pill {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.8rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }
        .hero-card-tool-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* --- Sections --- */
        .section-heading {
          text-align: center;
          margin-bottom: 0.75rem;
        }
        .section-subheading {
          text-align: center;
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 3.5rem;
        }

        /* --- Steps --- */
        .steps-section {
          padding: 6rem 0;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .step-card {
          padding: 2rem;
          text-align: center;
        }
        .step-number {
          font-size: 3rem;
          font-weight: 900;
          opacity: 0.8;
        }
        .step-title {
          margin-top: 0.75rem;
          font-size: 1.25rem;
        }
        .step-description {
          margin-top: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* --- Features --- */
        .features-section {
          padding: 6rem 0;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .feature-card {
          padding: 2rem;
        }
        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: var(--bg-elevated);
          color: var(--brand-primary-light);
          margin-bottom: 1rem;
        }
        .feature-title {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }
        .feature-description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* --- Tools marquee --- */
        .tools-section {
          padding: 4rem 0;
          overflow: hidden;
        }
        .tools-marquee {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }
        .tool-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .tool-chip-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        /* --- CTA --- */
        .cta-section {
          padding: 6rem 0;
        }
        .cta-card {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--gradient-card);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
        }
        .cta-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            600px circle at 50% 0%,
            rgba(99, 102, 241, 0.1),
            transparent
          );
        }
        .cta-title {
          position: relative;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
        }
        .cta-subtitle {
          position: relative;
          margin: 1rem auto 2rem;
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 500px;
        }

        /* --- Footer --- */
        .footer {
          padding: 3rem 0;
          border-top: 1px solid var(--border-primary);
        }
        .footer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .footer-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .footer-link {
          color: var(--brand-primary-light);
          text-decoration: none;
          font-weight: 500;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .footer-disclaimer {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        /* --- Responsive --- */
        @media (max-width: 768px) {
          .hero-section {
            padding: 8rem 0 4rem;
          }
          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .hero-visual {
            order: -1;
          }
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .cta-card {
            padding: 3rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
