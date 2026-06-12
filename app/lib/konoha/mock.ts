import type { DashboardData, PlantAiReport, PlantReading } from "./types";

const now = Date.now();

export const mockReadings: PlantReading[] = Array.from({ length: 8 }, (_, index) => {
  const minutesAgo = (7 - index) * 45;
  const soil = 48 - index * 1.8;
  return {
    id: `mock-reading-${index}`,
    created_at: new Date(now - minutesAgo * 60000).toISOString(),
    device_id: "konoha-mock-01",
    source: "mock_dashboard",
    soil_moisture_raw: Math.round(3000 - soil * 18),
    soil_moisture_percent: Math.round(soil * 10) / 10,
    temperature_c: Math.round((23.5 + Math.sin(index / 2) * 1.4) * 10) / 10,
    humidity_percent: Math.round((54 + Math.cos(index / 2) * 5) * 10) / 10,
    light_lux: Math.max(80, Math.round(180 + index * 75)),
    pressure_hpa: null,
    noise_db: null,
    e_tvoc_ppb: null,
    sensor_status: "mock",
    raw_payload: { mock: true },
  };
});

export const mockReport: PlantAiReport = {
  id: "mock-report-01",
  created_at: new Date(now - 12 * 60000).toISOString(),
  report_type: "plant_status",
  plant_message:
    "I feel mostly fine today, but my soil is slowly getting drier. Please check me again later.",
  status_level: "watch",
  summary: "Soil moisture is moderate but decreasing.",
  analysis_json: {
    soil: "watch",
    temperature: "comfortable",
    humidity: "normal",
    light: "good",
  },
  prediction_json: {
    risk: "soil may become dry within several hours if the current trend continues",
    confidence: "low_to_medium",
  },
  input_window_minutes: 360,
};

export function getMockDashboardData(dataError?: string): DashboardData {
  return {
    latestReading: mockReadings[mockReadings.length - 1],
    readings: mockReadings,
    latestReport: mockReport,
    usingMockData: true,
    dataError,
  };
}
