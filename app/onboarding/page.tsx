"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Landmark,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  WalletCards,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";
import { formatCurrency } from "@/lib/finance/engine";

const GIG_CATEGORIES = [
  "Rideshare (Uber, Ola, Rapido)",
  "Food Delivery (Zomato, Swiggy)",
  "Quick Commerce (Blinkit, Zepto, Instamart)",
  "E-Commerce Logistics (Amazon, Delhivery)",
  "Home Services (Urban Company)",
  "Freelance Creative / Tech",
  "Other Gig Service",
];

const MAJOR_CITIES = [
  "Bengaluru",
  "Delhi NCR",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Other Tier-1 / Tier-2 City",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedProfile, updateUserProfile, user, isAuthenticated } = useWorker();

  // Form State initialized from selected profile or defaults
  const [role, setRole] = useState(selectedProfile.role || "Rideshare (Uber, Ola, Rapido)");
  const [city, setCity] = useState(selectedProfile.city || "Bengaluru");
  const [essentialExpenses, setEssentialExpenses] = useState<number>(
    selectedProfile.essentialExpenses || 18000
  );
  const [monthlyEmi, setMonthlyEmi] = useState<number>(
    selectedProfile.monthlyEmi || 3500
  );
  const [currentSavings, setCurrentSavings] = useState<number>(
    selectedProfile.currentSavings || 14000
  );

  // 6-Month Income History
  const defaultMonths = [
    { date: "2026-03-31", label: "March 2026", amount: 26000 },
    { date: "2026-04-30", label: "April 2026", amount: 28500 },
    { date: "2026-05-31", label: "May 2026", amount: 24000 },
    { date: "2026-06-30", label: "June 2026", amount: 31000 },
    { date: "2026-07-31", label: "July 2026", amount: 29000 },
    { date: "2026-08-31", label: "August 2026 (Latest)", amount: 32500 },
  ];

  const [incomeList, setIncomeList] = useState(
    selectedProfile.monthlyIncome.length >= 3
      ? selectedProfile.monthlyIncome.map((item, idx) => ({
          date: item.date,
          label: defaultMonths[idx]?.label || `Month ${idx + 1}`,
          amount: item.amount,
        }))
      : defaultMonths
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Live Calculations for review
  const totalOutflow = (essentialExpenses || 0) + (monthlyEmi || 0);
  const avgIncome = useMemo(() => {
    const total = incomeList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return Math.round(total / (incomeList.length || 1));
  }, [incomeList]);

  const handleIncomeChange = (index: number, val: number) => {
    setIncomeList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], amount: Math.max(0, val) };
      return next;
    });
  };

  const handleApplyQuickProfile = (type: "conservative" | "moderate" | "growth") => {
    if (type === "conservative") {
      setEssentialExpenses(14000);
      setMonthlyEmi(2000);
      setCurrentSavings(8000);
      setIncomeList([
        { date: "2026-03-31", label: "March 2026", amount: 21000 },
        { date: "2026-04-30", label: "April 2026", amount: 22500 },
        { date: "2026-05-31", label: "May 2026", amount: 19000 },
        { date: "2026-06-30", label: "June 2026", amount: 24000 },
        { date: "2026-07-31", label: "July 2026", amount: 23000 },
        { date: "2026-08-31", label: "August 2026 (Latest)", amount: 25000 },
      ]);
    } else if (type === "moderate") {
      setEssentialExpenses(18000);
      setMonthlyEmi(3500);
      setCurrentSavings(15000);
      setIncomeList([
        { date: "2026-03-31", label: "March 2026", amount: 26000 },
        { date: "2026-04-30", label: "April 2026", amount: 28500 },
        { date: "2026-05-31", label: "May 2026", amount: 24000 },
        { date: "2026-06-30", label: "June 2026", amount: 31000 },
        { date: "2026-07-31", label: "July 2026", amount: 29000 },
        { date: "2026-08-31", label: "August 2026 (Latest)", amount: 32500 },
      ]);
    } else {
      setEssentialExpenses(24000);
      setMonthlyEmi(6000);
      setCurrentSavings(25000);
      setIncomeList([
        { date: "2026-03-31", label: "March 2026", amount: 35000 },
        { date: "2026-04-30", label: "April 2026", amount: 38000 },
        { date: "2026-05-31", label: "May 2026", amount: 32000 },
        { date: "2026-06-30", label: "June 2026", amount: 42000 },
        { date: "2026-07-31", label: "July 2026", amount: 39000 },
        { date: "2026-08-31", label: "August 2026 (Latest)", amount: 44000 },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedIncome = incomeList.map((item) => ({
      date: item.date,
      amount: Number(item.amount) || 0,
    }));

    updateUserProfile({
      role,
      city,
      essentialExpenses: Number(essentialExpenses) || 0,
      monthlyEmi: Number(monthlyEmi) || 0,
      currentSavings: Number(currentSavings) || 0,
      monthlyIncome: formattedIncome,
      description: `Customized profile for ${user?.displayName || "Worker"}. Essential outflow of ${formatCurrency(totalOutflow)}/mo with active buffer planning.`,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <section className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Step 2 · Financial Cashflow Setup</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Welcome{user?.displayName ? `, ${user.displayName}` : ""}! Let&apos;s Set Up Your Baseline
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Provide your typical cashflow numbers. Savora will compute your financial resilience state and tailor savings recommendations automatically.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline self-start sm:self-auto"
          >
            Skip for now
          </Link>
        </div>

        {/* Quick starter presets */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-400 dark:text-slate-500 font-semibold">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyQuickProfile("conservative")}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 font-medium transition cursor-pointer"
          >
            Entry Gig (₹14k)
          </button>
          <button
            type="button"
            onClick={() => handleApplyQuickProfile("moderate")}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 font-medium transition cursor-pointer"
          >
            Full-Time Partner (₹18k)
          </button>
          <button
            type="button"
            onClick={() => handleApplyQuickProfile("growth")}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 font-medium transition cursor-pointer"
          >
            Multi-Platform Lead (₹24k)
          </button>
        </div>
      </section>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Gig Work & City */}
        <section className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              1. Work & Location
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Primary Gig Role / Category
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              >
                {GIG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Base City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              >
                {MAJOR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Committed Outflows */}
        <section className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <WalletCards className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                2. Monthly Outflow Commitments
              </h2>
            </div>
            <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
              Total Outflow: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(totalOutflow)}/mo</strong>
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Essential Living Costs (₹/mo)
                </label>
                <span className="text-sm text-slate-400">Rent, food, fuel, bills</span>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={essentialExpenses}
                  onChange={(e) => setEssentialExpenses(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900/80 pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  required
                />
              </div>
              <div className="mt-2 flex gap-1.5">
                {[14000, 18000, 22000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setEssentialExpenses(amt)}
                    className="rounded-lg border border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-slate-900 px-2.5 py-1 text-sm font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    ₹{amt / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Monthly EMI / Loan Payments (₹/mo)
                </label>
                <span className="text-sm text-slate-400">Vehicle, phone, personal</span>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={monthlyEmi}
                  onChange={(e) => setMonthlyEmi(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900/80 pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  required
                />
              </div>
              <div className="mt-2 flex gap-1.5">
                {[0, 2500, 4500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthlyEmi(amt)}
                    className="rounded-lg border border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-slate-900 px-2.5 py-1 text-sm font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    {amt === 0 ? "No EMI" : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Current Savings */}
        <section className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              3. Current Emergency Savings
            </h2>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Liquid Cash & Bank Balance (₹)
              </label>
              <span className="text-sm text-slate-400">Available immediately in case of emergency</span>
            </div>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900/80 pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                required
              />
            </div>
            <div className="mt-2 flex gap-1.5">
              {[5000, 10000, 20000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCurrentSavings(amt)}
                  className="rounded-lg border border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-slate-900 px-2.5 py-1 text-sm font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  ₹{amt / 1000}k
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Recent 6-Month Income History */}
        <section className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                4. Recent 6 Months Earnings
              </h2>
            </div>
            <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
              6-Month Average: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{formatCurrency(avgIncome)}/mo</strong>
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your approximate earnings for each month. Savora calculates your volatility curve to know when to recommend saving vs when to pause.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
            {incomeList.map((item, idx) => (
              <div
                key={item.date}
                className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-white/[0.06] dark:bg-slate-950/40 p-3.5"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <span>{item.label}</span>
                  {idx === incomeList.length - 1 && (
                    <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-sm font-bold">
                      Latest
                    </span>
                  )}
                </div>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={item.amount}
                    onChange={(e) => handleIncomeChange(idx, Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900 pl-7 pr-2.5 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Summary & Submit Button */}
        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Ready to Process Your Resilience Strategy
              </h3>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                Committed outflow: <strong>{formatCurrency(totalOutflow)}/mo</strong> · Average earnings: <strong>{formatCurrency(avgIncome)}/mo</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {submittedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Inputs Saved! Loading Dashboard...</span>
                </>
              ) : isSubmitting ? (
                <span>Calculating Plan...</span>
              ) : (
                <>
                  <span>Calculate My Resilience Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
