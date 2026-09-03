"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";
import { useTheme } from "@/lib/context/theme-context";

export function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { user, isAuthenticated, signOut } = useWorker();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean internal workspace navigation tabs
  const appNavItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Stress Simulator", href: "/outputs", icon: SlidersHorizontal },
    { label: "Insights & Forecasts", href: "/insights", icon: LineChart },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Setup Inputs", href: "/onboarding", icon: Sparkles },
  ];

  // Relaxed landing page navigation anchors
  const landingNavItems = [
    { label: "The Problem", href: "#problem" },
    { label: "How it Works", href: "#solution" },
    { label: "Live Simulator", href: "#demo" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0b0f12]/85 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity: Refined icon with ambient glow */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-[0.98] focus:outline-none"
            aria-label="Savora Home"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-600/30 dark:bg-emerald-500 dark:shadow-emerald-500/20">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white font-sans">
              Savora<span className="text-emerald-600 dark:text-emerald-400">.</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {isLandingPage
            ? landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.05] transition-all duration-150"
                >
                  {item.label}
                </a>
              ))
            : appNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30"
                        : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                );
              })}
        </nav>

        {/* Right CTA, User State & Theme Toggle */}
        <div className="hidden sm:flex sm:items-center sm:gap-2.5">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-emerald-400 dark:hover:border-emerald-800/60 dark:hover:bg-slate-800 focus:outline-none shadow-2xs"
            aria-label="Toggle theme mode"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4 transition-transform rotate-0 scale-100" />
              ) : (
                <Moon className="h-4 w-4 transition-transform rotate-0 scale-100" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 pl-1 pr-3.5 py-1 text-xs font-semibold text-slate-800 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-200 shadow-2xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white uppercase dark:bg-emerald-500 shadow-xs">
                  {(user.displayName || "User").charAt(0)}
                </span>
                <span className="max-w-[130px] truncate">{user.displayName || "User"}</span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              >
                Sign Out
              </button>
              {isLandingPage && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 transition"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ) : isLandingPage ? (
            <div className="flex items-center gap-2">
              <a
                href="#auth"
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition"
              >
                Sign In
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/15 hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 transition"
              >
                <span>Open App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                Demo Mode
              </span>
              <Link
                href="/#auth"
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls: Theme toggle + Hamburger button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-emerald-400 focus:outline-none"
            aria-label="Toggle theme mode"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 md:hidden shadow-lg space-y-3 dark:border-white/[0.07] dark:bg-[#0b0f12]/95">
          <nav className="flex flex-col space-y-1">
            {isLandingPage
              ? landingNavItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition"
                  >
                    {item.label}
                  </a>
                ))
              : appNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-emerald-500/10 font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white uppercase dark:bg-emerald-500">
                      {(user.displayName || "User").charAt(0)}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.displayName || "User"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : isLandingPage ? (
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="#auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
                  >
                    Sign In
                  </a>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white dark:bg-emerald-500"
                  >
                    Open Full App
                  </Link>
                </div>
              ) : (
                <Link
                  href="/#auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white dark:bg-emerald-500"
                >
                  Sign In to Cloud Account
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
