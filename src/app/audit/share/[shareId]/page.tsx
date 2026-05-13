// ============================================================
// /audit/share/[shareId] — Public Shareable Audit Page
// Server-rendered with dynamic OG tags for social sharing
// ============================================================

import { Metadata } from "next";
import { notFound } from "next/navigation";
import SharedAuditClient from "./SharedAuditClient";
import { getSupabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ shareId: string }>;
}

async function getAudit(shareId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("audit_results")
    .select("*")
    .eq("share_id", shareId)
    .eq("is_public", true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  const audit = await getAudit(shareId);

  if (!audit) {
    return { title: "Audit Not Found — BurnLens" };
  }

  const savings = Number(audit.total_annual_savings).toLocaleString();
  const spend = Number(audit.total_monthly_spend).toLocaleString();
  const toolCount = audit.result_data?.toolResults?.length || 0;

  return {
    title: `Save $${savings}/year on AI Tools — BurnLens Audit`,
    description: `This team spends $${spend}/mo across ${toolCount} AI tools. BurnLens found $${savings}/year in savings. Run your own free audit.`,
    openGraph: {
      title: `Save $${savings}/year on AI Tools`,
      description: `BurnLens audit found $${savings}/year in savings across ${toolCount} AI tools. Run your own free audit.`,
      type: "website",
      siteName: "BurnLens by Credex",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://credex.vercel.app"}/audit/share/${shareId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Save $${savings}/year on AI Tools — BurnLens`,
      description: `BurnLens found $${savings}/year in AI tool savings. Free audit, no signup.`,
    },
  };
}

export default async function SharedAuditPage({ params }: PageProps) {
  const { shareId } = await params;
  const audit = await getAudit(shareId);

  if (!audit) {
    notFound();
  }

  return (
    <SharedAuditClient
      shareId={shareId}
      result={audit.result_data}
      aiSummary={audit.ai_summary}
      createdAt={audit.created_at}
    />
  );
}
