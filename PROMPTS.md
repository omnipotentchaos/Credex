# PROMPTS.md — AI Prompt Documentation

## Overview

BurnLens uses the **Cerebras API** (LLaMA 4 Scout 17B) to generate personalized audit summaries. The API follows the OpenAI chat completions format via `https://api.cerebras.ai/v1/chat/completions`.

## System Prompt

```
You are BurnLens, an AI spend audit assistant by Credex. Write a concise, personalized 80-120 word summary of this audit result. Be direct, specific with dollar amounts, and actionable. Use a professional but friendly tone. End with one sentence mentioning Credex credits as an additional saving opportunity. Do NOT use markdown formatting — write plain text only.
```

### Why this prompt works:
1. **Role anchoring** — "You are BurnLens" prevents the model from adding disclaimers or going off-topic
2. **Length constraint** — "80-120 word" keeps summaries scannable on mobile
3. **Dollar specificity** — Forces concrete numbers instead of vague "you could save money"
4. **No markdown** — Prevents formatting that would break in a plain text card
5. **Credex mention** — Ensures the Credex marketplace CTA is woven into the summary naturally

## User Prompt (template)

```
Audit Results:
- Total monthly spend: ${totalCurrentSpend}
- Total monthly savings found: ${totalMonthlySavings}
- Total annual savings: ${totalAnnualSavings}
- Optimization tier: ${savingsTier}

Per-tool breakdown:
{toolName} ({plan}, {seats} seats, ${monthlySpend}/mo):
  - {recommendation title}: saves ${amount}/mo ({type})
```

### Why structured data works better than prose:
- LLMs extract data from structured formats more reliably
- Bullet points prevent hallucination of numbers
- Per-tool breakdown lets the model highlight the most impactful finding

## Model Selection

| Considered | Chosen | Reason |
|------------|--------|--------|
| Claude Sonnet | ❌ | Better quality but higher cost/latency; not needed for short summaries |
| GPT-5 mini | ❌ | Good but requires OpenAI key |
| **LLaMA 4 Scout 17B (Cerebras)** | ✅ | Fast inference (Cerebras hardware), free tier, OpenAI-compatible API |

## Fallback Strategy

If the Cerebras API call fails (network error, rate limit, missing key), a **template-based fallback** generates a deterministic summary using the same data:

```typescript
// Template logic:
// 1. If $0 savings → "Your spend looks well-optimized..."
// 2. If savings found → highlight top recommendation with dollar amounts
// 3. If high-savings tier → add urgency about burn rate impact
// 4. Always end with Credex credit mention
```

## Prompt Iteration History

| Version | Change | Result |
|---------|--------|--------|
| v1 | "Summarize this audit" | Too generic, model added disclaimers |
| v2 | Added "80-120 words" constraint | Much better length but still used markdown |
| v3 (current) | Added "no markdown" + "end with Credex" | Clean output, consistent CTA placement |

## API Configuration

```json
{
  "model": "llama-4-scout-17b-16e-instruct",
  "max_tokens": 300,
  "temperature": 0.7
}
```

- **Temperature 0.7**: Slight creativity for varied summaries, but not so high that numbers get hallucinated
- **Max tokens 300**: Safety cap (summaries are ~100-150 tokens)
