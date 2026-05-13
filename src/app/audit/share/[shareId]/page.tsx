// ============================================================
// /audit/share/[shareId] — Public Shareable Audit Page
// Server-rendered with dynamic OG tags for social sharing
// ============================================================

import { Metadata } from "next";
import { notFound } from "next/navigation";
import SharedAuditClient from "./SharedAuditClient";
import { fetchPublicAuditByShareId } from "@/lib/public-audit";

interface PageProps {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  const audit = await fetchPublicAuditByShareId(shareId);

  if (!audit) {
    return { title: "Audit Not Found — CredexAudit" };
  }

  const savings = Number(audit.total_annual_savings).toLocaleString();
  const spend = Number(audit.total_monthly_spend).toLocaleString();
  const toolCount = audit.result_data.toolResults.length;

  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "https://credex.vercel.app";

  return {
    title: `Save $${savings}/year on AI Tools — CredexAudit Audit`,
    description: `This team spends $${spend}/mo across ${toolCount} AI tools. CredexAudit found $${savings}/year in savings. Run your own free audit.`,
    openGraph: {
      title: `Save $${savings}/year on AI Tools`,
      description: `CredexAudit audit found $${savings}/year in savings across ${toolCount} AI tools. Run your own free audit.`,
      type: "website",
      siteName: "CredexAudit by Credex",
      url: `${base}/audit/share/${shareId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Save $${savings}/year on AI Tools — CredexAudit`,
      description: `CredexAudit found $${savings}/year in AI tool savings. Free audit, no signup.`,
    },
  };
}

export default async function SharedAuditPage({ params }: PageProps) {
  const { shareId } = await params;
  const audit = await fetchPublicAuditByShareId(shareId);

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
