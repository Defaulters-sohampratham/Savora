"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import { stateStyles, useWorker } from "@/lib/context/worker-context";
import {
  calculateFinancialResilience,
  formatCurrency,
  profileToCalculationInput,
} from "@/lib/finance/engine";
import { explainRecommendation, explainScenario } from "@/lib/finance/narrator";
import { signInAction, signUpAction } from "@/app/auth/actions";

export default function LandingPage() {
  const {
    demoProfiles,
    user,
    isAuthenticated,
    refreshUser,
    signOut,
  } = useWorker();

  // Landing page interactive demonstration is pinned to demoProfiles
  const [selectedDemoId, setSelectedDemoId] = useState(
    demoProfiles[0]?.id ?? "ramesh-rideshare"
  );
  const activeDemoProfile = useMemo(() => {
    return (
      demoProfiles.find((p) => p.id === selectedDemoId) ??
      demoProfiles[0]
    );
  }, [demoProfiles, selectedDemoId]);

  const demoResult = useMemo(
    () => calculateFinancialResilience(profileToCalculationInput(activeDemoProfile)),
    [activeDemoProfile]
  );
  const demoExplanation = useMemo(
    () => explainRecommendation(demoResult),
    [demoResult]
  );
  const demoScenarioExplanation = useMemo(
    () => explainScenario(demoResult),
    [demoResult]
  );
  const demoBufferPercent = Math.min(
    100,
    Math.round(
      (activeDemoProfile.currentSavings / demoResult.buffer_target) * 100
    )
  );
  const demoStateStyle = stateStyles[demoResult.state];

  // Auth tab state
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "Rideshare (Uber, Ola)",
    pass: "",
  });

  // Demo simulator state
  const [simulateDrop, setSimulateDrop] = useState(false);

  const normalizeEmail = (contact: string) => {
    if (contact.includes("@")) return contact.trim().toLowerCase();
    const digits = contact.replace(/\D/g, "");
    return `worker_${digits || "guest"}@savora.local`;
  };

  const router = useRouter();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    const email = normalizeEmail(formData.contact);

    if (formData.pass.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      setAuthLoading(false);
      return;
    }

    try {
      if (authMode === "signup") {
        const res = await signUpAction({
          email,
          pass: formData.pass,
          name: formData.name.trim() || "Worker",
          category: formData.category,
        });

        if (res.success) {
          setAuthSuccess(res.message);
          await refreshUser();
          setTimeout(() => {
            router.push("/onboarding");
          }, 600);
        } else {
          setAuthError(res.message);
        }
      } else {
        const res = await signInAction({
          email,
          pass: formData.pass,
        });

        if (res.success) {
          setAuthSuccess("Signed in successfully! Preparing your setup...");
          await refreshUser();
          setTimeout(() => {
            router.push("/onboarding");
          }, 600);
        } else {
          setAuthError(res.message);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9] text-slate-950 dark:bg-[#080e0b] dark:text-slate-100 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Problem & What We Do in a Brief One-Liner Manner        */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-grid-subtle px-4 pt-14 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28 dark:border-white/[0.07]">
        {/* Subtle background glow effect */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-transparent blur-3xl dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent" />

        <div className="mx-auto max-w-5xl text-center">
          {/* Top Brand Identifier Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5 shadow-2xs backdrop-blur-md dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">
              ✦ Adaptive Financial Resilience Engine
            </span>
          </div>

          {/* Main Hook Headline */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-[1.15]">
            A safety net built for income that{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
              changes every cycle
            </span>
            .
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Traditional budgeting breaks when weekly earnings swing. Savora automatically throttles savings when earnings dip, and builds your emergency runway when earnings surge.
          </p>

          {/* Primary Quick Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98] transition-all duration-200 dark:bg-emerald-500 dark:hover:bg-emerald-600 sm:w-auto"
            >
              <span>Explore 3-Worker Live Demo</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#auth"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto shadow-2xs"
            >
              <span>Create Free Account</span>
            </a>
          </div>

          {/* One-Liner Problem vs Solution Visual Pill */}
          <div id="problem" className="mt-16 grid gap-5 text-left sm:grid-cols-2">
            {/* The Problem Box */}
            <div className="glass-card glass-card-interactive rounded-2xl border border-rose-200/80 bg-rose-50/30 p-6 sm:p-7 dark:border-rose-900/40 dark:bg-rose-950/15">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold">
                  <XCircle className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>The Problem</span>
                </span>
              </div>
              <h3 className="mt-3.5 text-lg font-bold text-slate-900 dark:text-slate-100">
                Rigid Monthly Saving Rules Break
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Traditional banking rules demand fixed monthly deposits. When platform algorithms shift or demand slows, workers get trapped between paying loan EMIs or borrowing high-interest payday cash.
              </p>
            </div>

            {/* What Savora Does Box */}
            <div id="solution" className="glass-card glass-card-interactive rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-6 sm:p-7 dark:border-emerald-900/40 dark:bg-emerald-950/15">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>What Savora Does</span>
                </span>
              </div>
              <h3 className="mt-3.5 text-lg font-bold text-slate-900 dark:text-slate-100">
                Adaptive Volatility-Grounded Buffers
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Savora senses income cycles in real time. We automatically recommend higher savings when earnings surge, and pause savings during lean weeks to safeguard your day-to-day essentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. AUTH SECTION: Clean Login / Sign Up Matching Site Vibe                 */}
      {/* ========================================================================= */}
      <section id="auth" className="relative border-b border-slate-200/80 bg-white dark:border-white/[0.07] dark:bg-[#090e0b] py-16 sm:py-24 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            {/* Header copy */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Instant Setup · Zero Bank Credentials Required</span>
              </div>
              <h2 className="mt-3.5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Get Your Personalized Resilience Plan
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Join thousands of rideshare drivers, couriers, and freelance creatives taking the stress out of irregular earnings.
              </p>
            </div>

            {/* Auth Card Container */}
            <div className="mt-8 overflow-hidden rounded-2xl glass-card border border-slate-200/90 dark:border-white/[0.08] shadow-xl">
              {/* Modern Pill Tab Switcher */}
              <div className="p-3 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/60 p-1 text-center text-xs font-semibold dark:bg-slate-900/90">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={`py-2 rounded-lg transition-all duration-200 ${
                      authMode === "signup"
                        ? "bg-white text-slate-950 shadow-xs font-bold dark:bg-slate-800 dark:text-white"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    Create Free Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={`py-2 rounded-lg transition-all duration-200 ${
                      authMode === "signin"
                        ? "bg-white text-slate-950 shadow-xs font-bold dark:bg-slate-800 dark:text-white"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-8">
                {isAuthenticated && user ? (
                  <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-6 text-center space-y-3 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 dark:bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">You are currently signed in</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Logged in as <strong>{user.displayName}</strong> ({user.role})
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition shadow-xs"
                      >
                        <span>Setup / Edit Financial Inputs</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                      >
                        <span>Open Dashboard</span>
                      </Link>
                      <button
                        type="button"
                        onClick={signOut}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : authSuccess ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3 dark:border-emerald-800/60 dark:bg-emerald-950/40">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">Success!</h3>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300">{authSuccess}</p>
                    <div className="pt-2">
                      <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition shadow-xs"
                      >
                        <span>Continue to Setup Financial Inputs</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                        {authError}
                      </div>
                    )}

                    {authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ramesh Chandra"
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-[#111e18] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Phone Number or Work Email
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          type="text"
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="+91 98765 43210 or email@domain.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-[#111e18] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                        />
                        <Smartphone className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    {authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Primary Work / Gig Category
                        </label>
                        <div className="relative mt-1.5">
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-[#111e18] dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                          >
                            <option value="Rideshare (Uber, Ola)" className="dark:bg-[#111e18]">Rideshare (Uber, Ola, Rapido)</option>
                            <option value="Delivery (Zomato, Swiggy, Zepto)" className="dark:bg-[#111e18]">Delivery (Zomato, Swiggy, Zepto)</option>
                            <option value="Freelancer / Creative" className="dark:bg-[#111e18]">Freelancer / Creative / Tech</option>
                            <option value="Home Services (Urban Company)" className="dark:bg-[#111e18]">Home Services (Urban Company)</option>
                            <option value="Artisan / Contractor" className="dark:bg-[#111e18]">Independent Contractor / Artisan</option>
                          </select>
                          <Briefcase className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {authMode === "signup" ? "Set Password (min 6 characters)" : "Password"}
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={formData.pass}
                          onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-[#111e18] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                        />
                        <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 py-3 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition hover:from-teal-700 hover:to-emerald-800 disabled:opacity-60 active:scale-98 dark:shadow-emerald-950/50"
                    >
                      {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                      <span>
                        {authLoading
                          ? "Connecting to database..."
                          : authMode === "signup"
                            ? "Create Free Resilience Account"
                            : "Sign In to Savora"}
                      </span>
                    </button>

                    <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                      <span>Or prefer to test without signing up?</span>
                      <a href="#demo" className="font-bold text-teal-700 hover:underline dark:text-emerald-400">
                        Jump directly to Demo ↓
                      </a>
                    </div>
                  </form>
                )}
              </div>

              {/* Trust Badge Footer */}
              <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-[#09110d] dark:text-slate-400">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-teal-700 dark:text-emerald-400" />
                    <span>Bank-grade local privacy</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-teal-700 dark:text-emerald-400" />
                    <span>No bank login required</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DEMO SECTION: 3 Real Worker Personas with Live Calculations            */}
      {/* ========================================================================= */}
      <section id="demo" className="relative py-16 sm:py-24 bg-[#f8faf9] dark:bg-[#080e0b] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive Platform Demonstration</span>
            </div>
            <h2 className="mt-3.5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              See How Savora Adapts to Real Workers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Select one of the three gig worker profiles below to see how our engine balances volatile income, fixed essential costs, and vehicle or micro-loans.
            </p>
          </div>

          {/* Three Demo Profile Cards */}
          <div className="grid gap-5 md:grid-cols-3">
            {demoProfiles.map((profile) => {
              const isSelected = profile.id === selectedDemoId;
              const totalOutflow = profile.essentialExpenses + profile.monthlyEmi;

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedDemoId(profile.id)}
                  className={`group relative rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-emerald-500 bg-white ring-2 ring-emerald-500/25 shadow-md shadow-emerald-500/10 dark:bg-slate-900/90 dark:border-emerald-400"
                      : "glass-card glass-card-interactive hover:border-slate-300 dark:hover:border-white/15"
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-emerald-500 shadow-xs">
                      Active Demo
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {profile.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {profile.role} · {profile.city}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                    {profile.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-white/[0.06] pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Essential Outflow:</span>
                      <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-200">
                        {formatCurrency(totalOutflow)}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Current Buffer:</span>
                      <span className="font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(profile.currentSavings)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between font-bold text-xs text-emerald-700 dark:text-emerald-400 group-hover:underline">
                    <span>{isSelected ? "Currently Viewing" : "Load Worker Persona"}</span>
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Live Calculation Console for Active Persona */}
          <div className="overflow-hidden rounded-2xl glass-card border border-slate-200/90 dark:border-white/[0.08] shadow-xl">
            {/* Terminal Top Window Header */}
            <div className="border-b border-slate-200/80 bg-slate-100/60 dark:border-white/[0.06] dark:bg-slate-950/50 px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Live Resilience Engine Output
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                      Real-Time Recommendation for {activeDemoProfile.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold ring-1 ${demoStateStyle.badge}`}
                  >
                    {demoStateStyle.label}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Confidence: <strong className="text-slate-800 dark:text-slate-200">{demoResult.confidence}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Key Recommendation Strip */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                {/* Savings Callout */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recommended Saving This Cycle
                  </span>
                  <p className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-slate-950 dark:text-emerald-300">
                    {simulateDrop && demoResult.scenario
                      ? formatCurrency(demoResult.scenario.recommended_saving)
                      : formatCurrency(demoResult.recommended_saving)}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {simulateDrop && demoResult.scenario ? demoScenarioExplanation : demoExplanation}
                  </p>
                </div>

                {/* Emergency Buffer Target & Progress Bar */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/[0.06] dark:bg-[#09100d] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <span>Emergency Runway Buffer</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">{demoBufferPercent}% Target</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${demoBufferPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                    <span>Saved: {formatCurrency(activeDemoProfile.currentSavings)}</span>
                    <span>3-Mo Target: {formatCurrency(demoResult.buffer_target)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provides <strong className="text-slate-800 dark:text-slate-200">{demoResult.runway_months} months</strong> of runway under zero earnings.
                  </p>
                </div>
              </div>

              {/* Stress Simulation Interactive Switch */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>Interactive Stress Test Simulator</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      What happens if {activeDemoProfile.name.split(" ")[0]}&apos;s platform income suddenly drops by 20%?
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={simulateDrop}
                      onChange={(e) => setSimulateDrop(e.target.checked)}
                      className="h-4 w-4 accent-emerald-600 dark:accent-emerald-500"
                    />
                    <span>{simulateDrop ? "Simulated Drop Active (-20%)" : "Enable 20% Income Drop"}</span>
                  </label>
                </div>

                {simulateDrop && demoResult.scenario && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/30 p-3.5 text-xs leading-relaxed text-amber-950 dark:text-amber-200 font-mono">
                    <strong>Engine Reaction:</strong> Income decreases from {formatCurrency(demoResult.latest_income)} to {formatCurrency(demoResult.scenario.latest_income)}. Notice how the savings recommendation automatically throttles down from {formatCurrency(demoResult.recommended_saving)} to {formatCurrency(demoResult.scenario.recommended_saving)} to keep essentials covered!
                  </div>
                )}
              </div>

              {/* Deep Dive Action */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 dark:border-white/[0.06] pt-6 sm:flex-row">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to inspect full historical cashflow tables, forecasting charts, and budget breakdowns?
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 transition"
                  >
                    <span>Open Full Worker Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/outputs"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    <span>What-If Simulator</span>
                  </Link>
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    <span>Volatility Trends</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER: Polished, High-Trust, Clean Closing                            */}
      {/* ========================================================================= */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white dark:border-white/[0.07] dark:bg-[#070c09] transition-colors">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs dark:bg-emerald-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                  Savora<span className="text-emerald-600 dark:text-emerald-400">.</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Building financial safety and adaptive buffer engines for the millions of hardworking gig, platform, and freelance professionals.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Deterministic Resilience Engine v1.0</span>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Platform Modules
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Worker Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/outputs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Stress & Drop Simulator
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Volatility & Forecasting
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Profile & Outflow Details
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Personas */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Target Personas
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">Ravi Kumar:</span> Rideshare Driver
                </li>
                <li>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">Priya Sharma:</span> Freelance Designer
                </li>
                <li>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">Amit Patel:</span> Quick Commerce Courier
                </li>
                <li>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">Daily Wage & Artisans:</span> Micro-budgeting
                </li>
              </ul>
            </div>

            {/* Column 4: Architecture & Trust */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Architecture & Privacy
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>Zero bank credential harvesting</li>
                <li>Supabase-ready relational schema</li>
                <li>Turbopack & Next.js 16 build</li>
                <li>Deterministic calculations with confidence</li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 dark:border-white/[0.06] pt-8 sm:flex-row text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} Savora Technologies. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#problem" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Problem Statement
              </a>
              <a href="#solution" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Adaptive Solution
              </a>
              <a href="#demo" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Live Demo
              </a>
              <a href="#auth" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
