export type CredexCtaVariant = "prominent" | "standard" | "soft";

/**
 * Battle-plan style tiers: high savings → strong Credex CTA;
 * low / optimal → honest "spending well" + lighter follow-up.
 */
export function getCredexCtaVariant(
  monthlySavings: number,
  savingsTier: string
): CredexCtaVariant {
  if (monthlySavings >= 500 || savingsTier === "high") return "prominent";
  if (monthlySavings < 100 || savingsTier === "optimal") return "soft";
  return "standard";
}
