"use client";

import Link from "next/link";
import {
  Banknote,
  ChevronRight,
  Database,
  Edit3,
  Landmark,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";
import { formatMonth, useWorker } from "@/lib/context/worker-context";
import { formatCurrency } from "@/lib/finance/engine";

export default function ProfilePage() {
  const {
    demoProfiles,
    selectedProfile,
    selectedProfileId,
    setSelectedProfileId,
    result,
    isAuthenticated,
    user,
  } = useWorker();

  const totalCommittedOutflow =
    selectedProfile.essentialExpenses + selectedProfile.monthlyEmi;
  const dailyBreakeven = Math.round(totalCommittedOutflow / 30);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <section className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isAuthenticated ? "Verified Worker Profile" : "Demo Profile & Baseline"}</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {isAuthenticated && user ? user.displayName : selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {selectedProfile.role} · {selectedProfile.city}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25 transition cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Cashflow Inputs</span>
            </Link>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 dark:border-white/[0.08] dark:bg-slate-900/80 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-300 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                ID:{" "}
                <strong className="text-slate-950 dark:text-white">
                  {isAuthenticated && user ? user.id.slice(0, 8) + "..." : selectedProfile.id}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {selectedProfile.description}
        </p>
      </section>

      {/* When NOT authenticated: Show demo persona comparisons */}
      {!isAuthenticated && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Compare Demo Worker Personas
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {demoProfiles.map((profile) => {
              const isSelected = profile.id === selectedProfileId;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={`group rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-emerald-500 bg-white ring-2 ring-emerald-500/25 shadow-md shadow-emerald-500/10 dark:bg-slate-900/90 dark:border-emerald-400"
                      : "glass-card glass-card-interactive hover:border-slate-300 dark:hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-950 dark:text-white">{profile.name}</p>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {profile.role} · {profile.city}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {profile.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.06] pt-3 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Committed Outflow:</span>
                    <span className="font-mono font-bold tabular-nums text-slate-950 dark:text-white">
                      {formatCurrency(profile.essentialExpenses + profile.monthlyEmi)}/mo
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* When authenticated: Show Account Information */}
      {isAuthenticated && user && (
        <section className="glass-card rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Account Credentials & Cloud Sync
            </h2>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Cashflow Inputs</span>
            </Link>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Registered Email:</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{user.email || "Not specified"}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Gig Category:</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{user.role || "Rideshare"}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Database Sync:</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active (Supabase Connected)
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Budget & Outflow Commitments Breakdown */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Monthly Outflow & Debt Obligations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Committed baseline expenses that must be cleared each month.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Essential Living Costs
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <WalletCards className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(selectedProfile.essentialExpenses)}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Rent, food, utilities, fuel, platform costs
            </p>
          </div>

          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly EMI / Loans
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Landmark className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(selectedProfile.monthlyEmi)}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vehicle loans, personal finance, micro-credit
            </p>
          </div>

          <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Committed Outflow
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatCurrency(totalCommittedOutflow)}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-mono">
              Daily Break-even: ~{formatCurrency(dailyBreakeven)}/day
            </p>
          </div>
        </div>
      </section>

      {/* Income History Table */}
      <section className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">6-Month Income History Log</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Recorded earnings cycles used by Savora to calculate volatility and resilience state.
            </p>
          </div>
          <div className="text-sm font-mono font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.08] rounded-xl px-3.5 py-1.5 self-start sm:self-auto shadow-2xs">
            Baseline Average: <strong className="text-slate-950 dark:text-white">{formatCurrency(result.average_income)}</strong>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 py-3">Cycle Month</th>
                <th className="px-4 py-3">Earnings Amount</th>
                <th className="px-4 py-3">Vs Essentials Outflow</th>
                <th className="px-4 py-3">Vs 6-Mo Average</th>
                <th className="px-4 py-3">Cycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05] bg-white/70 dark:bg-slate-900/60 font-mono">
              {selectedProfile.monthlyIncome.map((record) => {
                const diffFromEssentials = record.amount - totalCommittedOutflow;
                const diffFromAvg = record.amount - result.average_income;
                const percentOfAvg = Math.round((record.amount / result.average_income) * 100);

                return (
                  <tr key={record.date} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                      {formatMonth(record.date)}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-950 dark:text-white">
                      {formatCurrency(record.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm font-sans">
                      <span
                        className={`font-semibold ${
                          diffFromEssentials >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {diffFromEssentials >= 0 ? "+" : ""}
                        {formatCurrency(diffFromEssentials)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {percentOfAvg}% ({diffFromAvg >= 0 ? "+" : ""}
                      {formatCurrency(diffFromAvg)})
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                          percentOfAvg >= 115
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                            : percentOfAvg < 70
                              ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                              : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {percentOfAvg >= 115
                          ? "Surge Month"
                          : percentOfAvg < 70
                            ? "Lean Month"
                            : "Standard Month"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Database Schema Connection Note */}
      <section className="glass-card rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <div className="space-y-1 text-sm">
            <h3 className="font-bold text-slate-900 dark:text-white">Supabase Schema Readiness</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              This worker data is formatted to map directly to the connected Supabase tables:{" "}
              <code className="rounded bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-slate-800 dark:text-slate-200">
                profiles
              </code>{" "}
              and{" "}
              <code className="rounded bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-slate-800 dark:text-slate-200">
                income_records
              </code>
              . When logged in, your verified data is live and authenticated.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
