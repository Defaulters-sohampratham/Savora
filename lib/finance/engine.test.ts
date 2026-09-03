import { describe, expect, it } from "vitest";
import { calculateFinancialResilience } from "./engine";
import type { CalculationInput } from "./types";

const baseInput: CalculationInput = {
  incomeHistory: [
    { amount: 20000, date: "2026-04-30" },
    { amount: 20000, date: "2026-05-31" },
    { amount: 20000, date: "2026-06-30" },
  ],
  essentialExpenses: 10000,
  currentSavings: 0,
  monthlyEmi: 2000,
};

describe("calculateFinancialResilience", () => {
  it("classifies critical months and sets saving to zero", () => {
    const result = calculateFinancialResilience({
      ...baseInput,
      incomeHistory: [
        { amount: 18000, date: "2026-04-30" },
        { amount: 17000, date: "2026-05-31" },
        { amount: 10000, date: "2026-06-30" },
      ],
    });

    expect(result.state).toBe("Critical");
    expect(result.shortfall).toEqual({ exists: true, amount: 2000 });
    expect(result.recommended_saving).toBe(0);
  });

  it("classifies low-income periods and saves ten percent of surplus", () => {
    const result = calculateFinancialResilience({
      ...baseInput,
      incomeHistory: [
        { amount: 30000, date: "2026-04-30" },
        { amount: 30000, date: "2026-05-31" },
        { amount: 15000, date: "2026-06-30" },
      ],
    });

    expect(result.state).toBe("Low");
    expect(result.surplus).toBe(3000);
    expect(result.recommended_saving).toBe(300);
  });

  it("classifies normal periods and saves thirty percent of surplus", () => {
    const result = calculateFinancialResilience(baseInput);

    expect(result.state).toBe("Normal");
    expect(result.surplus).toBe(8000);
    expect(result.recommended_saving).toBe(2400);
  });

  it("classifies high-income periods and saves half of surplus", () => {
    const result = calculateFinancialResilience({
      ...baseInput,
      incomeHistory: [
        { amount: 12000, date: "2026-04-30" },
        { amount: 15000, date: "2026-05-31" },
        { amount: 30000, date: "2026-06-30" },
      ],
    });

    expect(result.state).toBe("High");
    expect(result.surplus).toBe(18000);
    expect(result.recommended_saving).toBe(9000);
  });

  it("classifies completed buffers and redirects surplus away from saving", () => {
    const result = calculateFinancialResilience({
      ...baseInput,
      currentSavings: 36000,
    });

    expect(result.state).toBe("Buffer Complete");
    expect(result.buffer_target).toBe(36000);
    expect(result.recommended_saving).toBe(0);
  });

  it("uses low confidence messaging when fewer than three income records exist", () => {
    const result = calculateFinancialResilience({
      ...baseInput,
      incomeHistory: [
        { amount: 18000, date: "2026-05-31" },
        { amount: 20000, date: "2026-06-30" },
      ],
    });

    expect(result.confidence).toBe("Low");
    expect(result.factors).toContain(
      "Limited income history. This is an indicative estimate; add more records for better personalization.",
    );
  });

  it("returns a parallel 20 percent drop scenario without replacing current results", () => {
    const result = calculateFinancialResilience(baseInput);

    expect(result.latest_income).toBe(20000);
    expect(result.scenario?.latest_income).toBe(16000);
    expect(result.scenario?.recommended_saving).toBe(1200);
  });

  it("never returns a negative conservative forecast", () => {
    const result = calculateFinancialResilience({
      ...baseInput,
      incomeHistory: [
        { amount: 0, date: "2026-04-30" },
        { amount: 1000, date: "2026-05-31" },
        { amount: 200, date: "2026-06-30" },
      ],
    });

    expect(result.forecast.conservative).toBeGreaterThanOrEqual(0);
  });
});
