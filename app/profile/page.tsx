"use client";

import {
  Banknote,
  ChevronRight,
  Database,
  Landmark,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";
import { formatMonth, useWorker } from "@/lib/context/worker-context";
import { formatCurrency } from "@/lib/finance/engine";

export default function ProfilePage() {
  const {
    profiles,
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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {isAuthenticated ? "Verified Worker Profile" : "Demo Profile & Baseline"}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              {isAuthenticated && user ? user.displayName : selectedProfile.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-teal-800">
              {selectedProfile.role} · {selectedProfile.city}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
            <ShieldCheck className="h-5 w-5 text-teal-700" />
            <span>
              Account ID:{" "}
              <strong className="font-mono text-slate-900">
                {isAuthenticated && user ? user.id.slice(0, 8) + "..." : selectedProfile.id}
              </strong>
            </span>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-650">
          {selectedProfile.description}
        </p>
      </section>

      {/* When NOT authenticated: Show demo persona comparisons */}
      {!isAuthenticated && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
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
                  className={`group rounded-xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/40 ring-2 ring-teal-200"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-950">{profile.name}</p>
                      <p className="text-xs font-semibold text-teal-800 mt-0.5">
                        {profile.role} · {profile.city}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 transition ${
                        isSelected ? "text-teal-700" : "text-slate-350 group-hover:text-teal-700"
                      }`}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
                    {profile.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-500">Committed Outflow:</span>
                    <span className="font-bold text-slate-900">
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
        <section className="rounded-xl border border-teal-100 bg-teal-50/40 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900">
            Account Credentials & Cloud Sync
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <span className="text-slate-500 block">Registered Email:</span>
              <span className="font-semibold text-slate-900">{user.email || "Not specified"}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Gig Category:</span>
              <span className="font-semibold text-slate-900">{user.role || "Rideshare"}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Database Sync:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active (Supabase Connected)
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Budget & Outflow Commitments Breakdown */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950">Monthly Outflow & Debt Obligations</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Essential Living Costs
              </span>
              <WalletCards className="h-5 w-5 text-teal-700" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(selectedProfile.essentialExpenses)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Rent, food, utilities, fuel, platform costs
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Monthly EMI / Loans
              </span>
              <Landmark className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(selectedProfile.monthlyEmi)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Vehicle loans, personal finance, micro-credit
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Committed Outflow
              </span>
              <Banknote className="h-5 w-5 text-emerald-700" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {formatCurrency(totalCommittedOutflow)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Break-even: ~{formatCurrency(dailyBreakeven)}/day
            </p>
          </div>
        </div>
      </section>

      {/* Income History Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">6-Month Income History Log</h2>
            <p className="text-xs text-slate-500">
              Recorded earnings cycles used by Savora to calculate volatility and resilience state.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 self-start sm:self-auto">
            Recent Average: <strong className="text-slate-900">{formatCurrency(result.average_income)}</strong>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Cycle Month</th>
                <th className="px-4 py-3">Earnings Amount</th>
                <th className="px-4 py-3">Vs Essentials Outflow</th>
                <th className="px-4 py-3">Vs 6-Mo Average</th>
                <th className="px-4 py-3">Cycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {selectedProfile.monthlyIncome.map((record) => {
                const diffFromEssentials = record.amount - totalCommittedOutflow;
                const diffFromAvg = record.amount - result.average_income;
                const percentOfAvg = Math.round((record.amount / result.average_income) * 100);

                return (
                  <tr key={record.date} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {formatMonth(record.date)}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {formatCurrency(record.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center text-xs font-semibold ${
                          diffFromEssentials >= 0 ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {diffFromEssentials >= 0 ? "+" : ""}
                        {formatCurrency(diffFromEssentials)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {percentOfAvg}% ({diffFromAvg >= 0 ? "+" : ""}
                      {formatCurrency(diffFromAvg)})
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          percentOfAvg >= 115
                            ? "bg-emerald-100 text-emerald-800"
                            : percentOfAvg < 70
                              ? "bg-rose-100 text-rose-800"
                              : "bg-sky-100 text-sky-800"
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
      <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
        <div className="flex items-start gap-3.5">
          <Database className="mt-0.5 h-6 w-6 text-teal-700 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="font-bold text-teal-950">Supabase Schema Readiness</h3>
            <p className="text-sm leading-relaxed text-teal-900">
              This worker data is formatted to map directly to the planned Supabase tables:{" "}
              <code className="rounded bg-teal-100 px-1.5 py-0.5 font-mono text-xs text-teal-950">
                profiles
              </code>{" "}
              and{" "}
              <code className="rounded bg-teal-100 px-1.5 py-0.5 font-mono text-xs text-teal-950">
                income_records
              </code>
              . Once the database connection is hooked up, live worker records will sync here automatically.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
