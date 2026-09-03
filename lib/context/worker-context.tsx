"use client";

import {
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
import {
  explainRecommendation,
  explainScenario,
  generatePureLLMFallback,
} from "@/lib/finance/narrator";
import type {
  AuthUser,
  CalculationResult,
  FinancialState,
  LLMExplanationResult,
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
    badge: "bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800",
    border: "border-rose-300 dark:border-rose-800",
    label: "Critical",
    soft: "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
  },
  Low: {
    badge: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800",
    border: "border-amber-300 dark:border-amber-800",
    label: "Low-income period",
    soft: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  },
  Normal: {
    badge: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800",
    border: "border-sky-300 dark:border-sky-800",
    label: "Normal period",
    soft: "bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  },
  High: {
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800",
    border: "border-emerald-300 dark:border-emerald-800",
    label: "High-income period",
    soft: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  },
  "Buffer Complete": {
    badge: "bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-800",
    border: "border-violet-300 dark:border-violet-800",
    label: "Buffer complete",
    soft: "bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-200",
  },
};

export function formatMonth(dateStr: string) {
  const [year, month] = dateStr.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${monthNames[Number(month) - 1]} ${year}`;
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
  hasCompletedOnboarding: boolean;
  updateUserProfile: (data: Partial<WorkerProfile>) => void;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
  llmExplanation: LLMExplanationResult;
  isGeneratingExplanation: boolean;
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

export function WorkerProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    demoProfiles[0]?.id ?? ""
  );
  const [customUserProfile, setCustomUserProfile] = useState<Partial<WorkerProfile> | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load custom user profile from localStorage whenever user changes
  useEffect(() => {
    if (!user) {
      setCustomUserProfile(null);
      setHasCompletedOnboarding(false);
      return;
    }

    try {
      const savedData = localStorage.getItem(`savora_user_profile_${user.id}`);
      const onboarded = localStorage.getItem(`savora_onboarded_${user.id}`) === "true";
      if (savedData) {
        setCustomUserProfile(JSON.parse(savedData));
      }
      setHasCompletedOnboarding(onboarded);
    } catch (_) {}
  }, [user]);

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
    setCustomUserProfile(null);
    setHasCompletedOnboarding(false);
    setSelectedProfileId(demoProfiles[0]?.id ?? "");
  }, []);

  const updateUserProfile = useCallback(
    (data: Partial<WorkerProfile>) => {
      setCustomUserProfile((prev) => {
        const updated = { ...(prev || {}), ...data };
        if (user) {
          try {
            localStorage.setItem(`savora_user_profile_${user.id}`, JSON.stringify(updated));
            localStorage.setItem(`savora_onboarded_${user.id}`, "true");
          } catch (_) {}
        }
        return updated;
      });
      setHasCompletedOnboarding(true);
    },
    [user]
  );

  // When authenticated, only the logged-in user's profile exists in the app.
  // When logged out, demoProfiles are provided.
  const profiles = useMemo<WorkerProfile[]>(() => {
    if (!user) {
      return demoProfiles;
    }

    const defaultProfile: WorkerProfile = {
      id: `user-${user.id}`,
      name: user.displayName || "Worker",
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
      description: `Active personal profile for ${user.displayName || "Worker"}. Live calculated resilience based on recent earnings.`,
    };

    const merged: WorkerProfile = {
      ...defaultProfile,
      ...(customUserProfile || {}),
      id: `user-${user.id}`,
      name: customUserProfile?.name || user.displayName || defaultProfile.name,
      role: customUserProfile?.role || user.role || defaultProfile.role,
      city: customUserProfile?.city || defaultProfile.city,
      essentialExpenses: customUserProfile?.essentialExpenses ?? defaultProfile.essentialExpenses,
      monthlyEmi: customUserProfile?.monthlyEmi ?? defaultProfile.monthlyEmi,
      currentSavings: customUserProfile?.currentSavings ?? defaultProfile.currentSavings,
      monthlyIncome: customUserProfile?.monthlyIncome ?? defaultProfile.monthlyIncome,
      description:
        customUserProfile?.description ||
        `Verified worker profile for ${user.displayName || "Worker"}. Tailored cashflow and resilience calculations.`,
    };

    return [merged];
  }, [user, customUserProfile]);

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

  const bufferPercent = useMemo(() => {
    if (result.buffer_target <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((selectedProfile.currentSavings / result.buffer_target) * 100));
  }, [result.buffer_target, selectedProfile.currentSavings]);

  const stateStyle = stateStyles[result.state];

  const fallbackExplanation = useMemo(
    () => generatePureLLMFallback(result),
    [result]
  );

  const [llmExplanation, setLlmExplanation] =
    useState<LLMExplanationResult>(fallbackExplanation);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  useEffect(() => {
    setLlmExplanation(fallbackExplanation);
  }, [fallbackExplanation]);

  useEffect(() => {
    let isCurrent = true;
    setIsGeneratingExplanation(true);

    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result,
        profile: {
          name: selectedProfile.name,
          role: selectedProfile.role,
          city: selectedProfile.city,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: LLMExplanationResult) => {
        if (isCurrent && data?.recommendation_explanation) {
          setLlmExplanation(data);
        }
      })
      .catch(() => {
        // Fallback is already present
      })
      .finally(() => {
        if (isCurrent) {
          setIsGeneratingExplanation(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [result, selectedProfile]);

  const value = useMemo(
    () => ({
      profiles,
      demoProfiles,
      selectedProfile,
      selectedProfileId,
      setSelectedProfileId,
      result,
      explanation:
        llmExplanation.recommendation_explanation ||
        fallbackExplanation.recommendation_explanation,
      scenarioExplanation:
        llmExplanation.scenario_explanation ||
        fallbackExplanation.scenario_explanation,
      bufferPercent,
      stateStyle,
      user,
      isAuthenticated: Boolean(user),
      hasCompletedOnboarding,
      updateUserProfile,
      refreshUser,
      signOut,
      llmExplanation,
      isGeneratingExplanation,
    }),
    [
      profiles,
      demoProfiles,
      selectedProfile,
      selectedProfileId,
      result,
      llmExplanation,
      fallbackExplanation,
      bufferPercent,
      stateStyle,
      user,
      hasCompletedOnboarding,
      updateUserProfile,
      refreshUser,
      signOut,
      isGeneratingExplanation,
    ]
  );

  return (
    <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
  );
}

export function useWorker() {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("useWorker must be used within a WorkerProvider");
  }
  return context;
}
