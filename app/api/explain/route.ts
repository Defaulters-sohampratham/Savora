import { NextResponse } from "next/server";
import { generatePureLLMFallback } from "@/lib/finance/narrator";
import type { CalculationResult, LLMExplanationResult, WorkerProfile } from "@/lib/finance/types";

export const runtime = "nodejs";

interface ExplainRequestBody {
  result: CalculationResult;
  profile?: Partial<WorkerProfile>;
  simulatedDrop?: boolean;
}

const SYSTEM_PROMPT = `You are Savora's Financial Resilience Explainer for gig and informal workers with irregular incomes.
The calculation engine has already performed 100% of all financial calculations deterministically.

HARD RULES:
1. ONLY explain the pre-calculated numbers provided in the JSON contract.
2. NEVER recalculate, invent, or hallucinate any numbers or percentages. Every rupee amount or month figure you mention MUST exactly match the input data.
3. Write in empathetic, respectful, and plain language suitable for a gig worker (e.g. delivery partner, cab driver, freelance technician). Complete every sentence; do not use fragments or informal sign-offs.
4. Output ONLY valid JSON with no preamble or markdown code fences, following this exact schema:
{
  "recommendation_explanation": "2-3 plain sentences explaining why this saving amount is recommended and how much flexible cash remains after essentials.",
  "why_panel_explanation": "A friendly summary explaining the decision factors behind this cycle's plan.",
  "scenario_explanation": "2 sentences contrasting the current plan against the 20% income drop stress test."
}`;

async function callGemini(
  apiKey: string,
  prompt: string
): Promise<{ recommendation_explanation: string; why_panel_explanation: string; scenario_explanation: string } | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nINPUT JSON CONTRACT:\n${prompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 350,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.warn(`[Savora LLM] Gemini API error (${response.status}):`, errText);
    return null;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn("[Savora LLM] Failed to parse Gemini response as JSON:", err);
    return null;
  }
}

async function callOpenAI(
  apiKey: string,
  prompt: string
): Promise<{ recommendation_explanation: string; why_panel_explanation: string; scenario_explanation: string } | null> {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 350,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `INPUT JSON CONTRACT:\n${prompt}` },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: ExplainRequestBody = await request.json();
    const { result, profile, simulatedDrop } = body;

    if (!result || typeof result.latest_income !== "number") {
      return NextResponse.json(
        { error: "Invalid calculation result payload." },
        { status: 400 }
      );
    }

    const workerName = profile?.name || "Worker";
    const workerRole = profile?.role || "Gig Partner";
    const fallback = generatePureLLMFallback(result);

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openaiKey) {
      const output: LLMExplanationResult = {
        ...fallback,
        is_live_llm: false,
        provider: "Deterministic Financial Engine (No LLM API Key)",
      };
      return NextResponse.json(output);
    }

    const promptPayload = {
      worker: {
        name: workerName,
        role: workerRole,
        city: profile?.city || "Bengaluru",
      },
      json_contract: {
        state: result.state,
        latest_income: result.latest_income,
        average_income: result.average_income,
        essential_total: result.essential_total,
        surplus: result.surplus,
        recommended_saving: result.recommended_saving,
        remaining_cash: result.remaining_cash,
        buffer_target: result.buffer_target,
        runway_months: result.runway_months,
        forecast: result.forecast,
        shortfall: result.shortfall,
        confidence: result.confidence,
        factors: result.factors,
        scenario: result.scenario,
      },
      simulated_drop_active: Boolean(simulatedDrop),
    };

    const promptString = JSON.stringify(promptPayload, null, 2);

    let llmResponse: {
      recommendation_explanation: string;
      why_panel_explanation: string;
      scenario_explanation: string;
    } | null = null;
    let providerName = "";

    if (geminiKey) {
      llmResponse = await callGemini(geminiKey, promptString);
      providerName = "Google Gemini 2.5 Flash";
    }

    if (!llmResponse && openaiKey) {
      llmResponse = await callOpenAI(openaiKey, promptString);
      providerName = "OpenAI GPT-4o-mini";
    }

    if (llmResponse && llmResponse.recommendation_explanation) {
      const output: LLMExplanationResult = {
        recommendation_explanation: llmResponse.recommendation_explanation,
        why_panel_explanation:
          llmResponse.why_panel_explanation || fallback.why_panel_explanation,
        scenario_explanation:
          llmResponse.scenario_explanation || fallback.scenario_explanation,
        is_live_llm: true,
        provider: providerName,
      };
      return NextResponse.json(output);
    }

    const output: LLMExplanationResult = {
      ...fallback,
      is_live_llm: false,
      provider: "Deterministic Engine Fallback (API Offline or Busy)",
    };
    return NextResponse.json(output);
  } catch (err: unknown) {
    console.error("[Savora API /api/explain] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate explanation." },
      { status: 500 }
    );
  }
}
