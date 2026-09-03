export type FinancialState =
  | "Critical"
  | "Low"
  | "Normal"
  | "High"
  | "Buffer Complete";

export type IncomeRecord = {
  amount: number;
  date: string;
};

export type WorkerProfile = {
  id: string;
  name: string;
  role: string;
  city: string;
  description: string;
  monthlyIncome: IncomeRecord[];
  essentialExpenses: number;
  currentSavings: number;
  monthlyEmi: number;
  goal?: GoalInput;
};

export type GoalInput = {
  name: string;
  targetAmount: number;
  savedSoFar: number;
};

export type CalculationInput = {
  incomeHistory: IncomeRecord[];
  essentialExpenses: number;
  currentSavings: number;
  monthlyEmi: number;
  includeScenario?: boolean;
  goal?: GoalInput;
};

export type GoalResult =
  | { exists: false }
  | {
      exists: true;
      name: string;
      target_amount: number;
      saved_so_far: number;
      contribution_this_cycle: number;
      progress_pct: number;
      remaining_amount: number;
      eta_cycles: number | null;
      status: "In Progress" | "Complete";
    };

export type Forecast = {
  conservative: number;
  expected: number;
  optimistic: number;
};

export type Shortfall = {
  exists: boolean;
  amount: number;
};

export type ScenarioResult = Omit<CalculationResult, "scenario">;

export type LLMExplanationResult = {
  recommendation_explanation: string;
  why_panel_explanation: string;
  scenario_explanation: string;
  is_live_llm: boolean;
  provider?: string;
};

export type CalculationResult = {
  state: FinancialState;
  latest_income: number;
  average_income: number;
  essential_total: number;
  income_volatility: number;
  surplus: number;
  recommended_saving: number;
  remaining_cash: number;
  remaining_cash_after_goal: number;
  goal: GoalResult;
  buffer_target: number;
  runway_months: number;
  forecast: Forecast;
  shortfall: Shortfall;
  confidence: "Low" | "Medium" | "High";
  factors: string[];
  state_reason: string;
  scenario: ScenarioResult | null;
};
