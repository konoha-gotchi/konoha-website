import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { analyzePlant } from "@/app/lib/konoha/analysis";
import { fetchDashboardDataFromSupabase } from "@/app/lib/konoha/data";
import { getSupabaseAdmin } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface GeminiReport {
  plant_message: string;
  status_level: string;
  summary: string;
  analysis: Record<string, unknown>;
  prediction: Record<string, unknown>;
}

function fallbackReport(
  ruleAnalysis: ReturnType<typeof analyzePlant>,
  provider: "rule_fallback" | "gemini_parse_fallback",
): GeminiReport {
  return {
    plant_message: ruleAnalysis.plantMessage,
    status_level: ruleAnalysis.statusLevel,
    summary: ruleAnalysis.summary,
    analysis: {
      ...ruleAnalysis.analysis,
      provider,
    },
    prediction: ruleAnalysis.prediction,
  };
}

function parseGeminiJson(text: string): GeminiReport | null {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(cleaned) as Partial<GeminiReport>;
    if (!parsed.plant_message || !parsed.status_level || !parsed.summary) {
      return null;
    }

    return {
      plant_message: String(parsed.plant_message),
      status_level: String(parsed.status_level),
      summary: String(parsed.summary),
      analysis: typeof parsed.analysis === "object" && parsed.analysis ? parsed.analysis : {},
      prediction: typeof parsed.prediction === "object" && parsed.prediction ? parsed.prediction : {},
    };
  } catch {
    return null;
  }
}

async function generateGeminiReport(ruleAnalysis: ReturnType<typeof analyzePlant>) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackReport(ruleAnalysis, "rule_fallback");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = [
    "You are Kono-Chan, a friendly plant in a class smart-planter prototype.",
    "Use the rule-based sensor summary below. Do not invent exact sensor values.",
    "Return only compact JSON with these keys: plant_message, status_level, summary, analysis, prediction.",
    "Keep plant_message to one or two natural sentences.",
    JSON.stringify(
      {
        status_level: ruleAnalysis.statusLevel,
        summary: ruleAnalysis.summary,
        analysis: ruleAnalysis.analysis,
        prediction: ruleAnalysis.prediction,
      },
      null,
      2,
    ),
  ].join("\n\n");

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 500,
      temperature: 0.6,
    },
  });

  return parseGeminiJson(response.text ?? "") ?? fallbackReport(ruleAnalysis, "gemini_parse_fallback");
}

export async function POST() {
  try {
    const windowMinutes = 360;
    const dashboardData = await fetchDashboardDataFromSupabase(windowMinutes);

    if (!dashboardData.latestReading) {
      return NextResponse.json({ error: "No sensor readings found yet." }, { status: 409 });
    }

    const ruleAnalysis = analyzePlant(dashboardData.latestReading, dashboardData.readings);
    const generated = await generateGeminiReport(ruleAnalysis);
    const supabase = getSupabaseAdmin();

    const insertPayload = {
      report_type: "plant_status",
      plant_message: generated.plant_message,
      status_level: generated.status_level,
      summary: generated.summary,
      analysis_json: {
        ...generated.analysis,
        rule_analysis: ruleAnalysis.analysis,
      },
      prediction_json: generated.prediction,
      input_window_minutes: windowMinutes,
    };

    const { data, error } = await supabase
      .from("plant_ai_reports")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ report: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate plant report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
