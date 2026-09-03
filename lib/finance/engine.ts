import type {
  CalculationInput,
  CalculationResult,
  FinancialState,
  GoalResult,
  IncomeRecord,
  ScenarioResult,
} from "./types";

const roundCurrency = (value: number) => {
  const rounded = Math.round(value);

  return Object.is(rounded, -0) ? 0 : rounded;
};
const roundMonths = (value: number) => Math.round(value * 10) / 10;

function sortIncomeHistory(incomeHistory: IncomeRecord[]) {
  return [...incomeHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

function mean(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function classifyState({
  latestIncome,
  averageIncome,
  currentSavings,
  bufferTarget,
  surplus,
}: {
  latestIncome: number;
  averageIncome: number;
  currentSavings: number;
  bufferTarget: number;
  surplus: number;
}): FinancialState {
  if (currentSavings >= bufferTarget) {
    return "Buffer Complete";
  }

  if (surplus <= 0) {
    return "Critical";
  }

  const ratio = averageIncome === 0 ? 0 : latestIncome / averageIncome;

  if (ratio < 0.7) {
    return "Low";
  }

  if (ratio <= 1.15) {
    return "Normal";
  }

  return "High";
}

function savingRateForState(state: FinancialState) {
  switch (state) {
    case "Low":
      return 0.1;
    case "Normal":
      return 0.3;
    case "High":
      return 0.5;
    case "Critical":
    case "Buffer Complete":
      return 0;
  }
}

function confidenceForHistory(recordCount: number): CalculationResult["confidence"] {
  if (recordCount < 3) {
    return "Low";
  }

  if (recordCount < 6) {
    return "Medium";
  }

  return "High";
}

function reasonForState(state: FinancialState, surplus: number, ratio: number) {
  switch (state) {
    case "Buffer Complete":
      return "Your emergency buffer already covers three months of essentials, so the app avoids pushing extra saving for this cycle.";
    case "Critical":
      return "Your latest income does not cover essential expenses and EMI, so preserving cash comes first.";
    case "Low":
      return `Your latest income is only ${Math.round(ratio * 100)}% of your recent average, so saving is kept light.`;
    case "Normal":
      return `Your latest income is close to your recent average and leaves a surplus of ${formatCurrency(surplus)}.`;
    case "High":
      return `Your latest income is stronger than usual and leaves a surplus of ${formatCurrency(surplus)}, so this is a good time to save more.`;
  }
}

function buildFactors({
  recordCount,
  latestIncome,
  previousIncome,
  averageIncome,
  essentialTotal,
  surplus,
  recommendedSaving,
  runwayMonths,
}: {
  recordCount: number;
  latestIncome: number;
  previousIncome: number;
  averageIncome: number;
  essentialTotal: number;
  surplus: number;
  recommendedSaving: number;
  runwayMonths: number;
}) {
  const factors = [
    `Latest income is ${formatCurrency(latestIncome)} versus a recent average of ${formatCurrency(averageIncome)}.`,
    `Essential monthly outflow including EMI is ${formatCurrency(essentialTotal)}.`,
    `After essentials, the current cycle surplus is ${formatCurrency(surplus)}.`,
    `Recommended saving is ${formatCurrency(recommendedSaving)}, leaving ${formatCurrency(surplus - recommendedSaving)} as flexible cash.`,
    `Current savings cover about ${runwayMonths.toFixed(1)} month${runwayMonths === 1 ? "" : "s"} of essentials.`,
  ];

  if (recordCount >= 2) {
    factors.push(`Previous month income was ${formatCurrency(previousIncome)}.`);
  }

  if (recordCount < 3) {
    factors.push(
      "Limited income history. This is an indicative estimate; add more records for better personalization.",
    );
  }

  return factors;
}

function calculateGoal(input: CalculationInput, state: FinancialState, remainingCash: number): GoalResult {
  const goal = input.goal;

  if (
    state !== "Buffer Complete" ||
    !goal ||
    !goal.name.trim() ||
    !Number.isFinite(goal.targetAmount) ||
    goal.targetAmount <= 0
  ) {
    return { exists: false };
  }

  const targetAmount = Math.max(0, goal.targetAmount);
  const savedSoFar = Math.min(targetAmount, Math.max(0, goal.savedSoFar));
  const contribution = Math.min(Math.max(0, remainingCash * 0.5), targetAmount - savedSoFar);
  const updatedSavings = savedSoFar + contribution;
  const remainingAmount = Math.max(0, targetAmount - updatedSavings);

  return {
    exists: true,
    name: goal.name.trim(),
    target_amount: roundCurrency(targetAmount),
    saved_so_far: roundCurrency(savedSoFar),
    contribution_this_cycle: roundCurrency(contribution),
    progress_pct: Math.min(100, Math.round((updatedSavings / targetAmount) * 1000) / 10),
    remaining_amount: roundCurrency(remainingAmount),
    eta_cycles: remainingAmount === 0 || contribution === 0 ? null : Math.ceil(remainingAmount / contribution),
    status: remainingAmount === 0 ? "Complete" : "In Progress",
  };
}

/**
 * Runs the deterministic resilience rules.  `scenarioLatestIncome` changes
 * only the current-cycle income: the historical average and volatility range
 * stay anchored to the recorded income history for a like-for-like stress test.
 */
function calculateCore(input: CalculationInput, scenarioLatestIncome?: number): ScenarioResult {
  const sortedIncome = sortIncomeHistory(input.incomeHistory);
  const amounts = sortedIncome.map((entry) => entry.amount);
  const latestIncome = scenarioLatestIncome ?? amounts.at(-1) ?? 0;
  const previousIncome = amounts.at(-2) ?? latestIncome;
  // "Older income" is the third most recent record. For incomplete history,
  // use the nearest available observation rather than introducing an average
  // that is not part of the stated three-point weighting rule.
  const olderIncome = amounts.at(-3) ?? previousIncome;
  const averageIncome = mean(amounts);
  const volatilityRange = amounts.length === 0 ? 0 : Math.max(...amounts) - Math.min(...amounts);
  const weightedExpected = 0.5 * latestIncome + 0.3 * previousIncome + 0.2 * olderIncome;
  const uncertaintyMargin = Math.min(0.5 * volatilityRange, 0.3 * weightedExpected);
  const conservative = Math.max(0, weightedExpected - uncertaintyMargin);
  const optimistic = weightedExpected + uncertaintyMargin;
  const essentialTotal = input.essentialExpenses + input.monthlyEmi;
  const surplus = latestIncome - essentialTotal;
  const bufferTarget = essentialTotal * 3;
  const runwayMonths = essentialTotal === 0 ? 0 : input.currentSavings / essentialTotal;
  const state = classifyState({
    latestIncome,
    averageIncome,
    currentSavings: input.currentSavings,
    bufferTarget,
    surplus,
  });
  const savingRate = surplus > 0 ? savingRateForState(state) : 0;
  const recommendedSaving = savingRate * surplus;
  const remainingCash = surplus - recommendedSaving;
  const goal = calculateGoal(input, state, remainingCash);
  const remainingCashAfterGoal = goal.exists
    ? remainingCash - goal.contribution_this_cycle
    : remainingCash;
  const ratio = averageIncome === 0 ? 0 : latestIncome / averageIncome;

  return {
    state,
    latest_income: roundCurrency(latestIncome),
    average_income: roundCurrency(averageIncome),
    essential_total: roundCurrency(essentialTotal),
    income_volatility: roundCurrency(volatilityRange),
    surplus: roundCurrency(surplus),
    recommended_saving: roundCurrency(recommendedSaving),
    remaining_cash: roundCurrency(remainingCash),
    remaining_cash_after_goal: roundCurrency(remainingCashAfterGoal),
    goal,
    buffer_target: roundCurrency(bufferTarget),
    runway_months: roundMonths(runwayMonths),
    forecast: {
      conservative: roundCurrency(conservative),
      expected: roundCurrency(weightedExpected),
      optimistic: roundCurrency(optimistic),
    },
    shortfall: {
      exists: surplus < 0,
      amount: surplus < 0 ? roundCurrency(Math.abs(surplus)) : 0,
    },
    confidence: confidenceForHistory(amounts.length),
    factors: buildFactors({
      recordCount: amounts.length,
      latestIncome,
      previousIncome,
      averageIncome,
      essentialTotal,
      surplus,
      recommendedSaving,
      runwayMonths,
    }),
    state_reason: reasonForState(state, surplus, ratio),
  };
}

export function calculateFinancialResilience(input: CalculationInput): CalculationResult {
  const sortedIncome = sortIncomeHistory(input.incomeHistory);
  const latestIncome = sortedIncome.at(-1)?.amount ?? 0;
  const current = calculateCore(input);

  return {
    ...current,
    scenario:
      input.includeScenario === false
        ? null
        : calculateCore(input, latestIncome * 0.8),
  };
}

export function profileToCalculationInput(profile: {
  monthlyIncome: IncomeRecord[];
  essentialExpenses: number;
  currentSavings: number;
  monthlyEmi: number;
  goal?: CalculationInput["goal"];
}): CalculationInput {
  return {
    incomeHistory: profile.monthlyIncome,
    essentialExpenses: profile.essentialExpenses,
    currentSavings: profile.currentSavings,
    monthlyEmi: profile.monthlyEmi,
    goal: profile.goal,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
