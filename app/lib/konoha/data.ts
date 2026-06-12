import { getSupabaseAdmin } from "../supabase/server";
import { getMockDashboardData } from "./mock";
import type { DashboardData, PlantAiReport, PlantReading } from "./types";

export const READING_COLUMNS =
  "id,created_at,device_id,source,soil_moisture_raw,soil_moisture_percent,temperature_c,humidity_percent,light_lux,pressure_hpa,noise_db,e_tvoc_ppb,sensor_status,raw_payload";

export const REPORT_COLUMNS =
  "id,created_at,report_type,plant_message,status_level,summary,analysis_json,prediction_json,input_window_minutes";

export async function fetchDashboardDataFromSupabase(windowMinutes = 360): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - windowMinutes * 60000).toISOString();

  const [latestResult, historyResult, reportResult] = await Promise.all([
    supabase
      .from("plant_readings")
      .select(READING_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("plant_readings")
      .select(READING_COLUMNS)
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(200),
    supabase
      .from("plant_ai_reports")
      .select(REPORT_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (latestResult.error) {
    throw latestResult.error;
  }
  if (historyResult.error) {
    throw historyResult.error;
  }
  if (reportResult.error) {
    throw reportResult.error;
  }

  return {
    latestReading: (latestResult.data as PlantReading | null) ?? null,
    readings: (historyResult.data as PlantReading[] | null) ?? [],
    latestReport: (reportResult.data as PlantAiReport | null) ?? null,
    usingMockData: false,
  };
}

export async function getDashboardData(windowMinutes = 360): Promise<DashboardData> {
  try {
    const data = await fetchDashboardDataFromSupabase(windowMinutes);
    if (!data.latestReading || data.readings.length === 0) {
      return getMockDashboardData("No Supabase readings found yet.");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read Supabase data.";
    return getMockDashboardData(message);
  }
}

export function toChartData(
  readings: PlantReading[],
  key: keyof Pick<
    PlantReading,
    "soil_moisture_percent" | "temperature_c" | "humidity_percent" | "light_lux"
  >,
) {
  return readings
    .filter((reading) => typeof reading[key] === "number")
    .map((reading) => ({
      x: new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(reading.created_at)),
      y: Number(reading[key]),
    }));
}
