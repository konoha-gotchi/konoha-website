export interface PlantReading {
  id: string;
  created_at: string;
  device_id: string;
  source: string;
  soil_moisture_raw: number | null;
  soil_moisture_percent: number | null;
  temperature_c: number | null;
  humidity_percent: number | null;
  light_lux: number | null;
  pressure_hpa: number | null;
  noise_db: number | null;
  e_tvoc_ppb: number | null;
  sensor_status: string;
  raw_payload: Record<string, unknown> | null;
}

export interface PlantAiReport {
  id: string;
  created_at: string;
  report_type: string;
  plant_message: string;
  status_level: string;
  summary: string;
  analysis_json: Record<string, unknown>;
  prediction_json: Record<string, unknown>;
  input_window_minutes: number;
}

export interface DashboardData {
  latestReading: PlantReading | null;
  readings: PlantReading[];
  latestReport: PlantAiReport | null;
  usingMockData: boolean;
  dataError?: string;
}
