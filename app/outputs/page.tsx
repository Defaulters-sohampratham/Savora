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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Calculation Outputs & Stress Simulator
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Resilience Strategy for {selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Deterministic calculations based on {selectedProfile.role}&apos;s cashflow and volatility.
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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recommended Saving This Cycle
            </span>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
              {formatCurrency(result.recommended_saving)}
            </p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
              {explanation}
            </p>
          </div>

          <div className="grid min-w-72 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Surplus After Essentials
              </p>
              <p className="mt-1 text-xl font-bold text-slate-950">
                {formatCurrency(result.surplus)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Flexible Cash Remaining
              </p>
              <p className="mt-1 text-xl font-bold text-slate-950">
                {formatCurrency(result.remaining_cash)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resilience State
              </p>
              <p className="mt-1 text-base font-bold text-slate-950">
                {result.state}
              </p>
            </div>
          </div>
        </div>

        {/* Grounded Decision Factors Dropdown */}
        <div className="rounded-xl bg-slate-50/80 p-5">
          <button
            type="button"
            onClick={() => setShowFactors(!showFactors)}
            className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-850"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              Why this recommendation? Grounded Engine Factors ({result.factors.length})
            </span>
            {showFactors ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showFactors && (
            <ul className="mt-4 space-y-2.5 border-t border-slate-200/60 pt-4 text-sm text-slate-700">
              {result.factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Emergency Buffer & Runway
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-950">
              {formatCurrency(selectedProfile.currentSavings)} currently saved
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <PiggyBank className="h-7 w-7" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="relative h-5 w-full overflow-hidden rounded-full bg-violet-100 ring-1 ring-inset ring-violet-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-700 transition-all duration-500"
              style={{ width: `${bufferPercent}%` }}
            />
            <span className="absolute inset-y-0 right-0 w-0.5 bg-violet-950/60" aria-hidden="true" />
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{bufferPercent}% of target reached</span>
            <span>Target: {formatCurrency(result.buffer_target)} (3 months of essentials)</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Essential Outflow Runway
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {result.runway_months} months
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Covers essentials and EMI under zero income.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Buffer Completion Rule
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700 leading-relaxed">
              {result.state === "Buffer Complete"
                ? "Full 3-month target achieved! Savora automatically redirects future surplus to debt or goals."
                : `Need ${formatCurrency(Math.max(0, result.buffer_target - selectedProfile.currentSavings))} more to complete the 3-month safety benchmark.`}
            </p>
          </div>
        </div>
      </section>

      {/* Output Section 3: Integrated What-If Stress Simulator */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
              <AlertTriangle className="h-4 w-4" />
              Stress Simulation Module
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-950">
              What-If Simulation: Sudden 20% Income Drop
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Test how Savora adjusts saving recommendations during gig platform slowdowns or lean cycles.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-100">
            <input
              type="checkbox"
              checked={showScenario}
              onChange={(e) => setShowScenario(e.target.checked)}
              className="h-4 w-4 accent-teal-700"
            />
            <span>Enable 20% Stress Drop</span>
          </label>
        </div>

        {showScenario && result.scenario ? (
          <div className="space-y-5">
            <div className="flex gap-3 rounded-xl border border-rose-300 bg-rose-100 p-4 text-sm leading-relaxed text-rose-950 shadow-sm">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" />
              <p><strong>Simulated Impact:</strong> {scenarioExplanation}</p>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-650 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Metric</th>
                    <th className="px-5 py-3.5">Current Plan</th>
                    <th className="px-5 py-3.5 bg-rose-50/60 text-rose-900">
                      Simulated 20% Drop Plan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-700">Monthly Income</td>
                    <td className="px-5 py-3.5 font-bold text-slate-950">
                      {formatCurrency(result.latest_income)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-rose-700 bg-rose-50/30">
                      {formatCurrency(result.scenario.latest_income)} (-20%)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-700">Financial State</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {result.state}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-rose-800 bg-rose-50/30">
                      {result.scenario.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-700">Surplus After Essentials</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-950">
                      {formatCurrency(result.surplus)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-950 bg-rose-50/30">
                      {formatCurrency(result.scenario.surplus)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-700">Recommended Saving</td>
                    <td className="px-5 py-3.5 font-bold text-teal-700">
                      {formatCurrency(result.recommended_saving)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-amber-700 bg-rose-50/30">
                      {formatCurrency(result.scenario.recommended_saving)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-700">Expense Coverage</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-emerald-700">
                      {coverageLabel(result.latest_income, result.essential_total)}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-rose-700 bg-rose-50/30">
                      {coverageLabel(result.scenario.latest_income, result.essential_total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-650">
              💡 <strong>How Savora adapts:</strong> Notice how the engine automatically scales back savings recommendations when income drops, rather than forcing a rigid percentage. In low or critical cycles, preserving liquid cash always takes precedence.
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            Check the box above to simulate how a 20% income reduction impacts {selectedProfile.name}&apos;s plan.
          </div>
        )}
      </section>
    </main>
  );
}
