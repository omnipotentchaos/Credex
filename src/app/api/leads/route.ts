// ============================================================
// POST /api/leads
// Stores lead data (email, company, role) after audit
// Falls back to in-memory if Supabase not configured
// ============================================================

import { NextRequest, NextResponse } from "next/server";

interface LeadData {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  auditSavings?: number;
  savingsTier?: string;
  honeypot?: string; // Spam trap field
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadData;

    // Honeypot check — if filled, it's a bot
    if (body.honeypot) {
      // Silently accept but don't store
      return NextResponse.json({ success: true });
    }

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Try Supabase first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl !== "your_supabase_url") {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase.from("leads").insert({
          email: body.email,
          company: body.company || null,
          role: body.role || null,
          team_size: body.teamSize || null,
          audit_savings: body.auditSavings || null,
          savings_tier: body.savingsTier || null,
        });

        if (error) {
          console.error("Supabase insert error:", error);
          // Fall through to log-based fallback
        } else {
          return NextResponse.json({ success: true, store: "supabase" });
        }
      } catch (err) {
        console.error("Supabase connection error:", err);
      }
    }

    // Fallback: log the lead (works without any external service)
    console.log("📧 Lead captured:", {
      email: body.email,
      company: body.company,
      role: body.role,
      teamSize: body.teamSize,
      auditSavings: body.auditSavings,
      savingsTier: body.savingsTier,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, store: "log" });
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
