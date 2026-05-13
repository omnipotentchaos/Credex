// ============================================================
// GET /api/audit/[shareId]
// Fetches a public audit by share_id from Supabase
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getAuditGetRateLimiter, rateLimitOr429 } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const limited = await rateLimitOr429(
    request,
    getAuditGetRateLimiter(),
    "audit-get"
  );
  if (limited) return limited;

  const { shareId } = await params;

  if (!shareId) {
    return NextResponse.json({ error: "Missing share ID" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("audit_results")
    .select("*")
    .eq("share_id", shareId)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  return NextResponse.json({
    shareId: data.share_id,
    result: data.result_data,
    aiSummary: data.ai_summary,
    createdAt: data.created_at,
    totalMonthlySpend: data.total_monthly_spend,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    savingsTier: data.savings_tier,
  });
}
