"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { useWorker } from "@/lib/context/worker-context";

export function Navbar() {
  const pathname = usePathname();
  const { profiles, selectedProfileId, setSelectedProfileId, selectedProfile } =
    useWorker();

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "User Details",
      href: "/profile",
      icon: User,
    },
    {
      label: "Outputs & Simulator",
      href: "/outputs",
      icon: SlidersHorizontal,
    },
    {
      label: "Insights & Trends",
      href: "/insights",
      icon: LineChart,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo placeholder - replace with <Image src="/logo.png" ... /> when ready */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm ring-2 ring-teal-50 transition group-hover:bg-teal-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-950">
                  Savora
                </span>
                <span className="hidden rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 sm:inline-block">
                  Resilience
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Gig Financial Resilience Engine
              </p>
            </div>
          </Link>

          {/* Mobile Profile Switcher Pill */}
          <div className="sm:hidden">
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800"
              aria-label="Select worker profile"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? "bg-teal-50 text-teal-900 ring-1 ring-teal-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-teal-700" : "text-slate-450"}`}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Worker Switcher & Demo Badge (Desktop) */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          {/* Active Worker Selector */}
          <div className="relative">
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-850 shadow-sm transition hover:border-slate-300 focus:outline-none"
              aria-label="Select active worker persona"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.role}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-650">
            <CalendarCheck className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
            <span>Aug 2026</span>
          </div>
        </div>
      </div>
    </header>
  );
}
