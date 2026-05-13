// ============================================================
// POST /api/leads
// Stores lead data + sends audit report email via Resend
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

interface LeadData {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  auditSavings?: number;
  savingsTier?: string;
  shareId?: string;
  honeypot?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadData;

    // Honeypot check — if filled, it's a bot
    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Try Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("leads").insert({
        email: body.email,
        company: body.company || null,
        role: body.role || null,
        team_size: body.teamSize || null,
        audit_savings: body.auditSavings || null,
        savings_tier: body.savingsTier || null,
      });

      if (error) {
        console.error("Supabase lead insert error:", error);
      }
    }

    // Try Resend email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "your_resend_api_key") {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://credex.vercel.app";
        const shareLink = body.shareId ? `${baseUrl}/audit/share/${body.shareId}` : baseUrl;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "BurnLens <onboarding@resend.dev>",
            to: [body.email],
            subject: `Your BurnLens AI Spend Audit — $${body.auditSavings || 0}/mo in savings found`,
            html: buildEmailHtml({
              savings: body.auditSavings || 0,
              tier: body.savingsTier || "optimal",
              shareLink,
            }),
          }),
        });

        // Update email_sent flag
        if (supabase) {
          await supabase
            .from("leads")
            .update({ email_sent: true })
            .eq("email", body.email)
            .order("created_at", { ascending: false })
            .limit(1);
        }
      } catch (emailError) {
        console.error("Resend email error:", emailError);
      }
    }

    // Fallback log
    console.log("📧 Lead captured:", {
      email: body.email,
      company: body.company,
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailHtml({ savings, tier, shareLink }: { savings: number; tier: string; shareLink: string }) {
  const tierMessage = tier === "optimal"
    ? "Your AI tool spend looks well-optimized!"
    : `We found <strong>$${savings}/mo</strong> in potential savings.`;

  return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="font-size: 1.5rem; color: #112F34;">⚡ Your BurnLens Audit Report</h1>
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
        BurnLens by <a href="https://credex.rocks" style="color: #0AD87D;">Credex</a> — the marketplace for AI & cloud credits.
      </p>
    </div>
  `;
}
