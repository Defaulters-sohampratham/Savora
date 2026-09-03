import { formatCurrency } from "./engine";
import type { CalculationResult } from "./types";

export function explainRecommendation(result: CalculationResult) {
  if (result.shortfall.exists) {
    return `Income is short by ${formatCurrency(result.shortfall.amount)} after essentials and EMI. For now, Savora suggests saving ${formatCurrency(result.recommended_saving)} and focusing on covering must-pay expenses first.`;
  }

  if (result.state === "Buffer Complete") {
    const goalSentence = result.goal.exists
      ? ` ${formatCurrency(result.goal.contribution_this_cycle)} of flexible cash is going toward ${result.goal.name} this cycle, taking you to ${result.goal.progress_pct}% of your target.`
      : "";
    return `Your buffer target of ${formatCurrency(result.buffer_target)} is already covered. This cycle, Savora keeps recommended saving at ${formatCurrency(result.recommended_saving)} so extra cash can go toward debt or future goals.${goalSentence}`;
  }

  return `Because your latest income is ${formatCurrency(result.latest_income)} and essentials are ${formatCurrency(result.essential_total)}, you have ${formatCurrency(result.surplus)} left after must-pay costs. Savora recommends saving ${formatCurrency(result.recommended_saving)} this cycle and keeping ${formatCurrency(result.remaining_cash)} flexible. This helps you make steady progress.`;
}

export function explainScenario(current: CalculationResult) {
  if (!current.scenario) {
    return "Scenario is not available for this profile.";
  }

  const savingChange = current.scenario.recommended_saving - current.recommended_saving;

  if (savingChange === 0) {
    return `With a 20% income drop, recommended saving would stay at ${formatCurrency(current.recommended_saving)}, while the state moves from ${current.state} to ${current.scenario.state}.`;
  }

  const direction = savingChange < 0 ? "reduce" : "increase";

  return `With a 20% income drop, the plan would ${direction} recommended saving by ${formatCurrency(Math.abs(savingChange))}, moving from ${current.state} to ${current.scenario.state}.`;
}

export function generatePureLLMFallback(result: CalculationResult) {
  return {
    recommendation_explanation: explainRecommendation(result),
    why_panel_explanation: result.factors.join(" "),
    scenario_explanation: explainScenario(result),
    is_live_llm: false,
    provider: "Deterministic Financial Engine (Offline Fallback)",
  };
}
