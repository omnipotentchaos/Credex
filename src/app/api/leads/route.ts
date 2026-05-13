// ============================================================
// POST /api/leads
// Stores lead data + sends audit report email via Resend
// Rate limited (Upstash) + honeypot
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { validate as uuidValidate } from "uuid";
import { getSupabase } from "@/lib/supabase";
import { getLeadsRateLimiter, rateLimitOr429 } from "@/lib/rate-limit";

interface LeadData {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  auditSavings?: number;
  savingsTier?: string;
  shareId?: string;
  auditId?: string;
  honeypot?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const limited = await rateLimitOr429(
    request,
    getLeadsRateLimiter(),
    "leads-post"
  );
  if (limited) return limited;

  try {
    const body = (await request.json()) as LeadData;

    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    let leadId: string | null = null;

    if (supabase) {
      const row: Record<string, unknown> = {
        email: body.email,
        company: body.company || null,
        role: body.role || null,
        team_size:
          typeof body.teamSize === "number" && Number.isFinite(body.teamSize)
            ? Math.min(100000, Math.max(0, Math.floor(body.teamSize)))
            : null,
        audit_savings: body.auditSavings ?? null,
        savings_tier: body.savingsTier || null,
      };

      if (body.auditId && uuidValidate(body.auditId)) {
        row.audit_id = body.auditId;
      }

      const { data: inserted, error } = await supabase
        .from("leads")
        .insert(row)
        .select("id")
        .single();

      if (error) {
        console.error("Supabase lead insert error:", error);
      } else if (inserted?.id) {
        leadId = inserted.id as string;
      }
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "your_resend_api_key") {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "https://credex.vercel.app";
        const shareLink = body.shareId
          ? `${baseUrl}/audit/share/${body.shareId}`
          : baseUrl;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "CredexAudit <onboarding@resend.dev>",
            to: [body.email],
            subject: `Your CredexAudit AI Spend Audit — $${body.auditSavings || 0}/mo in savings found`,
            html: buildEmailHtml({
              savings: body.auditSavings || 0,
              tier: body.savingsTier || "optimal",
              shareLink,
            }),
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Resend API rejected the request:", errData);
        } else if (supabase && leadId) {
          const { error: upErr } = await supabase
            .from("leads")
            .update({ email_sent: true })
            .eq("id", leadId);
          if (upErr) console.error("Supabase email_sent update error:", upErr);
        }
      } catch (emailError) {
        console.error("Resend email error:", emailError);
      }
    }

    console.log("📧 Lead captured:", {
      email: body.email,
      company: body.company,
      role: body.role,
      teamSize: body.teamSize,
      auditId: body.auditId,
      savings: body.auditSavings,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    );
  }
}

function buildEmailHtml({
  savings,
  tier,
  shareLink,
}: {
  savings: number;
  tier: string;
  shareLink: string;
}) {
  const tierMessage =
    tier === "optimal"
      ? "Your AI tool spend looks well-optimized!"
      : `We found <strong>$${savings}/mo</strong> in potential savings.`;

  return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="font-size: 1.5rem; color: #112F34;">⚡ Your CredexAudit Audit Report</h1>
      </div>
      
      <div style="background: #112F34; border-radius: 16px; padding: 2rem; text-align: center; margin-bottom: 1.5rem;">
        <p style="color: rgba(255,255,255,0.7); margin: 0 0 0.5rem; font-size: 0.85rem;">POTENTIAL ANNUAL SAVINGS</p>
        <p style="color: #0FF395; font-size: 2.5rem; font-weight: 800; margin: 0;">$${(savings * 12).toLocaleString()}</p>
        <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin: 0.5rem 0 0;">${savings}/mo across your AI tools</p>
      </div>

      <p style="color: #3a4a5c; line-height: 1.7; font-size: 0.95rem;">
        ${tierMessage} View your full audit breakdown with per-tool recommendations:
      </p>

      <div style="text-align: center; margin: 2rem 0;">
        <a href="${shareLink}" style="background: #0FF395; color: #112F34; padding: 0.75rem 2rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 0.95rem; display: inline-block;">
          View Full Report →
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #E1E8ED; margin: 2rem 0;" />

      <p style="color: #8a9ab5; font-size: 0.8rem; text-align: center;">
        CredexAudit by <a href="https://credex.rocks" style="color: #0AD87D;">Credex</a> — the marketplace for AI & cloud credits.
      </p>
    </div>
  `;
}
