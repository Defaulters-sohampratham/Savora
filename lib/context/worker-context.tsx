"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
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

interface WorkerContextValue {
  profiles: WorkerProfile[];
  selectedProfile: WorkerProfile;
  selectedProfileId: string;
  setSelectedProfileId: (id: string) => void;
  result: CalculationResult;
  explanation: string;
  scenarioExplanation: string;
  bufferPercent: number;
  stateStyle: (typeof stateStyles)[FinancialState];
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

export function WorkerProvider({ children }: { children: React.ReactNode }) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    demoProfiles[0]?.id ?? "",
  );

  const selectedProfile = useMemo(
    () =>
      demoProfiles.find((profile) => profile.id === selectedProfileId) ??
      demoProfiles[0],
    [selectedProfileId],
  );

  const result = useMemo(
    () =>
      calculateFinancialResilience(profileToCalculationInput(selectedProfile)),
    [selectedProfile],
  );

  const explanation = useMemo(() => explainRecommendation(result), [result]);
  const scenarioExplanation = useMemo(() => explainScenario(result), [result]);

  const bufferPercent = Math.min(
    100,
    Math.round((selectedProfile.currentSavings / result.buffer_target) * 100),
  );

  const stateStyle = stateStyles[result.state];

  return (
    <WorkerContext.Provider
      value={{
        profiles: demoProfiles,
        selectedProfile,
        selectedProfileId,
        setSelectedProfileId,
        result,
        explanation,
        scenarioExplanation,
        bufferPercent,
        stateStyle,
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
