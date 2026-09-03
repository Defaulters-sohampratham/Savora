"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  Gauge,
  HelpCircle,
  Layers,
  Loader2,
  Lock,
  PiggyBank,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Wallet,
  XCircle,
  Zap,
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

  // Dynamic Interactive Hero Slider State
  const [heroIncome, setHeroIncome] = useState<number>(32500);
  const heroEssential = 21500;
  const heroSurplus = Math.max(0, heroIncome - heroEssential);
  const heroRecommendedSave = heroIncome < heroEssential ? 0 : Math.round(heroSurplus * 0.35);
  const heroFlexible = Math.max(0, heroSurplus - heroRecommendedSave);
  const heroRunway = ((14000 + heroRecommendedSave) / heroEssential).toFixed(1);

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

  // Demo simulator drop state
  const [stressLevel, setStressLevel] = useState<0 | 20 | 40>(0);

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
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-950 dark:bg-[#030708] dark:text-slate-100 transition-colors duration-300">
      {/* Top Ambient Glow Beam */}
      <div className="ambient-aurora-top" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Electric, Interactive, Futuristic Real-Time Simulator    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-tech-grid pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Top Pill Beacon */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-xl shadow-lg shadow-emerald-500/10 dark:border-emerald-500/40 dark:bg-emerald-500/15">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                ✦ Autonomous Resilience Engine v1.2 · Live
              </span>
            </div>
          </div>

          {/* Main Monumental Headline */}
          <div className="mt-8 text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-950 dark:text-white">
              The safety net built for{" "}
              <span className="text-shimmer">volatile income</span>.
            </h1>
            <p className="text-base sm:text-xl text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Traditional savings break when platform algorithms shift. Savora automatically throttles savings when earnings drop, and builds emergency runway when cash surges.
            </p>
          </div>

          {/* ===================================================================== */}
          {/* HERO CENTERPIECE: Real-Time Drag-To-Simulate Pod                      */}
          {/* ===================================================================== */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="glass-cockpit rounded-3xl p-6 sm:p-8 neon-border-emerald shadow-2xl relative overflow-hidden">
              {/* Subtle top sheen */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="flex flex-col gap-6">
                {/* Header & Label */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                    <span className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Live Engine Simulator · Drag to Test
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Real-time Reaction
                  </span>
                </div>

                {/* Interactive Slider Input */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly Platform Income:</span>
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
                      {formatCurrency(heroIncome)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="14000"
                    max="60000"
                    step="1000"
                    value={heroIncome}
                    onChange={(e) => setHeroIncome(Number(e.target.value))}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm font-mono font-medium text-slate-500 dark:text-slate-400">
                    <span>₹14,000 (Lean Valley)</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Baseline Floor: ₹21,500</span>
                    <span>₹60,000 (Surge Peak)</span>
                  </div>
                </div>

                {/* Engine Response Cards */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {/* Metric 1 */}
                  <div className="rounded-2xl bg-slate-100/70 dark:bg-white/[0.04] p-4 border border-slate-200/80 dark:border-white/[0.06] text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                      Auto-Save
                    </span>
                    <p className={`mt-1 text-xl sm:text-2xl font-black font-mono tabular-nums ${
                      heroRecommendedSave > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {heroRecommendedSave > 0 ? formatCurrency(heroRecommendedSave) : "₹0 (Paused)"}
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="rounded-2xl bg-slate-100/70 dark:bg-white/[0.04] p-4 border border-slate-200/80 dark:border-white/[0.06] text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                      Safe Flexible Cash
                    </span>
                    <p className="mt-1 text-xl sm:text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {formatCurrency(heroFlexible)}
                    </p>
                  </div>

                  {/* Metric 3 */}
                  <div className="rounded-2xl bg-slate-100/70 dark:bg-white/[0.04] p-4 border border-slate-200/80 dark:border-white/[0.06] text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                      Buffer Runway
                    </span>
                    <p className="mt-1 text-xl sm:text-2xl font-black font-mono tabular-nums text-teal-600 dark:text-teal-400">
                      {heroRunway} <span className="text-sm font-semibold">mo</span>
                    </p>
                  </div>
                </div>

                {/* Real-time Narrative Callout */}
                <div className={`rounded-xl p-4 text-sm leading-relaxed flex items-start gap-3 transition-colors duration-200 ${
                  heroIncome < heroEssential
                    ? "bg-rose-500/10 text-rose-900 dark:text-rose-200 border border-rose-500/30"
                    : heroIncome > 35000
                      ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30"
                      : "bg-teal-500/10 text-teal-900 dark:text-teal-200 border border-teal-500/30"
                }`}>
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    {heroIncome < heroEssential
                      ? `⚠️ Lean cycle alert: Income falls short of ₹${heroEssential.toLocaleString()} essential outflow. Savora completely pauses savings so you don't default on bills.`
                      : heroIncome > 35000
                        ? `🚀 Surge cycle active: ₹${heroSurplus.toLocaleString()} surplus detected! Savora automatically funnels ₹${heroRecommendedSave.toLocaleString()} into your runway while leaving ₹${heroFlexible.toLocaleString()} totally liquid.`
                        : `✅ Balanced cycle: Essentials are cleared. Savora safely allocates ₹${heroRecommendedSave.toLocaleString()} into your emergency buffer.`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#auth"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all duration-200 sm:w-auto cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl glass-cockpit px-8 py-4 text-sm font-bold text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white active:scale-95 transition-all duration-200 sm:w-auto shadow-md"
            >
              <span>Explore 3 Real Worker Cockpits</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE CRISIS VS THE ENGINE (BENTO COMPARISON)                            */}
      {/* ========================================================================= */}
      <section id="problem" className="py-20 border-y border-slate-200/80 dark:border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Why Traditional Banking Fails Gig Workers
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Two Different Realities
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* The Trap Box */}
            <div className="glass-cockpit rounded-3xl p-8 neon-border-rose relative overflow-hidden space-y-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-3 py-1 text-sm font-bold uppercase tracking-wider">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  The Broken Status Quo
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                The Fixed Rule Debt Spiral
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Banks demand fixed monthly EMI and savings deposits. When a delivery driver or freelancer experiences a lean week, rigid rules force them to take 36% APR instant loans just to buy fuel and cover rent.
              </p>

              {/* Visual Flow diagram */}
              <div className="space-y-2 pt-2 text-sm">
                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-900 dark:text-rose-300 font-medium">
                  ⚡ 1. Platform income drops unexpectedly by 30%
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-900 dark:text-rose-300 font-medium">
                  💸 2. Fixed bank debit bounces or hits penalties
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-900 dark:text-rose-300 font-medium">
                  🪤 3. Worker borrows predatory short-term emergency cash
                </div>
              </div>
            </div>

            {/* The Savora Solution Box */}
            <div className="glass-cockpit rounded-3xl p-8 neon-border-emerald relative overflow-hidden space-y-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-3.5 py-1 text-sm font-bold uppercase tracking-wider">
                  <Zap className="h-4 w-4" />
                  The Savora Architecture
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                Autonomous Volatility Absorber
              </h3>
              <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-400">
                Savora continuously gauges income volatility, essential burn rate, and committed debt. It throttles savings to ₹0 during lean cycles and aggressively buffers cash during surge periods.
              </p>

              {/* Visual Flow diagram */}
              <div className="space-y-2 pt-2 text-sm">
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-medium">
                  🛡️ 1. Dynamic sensing tracks cashflow changes every cycle
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-medium">
                  📊 2. Savings dynamically scale down to guarantee essentials
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-medium">
                  🚀 3. Surge months feed a 3-month emergency runway buffer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AUTH SECTION: High-Contrast, Solid, Luminous Card (Positioned Above Demo) */}
      {/* ========================================================================= */}
      <section id="auth" className="py-20 border-t border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-[#050c0e] relative">
        <div className="mx-auto max-w-xl px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-mono font-bold text-emerald-800 dark:text-emerald-300 shadow-sm">
              <Lock className="h-4 w-4" />
              <span>Zero Bank Credentials Required · 100% Free</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              Get Your Personal Safety Plan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Takes 60 seconds to configure. Your cashflow inputs calculate your emergency buffer runway immediately.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-slate-200 dark:border-emerald-500/40 bg-white dark:bg-[#07130e] shadow-2xl overflow-hidden relative">
            {/* Subtle glow aura */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl" />

            {/* Pill Tab Switcher */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10">
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-200/90 dark:bg-slate-900 p-1.5 text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    authMode === "signup"
                      ? "bg-white text-slate-950 shadow-md font-black dark:bg-emerald-600 dark:text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Create Free Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    authMode === "signin"
                      ? "bg-white text-slate-950 shadow-md font-black dark:bg-emerald-600 dark:text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              {isAuthenticated && user ? (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center space-y-4">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">You are signed in</h3>
                  <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
                    Logged in as <strong>{user.displayName}</strong> ({user.role})
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Link
                      href="/onboarding"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
                    >
                      <span>Update Cashflow Inputs</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 rounded-xl glass-cockpit px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition"
                    >
                      <span>Open Cockpit</span>
                    </Link>
                  </div>
                </div>
              ) : authSuccess ? (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">Success!</h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">{authSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authError && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm font-mono text-rose-800 dark:text-rose-300">
                      {authError}
                    </div>
                  )}

                  {authMode === "signup" && (
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Chandra"
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:outline-none dark:border-white/15 dark:bg-[#0c1813] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Phone Number or Work Email
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="9876543210 or name@work.com"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:outline-none dark:border-white/15 dark:bg-[#0c1813] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 transition"
                    />
                  </div>

                  {authMode === "signup" && (
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Primary Platform / Gig
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm sm:text-base font-semibold text-slate-950 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:outline-none dark:border-white/15 dark:bg-[#0c1813] dark:text-white dark:focus:border-emerald-400 transition"
                      >
                        <option value="Rideshare (Uber, Ola)">Rideshare (Uber, Ola, Rapido)</option>
                        <option value="Delivery (Zomato, Swiggy)">Food Delivery (Zomato, Swiggy)</option>
                        <option value="Quick Commerce (Blinkit, Zepto)">Quick Commerce (Blinkit, Zepto)</option>
                        <option value="Freelance Creative / Tech">Freelance Creative / Tech</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Secret Passcode
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.pass}
                      onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                      placeholder="••••••••"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:outline-none dark:border-white/15 dark:bg-[#0c1813] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-4 text-base font-black text-white shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {authLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processing securely...</span>
                      </span>
                    ) : authMode === "signup" ? (
                      "Create My Free Resilience Plan →"
                    ) : (
                      "Sign In to My Dashboard →"
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060e0a] px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Bank-Grade Local Privacy
              </span>
              <span className="font-mono text-sm">Zero harvesting</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE 3-WORKER LIVE COCKPIT (THE CENTERPIECE)                    */}
      {/* ========================================================================= */}
      <section id="demo" className="py-24 border-t border-slate-200/80 dark:border-white/[0.08] relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-sm font-mono font-bold text-emerald-800 dark:text-emerald-300">
              <Layers className="h-4 w-4" />
              <span>Multi-Persona Resilience Terminal</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
              Live Interactive Cockpit
            </h2>
            <p className="text-sm sm:text-base text-slate-650 dark:text-slate-400">
              Select a real gig profile and inject platform stress drops to see the calculation engine react instantly.
            </p>
          </div>

          {/* 3 Persona Hardware Switchers */}
          <div className="grid gap-4 md:grid-cols-3">
            {demoProfiles.map((p) => {
              const isSelected = p.id === selectedDemoId;
              const totalOut = p.essentialExpenses + p.monthlyEmi;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedDemoId(p.id)}
                  type="button"
                  className={`relative rounded-3xl p-6 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "glass-cockpit neon-border-emerald bg-white dark:bg-[#07130e]"
                      : "glass-cockpit glass-cockpit-interactive opacity-80 hover:opacity-100"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-sm font-mono font-bold uppercase tracking-wider text-white shadow-sm">
                      ● Active Cockpit
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{p.name}</h3>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {p.role} · {p.city}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="mt-5 border-t border-slate-200/80 dark:border-white/[0.08] pt-3 flex justify-between text-sm font-mono">
                    <span className="text-slate-500">Committed Outflow:</span>
                    <span className="font-bold text-slate-950 dark:text-white">{formatCurrency(totalOut)}/mo</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cockpit Main Display Window */}
          <div className="glass-cockpit rounded-3xl border border-slate-200/90 dark:border-white/[0.1] shadow-2xl overflow-hidden">
            {/* Terminal Status Bar */}
            <div className="border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-slate-950/60 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Profile: {activeDemoProfile.name}
                </span>
              </div>

              {/* Stress Drop Level Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/50 dark:border-white/[0.08]">
                <span className="text-sm font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2">
                  Inject Shock:
                </span>
                <button
                  type="button"
                  onClick={() => setStressLevel(0)}
                  className={`px-3 py-1.5 text-sm font-mono font-bold rounded-lg transition ${
                    stressLevel === 0
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-white"
                  }`}
                >
                  0% Normal
                </button>
                <button
                  type="button"
                  onClick={() => setStressLevel(20)}
                  className={`px-3 py-1.5 text-sm font-mono font-bold rounded-lg transition ${
                    stressLevel === 20
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-white"
                  }`}
                >
                  -20% Drop
                </button>
                <button
                  type="button"
                  onClick={() => setStressLevel(40)}
                  className={`px-3 py-1.5 text-sm font-mono font-bold rounded-lg transition ${
                    stressLevel === 40
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-white"
                  }`}
                >
                  -40% Shock
                </button>
              </div>
            </div>

            {/* Cockpit Core Display */}
            <div className="p-6 sm:p-10 space-y-8">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                {/* Left: Huge Saving Action Metric */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-3.5 py-1 text-sm font-mono font-bold ring-1 ${demoStateStyle.badge}`}>
                      {demoStateStyle.label}
                    </span>
                    <span className="text-sm font-mono text-slate-500">
                      Confidence: <strong className="text-slate-800 dark:text-slate-200">{demoResult.confidence}</strong>
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-mono uppercase font-bold tracking-wider text-slate-500">
                      Recommended Action This Cycle
                    </span>
                    <p className="mt-1 text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-emerald-300">
                      {stressLevel > 0 && demoResult.scenario
                        ? formatCurrency(
                            stressLevel === 40
                              ? Math.max(0, Math.round(demoResult.scenario.recommended_saving * 0.4))
                              : demoResult.scenario.recommended_saving
                          )
                        : formatCurrency(demoResult.recommended_saving)}
                    </p>
                  </div>

                  <p className="text-base leading-relaxed text-slate-750 dark:text-slate-300 max-w-xl">
                    {stressLevel > 0 ? demoScenarioExplanation : demoExplanation}
                  </p>
                </div>

                {/* Right: Runway Buffer Gauge */}
                <div className="rounded-3xl p-6 bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between text-sm font-mono uppercase font-bold tracking-wider">
                    <span className="text-slate-700 dark:text-slate-300">Emergency Buffer Runway</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{demoBufferPercent}% of Target</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ring-1 ring-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-500"
                      style={{ width: `${demoBufferPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm font-mono text-slate-500 dark:text-slate-400">
                    <span>Saved: {formatCurrency(activeDemoProfile.currentSavings)}</span>
                    <span>3-Month Target: {formatCurrency(demoResult.buffer_target)}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-white/[0.06] text-sm font-mono">
                    <span className="text-slate-500">Zero-Income Runway:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-base">{demoResult.runway_months} Months</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 dark:border-white/[0.08] pt-6">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  View full cashflow tables and forecasting charts:
                </span>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition"
                  >
                    <span>Launch Full Cockpit</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/outputs"
                    className="inline-flex items-center gap-2 rounded-xl glass-cockpit px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 active:scale-95 transition"
                  >
                    <span>What-If Stress Lab</span>
                  </Link>
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-2 rounded-xl glass-cockpit px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 active:scale-95 transition"
                  >
                    <span>Predictive Trends</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER: High-Tech FinTech Closing                                      */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#020506] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950 dark:text-white">SAVORA TECHNOLOGIES</span>
            <span>·</span>
            <span>Deterministic Resilience Engine v1.2</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#problem" className="hover:text-emerald-500 transition">The Crisis</a>
            <a href="#auth" className="hover:text-emerald-500 transition">Account</a>
            <a href="#demo" className="hover:text-emerald-500 transition">Live Deck</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
