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
    explanation,
    stateStyle,
    isAuthenticated,
    user,
  } = useWorker();

  const confidencePercent =
    result.confidence === "High" ? 100 : result.confidence === "Medium" ? 66 : 33;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Welcome & Worker Persona Selection Strip */}
      <section className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isAuthenticated ? "Personal Worker Account" : "Demo Worker Persona"}</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {isAuthenticated && user ? user.displayName : selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {selectedProfile.role} · {selectedProfile.city}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {selectedProfile.description}
            </p>
          </div>

          {/* Quick profile switch pills ONLY shown in guest/demo mode */}
          {!isAuthenticated && (
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
              <span className="w-full text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:text-right">
                Switch Demo Persona:
              </span>
              <div className="flex flex-wrap gap-2">
                {demoProfiles.map((p) => {
                  const isSelected = p.id === selectedProfileId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfileId(p.id)}
                      type="button"
                      className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs dark:bg-emerald-500"
                          : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p.name.split(" ")[0]} ({p.role.split(" ")[0]})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Primary Financial Health & Resilience Status */}
      <section className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Financial Health State
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-sm font-bold ring-1 ${stateStyle.badge}`}
              >
                {stateStyle.label}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Calculation Confidence: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{result.confidence}</strong>
              </span>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {result.state_reason}
            </p>
          </div>

          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full p-1 shadow-sm ring-1 ring-emerald-500/20"
            role="img"
            aria-label={`${result.confidence} confidence based on available income history`}
            style={{ background: `conic-gradient(#059669 ${confidencePercent}%, rgba(16, 185, 129, 0.15) 0)` }}
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-white dark:bg-slate-900 text-center shadow-inner">
              <Gauge className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span className="-mt-1 text-sm font-mono font-bold text-emerald-800 dark:text-emerald-300">{confidencePercent}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clean, Uniform KPI Bento-Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Latest Income */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Latest Income
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
            {formatCurrency(result.latest_income)}
          </p>
          <p className="mt-1 text-sm font-mono text-slate-500 dark:text-slate-400">
            Baseline Avg: {formatCurrency(result.average_income)}/mo
          </p>
        </div>

        {/* Card 2: Monthly Outflow */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Essential Outflow
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <WalletCards className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
            {formatCurrency(result.essential_total)}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Living + {formatCurrency(selectedProfile.monthlyEmi)} EMI
          </p>
        </div>

        {/* Card 3: Current Savings */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Emergency Buffer
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
            {formatCurrency(selectedProfile.currentSavings)}
          </p>
          <p className="mt-1 text-sm font-mono text-slate-500 dark:text-slate-400">
            Target: {formatCurrency(result.buffer_target)}
          </p>
        </div>

        {/* Card 4: Runway Months */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Runway Duration
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
            {result.runway_months} <span className="text-base font-semibold text-slate-500 dark:text-slate-400">months</span>
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Under zero earnings scenario
          </p>
        </div>
      </section>

      {/* Cycle Action Highlight Banner */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Recommended Action For This Cycle
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {result.recommended_saving > 0
                ? `Set aside ${formatCurrency(result.recommended_saving)} into emergency buffer`
                : result.state === "Buffer Complete"
                  ? "Emergency buffer complete — preserve cash or tackle long-term goals"
                  : "Preserve all cashflow — zero savings recommended this cycle"}
            </h2>
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {explanation}
            </p>
          </div>

          <Link
            href="/outputs"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-150"
          >
            <span>Outputs & Simulator</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Deep-Dive Navigation Cards */}
      <section className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Explore Savora Modules</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review granular calculation factors, test custom stress scenarios, or inspect trends.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Card 1: User Details */}
          <Link
            href="/profile"
            className="glass-card glass-card-interactive group rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm block"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <User className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              User Details & Budget
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Inspect {selectedProfile.name}&apos;s profile metadata, fixed living expenses, and EMI commitments.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Review Profile</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Outputs & Stress Simulator */}
          <Link
            href="/outputs"
            className="glass-card glass-card-interactive group rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm block"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Outputs & What-If Simulator
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Breakdown of saving factors, buffer targets, and live 20% income-drop stress simulation.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Run Calculations</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Insights & Trends */}
          <Link
            href="/insights"
            className="glass-card glass-card-interactive group rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm block"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Insights & Forecasting
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Explore earnings volatility, spread between cycles, and 3-tier future forecasts.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <span>View Insights</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
