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
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
        Covers essentials (+{formatCurrency(diff)})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
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
      color: "border-amber-200 bg-amber-50/50 text-amber-950",
    },
    {
      label: "Expected Forecast",
      sublabel: "Most likely baseline outcome",
      value: result.forecast.expected,
      color: "border-sky-200 bg-sky-50/50 text-sky-950",
    },
    {
      label: "Optimistic Forecast",
      sublabel: "Peak cycle upside estimate",
      value: result.forecast.optimistic,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
              Insights & Forecasting
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Income Volatility & Projections
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Analyzing income swings, seasonal consistency, and forward-looking ranges for {selectedProfile.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">
            <span>Confidence:</span>
            <strong className="text-teal-700">{result.confidence}</strong>
          </div>
        </div>
      </section>

      {/* Volatility & Spread Metrics */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950">Earnings Volatility Breakdown</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Volatility Index
              </span>
              <BarChart3 className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(result.income_volatility)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Standard variation across cycles
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Peak Cycle Earnings
              </span>
              <ArrowUp className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(maxIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Highest monthly earnings recorded
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Lean Cycle Earnings
              </span>
              <ArrowDown className="h-5 w-5 text-rose-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(minIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Lowest monthly earnings recorded
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Earnings Spread
              </span>
              <TrendingUp className="h-5 w-5 text-teal-700" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(spread)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Difference between highest & lowest
            </p>
          </div>
        </div>
      </section>

      {/* Visual Monthly Performance Comparison */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Monthly Trend vs Average Benchmark</h2>
            <p className="text-xs text-slate-500">
              Compare each cycle&apos;s earnings against the 6-month baseline average of {formatCurrency(result.average_income)}.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-teal-600" />
              <span>Earnings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-slate-400" />
              <span>Average Benchmark</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {selectedProfile.monthlyIncome.map((record) => {
            const barWidth = Math.min(100, Math.round((record.amount / maxIncome) * 100));
            const isAboveAvg = record.amount >= result.average_income;

            return (
              <div key={record.date} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {formatMonth(record.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-950">
                      {formatCurrency(record.amount)}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isAboveAvg ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      ({isAboveAvg ? "+" : ""}
                      {formatCurrency(record.amount - result.average_income)})
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAboveAvg ? "bg-teal-600" : "bg-amber-500"
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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <CircleDollarSign className="h-4 w-4" />
              Next-Cycle Range
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-950">
              Forward-Looking Income Forecasts
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Projected earnings bandwidth derived from historical variance and recent cycle momentum.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {forecasts.map((f) => (
            <div
              key={f.label}
              className={`rounded-xl border p-5 transition hover:shadow-sm ${f.color}`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {f.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{f.sublabel}</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">
                {formatCurrency(f.value)}
              </p>
              <div className="mt-4">
                {coverageBadge(f.value, result.essential_total)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-650">
          📌 <strong>Forecast Methodology:</strong> Conservative estimates prepare workers for lean cycles, while expected forecasts anchor month-to-month budgeting. If conservative earnings fall below essential outgoings, Savora flags immediate cash preservation.
        </div>
      </section>

      {/* Strategic Resilience Tips */}
      <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="h-5 w-5 text-teal-700" />
          <h2 className="text-base font-bold text-teal-950">
            Resilience Takeaways for {selectedProfile.name}
          </h2>
        </div>
        <ul className="space-y-2 text-sm text-teal-900 leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
            <span>
              <strong>Buffer First:</strong> Prioritize building a 3-month buffer of {formatCurrency(result.buffer_target)} before investing surplus in speculative or illiquid assets.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
            <span>
              <strong>Surge Cycle Discipline:</strong> During high-income cycles (above {formatCurrency(Math.round(result.average_income * 1.15))}), save up to 50% of the surplus to smooth future dips.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
            <span>
              <strong>EMI Safety Cushion:</strong> Current monthly EMI of {formatCurrency(selectedProfile.monthlyEmi)} represents {Math.round((selectedProfile.monthlyEmi / result.essential_total) * 100)}% of total committed outgoings.
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
