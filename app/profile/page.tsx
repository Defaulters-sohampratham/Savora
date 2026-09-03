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
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1 text-xs font-semibold">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {isAuthenticated ? "Verified Worker Profile" : "Demo Profile & Baseline"}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isAuthenticated && user ? user.displayName : selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {selectedProfile.role} · {selectedProfile.city}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900 transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Cashflow Inputs</span>
            </Link>
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>
                Account ID:{" "}
                <strong className="font-mono text-slate-900 dark:text-slate-100">
                  {isAuthenticated && user ? user.id.slice(0, 8) + "..." : selectedProfile.id}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {selectedProfile.description}
        </p>
      </section>

      {/* When NOT authenticated: Show demo persona comparisons */}
      {!isAuthenticated && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                  className={`group rounded-xl border p-5 text-left transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30 dark:border-emerald-500 dark:bg-emerald-950/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100">{profile.name}</p>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {profile.role} · {profile.city}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition ${
                        isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {profile.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                    <span className="text-slate-400">Committed Outflow:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
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
        <section className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Credentials & Cloud Sync
            </h2>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Cashflow Inputs</span>
            </Link>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Registered Email:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email || "Not specified"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Gig Category:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.role || "Rideshare"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Database Sync:</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active (Supabase Connected)
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Budget & Outflow Commitments Breakdown */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Monthly Outflow & Debt Obligations</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Essential Living Costs
              </span>
              <WalletCards className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(selectedProfile.essentialExpenses)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Rent, food, utilities, fuel, platform costs
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly EMI / Loans
              </span>
              <Landmark className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(selectedProfile.monthlyEmi)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Vehicle loans, personal finance, micro-credit
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Committed Outflow
              </span>
              <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalCommittedOutflow)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Break-even: ~{formatCurrency(dailyBreakeven)}/day
            </p>
          </div>
        </div>
      </section>

      {/* Income History Table */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">6-Month Income History Log</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recorded earnings cycles used by Savora to calculate volatility and resilience state.
            </p>
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 self-start sm:self-auto">
            Recent Average: <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(result.average_income)}</strong>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Cycle Month</th>
                <th className="px-4 py-3">Earnings Amount</th>
                <th className="px-4 py-3">Vs Essentials Outflow</th>
                <th className="px-4 py-3">Vs 6-Mo Average</th>
                <th className="px-4 py-3">Cycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {selectedProfile.monthlyIncome.map((record) => {
                const diffFromEssentials = record.amount - totalCommittedOutflow;
                const diffFromAvg = record.amount - result.average_income;
                const percentOfAvg = Math.round((record.amount / result.average_income) * 100);

                return (
                  <tr key={record.date} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {formatMonth(record.date)}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(record.amount)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`font-semibold ${
                          diffFromEssentials >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {diffFromEssentials >= 0 ? "+" : ""}
                        {formatCurrency(diffFromEssentials)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {percentOfAvg}% ({diffFromAvg >= 0 ? "+" : ""}
                      {formatCurrency(diffFromAvg)})
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          percentOfAvg >= 115
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                            : percentOfAvg < 70
                              ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
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
      <section className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 p-5">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Supabase Schema Readiness</h3>
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
