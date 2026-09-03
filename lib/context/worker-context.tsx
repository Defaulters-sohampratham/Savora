"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { demoProfiles } from "@/lib/finance/demo-profiles";
import {
  calculateFinancialResilience,
  profileToCalculationInput,
} from "@/lib/finance/engine";
import { explainRecommendation, explainScenario } from "@/lib/finance/narrator";
import type {
  CalculationResult,
  FinancialState,
  WorkerProfile,
} from "@/lib/finance/types";
import { getUserAction, signOutAction } from "@/app/auth/actions";

export const stateStyles: Record<
  FinancialState,
  {
    badge: string;
    border: string;
    soft: string;
    label: string;
  }
> = {
  Critical: {
    badge: "bg-rose-100 text-rose-800 ring-rose-200",
    border: "border-rose-300",
    label: "Critical",
    soft: "bg-rose-50 text-rose-900",
  },
  Low: {
    badge: "bg-amber-100 text-amber-800 ring-amber-200",
    border: "border-amber-300",
    label: "Low-income period",
    soft: "bg-amber-50 text-amber-900",
  },
  Normal: {
    badge: "bg-sky-100 text-sky-800 ring-sky-200",
    border: "border-sky-300",
    label: "Normal period",
    soft: "bg-sky-50 text-sky-900",
  },
  High: {
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    border: "border-emerald-300",
    label: "High-income period",
    soft: "bg-emerald-50 text-emerald-900",
  },
  "Buffer Complete": {
    badge: "bg-violet-100 text-violet-800 ring-violet-200",
    border: "border-violet-300",
    label: "Buffer complete",
    soft: "bg-violet-50 text-violet-900",
  },
};

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

export function formatMonth(date: string) {
  return monthFormatter.format(new Date(date));
}

export interface AuthUser {
  id: string;
  email?: string;
  displayName: string;
  role: string;
}

interface WorkerContextValue {
  profiles: WorkerProfile[];
  demoProfiles: WorkerProfile[];
  selectedProfile: WorkerProfile;
  selectedProfileId: string;
  setSelectedProfileId: (id: string) => void;
  result: CalculationResult;
  explanation: string;
  scenarioExplanation: string;
  bufferPercent: number;
  stateStyle: (typeof stateStyles)[FinancialState];
  user: AuthUser | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

export function WorkerProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    demoProfiles[0]?.id ?? ""
  );

  const refreshUser = useCallback(async () => {
    try {
      const res = await getUserAction();
      if (res.authenticated && res.user) {
        setUser(res.user);
        setSelectedProfileId(`user-${res.user.id}`);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getUserAction()
      .then((res) => {
        if (!isMounted) return;
        if (res.authenticated && res.user) {
          setUser(res.user);
          setSelectedProfileId(`user-${res.user.id}`);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await signOutAction();
    setUser(null);
    setSelectedProfileId(demoProfiles[0]?.id ?? "");
  }, []);

  // When authenticated, only the logged-in user's profile exists in the app.
  // When logged out, demoProfiles are provided.
  const profiles = useMemo<WorkerProfile[]>(() => {
    if (!user) {
      return demoProfiles;
    }

    const userProfile: WorkerProfile = {
      id: `user-${user.id}`,
      name: user.displayName,
      role: user.role || "Gig Partner",
      city: "Bengaluru",
      essentialExpenses: 18000,
      monthlyEmi: 3500,
      currentSavings: 14000,
      monthlyIncome: [
        { date: "2026-03-31", amount: 26000 },
        { date: "2026-04-30", amount: 28500 },
        { date: "2026-05-31", amount: 24000 },
        { date: "2026-06-30", amount: 31000 },
        { date: "2026-07-31", amount: 29000 },
        { date: "2026-08-31", amount: 32500 },
      ],
      description: `Active personal profile for ${user.displayName}. Live calculated resilience based on recent earnings.`,
    };

    return [userProfile];
  }, [user]);

  const selectedProfile = useMemo(() => {
    if (user && profiles.length > 0) {
      return profiles[0];
    }
    return (
      profiles.find((profile) => profile.id === selectedProfileId) ??
      profiles[0] ??
      demoProfiles[0]
    );
  }, [user, profiles, selectedProfileId]);

  const result = useMemo(
    () => calculateFinancialResilience(profileToCalculationInput(selectedProfile)),
    [selectedProfile]
  );

  const explanation = useMemo(() => explainRecommendation(result), [result]);
  const scenarioExplanation = useMemo(() => explainScenario(result), [result]);

  const bufferPercent = Math.min(
    100,
    Math.round((selectedProfile.currentSavings / result.buffer_target) * 100)
  );

  const stateStyle = stateStyles[result.state];

  return (
    <WorkerContext.Provider
      value={{
        profiles,
        demoProfiles,
        selectedProfile,
        selectedProfileId,
        setSelectedProfileId,
        result,
        explanation,
        scenarioExplanation,
        bufferPercent,
        stateStyle,
        user,
        isAuthenticated: Boolean(user),
        refreshUser,
        signOut,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
}

export function useWorker() {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("useWorker must be used within a WorkerProvider");
  }
  return context;
}
