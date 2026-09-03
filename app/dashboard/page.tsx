"use client";

import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Gauge,
  LineChart,
  PiggyBank,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  User,
  WalletCards,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";
import { formatCurrency } from "@/lib/finance/engine";

export default function DashboardPage() {
  const {
    demoProfiles,
    selectedProfile,
    selectedProfileId,
    setSelectedProfileId,
    result,
    stateStyle,
    explanation,
    isAuthenticated,
    user,
  } = useWorker();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Welcome & Worker Persona Selection Strip */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {isAuthenticated ? "Personal Worker Account" : "Demo Worker Persona"}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isAuthenticated && user ? user.displayName : selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {selectedProfile.role} · {selectedProfile.city}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {selectedProfile.description}
            </p>
          </div>

          {/* Quick profile switch pills ONLY shown in guest/demo mode */}
          {!isAuthenticated && (
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
              <span className="w-full text-xs font-medium uppercase tracking-wider text-slate-400 lg:text-right">
                Explore Demo Personas:
              </span>
              <div className="flex flex-wrap gap-2">
                {demoProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    type="button"
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      p.id === selectedProfileId
                        ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {p.name.split(" ")[0]} ({p.role.split(" ")[0]})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Primary Financial Health & Resilience Status */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Financial Health State
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold ring-1 ${stateStyle.badge}`}
              >
                {stateStyle.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Confidence: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{result.confidence}</strong>
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-650 dark:text-slate-300">
              {result.state_reason}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3.5 text-emerald-700 dark:text-emerald-400">
            <Gauge className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Clean, Uniform KPI Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Latest Income
            </span>
            <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(result.latest_income)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Avg: {formatCurrency(result.average_income)}/mo
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly Outflow
            </span>
            <WalletCards className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(result.essential_total)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Essentials + {formatCurrency(selectedProfile.monthlyEmi)} EMI
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Savings
            </span>
            <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(selectedProfile.currentSavings)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Target: {formatCurrency(result.buffer_target)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Runway Months
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {result.runway_months} mo
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            At current essential spend
          </p>
        </div>
      </section>

      {/* Cycle Action Highlight Banner */}
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Recommended Action For This Cycle
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {result.recommended_saving > 0
                ? `Set aside ${formatCurrency(result.recommended_saving)} into emergency buffer`
                : result.state === "Buffer Complete"
                  ? "Emergency buffer complete — preserve cash or tackle long-term goals"
                  : "Preserve all cashflow — zero savings recommended this cycle"}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-650 dark:text-slate-300">
              {explanation}
            </p>
          </div>

          <Link
            href="/outputs"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition"
          >
            <span>Outputs & Simulator</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Deep-Dive Navigation Cards */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Explore Savora Modules</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a section below to review granular data, test scenarios, or inspect trends.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Card 1: User Details */}
          <Link
            href="/profile"
            className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <User className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
              User Details & Budget
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Inspect {selectedProfile.name}&apos;s profile metadata, fixed living expenses, and EMI commitments.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Review Profile</span>
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Card 2: Outputs & Stress Simulator */}
          <Link
            href="/outputs"
            className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
              Outputs & What-If Simulator
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Breakdown of saving factors, buffer targets, and live 20% income-drop stress simulation.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Run Calculations</span>
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Card 3: Insights & Trends */}
          <Link
            href="/insights"
            className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
              Insights & Forecasting
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Explore earnings volatility, spread between cycles, and 3-tier future forecasts.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>View Insights</span>
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
