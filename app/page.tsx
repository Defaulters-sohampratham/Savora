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
    profiles,
    selectedProfile,
    selectedProfileId,
    setSelectedProfileId,
    result,
    stateStyle,
    explanation,
  } = useWorker();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome & Worker Persona Selection Strip */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Active Worker Persona
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              {selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-teal-800">
              {selectedProfile.role} · {selectedProfile.city}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-650">
              {selectedProfile.description}
            </p>
          </div>

          {/* Quick profile switch pills */}
          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
            <span className="w-full text-xs font-semibold uppercase tracking-wider text-slate-400 lg:text-right">
              Switch Persona:
            </span>
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  type="button"
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    p.id === selectedProfileId
                      ? "bg-teal-600 text-white shadow-sm"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {p.name.split(" ")[0]} ({p.role.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Financial Health & Resilience Status */}
      <section className={`rounded-2xl border bg-white p-6 shadow-sm ${stateStyle.border}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Current Financial Health State
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-sm font-bold ring-1 ${stateStyle.badge}`}
              >
                {stateStyle.label}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Confidence: <strong className="text-slate-800">{result.confidence}</strong>
              </span>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-slate-800">
              {result.state_reason}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-teal-50 p-4 text-teal-700">
            <Gauge className="h-12 w-12" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Snapshot KPI Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Latest Income</span>
            <Banknote className="h-5 w-5 text-teal-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {formatCurrency(result.latest_income)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Avg: {formatCurrency(result.average_income)}/mo
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Outflow</span>
            <WalletCards className="h-5 w-5 text-teal-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {formatCurrency(result.essential_total)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Essentials + {formatCurrency(selectedProfile.monthlyEmi)} EMI
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Savings</span>
            <PiggyBank className="h-5 w-5 text-violet-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {formatCurrency(selectedProfile.currentSavings)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Target: {formatCurrency(result.buffer_target)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Runway Months</span>
            <TrendingUp className="h-5 w-5 text-emerald-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {result.runway_months} mo
          </p>
          <p className="mt-1 text-xs text-slate-500">
            At current essential spend rate
          </p>
        </div>
      </section>

      {/* Cycle Action Callout Banner */}
      <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/60 to-emerald-50/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
              Recommended Action For This Cycle
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
              {result.recommended_saving > 0
                ? `Set aside ${formatCurrency(result.recommended_saving)} into emergency buffer`
                : result.state === "Buffer Complete"
                  ? "Emergency buffer complete — preserve cash or tackle long-term goals"
                  : "Preserve all cashflow — zero savings recommended this cycle"}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
              {explanation}
            </p>
          </div>

          <Link
            href="/outputs"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800"
          >
            <span>View Outputs & Simulator</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Deep-Dive Navigation Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Explore Savora Modules</h2>
          <p className="text-sm text-slate-550">
            Select a dedicated section below to review granular data, test scenarios, or inspect trends.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1: User Details */}
          <Link
            href="/profile"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white">
              <User className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950 group-hover:text-teal-700">
              User Details & Budget
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Inspect {selectedProfile.name}&apos;s profile metadata, fixed living expenses, EMI commitments, and 6-month earnings log.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <span>Review Profile</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Outputs & Stress Simulator */}
          <Link
            href="/outputs"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950 group-hover:text-teal-700">
              Outputs & What-If Simulator
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Full breakdown of saving factors, buffer completion targets, and live 20% income-drop stress simulation.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <span>Run Calculations</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Insights & Trends */}
          <Link
            href="/insights"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950 group-hover:text-teal-700">
              Insights & Forecasting
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Explore month-over-month earnings volatility, spread between peak and low cycles, and 3-tier future forecasts.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <span>View Insights</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
