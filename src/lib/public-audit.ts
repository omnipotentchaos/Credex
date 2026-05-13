import { getSupabase } from "@/lib/supabase";
import type { AuditResult } from "@/lib/audit-engine";

export interface PublicAuditRow {
  id: string;
  share_id: string;
  input_data: unknown;
  result_data: AuditResult;
  ai_summary: string | null;
  created_at: string;
  total_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  savings_tier: string | null;
  is_public: boolean;
}

export async function fetchPublicAuditByShareId(
  shareId: string
): Promise<PublicAuditRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("audit_results")
    .select("*")
    .eq("share_id", shareId)
    .eq("is_public", true)
    .single();

  if (error || !data) return null;
  return data as unknown as PublicAuditRow;
}
