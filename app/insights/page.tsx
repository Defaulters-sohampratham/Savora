"use client";

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Lightbulb,
  LineChart,
  TrendingUp,
} from "lucide-react";
import { formatMonth, useWorker } from "@/lib/context/worker-context";
import { formatCurrency } from "@/lib/finance/engine";

function coverageBadge(value: number, essentialTotal: number) {
  const diff = value - essentialTotal;
  if (diff >= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
        Covers essentials (+{formatCurrency(diff)})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 px-2.5 py-0.5 text-xs font-semibold">
      Shortfall (-{formatCurrency(Math.abs(diff))})
    </span>
  );
}

export default function InsightsPage() {
  const { selectedProfile, result } = useWorker();

  const amounts = selectedProfile.monthlyIncome.map((i) => i.amount);
  const maxIncome = Math.max(...amounts);
  const minIncome = Math.min(...amounts);
  const spread = maxIncome - minIncome;

  const forecasts = [
    {
      label: "Conservative Forecast",
      sublabel: "Lower-bound safety estimate",
      value: result.forecast.conservative,
      color: "border border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100",
    },
    {
      label: "Expected Forecast",
      sublabel: "Most likely baseline outcome",
      value: result.forecast.expected,
      color: "border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100",
    },
    {
      label: "Optimistic Forecast",
      sublabel: "Peak cycle upside estimate",
      value: result.forecast.optimistic,
      color: "border border-teal-200 bg-teal-50/40 dark:border-teal-900/40 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1 text-xs font-semibold">
              <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
              Insights & Forecasting
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Income Volatility & Projections
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Analyzing income swings, seasonal consistency, and forward-looking ranges for {selectedProfile.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span>Confidence:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{result.confidence}</strong>
          </div>
        </div>
      </section>

      {/* Volatility & Spread Metrics */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Earnings Volatility Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Volatility Index
              </span>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(result.income_volatility)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Standard variation across cycles
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Peak Cycle Earnings
              </span>
              <ArrowUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(maxIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Highest monthly earnings recorded
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Lean Cycle Earnings
              </span>
              <ArrowDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(minIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Lowest monthly earnings recorded
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Earnings Spread
              </span>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(spread)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Difference between peak & lowest
            </p>
          </div>
        </div>
      </section>

      {/* Visual Monthly Performance Comparison */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Monthly Trend vs Average Benchmark</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare each cycle&apos;s earnings against the 6-month baseline average of {formatCurrency(result.average_income)}.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span>Earnings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-3 rounded-full bg-slate-400" />
              <span>Average</span>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 pt-2">
          {selectedProfile.monthlyIncome.map((record) => {
            const barWidth = Math.min(100, Math.round((record.amount / maxIncome) * 100));
            const isAboveAvg = record.amount >= result.average_income;

            return (
              <div key={record.date} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatMonth(record.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(record.amount)}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isAboveAvg ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      ({isAboveAvg ? "+" : ""}
                      {formatCurrency(record.amount - result.average_income)})
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAboveAvg ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Next-Cycle Income Forecasts */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <CircleDollarSign className="h-3.5 w-3.5" />
            Next-Cycle Range
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Forward-Looking Income Forecasts
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Projected earnings bandwidth derived from historical variance and recent cycle momentum.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {forecasts.map((f) => (
            <div
              key={f.label}
              className={`rounded-xl p-5 shadow-xs transition hover:shadow-sm ${f.color}`}
            >
              <p className="text-xs font-bold uppercase tracking-wider opacity-85">
                {f.label}
              </p>
              <p className="text-xs opacity-65 mt-0.5">{f.sublabel}</p>
              <p className="mt-3 text-2xl font-bold">
                {formatCurrency(f.value)}
              </p>
              <div className="mt-3">
                {coverageBadge(f.value, result.essential_total)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          📌 <strong>Forecast Methodology:</strong> Conservative estimates prepare workers for lean cycles, while expected forecasts anchor month-to-month budgeting. If conservative earnings fall below essential outgoings, Savora flags immediate cash preservation.
        </div>
      </section>

      {/* Strategic Resilience Tips */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Resilience Takeaways for {selectedProfile.name}
          </h2>
        </div>
        <ul className="space-y-2 text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Buffer First:</strong> Prioritize building a 3-month buffer of {formatCurrency(result.buffer_target)} before investing surplus in speculative or illiquid assets.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Surge Cycle Discipline:</strong> During high-income cycles (above {formatCurrency(Math.round(result.average_income * 1.15))}), save up to 50% of the surplus to smooth future dips.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>EMI Safety Cushion:</strong> Current monthly EMI of {formatCurrency(selectedProfile.monthlyEmi)} represents {Math.round((selectedProfile.monthlyEmi / result.essential_total) * 100)}% of total committed outgoings.
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
