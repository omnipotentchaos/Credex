// ============================================================
// Audit Engine — Unit Tests
// ============================================================

import { describe, it, expect } from "vitest";
import { runAudit, getSavingsTier, type AuditInput } from "@/lib/audit-engine";

// ============================================================
// Test 1: Savings tier classification
// ============================================================
describe("getSavingsTier", () => {
  it("returns 'high' for savings >= $500", () => {
    expect(getSavingsTier(500)).toBe("high");
    expect(getSavingsTier(1000)).toBe("high");
  });

  it("returns 'medium' for savings $100–$499", () => {
    expect(getSavingsTier(100)).toBe("medium");
    expect(getSavingsTier(499)).toBe("medium");
  });

  it("returns 'low' for savings $1–$99", () => {
    expect(getSavingsTier(1)).toBe("low");
    expect(getSavingsTier(99)).toBe("low");
  });

  it("returns 'optimal' for zero savings", () => {
    expect(getSavingsTier(0)).toBe("optimal");
  });
});

// ============================================================
// Test 2: Empty input produces no savings
// ============================================================
describe("runAudit — empty input", () => {
  it("returns $0 savings for no tools", () => {
    const input: AuditInput = {
      tools: [],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.totalCurrentSpend).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
    expect(result.toolResults).toHaveLength(0);
  });
});

// ============================================================
// Test 3: Plan-fit detection — team plan with ≤2 users
// ============================================================
describe("runAudit — plan-fit detection", () => {
  it("recommends downgrade when team plan used by 1 person on small team", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-business",
          monthlySpend: 40,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.toolResults).toHaveLength(1);

    const cursorResult = result.toolResults[0];
    const downgrade = cursorResult.recommendations.find(
      (r) => r.type === "downgrade"
    );
    expect(downgrade).toBeDefined();
    expect(downgrade!.monthlySavings).toBeGreaterThan(0);
  });
});

// ============================================================
// Test 4: Overpaying detection — paying more than retail
// ============================================================
describe("runAudit — overpay detection", () => {
  it("flags when actual spend exceeds retail price", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "github-copilot",
          planId: "copilot-pro",
          monthlySpend: 50, // Retail is $10/seat, overpaying by $40
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const copilotResult = result.toolResults[0];

    const rightSize = copilotResult.recommendations.find(
      (r) => r.type === "right-size"
    );
    expect(rightSize).toBeDefined();
    expect(rightSize!.monthlySavings).toBe(40); // $50 - $10 = $40
  });
});

// ============================================================
// Test 5: Seat right-sizing — more seats than team members
// ============================================================
describe("runAudit — seat right-sizing", () => {
  it("recommends removing unused seats", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-pro",
          monthlySpend: 200, // 10 seats × $20
          seats: 10,
        },
      ],
      teamSize: 3,
      useCase: "coding",
    };
    const result = runAudit(input);
    const cursorResult = result.toolResults[0];

    const rightSize = cursorResult.recommendations.find(
      (r) => r.type === "right-size" && r.title.includes("unused")
    );
    expect(rightSize).toBeDefined();
    expect(rightSize!.monthlySavings).toBe(140); // 7 excess × $20
  });
});

// ============================================================
// Test 6: Cross-tool alternatives
// ============================================================
describe("runAudit — cross-tool alternatives", () => {
  it("suggests cheaper IDE alternative for expensive plan", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-business",
          monthlySpend: 200, // 5 seats × $40
          seats: 5,
        },
      ],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const cursorResult = result.toolResults[0];

    const altRec = cursorResult.recommendations.find(
      (r) => r.type === "switch-alternative"
    );
    expect(altRec).toBeDefined();
    expect(altRec!.monthlySavings).toBeGreaterThan(0);
  });
});

// ============================================================
// Test 7: Credex credit opportunity
// ============================================================
describe("runAudit — Credex credit opportunity", () => {
  it("shows Credex credit savings for high spend", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "claude",
          planId: "claude-max-5x",
          monthlySpend: 500,
          seats: 5,
        },
      ],
      teamSize: 10,
      useCase: "research",
    };
    const result = runAudit(input);
    const claudeResult = result.toolResults[0];

    const credexRec = claudeResult.recommendations.find(
      (r) => r.type === "use-credits"
    );
    expect(credexRec).toBeDefined();
    expect(credexRec!.monthlySavings).toBeGreaterThan(0);
  });
});

// ============================================================
// Test 8: Optimal configuration produces no recommendations
// ============================================================
describe("runAudit — optimal scenario", () => {
  it("returns zero savings for free plan", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "github-copilot",
          planId: "copilot-free",
          monthlySpend: 0,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.toolResults[0].savingsTier).toBe("optimal");
  });
});

// ============================================================
// Test 9: Annual savings is 12× monthly
// ============================================================
describe("runAudit — annual calculation", () => {
  it("correctly multiplies monthly savings by 12", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-pro",
          monthlySpend: 200,
          seats: 10,
        },
      ],
      teamSize: 3,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });
});

// ============================================================
// Test 10: Multi-tool audit aggregates correctly
// ============================================================
describe("runAudit — multi-tool aggregation", () => {
  it("sums spend across multiple tools", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-pro",
          monthlySpend: 20,
          seats: 1,
        },
        {
          toolId: "claude",
          planId: "claude-pro",
          monthlySpend: 20,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.totalCurrentSpend).toBe(40);
    expect(result.toolResults).toHaveLength(2);
  });
});
