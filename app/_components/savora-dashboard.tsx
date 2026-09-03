"use client";

import {
  ArrowDown,
  BadgeIndianRupee,
  Banknote,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gauge,
  Landmark,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  calculateFinancialResilience,
  formatCurrency,
  profileToCalculationInput,
} from "@/lib/finance/engine";
import { explainRecommendation, explainScenario } from "@/lib/finance/narrator";
import type { CalculationResult, FinancialState, ScenarioResult, WorkerProfile } from "@/lib/finance/types";

const stateStyles: Record<
  FinancialState,
  {
    badge: string;
    border: string;
    soft: string;
    label: string;
  }
> = {
  Critical: {
    badge: "bg-rose-100 text-rose-800 ring-rose-200",
    border: "border-rose-300",
    label: "Critical",
    soft: "bg-rose-50 text-rose-900",
  },
  Low: {
    badge: "bg-amber-100 text-amber-800 ring-amber-200",
    border: "border-amber-300",
    label: "Low-income period",
    soft: "bg-amber-50 text-amber-900",
  },
  Normal: {
    badge: "bg-sky-100 text-sky-800 ring-sky-200",
    border: "border-sky-300",
    label: "Normal period",
    soft: "bg-sky-50 text-sky-900",
  },
  High: {
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    border: "border-emerald-300",
    label: "High-income period",
    soft: "bg-emerald-50 text-emerald-900",
  },
  "Buffer Complete": {
    badge: "bg-violet-100 text-violet-800 ring-violet-200",
    border: "border-violet-300",
    label: "Buffer complete",
    soft: "bg-violet-50 text-violet-900",
  },
};

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

function formatMonth(date: string) {
  return monthFormatter.format(new Date(date));
}

function coverageLabel(value: number, essentialTotal: number) {
  if (value >= essentialTotal) {
    return `covers essentials by ${formatCurrency(value - essentialTotal)}`;
  }

  return `short by ${formatCurrency(essentialTotal - value)}`;
}

export function SavoraDashboard({ profiles }: { profiles: WorkerProfile[] }) {
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id ?? "");
  const [showScenario, setShowScenario] = useState(false);
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];
  const result = useMemo(
    () => calculateFinancialResilience(profileToCalculationInput(selectedProfile)),
    [selectedProfile],
  );
  const explanation = useMemo(() => explainRecommendation(result), [result]);
  const scenarioExplanation = useMemo(() => explainScenario(result), [result]);
  const bufferPercent = Math.min(
    100,
    Math.round((selectedProfile.currentSavings / result.buffer_target) * 100),
  );
  const stateStyle = stateStyles[result.state];

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
          {/* Brand & Logo Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              {/* Logo placeholder - replace with <Image src="/logo.png" ... /> when logo is ready */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm ring-4 ring-teal-50">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Savora
                  </span>
                  <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-sm font-semibold text-teal-800">
                    Resilience Check
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Financial safety & adaptive buffer engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 sm:self-auto">
              <CalendarCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span className="font-medium">Demo month: Aug 2026</span>
            </div>
          </div>

          {/* Headline & Overview */}
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              A safer money plan for irregular income
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-650">
              Pick a worker profile to see how Savora adjusts saving advice when income rises,
              dips, or becomes risky.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {profiles.map((profile) => {
              const isSelected = profile.id === selectedProfile.id;

              return (
                <button
                  className={`group min-h-36 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md ${
                    isSelected ? "border-teal-500 ring-2 ring-teal-100" : "border-slate-200"
                  }`}
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{profile.name}</p>
                      <p className="mt-1 text-sm font-medium text-teal-800">
                        {profile.role} · {profile.city}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 transition ${isSelected ? "text-teal-700" : "text-slate-350 group-hover:text-teal-700"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{profile.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="space-y-6">
          <SummaryCards result={result} profile={selectedProfile} />

          <section className={`rounded-lg border bg-white p-5 shadow-sm ${stateStyle.border}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Current state
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ${stateStyle.badge}`}
                  >
                    {stateStyle.label}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    Confidence: {result.confidence}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                  {result.state_reason}
                </p>
              </div>
              <Gauge className="h-10 w-10 shrink-0 text-teal-700" aria-hidden="true" />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Recommended saving this cycle
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">
                  {formatCurrency(result.recommended_saving)}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
                  {explanation}
                </p>
              </div>
              <div className="grid min-w-72 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <MetricLine label="Surplus after essentials" value={formatCurrency(result.surplus)} />
                <MetricLine label="Flexible cash left" value={formatCurrency(result.remaining_cash)} />
                <MetricLine label="Financial state" value={result.state} />
              </div>
            </div>
            <details className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-850">
                Why this recommendation?
              </summary>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-650">
                {result.factors.map((factor) => (
                  <li className="flex gap-2" key={factor}>
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </details>
          </section>

          <ForecastSection result={result} />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  What-if simulation
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  Simulate a 20% income drop
                </h2>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800">
                <input
                  checked={showScenario}
                  className="h-4 w-4 accent-teal-700"
                  onChange={(event) => setShowScenario(event.target.checked)}
                  type="checkbox"
                />
                Show adjusted plan
              </label>
            </div>
            {showScenario && result.scenario ? (
              <div className="mt-5">
                <p className="mb-4 text-sm leading-6 text-slate-650">{scenarioExplanation}</p>
                <ScenarioTable current={result} scenario={result.scenario} />
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-650">
                Turn this on during the demo to show how Savora changes advice when income suddenly
                drops.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Emergency buffer
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  {formatCurrency(selectedProfile.currentSavings)} saved
                </h2>
              </div>
              <PiggyBank className="h-9 w-9 text-violet-700" aria-hidden="true" />
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-violet-600"
                style={{ width: `${bufferPercent}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-slate-650">
              <span>{bufferPercent}% of target</span>
              <span>{formatCurrency(result.buffer_target)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-650">
              This covers about{" "}
              <span className="font-semibold text-slate-950">{result.runway_months} months</span>{" "}
              of essentials and EMI.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Income history
            </p>
            <div className="mt-4 space-y-3">
              {selectedProfile.monthlyIncome.map((income) => (
                <div className="flex items-center justify-between gap-3" key={income.date}>
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                    <span className="text-sm text-slate-650">{formatMonth(income.date)}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-950">
                    {formatCurrency(income.amount)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <div className="flex items-start gap-3">
              <Landmark className="mt-0.5 h-5 w-5 text-teal-800" aria-hidden="true" />
              <div>
                <p className="font-semibold text-teal-950">Built for later Supabase</p>
                <p className="mt-2 text-sm leading-6 text-teal-900">
                  Demo data is local for now. The types are shaped so profiles, income records, and
                  snapshots can move into Supabase next.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function SummaryCards({ result, profile }: { result: CalculationResult; profile: WorkerProfile }) {
  const cards = [
    {
      icon: Banknote,
      label: "Latest income",
      value: formatCurrency(result.latest_income),
    },
    {
      icon: TrendingUp,
      label: "Average income",
      value: formatCurrency(result.average_income),
    },
    {
      icon: ArrowDown,
      label: "Income volatility",
      value: formatCurrency(result.income_volatility),
    },
    {
      icon: WalletCards,
      label: "Essential expenses",
      value: formatCurrency(result.essential_total),
    },
    {
      icon: BadgeIndianRupee,
      label: "Current savings",
      value: formatCurrency(profile.currentSavings),
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ icon: Icon, label, value }) => (
        <div className="min-h-32 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={label}>
          <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
      ))}
    </section>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ForecastSection({ result }: { result: CalculationResult }) {
  const forecasts = [
    { label: "Conservative", value: result.forecast.conservative },
    { label: "Expected", value: result.forecast.expected },
    { label: "Optimistic", value: result.forecast.optimistic },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Income forecast
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Next-cycle range from recent income
          </h2>
        </div>
        <CircleDollarSign className="h-9 w-9 text-indigo-700" aria-hidden="true" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {forecasts.map((forecast) => (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={forecast.label}>
            <p className="text-sm font-semibold text-slate-600">{forecast.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {formatCurrency(forecast.value)}
            </p>
            <p
              className={`mt-3 text-sm font-medium ${
                forecast.value >= result.essential_total ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {coverageLabel(forecast.value, result.essential_total)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScenarioTable({
  current,
  scenario,
}: {
  current: CalculationResult;
  scenario: ScenarioResult;
}) {
  const rows = [
    ["Income", formatCurrency(current.latest_income), formatCurrency(scenario.latest_income)],
    ["State", current.state, scenario.state],
    ["Surplus", formatCurrency(current.surplus), formatCurrency(scenario.surplus)],
    [
      "Recommended saving",
      formatCurrency(current.recommended_saving),
      formatCurrency(scenario.recommended_saving),
    ],
    [
      "Expense coverage",
      coverageLabel(current.latest_income, current.essential_total),
      coverageLabel(scenario.latest_income, scenario.essential_total),
    ],
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse bg-white text-sm">
        <thead className="bg-slate-100 text-left text-slate-650">
          <tr>
            <th className="px-4 py-3 font-semibold">Metric</th>
            <th className="px-4 py-3 font-semibold">Current plan</th>
            <th className="px-4 py-3 font-semibold">20% drop plan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, currentValue, scenarioValue]) => (
            <tr className="border-t border-slate-200" key={label}>
              <td className="px-4 py-3 font-semibold text-slate-700">{label}</td>
              <td className="px-4 py-3 text-slate-950">{currentValue}</td>
              <td className="px-4 py-3 text-slate-950">{scenarioValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
