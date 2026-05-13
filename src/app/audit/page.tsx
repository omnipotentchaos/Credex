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

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================
// Local storage key
// ============================================================
const STORAGE_KEY = "CredexAudit-audit-form";

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
      if (saved) {
        const parsed = JSON.parse(saved) as FormState;
        // Filter out tools that no longer exist in the config
        parsed.tools = parsed.tools.filter(t => TOOLS_MAP[t.toolId]);
        return parsed;
      }
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
    sessionStorage.setItem("CredexAudit-audit-result", JSON.stringify(result));
    sessionStorage.setItem("CredexAudit-audit-input", JSON.stringify(input));
    router.push("/audit/results");
  };

  const usedToolIds = new Set(form.tools.map((t) => t.toolId));
  const canAddMore = usedToolIds.size < ALL_TOOLS.length;

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/90 py-4 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground transition-colors hover:text-foreground no-underline">
            <ArrowLeft size={18} />
            <Zap size={20} color="#0FF395" />
            <span className="text-foreground">
              Burn<span className="text-[#0AD87D]">Lens</span>
            </span>
          </Link>
          <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground bg-secondary/50">
            <Save size={12} />
            Auto-saved
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto max-w-4xl px-6 pt-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Tell us about your <span className="text-[#0AD87D]">AI stack</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Add the AI tools your team pays for. We&apos;ll analyze each one and
            find where you can save.
          </p>
        </div>

        {/* Team info row */}
        <Card className="mb-8 grid gap-6 p-6 sm:grid-cols-[200px_1fr] rounded-2xl shadow-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="team-size" className="flex items-center gap-1.5 text-muted-foreground">
              <Users size={14} />
              Team Size
            </Label>
            <Input
              id="team-size"
              type="number"
              min={1}
              max={10000}
              value={form.teamSize}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teamSize: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="use-case" className="text-muted-foreground">Primary Use Case</Label>
            <Select
              value={form.useCase}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  useCase: val as UseCase,
                }))
              }
            >
              <SelectTrigger id="use-case">
                <SelectValue placeholder="Select primary use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.id} value={uc.id}>
                    {uc.label} — {uc.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tool cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your AI Tools</h2>
            {canAddMore && (
              <Button variant="outline" size="sm" onClick={addTool} id="add-tool-btn" className="gap-2 rounded-full">
                <Plus size={16} />
                Add Tool
              </Button>
            )}
          </div>

          {form.tools.length === 0 ? (
            <Card className="flex flex-col items-center gap-6 p-12 text-center rounded-2xl border-dashed">
              <p className="text-muted-foreground">
                No tools added yet. Click &quot;Add Tool&quot; to get started.
              </p>
              <Button onClick={addTool} id="add-first-tool-btn" className="gap-2 rounded-full px-6">
                <Plus size={18} />
                Add Your First Tool
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {form.tools.map((entry, index) => {
                const tool = TOOLS_MAP[entry.toolId];
                const selectedPlan = tool.plans.find(
                  (p) => p.id === entry.planId
                );

                return (
                  <Card key={index} className="p-5 rounded-2xl shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                        style={{ background: tool.color }}
                      >
                        {tool.name.charAt(0)}
                      </div>
                      <Select
                        value={entry.toolId}
                        onValueChange={(val) => handleToolChange(index, val as ToolId)}
                      >
                        <SelectTrigger className="flex-1 font-semibold border-transparent bg-secondary/50 hover:bg-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_TOOLS.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={t.id}
                              disabled={usedToolIds.has(t.id) && t.id !== entry.toolId}
                            >
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 h-9 w-9"
                        onClick={() => removeTool(index)}
                        aria-label={`Remove ${tool.name}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground font-medium">Plan</Label>
                        <Select
                          value={entry.planId}
                          onValueChange={(val) => handlePlanChange(index, val, entry.toolId)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tool.plans.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                                {p.pricePerSeat > 0
                                  ? ` — $${p.pricePerSeat}/seat/mo`
                                  : p.pricePerSeat === 0
                                  ? " — Free"
                                  : " — Custom"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs text-muted-foreground font-medium">Seats</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10000}
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
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs text-muted-foreground font-medium">Monthly Spend ($)</Label>
                          <Input
                            type="number"
                            min={0}
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
                        <p className="text-xs italic text-muted-foreground mt-1">
                          Best for: {selectedPlan.bestFor}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        {form.tools.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-6 px-2 sm:px-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tools</span>
                <span className="text-lg font-bold">{form.tools.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Monthly</span>
                <span className="text-lg font-bold">
                  ${form.tools.reduce((s, t) => s + t.monthlySpend, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Seats</span>
                <span className="text-lg font-bold">
                  {form.tools.reduce((s, t) => s + t.seats, 0)}
                </span>
              </div>
              <Button
                size="lg"
                className="ml-auto w-full gap-2 rounded-full sm:w-auto px-8"
                onClick={handleSubmit}
                id="run-audit-btn"
              >
                Run Audit
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
