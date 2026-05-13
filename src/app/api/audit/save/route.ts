// ============================================================
// POST /api/audit/save
// Saves audit result to Supabase + returns share_id
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getSupabase } from "@/lib/supabase";
import type { AuditResult } from "@/lib/audit-engine";

interface SaveRequest {
  input: Record<string, unknown>;
  result: AuditResult;
  aiSummary?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveRequest;

    if (!body.result || !body.input) {
      return NextResponse.json(
        { error: "Missing input or result data" },
        { status: 400 }
      );
    }

    const shareId = nanoid(10); // Short, URL-safe ID

    const supabase = getSupabase();
    if (!supabase) {
      // Fallback: return a share_id but don't persist
      return NextResponse.json({
        shareId,
        persisted: false,
        message: "Supabase not configured — audit not persisted",
      });
    }

    const { error } = await supabase.from("audit_results").insert({
      share_id: shareId,
      input_data: body.input,
      result_data: body.result,
      ai_summary: body.aiSummary || null,
      total_monthly_spend: body.result.totalCurrentSpend,
      total_monthly_savings: body.result.totalMonthlySavings,
      total_annual_savings: body.result.totalAnnualSavings,
      savings_tier: body.result.savingsTier,
      is_public: true,
    });

    if (error) {
      console.error("Supabase save error:", error);
      return NextResponse.json(
        { shareId, persisted: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ shareId, persisted: true });
  } catch (error) {
    console.error("Audit save error:", error);
    return NextResponse.json(
      { error: "Failed to save audit" },
      { status: 500 }
    );
  }
}
