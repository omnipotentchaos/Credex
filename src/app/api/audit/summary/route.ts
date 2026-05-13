// ============================================================
// POST /api/audit/summary
// Generates an AI-powered audit summary via Cerebras (+ template fallback)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { generateAuditSummary } from "@/lib/cerebras";
import type { AuditResult } from "@/lib/audit-engine";
import { getSummaryRateLimiter, rateLimitOr429 } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = await rateLimitOr429(
    request,
    getSummaryRateLimiter(),
    "audit-summary"
  );
  if (limited) return limited;

  try {
    const body = await request.json();
    const result = body.result as AuditResult;

    if (!result || !result.toolResults) {
      return NextResponse.json(
        { error: "Invalid audit result data" },
        { status: 400 }
      );
    }

    const { summary, source } = await generateAuditSummary(result);

    return NextResponse.json({ summary, source });
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
