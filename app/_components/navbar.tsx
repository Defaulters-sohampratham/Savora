"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  LayoutDashboard,
  LineChart,
  Menu,
  ShieldCheck,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";

export function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { user, isAuthenticated, signOut } = useWorker();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean internal workspace navigation tabs
  const appNavItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Stress Simulator", href: "/outputs", icon: SlidersHorizontal },
    { label: "Insights & Forecasts", href: "/insights", icon: LineChart },
    { label: "Profile", href: "/profile", icon: User },
  ];

  // Relaxed landing page navigation anchors
  const landingNavItems = [
    { label: "The Problem", href: "#problem" },
    { label: "How it Works", href: "#solution" },
    { label: "Live Simulator", href: "#demo" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity: Clean, calm, uncluttered logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition focus:outline-none"
            aria-label="Savora Home"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-950 font-sans">
              Savora<span className="text-teal-600">.</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation: Relaxed text links with spacious padding */}
        <nav className="hidden md:flex md:items-center md:gap-1.5">
          {isLandingPage
            ? landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
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
                        ? "bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-200/70"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-teal-700" : "text-slate-400"}`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                );
              })}
        </nav>

        {/* Right CTA / User State */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 pl-1 pr-3.5 py-1 text-xs font-semibold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white uppercase">
                  {user.displayName.charAt(0) || "U"}
                </span>
                <span className="max-w-[130px] truncate">{user.displayName}</span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                Sign Out
              </button>
              {isLandingPage && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
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
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-950 transition"
              >
                Sign In
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
              >
                <span>Open App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                Demo Mode
              </span>
              <Link
                href="/#auth"
                className="rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
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
        <div className="border-t border-slate-200/80 bg-white px-4 py-4 md:hidden shadow-lg space-y-3">
          {isLandingPage ? (
            <div className="flex flex-col space-y-1">
              {landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-900">
                      <User className="h-4 w-4 text-teal-700" />
                      <span>{user.displayName}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl bg-teal-700 py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-800"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="#auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Sign In / Register
                    </a>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl bg-teal-700 py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-800"
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
                        ? "bg-teal-50 text-teal-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-teal-700" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-slate-100 pt-3">
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white uppercase">
                        {user.displayName.charAt(0) || "U"}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{user.displayName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs font-medium text-rose-600 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-800 font-medium">Demo Mode</span>
                    <Link
                      href="/#auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
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
