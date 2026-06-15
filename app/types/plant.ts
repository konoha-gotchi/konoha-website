export type PlantStatus =
    | "Good"
    | "Needs water"
    | "Too dark"
    | "Too hot"
    | "Too dry"
    | "Sensor error";

export type SensorStatus = "ok" | "warning" | "error" | "offline";

export type SensorMetricLevel = "Low" | "Normal" | "Good";

export type SensorMetricKey =
    | "soil_moisture"
    | "light"
    | "temperature"
    | "humidity";

export interface SensorReading {
    device_id: string;
    timestamp: string;
    soil_moisture_raw: number;
    soil_moisture_percent: number;
    temperature_c: number;
    humidity_percent: number;
    light_lux: number;
    sensor_status: SensorStatus;
    battery_or_power_status?: string;
    notes?: string;
}

export interface PlantProfileFact {
    label: string;
    value: string;
}

export interface PlantProfile {
    name: string;
    species: string;
    description: string;
    imagePath: string;
    facts: PlantProfileFact[];
}

export interface PlantTag {
    label: string;
    value: string;
    iconPath: string;
}

export interface AiReport {
    plant_message: string;
    condition_summary: string;
    near_future_prediction: string;
    generated_at: string;
}

export interface SensorHistoryPoint {
    x: string;
    y: number;
}

export interface SensorMetricSummary {
    key: SensorMetricKey;
    label: string;
    value: number;
    unit: string;
    level: SensorMetricLevel;
    change_percent_from_previous: number;
    iconPath: string;
    accentColor: string;
    chartTitle: string;
    chartDescription: string;
    yAxisLabel: string;
    chartDomain: [number, number];
    strokeColor: string;
    fillColor: string;
    history: SensorHistoryPoint[];
}

export interface CareAdvice {
    title: string;
    body: string;
    actionLabel: string;
    imagePath: string;
}

export interface ActivityItem {
    title: string;
    description?: string;
    timestampLabel: string;
    iconPath?: string;
    iconBackgroundColor?: string;
}

export interface DashboardMood {
    emoji: string;
    label: string;
    description: string;
}

export interface DashboardData {
    plant: PlantProfile;
    plantTags: PlantTag[];
    plant_status: PlantStatus;
    plant_hp_percent: number;
    latest_reading: SensorReading;
    ai_report: AiReport;
    last_updated_label: string;
    mood: DashboardMood;
    sensorMetrics: SensorMetricSummary[];
    recentActivity: ActivityItem[];
    careAdvice: CareAdvice;
}

export interface OptimalCondition {
    key: SensorMetricKey;
    title: string;
    iconPath: string;
    range: string;
    label: string;
    themeClass: string;
}

export interface CareGuideline {
    title: string;
    body: string;
}

export interface PlantInfoData {
    plant: PlantProfile;
    optimalConditions: OptimalCondition[];
    careGuidelines: CareGuideline[];
}

export interface WeeklyStat {
    key: "soil_moisture" | "light_exposure" | "growth";
    label: string;
    value: string;
    themeClass: string;
}

export interface TimelineData {
    healthHistory: SensorHistoryPoint[];
    weeklyStats: WeeklyStat[];
    eventLogs: ActivityItem[];
}
