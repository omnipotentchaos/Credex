import { describe, it, expect } from "vitest";
import { getCredexCtaVariant } from "../credex-cta-variant";

describe("getCredexCtaVariant", () => {
  it("returns prominent for high monthly savings", () => {
    expect(getCredexCtaVariant(600, "low")).toBe("prominent");
  });

  it("returns prominent for high tier even at lower dollars", () => {
    expect(getCredexCtaVariant(200, "high")).toBe("prominent");
  });

  it("returns soft for optimal tier", () => {
    expect(getCredexCtaVariant(0, "optimal")).toBe("soft");
  });

  it("returns soft for low monthly savings", () => {
    expect(getCredexCtaVariant(50, "medium")).toBe("soft");
  });

  it("returns standard for moderate savings", () => {
    expect(getCredexCtaVariant(250, "medium")).toBe("standard");
  });
});
