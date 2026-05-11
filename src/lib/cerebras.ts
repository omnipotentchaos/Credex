// ============================================================
// Cerebras AI Summary Generator
// OpenAI-compatible endpoint: https://api.cerebras.ai/v1
// Model: llama-4-scout-17b-16e-instruct (fast, free tier)
// ============================================================

import type { AuditResult } from "./audit-engine";

const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "llama-4-scout-17b-16e-instruct";

interface CerebrasMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CerebrasResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Build the prompt for the AI summary
 */
function buildPrompt(result: AuditResult): CerebrasMessage[] {
  const toolSummaries = result.toolResults
    .map((tr) => {
      const recs = tr.recommendations
        .map((r) => `  - ${r.title}: saves $${r.monthlySavings}/mo (${r.type})`)
        .join("\n");
      return `${tr.toolName} (${tr.currentPlan}, ${tr.currentSeats} seats, $${tr.currentMonthlySpend}/mo):\n${recs || "  - No changes recommended"}`;
    })
    .join("\n\n");

  return [
    {
      role: "system",
      content: `You are BurnLens, an AI spend audit assistant by Credex. Write a concise, personalized 80-120 word summary of this audit result. Be direct, specific with dollar amounts, and actionable. Use a professional but friendly tone. End with one sentence mentioning Credex credits as an additional saving opportunity. Do NOT use markdown formatting — write plain text only.`,
    },
    {
      role: "user",
      content: `Audit Results:
- Total monthly spend: $${result.totalCurrentSpend}
- Total monthly savings found: $${result.totalMonthlySavings}
- Total annual savings: $${result.totalAnnualSavings}
- Optimization tier: ${result.savingsTier}

Per-tool breakdown:
${toolSummaries}`,
    },
  ];
}

/**
 * Generate AI-powered audit summary via Cerebras API.
 * Falls back to a template if the API call fails.
 */
export async function generateAuditSummary(
  result: AuditResult,
  apiKey?: string
): Promise<{ summary: string; source: "ai" | "template" }> {
  const key = apiKey || process.env.CEREBRAS_API_KEY;

  // If no API key, use template fallback
  if (!key) {
    return {
      summary: buildTemplateSummary(result),
      source: "template",
    };
  }

  try {
    const messages = buildPrompt(result);

    const response = await fetch(CEREBRAS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: CEREBRAS_MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`Cerebras API error: ${response.status} ${response.statusText}`);
      return {
        summary: buildTemplateSummary(result),
        source: "template",
      };
    }

    const data = (await response.json()) as CerebrasResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        summary: buildTemplateSummary(result),
        source: "template",
      };
    }

    return { summary: content.trim(), source: "ai" };
  } catch (error) {
    console.error("Cerebras API call failed:", error);
    return {
      summary: buildTemplateSummary(result),
      source: "template",
    };
  }
}

/**
 * Template fallback — deterministic, no API needed.
 * Always produces a reasonable summary.
 */
function buildTemplateSummary(result: AuditResult): string {
  const { totalCurrentSpend, totalMonthlySavings, totalAnnualSavings, toolResults, savingsTier } = result;
  const toolCount = toolResults.length;
  const toolsWithSavings = toolResults.filter((t) => t.totalMonthlySavings > 0);

  if (totalMonthlySavings === 0) {
    return `Your AI tool spend of $${totalCurrentSpend}/mo across ${toolCount} tool${toolCount > 1 ? "s" : ""} looks well-optimized. We didn't find significant savings opportunities with your current configuration. You're already getting good value from your plans. For future savings, consider Credex credits — verified discounts on the same tools you already use.`;
  }

  const topSaving = toolsWithSavings.sort(
    (a, b) => b.totalMonthlySavings - a.totalMonthlySavings
  )[0];

  const topRec = topSaving?.recommendations[0];

  let summary = `We found $${totalMonthlySavings}/mo in potential savings across your ${toolCount} AI tool${toolCount > 1 ? "s" : ""} — that's $${totalAnnualSavings}/year. `;

  if (topRec) {
    summary += `Your biggest opportunity is ${topSaving.toolName}: ${topRec.title.toLowerCase()}, saving $${topRec.monthlySavings}/mo. `;
  }

  if (savingsTier === "high") {
    summary += `This is a ${savingsTier}-savings scenario — acting on these recommendations could meaningfully impact your burn rate. `;
  }

  summary += `For additional savings, explore Credex credits for verified discounts on the same tools.`;

  return summary;
}

// Export the prompt builder for PROMPTS.md documentation
export { buildPrompt };
