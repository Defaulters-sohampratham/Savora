"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";
import { formatCurrency } from "@/lib/finance/engine";

function coverageLabel(value: number, essentialTotal: number) {
  if (value >= essentialTotal) {
    return `Covers essentials (+${formatCurrency(value - essentialTotal)})`;
  }
  return `Shortfall (-${formatCurrency(essentialTotal - value)})`;
}

export default function OutputsPage() {
  const {
    selectedProfile,
    result,
    explanation,
    scenarioExplanation,
    bufferPercent,
    stateStyle,
  } = useWorker();

  const [showFactors, setShowFactors] = useState(true);
  const [showScenario, setShowScenario] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <section className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Calculation Outputs & Stress Simulator</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Resilience Strategy for {selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Deterministic calculations based on {selectedProfile.role}&apos;s cashflow, essential floor, and volatility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3.5 py-1 text-sm font-bold ring-1 ${stateStyle.badge}`}
            >
              {stateStyle.label}
            </span>
          </div>
        </div>
      </section>

      {/* Output Section 1: Cycle Saving Recommendation */}
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recommended Saving This Cycle
            </span>
            <p className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-slate-950 dark:text-emerald-300">
              {formatCurrency(result.recommended_saving)}
            </p>
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {explanation}
            </p>
          </div>

          <div className="grid min-w-72 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="glass-card rounded-xl p-4 border border-slate-200/80 dark:border-white/[0.06]">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Surplus After Essentials
              </p>
              <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white">
                {formatCurrency(result.surplus)}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-200/80 dark:border-white/[0.06]">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Flexible Cash Remaining
              </p>
              <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white">
                {formatCurrency(result.remaining_cash)}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-200/80 dark:border-white/[0.06]">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Resilience State
              </p>
              <p className="mt-1 text-base font-bold text-emerald-700 dark:text-emerald-400">
                {result.state}
              </p>
            </div>
          </div>
        </div>

        {/* Grounded Decision Factors Dropdown */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-white/[0.06] dark:bg-slate-950/40 p-5">
          <button
            type="button"
            onClick={() => setShowFactors(!showFactors)}
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Why this recommendation? Engine Factors ({result.factors.length})</span>
            </span>
            {showFactors ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showFactors && (
            <ul className="mt-3 space-y-2.5 border-t border-slate-200/60 dark:border-white/[0.05] pt-3 text-sm text-slate-700 dark:text-slate-300">
              {result.factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Output Section 2: Emergency Buffer & Runway Tracker */}
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Emergency Buffer & Runway
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(selectedProfile.currentSavings)} currently saved
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <PiggyBank className="h-5 w-5" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${bufferPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm font-mono text-slate-600 dark:text-slate-400">
            <span>{bufferPercent}% of target reached</span>
            <span>Target: {formatCurrency(result.buffer_target)} (3 months essentials)</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="glass-card rounded-xl p-5 border border-slate-200/80 dark:border-white/[0.06]">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Essential Outflow Runway
            </p>
            <p className="mt-2 text-2xl font-extrabold font-mono text-slate-950 dark:text-white">
              {result.runway_months} months
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Covers living costs and EMI obligations under zero platform income.
            </p>
          </div>

          <div className="glass-card rounded-xl p-5 border border-slate-200/80 dark:border-white/[0.06]">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Buffer Target Rule
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {result.state === "Buffer Complete"
                ? "Full 3-month target achieved! Surplus automatically redirects to long-term goals or debt prepayment."
                : `Need ${formatCurrency(Math.max(0, result.buffer_target - selectedProfile.currentSavings))} more to reach the full 3-month safety benchmark.`}
            </p>
          </div>
        </div>
      </section>

      {/* Output Section 3: Integrated What-If Stress Simulator */}
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/70 dark:border-white/[0.06] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Stress Simulation Module</span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              What-If Simulation: Sudden 20% Income Drop
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Test how Savora adjusts recommendations during gig platform slowdowns or lean cycles.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 shadow-2xs transition hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={showScenario}
              onChange={(e) => setShowScenario(e.target.checked)}
              className="h-4 w-4 accent-emerald-600 dark:accent-emerald-500"
            />
            <span>{showScenario ? "Simulated Drop Active (-20%)" : "Enable 20% Income Drop"}</span>
          </label>
        </div>

        {showScenario && result.scenario ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 text-sm leading-relaxed text-amber-950 dark:text-amber-200 font-medium">
              <strong>Simulated Impact:</strong> {scenarioExplanation}
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/[0.08]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-white/[0.06]">
                  <tr>
                    <th className="px-4 py-3">Metric</th>
                    <th className="px-4 py-3">Current Plan</th>
                    <th className="px-4 py-3 text-rose-700 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20">
                      Simulated 20% Drop Plan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05] bg-white/70 dark:bg-slate-900/60 font-mono text-sm">
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800 dark:text-slate-200">Monthly Income</td>
                    <td className="px-4 py-3 font-bold text-slate-950 dark:text-slate-100">
                      {formatCurrency(result.latest_income)}
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-700 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-950/10">
                      {formatCurrency(result.scenario.latest_income)} (-20%)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800 dark:text-slate-200">Financial State</td>
                    <td className="px-4 py-3 font-semibold font-sans text-slate-800 dark:text-slate-200">
                      {result.state}
                    </td>
                    <td className="px-4 py-3 font-semibold font-sans text-rose-700 dark:text-rose-300 bg-rose-50/30 dark:bg-rose-950/10">
                      {result.scenario.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800 dark:text-slate-200">Surplus After Essentials</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(result.surplus)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 bg-rose-50/30 dark:bg-rose-950/10">
                      {formatCurrency(result.scenario.surplus)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800 dark:text-slate-200">Recommended Saving</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(result.recommended_saving)}
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400 bg-rose-50/30 dark:bg-rose-950/10">
                      {formatCurrency(result.scenario.recommended_saving)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800 dark:text-slate-200">Expense Coverage</td>
                    <td className="px-4 py-3 font-sans font-semibold text-emerald-700 dark:text-emerald-400">
                      {coverageLabel(result.latest_income, result.essential_total)}
                    </td>
                    <td className="px-4 py-3 font-sans font-semibold text-rose-700 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-950/10">
                      {coverageLabel(result.scenario.latest_income, result.essential_total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-white/[0.06] dark:bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              💡 <strong>How Savora adapts:</strong> Notice how the engine automatically scales back savings recommendations when income drops, rather than forcing a rigid percentage. In low or critical cycles, preserving liquid cash always takes precedence.
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/[0.1] p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Check the box above to simulate how a 20% income reduction impacts {selectedProfile.name}&apos;s plan.
          </div>
        )}
      </section>
    </main>
  );
}
