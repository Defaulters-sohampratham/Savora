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
};

export type CalculationInput = {
  incomeHistory: IncomeRecord[];
  essentialExpenses: number;
  currentSavings: number;
  monthlyEmi: number;
  includeScenario?: boolean;
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

export type CalculationResult = {
  state: FinancialState;
  latest_income: number;
  average_income: number;
  essential_total: number;
  income_volatility: number;
  surplus: number;
  recommended_saving: number;
  remaining_cash: number;
  buffer_target: number;
  runway_months: number;
  forecast: Forecast;
  shortfall: Shortfall;
  confidence: "Low" | "Medium" | "High";
  factors: string[];
  state_reason: string;
  scenario: ScenarioResult | null;
};

export type AuthUser = {
  id: string;
  email?: string;
  displayName?: string;
  role?: string;
};
