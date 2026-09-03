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
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
        Covers essentials (+{formatCurrency(diff)})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold">
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
      border: "border-amber-500/30 dark:border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20",
    },
    {
      label: "Expected Forecast",
      sublabel: "Most likely baseline outcome",
      value: result.forecast.expected,
      border: "border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20",
    },
    {
      label: "Optimistic Forecast",
      sublabel: "Peak cycle upside estimate",
      value: result.forecast.optimistic,
      border: "border-teal-500/30 dark:border-teal-500/40 bg-teal-500/5 dark:bg-teal-950/20",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <section className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
              <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Insights & Forecasting</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Income Volatility & Projections
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Analyzing income swings, seasonal consistency, and forward-looking ranges for {selectedProfile.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 dark:border-white/[0.08] dark:bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span>Confidence:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{result.confidence}</strong>
          </div>
        </div>
      </section>

      {/* Volatility & Spread Metrics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Earnings Volatility Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Statistical deviation across 6-month historical cashflow records.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Volatility Index
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(result.income_volatility)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Standard variation across cycles
            </p>
          </div>

          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Peak Cycle Earnings
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(maxIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Highest monthly earnings recorded
            </p>
          </div>

          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Lean Cycle Earnings
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(minIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Lowest monthly earnings recorded
            </p>
          </div>

          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Earnings Spread
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(spread)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Difference between peak & lowest
            </p>
          </div>
        </div>
      </section>

      {/* Visual Monthly Performance Comparison */}
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Monthly Trend vs Average Benchmark</h2>
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

        <div className="space-y-4 pt-2">
          {selectedProfile.monthlyIncome.map((record) => {
            const barWidth = Math.min(100, Math.round((record.amount / maxIncome) * 100));
            const isAboveAvg = record.amount >= result.average_income;

            return (
              <div key={record.date} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatMonth(record.date)}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-950 dark:text-white">
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
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAboveAvg ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-500 to-amber-600"
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
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <CircleDollarSign className="h-3.5 w-3.5" />
            <span>Next-Cycle Range</span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
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
              className={`rounded-2xl p-6 border shadow-xs transition hover:shadow-sm ${f.border}`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {f.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.sublabel}</p>
              <p className="mt-4 text-3xl font-extrabold font-mono tracking-tight text-slate-950 dark:text-white">
                {formatCurrency(f.value)}
              </p>
              <div className="mt-4">
                {coverageBadge(f.value, result.essential_total)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-white/[0.06] dark:bg-slate-950/40 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          📌 <strong>Forecast Methodology:</strong> Conservative estimates prepare workers for lean cycles, while expected forecasts anchor month-to-month budgeting. If conservative earnings fall below essential outgoings, Savora flags immediate cash preservation.
        </div>
      </section>

      {/* Strategic Resilience Tips */}
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Resilience Takeaways for {selectedProfile.name}
          </h2>
        </div>
        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Buffer First:</strong> Prioritize building a 3-month buffer of {formatCurrency(result.buffer_target)} before investing surplus in speculative or illiquid assets.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Surge Cycle Discipline:</strong> During high-income cycles (above {formatCurrency(Math.round(result.average_income * 1.15))}), save up to 50% of the surplus to smooth future dips.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
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
