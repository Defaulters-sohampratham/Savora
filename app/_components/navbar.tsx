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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0b0f12]/90 transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity: Clean, calm, uncluttered logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition focus:outline-none"
            aria-label="Savora Home"
          >
            <SavoraLogo className="transition-transform duration-200 group-hover:scale-[1.035]" />
          </Link>
        </div>

        {/* Desktop Navigation: Relaxed text links with spacious padding */}
        <nav className="hidden md:flex md:items-center md:gap-1.5">
          {isLandingPage
            ? landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-650 hover:text-slate-950 dark:text-slate-350 dark:hover:text-white dark:hover:bg-slate-900/60 transition-colors"
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
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50"
                        : "text-slate-650 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-350 dark:hover:bg-slate-900/60 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? "text-teal-700 dark:text-emerald-400"
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
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-emerald-400 dark:hover:border-emerald-800/60 dark:hover:bg-slate-800 focus:outline-none"
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
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 pl-1 pr-3.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white uppercase dark:bg-emerald-600">
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
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
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-650 hover:text-slate-950 dark:text-slate-350 dark:hover:text-white transition"
              >
                Sign In
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
              >
                <span>Open App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                Demo Mode
              </span>
              <Link
                href="/#auth"
                className="rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls: Theme toggle + Hamburger button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-emerald-400 focus:outline-none"
            aria-label="Toggle theme mode"
          >
            {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 bg-white px-4 py-4 md:hidden shadow-lg space-y-3 dark:border-slate-800 dark:bg-[#0a100d]">
          {isLandingPage ? (
            <div className="flex flex-col space-y-1">
              {landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <User className="h-4 w-4 text-teal-700 dark:text-emerald-400" />
                      <span>{user.displayName}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl bg-teal-700 py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="#auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Sign In / Register
                    </a>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl bg-teal-700 py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                      Launch Demo
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              {appNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-teal-50 text-teal-900 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-teal-700 dark:text-emerald-400" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white uppercase dark:bg-emerald-600">
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
                      className="text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">Demo Mode</span>
                    <Link
                      href="/#auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-semibold text-teal-700 hover:underline dark:text-emerald-400"
                    >
                      Sign In to Save
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
