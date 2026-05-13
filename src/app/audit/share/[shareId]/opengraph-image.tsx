import { ImageResponse } from "next/og";
import { fetchPublicAuditByShareId } from "@/lib/public-audit";

export const runtime = "nodejs";
export const alt = "CredexAudit AI spend audit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const audit = await fetchPublicAuditByShareId(shareId);
  const annual = audit
    ? Number(audit.total_annual_savings).toLocaleString()
    : "—";
  const monthlySave = audit
    ? Number(audit.total_monthly_savings).toLocaleString()
    : "—";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#112F34",
          color: "#fff",
          padding: 56,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800, color: "#0FF395" }}>
          CredexAudit by Credex
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>
            Up to ${annual}/year in AI tool savings
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.78)" }}>
            ~${monthlySave}/mo identified · Free audit, no signup
          </div>
        </div>
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.55)" }}>
          credex.rocks — verified AI & cloud credits below retail
        </div>
      </div>
    ),
    { ...size }
  );
}
