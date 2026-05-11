"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Users,
  Save,
} from "lucide-react";
import {
  ALL_TOOLS,
  USE_CASES,
  TOOLS_MAP,
  type ToolId,
  type UseCase,
} from "@/lib/pricing-data";
import { type ToolEntry, type AuditInput, runAudit } from "@/lib/audit-engine";

// ============================================================
// Local storage key
// ============================================================
const STORAGE_KEY = "burnlens-audit-form";

interface FormState {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

const DEFAULT_FORM: FormState = {
  tools: [],
  teamSize: 1,
  useCase: "coding",
};

// ============================================================
// Component
// ============================================================
export default function AuditFormPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as FormState;
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_FORM;
  });
  const isFirstRender = useRef(true);

  // Persist to localStorage on change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // ---- Tool management ----
  const addTool = useCallback(() => {
    const usedIds = new Set(form.tools.map((t) => t.toolId));
    const available = ALL_TOOLS.find((t) => !usedIds.has(t.id));
    if (!available) return;

    const defaultPlan =
      available.plans.find((p) => p.pricePerSeat > 0) || available.plans[0];

    setForm((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          toolId: available.id,
          planId: defaultPlan.id,
          monthlySpend: defaultPlan.pricePerSeat > 0 ? defaultPlan.pricePerSeat : 0,
          seats: 1,
        },
      ],
    }));
  }, [form.tools]);

  const removeTool = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  }, []);

  const updateTool = useCallback(
    (index: number, updates: Partial<ToolEntry>) => {
      setForm((prev) => ({
        ...prev,
        tools: prev.tools.map((t, i) => (i === index ? { ...t, ...updates } : t)),
      }));
    },
    []
  );

  const handleToolChange = useCallback(
    (index: number, newToolId: ToolId) => {
      const tool = TOOLS_MAP[newToolId];
      const defaultPlan =
        tool.plans.find((p) => p.pricePerSeat > 0) || tool.plans[0];
      updateTool(index, {
        toolId: newToolId,
        planId: defaultPlan.id,
        monthlySpend: defaultPlan.pricePerSeat > 0 ? defaultPlan.pricePerSeat : 0,
        seats: 1,
      });
    },
    [updateTool]
  );

  const handlePlanChange = useCallback(
    (index: number, planId: string, toolId: ToolId) => {
      const tool = TOOLS_MAP[toolId];
      const plan = tool.plans.find((p) => p.id === planId);
      if (plan) {
        const seats = form.tools[index].seats;
        updateTool(index, {
          planId,
          monthlySpend: plan.pricePerSeat > 0 ? plan.pricePerSeat * seats : form.tools[index].monthlySpend,
        });
      }
    },
    [updateTool, form.tools]
  );

  // ---- Submit ----
  const handleSubmit = () => {
    if (form.tools.length === 0) return;

    const input: AuditInput = {
      tools: form.tools,
      teamSize: form.teamSize,
      useCase: form.useCase,
    };

    const result = runAudit(input);
    sessionStorage.setItem("burnlens-audit-result", JSON.stringify(result));
    sessionStorage.setItem("burnlens-audit-input", JSON.stringify(input));
    router.push("/audit/results");
  };

  const usedToolIds = new Set(form.tools.map((t) => t.toolId));
  const canAddMore = usedToolIds.size < ALL_TOOLS.length;

  return (
    <div className="audit-page">
      {/* Navbar */}
      <nav className="audit-nav">
        <div className="container audit-nav-inner">
          <Link href="/" className="audit-nav-brand" aria-label="Back to home">
            <ArrowLeft size={18} />
            <Zap size={20} color="#0FF395" />
            <span className="audit-nav-text">
              Burn<span style={{ color: "#0AD87D" }}>Lens</span>
            </span>
          </Link>
          <div className="badge" style={{ fontSize: "0.75rem", gap: "0.25rem" }}>
            <Save size={12} />
            Auto-saved
          </div>
        </div>
      </nav>

      <main className="container audit-main">
        {/* Header */}
        <div className="audit-header">
          <h1 className="audit-title">
            Tell us about your <span className="gradient-text">AI stack</span>
          </h1>
          <p className="audit-subtitle">
            Add the AI tools your team pays for. We&apos;ll analyze each one and
            find where you can save.
          </p>
        </div>

        {/* Team info row */}
        <div className="audit-team-row glass-card">
          <div className="audit-field">
            <label className="input-label" htmlFor="team-size">
              <Users size={14} />
              Team Size
            </label>
            <input
              id="team-size"
              type="number"
              min={1}
              max={10000}
              className="input-field"
              value={form.teamSize}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teamSize: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
            />
          </div>
          <div className="audit-field">
            <label className="input-label" htmlFor="use-case">
              Primary Use Case
            </label>
            <select
              id="use-case"
              className="input-field"
              value={form.useCase}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  useCase: e.target.value as UseCase,
                }))
              }
            >
              {USE_CASES.map((uc) => (
                <option key={uc.id} value={uc.id}>
                  {uc.label} — {uc.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tool cards */}
        <div className="audit-tools-section">
          <div className="audit-tools-header">
            <h2 className="audit-tools-title">Your AI Tools</h2>
            {canAddMore && (
              <button
                className="btn-secondary"
                onClick={addTool}
                id="add-tool-btn"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <Plus size={16} />
                Add Tool
              </button>
            )}
          </div>

          {form.tools.length === 0 ? (
            <div className="audit-empty glass-card">
              <p className="audit-empty-text">
                No tools added yet. Click &quot;Add Tool&quot; to get started.
              </p>
              <button className="btn-primary" onClick={addTool} id="add-first-tool-btn">
                <Plus size={18} />
                Add Your First Tool
              </button>
            </div>
          ) : (
            <div className="audit-tools-grid">
              {form.tools.map((entry, index) => {
                const tool = TOOLS_MAP[entry.toolId];
                const selectedPlan = tool.plans.find(
                  (p) => p.id === entry.planId
                );

                return (
                  <div key={index} className="audit-tool-card glass-card">
                    <div className="audit-tool-card-header">
                      <div
                        className="audit-tool-dot"
                        style={{ background: tool.color }}
                      >
                        {tool.name.charAt(0)}
                      </div>
                      <select
                        className="input-field audit-tool-select"
                        value={entry.toolId}
                        onChange={(e) =>
                          handleToolChange(index, e.target.value as ToolId)
                        }
                        aria-label={`Tool ${index + 1} name`}
                      >
                        {ALL_TOOLS.map((t) => (
                          <option
                            key={t.id}
                            value={t.id}
                            disabled={usedToolIds.has(t.id) && t.id !== entry.toolId}
                          >
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="audit-tool-remove"
                        onClick={() => removeTool(index)}
                        aria-label={`Remove ${tool.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="audit-tool-fields">
                      <div className="audit-field">
                        <label className="input-label">Plan</label>
                        <select
                          className="input-field"
                          value={entry.planId}
                          onChange={(e) =>
                            handlePlanChange(index, e.target.value, entry.toolId)
                          }
                        >
                          {tool.plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                              {p.pricePerSeat > 0
                                ? ` — $${p.pricePerSeat}/seat/mo`
                                : p.pricePerSeat === 0
                                ? " — Free"
                                : " — Custom"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="audit-field-row">
                        <div className="audit-field">
                          <label className="input-label">Seats</label>
                          <input
                            type="number"
                            min={1}
                            max={10000}
                            className="input-field"
                            value={entry.seats}
                            onChange={(e) => {
                              const seats = Math.max(
                                1,
                                parseInt(e.target.value) || 1
                              );
                              const plan = tool.plans.find(
                                (p) => p.id === entry.planId
                              );
                              const autoSpend =
                                plan && plan.pricePerSeat > 0
                                  ? plan.pricePerSeat * seats
                                  : entry.monthlySpend;
                              updateTool(index, {
                                seats,
                                monthlySpend: autoSpend,
                              });
                            }}
                          />
                        </div>
                        <div className="audit-field">
                          <label className="input-label">Monthly Spend ($)</label>
                          <input
                            type="number"
                            min={0}
                            className="input-field"
                            value={entry.monthlySpend}
                            onChange={(e) =>
                              updateTool(index, {
                                monthlySpend: Math.max(
                                  0,
                                  parseFloat(e.target.value) || 0
                                ),
                              })
                            }
                          />
                        </div>
                      </div>

                      {selectedPlan && (
                        <p className="audit-tool-best-for">
                          Best for: {selectedPlan.bestFor}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        {form.tools.length > 0 && (
          <div className="audit-submit-section">
            <div className="audit-summary-bar glass-card">
              <div className="audit-summary-stat">
                <span className="audit-summary-label">Tools</span>
                <span className="audit-summary-value">{form.tools.length}</span>
              </div>
              <div className="audit-summary-stat">
                <span className="audit-summary-label">Total Monthly</span>
                <span className="audit-summary-value">
                  ${form.tools.reduce((s, t) => s + t.monthlySpend, 0).toLocaleString()}
                </span>
              </div>
              <div className="audit-summary-stat">
                <span className="audit-summary-label">Total Seats</span>
                <span className="audit-summary-value">
                  {form.tools.reduce((s, t) => s + t.seats, 0)}
                </span>
              </div>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                id="run-audit-btn"
              >
                Run Audit
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Styles */}
      <style jsx>{`
        .audit-page {
          min-height: 100vh;
          padding-bottom: 8rem;
          background: var(--bg-primary);
        }
        .audit-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-card);
          border-top-color: var(--credex-green-dark);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Nav */
        .audit-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 1rem 0;
          background: rgba(244, 247, 250, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-card);
        }
        .audit-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .audit-nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 1.1rem;
          transition: color var(--transition-base);
        }
        .audit-nav-brand:hover {
          color: var(--text-primary);
        }
        .audit-nav-text {
          color: var(--text-primary);
        }

        /* Header */
        .audit-main {
          padding-top: 3rem;
        }
        .audit-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .audit-title {
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          margin-bottom: 0.75rem;
        }
        .audit-subtitle {
          color: var(--text-secondary);
          font-size: 1.05rem;
          max-width: 550px;
          margin: 0 auto;
        }

        /* Team row */
        .audit-team-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .audit-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* Tools section */
        .audit-tools-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .audit-tools-title {
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* Empty state */
        .audit-empty {
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .audit-empty-text {
          color: var(--text-tertiary);
          font-size: 1rem;
        }

        /* Tool cards */
        .audit-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1rem;
        }
        .audit-tool-card {
          padding: 1.25rem;
        }
        .audit-tool-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .audit-tool-dot {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
        }
        .audit-tool-select {
          flex: 1;
          font-weight: 600;
        }
        .audit-tool-remove {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 0.375rem;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .audit-tool-remove:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
        }
        .audit-tool-fields {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .audit-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .audit-tool-best-for {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          font-style: italic;
        }

        /* Submit */
        .audit-submit-section {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem var(--container-padding);
          background: rgba(244, 247, 250, 0.92);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-card);
          z-index: 50;
        }
        .audit-summary-bar {
          max-width: var(--container-max);
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1rem 1.5rem;
        }
        .audit-summary-stat {
          display: flex;
          flex-direction: column;
        }
        .audit-summary-label {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .audit-summary-value {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .audit-summary-bar .btn-primary {
          margin-left: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .audit-team-row {
            grid-template-columns: 1fr;
          }
          .audit-tools-grid {
            grid-template-columns: 1fr;
          }
          .audit-summary-bar {
            flex-wrap: wrap;
            gap: 1rem;
          }
          .audit-summary-bar .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
