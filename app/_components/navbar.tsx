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
  SlidersHorizontal,
  Sparkles,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";
import { useTheme } from "@/lib/context/theme-context";
import { SavoraLogo } from "./savora-logo";

export function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { user, isAuthenticated, signOut } = useWorker();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const appNavItems = [
    { label: "Cockpit", href: "/dashboard", icon: LayoutDashboard },
    { label: "Stress Lab", href: "/outputs", icon: SlidersHorizontal },
    { label: "Predictive Trends", href: "/insights", icon: LineChart },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Setup Baseline", href: "/onboarding", icon: Sparkles },
  ];

  const landingNavItems = [
    { label: "The Crisis", href: "#problem" },
    { label: "Engine Logic", href: "#solution" },
    { label: "Interactive Deck", href: "#demo" },
  ];

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl glass-cockpit px-4 sm:px-6 shadow-2xl transition-all duration-300">
        {/* Brand identity: Neon glow shield + high-tech logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95 focus:outline-none"
            aria-label="Savora Home"
          >
            <SavoraLogo className="transition-transform duration-200 group-hover:scale-[1.035]" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1.5">
          {isLandingPage
            ? landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-all duration-200"
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
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs shadow-emerald-500/10"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
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
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:scale-90 dark:border-white/10 dark:bg-slate-900/80 dark:text-emerald-400 dark:hover:border-emerald-500/40 dark:hover:bg-slate-800 focus:outline-none shadow-xs"
            aria-label="Toggle theme mode"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-3.5 w-3.5 transition-transform rotate-0 scale-100" />
              ) : (
                <Moon className="h-3.5 w-3.5 transition-transform rotate-0 scale-100" />
              )
            ) : (
              <div className="h-3.5 w-3.5" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 pl-1 pr-3 py-1 text-sm font-semibold text-slate-800 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white uppercase dark:bg-emerald-500 shadow-xs">
                  {(user.displayName || "User").charAt(0)}
                </span>
                <span className="max-w-[110px] truncate">{user.displayName || "User"}</span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              >
                Sign Out
              </button>
              {isLandingPage && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all duration-200"
                >
                  <span>Open Cockpit</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          ) : isLandingPage ? (
            <div className="flex items-center gap-2">
              <a
                href="#auth"
                className="rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition"
              >
                Sign In
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-200"
              >
                <Zap className="h-3 w-3 fill-current" />
                <span>Launch App</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine
              </span>
              <Link
                href="/#auth"
                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-emerald-400"
            aria-label="Toggle theme mode"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />
            ) : (
              <div className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-2xl glass-cockpit p-4 md:hidden shadow-2xl space-y-3">
          <nav className="flex flex-col space-y-1">
            {isLandingPage
              ? landingNavItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition"
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
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

            <div className="border-t border-slate-200/60 dark:border-white/10 pt-3">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white uppercase dark:bg-emerald-500">
                      {(user.displayName || "User").charAt(0)}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.displayName || "User"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-md dark:bg-emerald-500"
                >
                  Launch Live App
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
