// ============================================================
// CredexAudit — Audit Engine
// Rule-based audit logic. No AI here — hardcoded rules are correct.
// ============================================================

import {
  type ToolId,
  type UseCase,
  type ToolInfo,
  type PlanInfo,
  TOOLS_MAP,
} from "./pricing-data";

// ============================================================
// Types
// ============================================================

export interface ToolEntry {
  toolId: ToolId;
  planId: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export type RecommendationType =
  | "downgrade"          // Same vendor, cheaper plan
  | "right-size"         // Reduce seats
  | "switch-alternative" // Different tool
  | "use-credits"        // Credex credit discount
  | "optimal";           // Already well-optimized

export interface Recommendation {
  type: RecommendationType;
  title: string;
  reason: string;
  suggestedPlan?: string;
  suggestedTool?: string;
  monthlySavings: number;
}

export interface ToolAuditResult {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  currentSeats: number;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  savingsTier: "high" | "medium" | "low" | "optimal";
}

export interface AuditResult {
  toolResults: ToolAuditResult[];
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsTier: "high" | "medium" | "low" | "optimal";
  credexOpportunity: boolean; // Show Credex CTA prominently?
  timestamp: string;
}

// ============================================================
// Helper functions
// ============================================================

function findTool(toolId: ToolId): ToolInfo {
  return TOOLS_MAP[toolId];
}

function findPlan(tool: ToolInfo, planId: string): PlanInfo | undefined {
  return tool.plans.find((p) => p.id === planId);
}

/**
 * Get the "fair price" for a plan — what you should be paying at full retail.
 * Returns -1 for custom/enterprise plans where we can't calculate.
 */
function getExpectedCost(plan: PlanInfo, seats: number): number {
  if (plan.pricePerSeat < 0) return -1; // Custom pricing
  if (plan.isApi) return -1; // Usage-based, can't predict
  return plan.pricePerSeat * seats;
}

/**
 * Determine savings tier based on monthly savings amount
 */
export function getSavingsTier(
  monthlySavings: number
): "high" | "medium" | "low" | "optimal" {
  if (monthlySavings >= 500) return "high";
  if (monthlySavings >= 100) return "medium";
  if (monthlySavings > 0) return "low";
  return "optimal";
}

// ============================================================
// Audit rules
// ============================================================

/**
 * Rule 1: Plan-fit check — Is the team paying for a team/business plan
 * when individual plans would suffice?
 */
function checkPlanFit(
  tool: ToolInfo,
  plan: PlanInfo,
  seats: number,
  teamSize: number
): Recommendation | null {
  // If on a team/business plan with ≤2 users, individual might be cheaper
  const isTeamPlan =
    plan.name.toLowerCase().includes("team") ||
    plan.name.toLowerCase().includes("business");
  
  if (isTeamPlan && seats <= 2 && teamSize <= 3) {
    // Find the best individual plan
    const individualPlans = tool.plans.filter(
      (p) =>
        !p.name.toLowerCase().includes("team") &&
        !p.name.toLowerCase().includes("business") &&
        !p.name.toLowerCase().includes("enterprise") &&
        p.pricePerSeat > 0 &&
        p.pricePerSeat < plan.pricePerSeat
    );

    if (individualPlans.length > 0) {
      const bestIndividual = individualPlans[individualPlans.length - 1]; // Highest tier that's still cheaper
      const currentCost = plan.pricePerSeat * seats;
      const newCost = bestIndividual.pricePerSeat * seats;
      const savings = currentCost - newCost;

      if (savings > 0) {
        return {
          type: "downgrade",
          title: `Switch from ${plan.name} to ${bestIndividual.name}`,
          reason: `With only ${seats} seat${seats > 1 ? "s" : ""} on a team of ${teamSize}, the ${plan.name} plan's team features (SSO, admin controls) likely aren't needed. ${bestIndividual.name} at $${bestIndividual.pricePerSeat}/seat gives you the same AI capabilities.`,
          suggestedPlan: bestIndividual.id,
          monthlySavings: savings,
        };
      }
    }
  }
  return null;
}

/**
 * Rule 2: Same-vendor cheaper plan — Is there a cheaper plan
 * from the same vendor that covers the use case?
 */
function checkCheaperPlan(
  tool: ToolInfo,
  plan: PlanInfo,
  seats: number,
  useCase: UseCase
): Recommendation | null {
  if (plan.isApi || plan.pricePerSeat <= 0) return null;

  // Find cheaper plans that aren't free and aren't API-based
  const cheaperPlans = tool.plans.filter(
    (p) =>
      p.pricePerSeat > 0 &&
      p.pricePerSeat < plan.pricePerSeat &&
      !p.isApi &&
      p.id !== plan.id
  );

  for (const cheaper of cheaperPlans) {
    const currentCost = plan.pricePerSeat * seats;
    const cheaperCost = cheaper.pricePerSeat * seats;
    const savings = currentCost - cheaperCost;

    // Only recommend if savings are meaningful (> $5/mo)
    if (savings >= 5) {
      // Check if the cheaper plan is the "Pro" equivalent — still good for professionals
      const isPro =
        cheaper.name.toLowerCase().includes("pro") ||
        cheaper.name.toLowerCase().includes("individual");

      if (isPro || cheaper.pricePerSeat >= 10) {
        return {
          type: "downgrade",
          title: `Downgrade to ${cheaper.name}`,
          reason: `${cheaper.name} at $${cheaper.pricePerSeat}/seat covers ${useCase} use cases. You'd save $${savings}/mo without losing core AI capabilities. The main trade-off: ${plan.features.slice(-1)[0] || "premium features"}.`,
          suggestedPlan: cheaper.id,
          monthlySavings: savings,
        };
      }
    }
  }
  return null;
}

/**
 * Rule 3: Over-paying vs retail — is their actual spend higher
 * than what the plan should cost?
 */
function checkOverpaying(
  plan: PlanInfo,
  seats: number,
  monthlySpend: number
): Recommendation | null {
  if (plan.pricePerSeat <= 0 || plan.isApi) return null;

  const expectedCost = getExpectedCost(plan, seats);
  if (expectedCost <= 0) return null;

  const overpay = monthlySpend - expectedCost;

  // If they're paying more than retail (e.g., forgot to cancel extra seats)
  if (overpay >= 10) {
    return {
      type: "right-size",
      title: "You're paying above retail price",
      reason: `You're paying $${monthlySpend}/mo but ${seats} seat${seats > 1 ? "s" : ""} on ${plan.name} should cost $${expectedCost}/mo. Check for unused seats, add-ons, or billing discrepancies.`,
      monthlySavings: overpay,
    };
  }
  return null;
}

/**
 * Rule 4: Cross-tool alternatives — Is there a cheaper tool
 * that serves the same use case?
 */
function checkAlternatives(
  tool: ToolInfo,
  plan: PlanInfo,
  seats: number,
  useCase: UseCase,
  monthlySpend: number
): Recommendation | null {
  if (plan.isApi || monthlySpend === 0) return null;

  // Alternative mappings for each category
  const alternatives: Partial<Record<ToolId, ToolId[]>> = {
    cursor: ["github-copilot", "windsurf"],
    "github-copilot": ["cursor", "windsurf"],
    windsurf: ["cursor", "github-copilot"],
    claude: ["chatgpt", "gemini"],
    chatgpt: ["claude", "gemini"],
    gemini: ["chatgpt", "claude"],
  };

  const altToolIds = alternatives[tool.id] || [];

  for (const altId of altToolIds) {
    const altTool = findTool(altId);
    if (!altTool) continue;

    // Only suggest if the alternative supports the use case
    if (!altTool.primaryUseCases.includes(useCase) && useCase !== "mixed")
      continue;

    // Find a comparable plan that's cheaper
    const altPlans = altTool.plans.filter(
      (p) => p.pricePerSeat > 0 && !p.isApi && p.pricePerSeat < plan.pricePerSeat
    );

    if (altPlans.length > 0) {
      const bestAlt = altPlans[altPlans.length - 1]; // Best quality that's still cheaper
      const currentCost = monthlySpend;
      const altCost = bestAlt.pricePerSeat * seats;
      const savings = currentCost - altCost;

      if (savings >= 10) {
        return {
          type: "switch-alternative",
          title: `Consider ${altTool.name} ${bestAlt.name}`,
          reason: `${altTool.name} ${bestAlt.name} at $${bestAlt.pricePerSeat}/seat is a strong alternative for ${useCase}. Saves $${savings}/mo. Trade-off: different ecosystem, but similar AI capabilities for ${useCase}.`,
          suggestedTool: altTool.id,
          suggestedPlan: bestAlt.id,
          monthlySavings: savings,
        };
      }
    }
  }
  return null;
}

/**
 * Rule 5: Credex credit opportunity — Flag tools where Credex
 * could provide discounted credits
 */
function checkCredexOpportunity(
  tool: ToolInfo,
  plan: PlanInfo,
  monthlySpend: number
): Recommendation | null {
  // Credex can offer discounts on most paid plans
  if (monthlySpend < 50 || plan.pricePerSeat <= 0) return null;

  const estimatedDiscount = Math.round(monthlySpend * 0.15); // ~15% through credits

  if (estimatedDiscount >= 10) {
    return {
      type: "use-credits",
      title: "Save with Credex credits",
      reason: `Credex sources discounted ${tool.name} credits from companies that overforecast. You could save ~$${estimatedDiscount}/mo (est. 15% discount) on the same ${plan.name} plan — no downgrade needed.`,
      monthlySavings: estimatedDiscount,
    };
  }
  return null;
}

/**
 * Rule 6: Seat right-sizing — Are there more seats than team members?
 */
function checkSeatRightSizing(
  tool: ToolInfo,
  plan: PlanInfo,
  seats: number,
  teamSize: number
): Recommendation | null {
  if (plan.isApi || plan.pricePerSeat <= 0) return null;

  // If seats exceed team size by more than 1
  if (seats > teamSize + 1 && teamSize > 0) {
    const excessSeats = seats - teamSize;
    const savings = plan.pricePerSeat * excessSeats;

    if (savings > 0) {
      return {
        type: "right-size",
        title: `Remove ${excessSeats} unused seat${excessSeats > 1 ? "s" : ""}`,
        reason: `You have ${seats} seats but a team of ${teamSize}. ${excessSeats} seat${excessSeats > 1 ? "s are" : " is"} likely unused. Removing them saves $${savings}/mo.`,
        monthlySavings: savings,
      };
    }
  }
  return null;
}

// ============================================================
// Main audit function
// ============================================================

export function runAudit(input: AuditInput): AuditResult {
  const toolResults: ToolAuditResult[] = [];
  let totalCurrentSpend = 0;
  let totalMonthlySavings = 0;

  for (const entry of input.tools) {
    const tool = findTool(entry.toolId);
    if (!tool) continue;

    const plan = findPlan(tool, entry.planId);
    if (!plan) continue;

    const recommendations: Recommendation[] = [];

    // Run all audit rules
    const planFit = checkPlanFit(tool, plan, entry.seats, input.teamSize);
    if (planFit) recommendations.push(planFit);

    const cheaperPlan = checkCheaperPlan(
      tool,
      plan,
      entry.seats,
      input.useCase
    );
    if (cheaperPlan) recommendations.push(cheaperPlan);

    const overpaying = checkOverpaying(plan, entry.seats, entry.monthlySpend);
    if (overpaying) recommendations.push(overpaying);

    const seatRightSize = checkSeatRightSizing(
      tool,
      plan,
      entry.seats,
      input.teamSize
    );
    if (seatRightSize) recommendations.push(seatRightSize);

    const alternative = checkAlternatives(
      tool,
      plan,
      entry.seats,
      input.useCase,
      entry.monthlySpend
    );
    if (alternative) recommendations.push(alternative);

    const credex = checkCredexOpportunity(tool, plan, entry.monthlySpend);
    if (credex) recommendations.push(credex);

    // Calculate total savings for this tool (take the best non-overlapping savings)
    // Use the largest single savings recommendation (they may overlap)
    const toolSavings = recommendations.length > 0
      ? Math.max(...recommendations.map((r) => r.monthlySavings))
      : 0;

    totalCurrentSpend += entry.monthlySpend;
    totalMonthlySavings += toolSavings;

    toolResults.push({
      toolId: entry.toolId,
      toolName: tool.name,
      currentPlan: plan.name,
      currentMonthlySpend: entry.monthlySpend,
      currentSeats: entry.seats,
      recommendations,
      totalMonthlySavings: toolSavings,
      savingsTier: getSavingsTier(toolSavings),
    });
  }

  const overallTier = getSavingsTier(totalMonthlySavings);

  return {
    toolResults,
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsTier: overallTier,
    credexOpportunity: totalMonthlySavings >= 500,
    timestamp: new Date().toISOString(),
  };
}
