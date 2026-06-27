import "server-only";

import type {
    ActivityItem,
    AiReport,
    CareAdvice,
    CareGuideline,
    DashboardData,
    DashboardMood,
    OptimalCondition,
    PlantInfoData,
    PlantProfile,
    PlantStatus,
    PlantTag,
    SensorHistoryPoint,
    SensorMetricKey,
    SensorMetricLevel,
    SensorMetricSummary,
    SensorReading,
    TimelineData,
    WeeklyStat,
} from "../types/plant";
import {
    getDefaultDeviceId,
    getSupabaseServerClient,
} from "../lib/supabase/server";

type SupabaseErrorLike = {
    code?: string;
};

type SupabaseResult<T> = {
    data: T | null;
    error: SupabaseErrorLike | null;
};

interface DeviceRow {
    plant_id: string;
    device_id: string;
    is_active: boolean;
}

interface PlantRow {
    id: string;
    name: string;
    species: string;
    description: string;
    image_path: string;
}

interface PlantFactRow {
    label: string;
    value: string;
}

interface PlantTagRow {
    label: string;
    value: string;
    icon_path: string;
}

interface SensorReadingRow {
    id: number;
    plant_id: string;
    device_id: string;
    timestamp: string;
    soil_moisture_raw: number;
    soil_moisture_percent: number | string;
    temperature_c: number | string;
    humidity_percent: number | string;
    light_lux: number | string;
    sensor_status: SensorReading["sensor_status"];
    battery_or_power_status: string | null;
    notes: string | null;
}

interface HealthSnapshotRow {
    plant_status: PlantStatus;
    plant_hp_percent: number;
    mood_emoji: string;
    mood_label: string;
    mood_description: string;
    generated_at: string;
}

interface MetricThresholdRow {
    metric_key: SensorMetricKey;
    display_title: string;
    unit: string;
    optimal_min: number | string;
    optimal_max: number | string;
    display_range: string;
}

interface CareGuidelineRow {
    title: string;
    body: string;
}

interface CareAdviceRow {
    title: string;
    body: string;
    action_label: string | null;
    image_path: string | null;
}

interface AiReportRow {
    plant_message: string;
    condition_summary: string;
    near_future_prediction: string;
    generated_at: string;
}

interface ActivityEventRow {
    title: string;
    description: string | null;
    icon_path: string | null;
    icon_background_color: string | null;
    occurred_at: string;
}

interface CoreDashboardDataset {
    plant: PlantRow;
    facts: PlantFactRow[];
    tags: PlantTagRow[];
    readings: SensorReadingRow[];
    healthSnapshots: HealthSnapshotRow[];
    thresholds: MetricThresholdRow[];
    careGuidelines: CareGuidelineRow[];
    activityEvents: ActivityEventRow[];
}

interface DashboardDataset extends CoreDashboardDataset {
    careAdvice: CareAdviceRow;
    aiReport: AiReportRow;
}

interface ActiveDeviceDataset {
    supabase: ReturnType<typeof getSupabaseServerClient>;
    device: DeviceRow;
    plantId: string;
}

interface CoreDashboardContext extends ActiveDeviceDataset {
    data: CoreDashboardDataset;
}

interface SensorMetricsDataset {
    readings: SensorReadingRow[];
    thresholds: MetricThresholdRow[];
}

interface PlantInfoDataset {
    plant: PlantRow;
    facts: PlantFactRow[];
    thresholds: MetricThresholdRow[];
    careGuidelines: CareGuidelineRow[];
}

const metricPresentation: Record<
    SensorMetricKey,
    {
        iconPath: string;
        accentColor: string;
        chartTitle: string;
        chartDescription: string;
        yAxisLabel: string;
        chartDomain: [number, number];
        strokeColor: string;
        fillColor: string;
        themeClass: string;
        infoLabel: string;
    }
> = {
    soil_moisture: {
        iconPath: "/icon/water-droplet.png",
        accentColor: "#8eb5f5",
        chartTitle: "Soil Moisture History",
        chartDescription: "recent readings",
        yAxisLabel: "Moisture (%)",
        chartDomain: [0, 100],
        strokeColor: "#8eb5f5",
        fillColor: "#8eb5f5",
        themeClass: "moistureCard",
        infoLabel: "Ideal Range",
    },
    light: {
        iconPath: "/icon/sun.png",
        accentColor: "#f5e38e",
        chartTitle: "Light Level History",
        chartDescription: "recent readings",
        yAxisLabel: "Light (lux)",
        chartDomain: [0, 3000],
        strokeColor: "#efd035",
        fillColor: "#f5e38e",
        themeClass: "lightCard",
        infoLabel: "Intensity",
    },
    temperature: {
        iconPath: "/icon/thermometer.png",
        accentColor: "#ff8e8e",
        chartTitle: "Temperature History",
        chartDescription: "recent readings",
        yAxisLabel: "Temperature (C)",
        chartDomain: [0, 100],
        strokeColor: "#f36464",
        fillColor: "#ff8e8e",
        themeClass: "tempCard",
        infoLabel: "Day/Night",
    },
    humidity: {
        iconPath: "/icon/leaves.png",
        accentColor: "#8ef5a5",
        chartTitle: "Air Humidity",
        chartDescription: "recent readings",
        yAxisLabel: "Humidity (%)",
        chartDomain: [0, 100],
        strokeColor: "#39f060",
        fillColor: "#8ef5a5",
        themeClass: "humidityCard",
        infoLabel: "Relative",
    },
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Tokyo",
});

function requireResult<T>(result: SupabaseResult<T>, label: string): T {
    if (result.error) {
        throw new Error(
            `Failed to load ${label} from Supabase (${result.error.code ?? "unknown"}).`,
        );
    }

    if (!result.data) {
        throw new Error(`Konoha Supabase data is missing ${label}.`);
    }

    return result.data;
}

function requireRows<T>(result: SupabaseResult<T[]>, label: string): T[] {
    const rows = requireResult(result, label);

    if (rows.length === 0) {
        throw new Error(`Konoha Supabase table has no rows for ${label}.`);
    }

    return rows;
}

function toNumber(value: number | string) {
    return typeof value === "number" ? value : Number(value);
}

function roundMetric(value: number) {
    return Math.round(value * 10) / 10;
}

function formatTimestampLabel(timestamp: string) {
    return dateTimeFormatter.format(new Date(timestamp));
}

function formatTimeLabel(timestamp: string) {
    return timeFormatter.format(new Date(timestamp));
}

function formatWeekdayLabel(timestamp: string) {
    return weekdayFormatter.format(new Date(timestamp));
}

function valueForMetric(reading: SensorReadingRow, key: SensorMetricKey) {
    if (key === "soil_moisture") {
        return toNumber(reading.soil_moisture_percent);
    }

    if (key === "light") {
        return toNumber(reading.light_lux);
    }

    if (key === "temperature") {
        return toNumber(reading.temperature_c);
    }

    return toNumber(reading.humidity_percent);
}

function displayUnitForMetric(threshold: MetricThresholdRow) {
    return threshold.metric_key === "temperature" ? "\u00b0C" : threshold.unit;
}

function displayRangeForMetric(threshold: MetricThresholdRow) {
    return threshold.metric_key === "temperature"
        ? threshold.display_range.replaceAll("C", "\u00b0C")
        : threshold.display_range;
}

function levelForMetric(value: number, threshold: MetricThresholdRow): SensorMetricLevel {
    const min = toNumber(threshold.optimal_min);
    const max = toNumber(threshold.optimal_max);

    if (value < min) {
        return "Low";
    }

    if (value > max) {
        return "High";
    }

    return threshold.metric_key === "temperature" ? "Normal" : "Good";
}

function changeFromPrevious(
    latest: SensorReadingRow,
    previous: SensorReadingRow | undefined,
    key: SensorMetricKey,
) {
    if (!previous) {
        return 0;
    }

    const previousValue = valueForMetric(previous, key);

    if (previousValue === 0) {
        return 0;
    }

    const latestValue = valueForMetric(latest, key);
    return Math.round(((latestValue - previousValue) / Math.abs(previousValue)) * 100);
}

function mapReading(row: SensorReadingRow): SensorReading {
    return {
        device_id: row.device_id,
        timestamp: row.timestamp,
        soil_moisture_raw: row.soil_moisture_raw,
        soil_moisture_percent: toNumber(row.soil_moisture_percent),
        temperature_c: toNumber(row.temperature_c),
        humidity_percent: toNumber(row.humidity_percent),
        light_lux: toNumber(row.light_lux),
        sensor_status: row.sensor_status,
        battery_or_power_status: row.battery_or_power_status ?? undefined,
        notes: row.notes ?? undefined,
    };
}

function mapPlantProfile(plant: PlantRow, facts: PlantFactRow[]): PlantProfile {
    return {
        name: plant.name,
        species: plant.species,
        description: plant.description,
        imagePath: plant.image_path,
        facts: facts.map((fact) => ({
            label: fact.label,
            value: fact.value,
        })),
    };
}

function mapPlantTags(tags: PlantTagRow[]): PlantTag[] {
    return tags.map((tag) => ({
        label: tag.label,
        value: tag.value,
        iconPath: tag.icon_path,
    }));
}

function mapAiReport(row: AiReportRow): AiReport {
    return {
        plant_message: row.plant_message,
        condition_summary: row.condition_summary,
        near_future_prediction: row.near_future_prediction,
        generated_at: row.generated_at,
    };
}

function mapMood(row: HealthSnapshotRow): DashboardMood {
    return {
        emoji: row.mood_emoji,
        label: row.mood_label,
        description: row.mood_description,
    };
}

function mapCareAdvice(row: CareAdviceRow): CareAdvice {
    return {
        title: row.title,
        body: row.body,
        actionLabel: row.action_label ?? "Done",
        imagePath: row.image_path ?? "/icon/water.jpeg",
    };
}

function mapActivityItem(row: ActivityEventRow): ActivityItem {
    return {
        title: row.title,
        description: row.description ?? undefined,
        timestampLabel: formatTimestampLabel(row.occurred_at),
        iconPath: row.icon_path ?? undefined,
        iconBackgroundColor: row.icon_background_color ?? undefined,
    };
}

function mapSensorMetrics(
    readings: SensorReadingRow[],
    thresholds: MetricThresholdRow[],
): SensorMetricSummary[] {
    const latest = readings[0];
    const previous = readings[1];
    const historyReadings = [...readings].reverse().slice(-6);

    return thresholds.map((threshold) => {
        const key = threshold.metric_key;
        const presentation = metricPresentation[key];
        const value = roundMetric(valueForMetric(latest, key));
        const history: SensorHistoryPoint[] = historyReadings.map((reading) => ({
            x: formatTimeLabel(reading.timestamp),
            y: roundMetric(valueForMetric(reading, key)),
        }));

        return {
            key,
            label: threshold.display_title,
            value,
            unit: displayUnitForMetric(threshold),
            level: levelForMetric(value, threshold),
            change_percent_from_previous: changeFromPrevious(latest, previous, key),
            iconPath: presentation.iconPath,
            accentColor: presentation.accentColor,
            chartTitle: presentation.chartTitle,
            chartDescription: presentation.chartDescription,
            yAxisLabel: presentation.yAxisLabel,
            chartDomain: presentation.chartDomain,
            strokeColor: presentation.strokeColor,
            fillColor: presentation.fillColor,
            history,
        };
    });
}

function mapOptimalConditions(thresholds: MetricThresholdRow[]): OptimalCondition[] {
    return thresholds.map((threshold) => {
        const presentation = metricPresentation[threshold.metric_key];

        return {
            key: threshold.metric_key,
            title: threshold.display_title,
            iconPath: presentation.iconPath,
            range: displayRangeForMetric(threshold),
            label: presentation.infoLabel,
            themeClass: presentation.themeClass,
        };
    });
}

function mapCareGuidelines(rows: CareGuidelineRow[]): CareGuideline[] {
    return rows.map((row) => ({
        title: row.title,
        body: row.body,
    }));
}

function mapHealthHistory(
    readings: SensorReadingRow[],
    healthSnapshots: HealthSnapshotRow[],
): SensorHistoryPoint[] {
    if (healthSnapshots.length > 1) {
        return [...healthSnapshots].reverse().map((snapshot) => ({
            x: formatWeekdayLabel(snapshot.generated_at),
            y: snapshot.plant_hp_percent,
        }));
    }

    const latestHp = healthSnapshots[0]?.plant_hp_percent ?? 80;
    return [...readings].reverse().slice(-7).map((reading, index, list) => {
        const offset = index - list.length + 1;

        return {
            x: formatWeekdayLabel(reading.timestamp),
            y: Math.max(0, Math.min(100, latestHp + offset * 2)),
        };
    });
}

function calculateLightExposureHours(readings: SensorReadingRow[]) {
    const chronologicalReadings = [...readings]
        .map((reading) => ({
            timestampMs: new Date(reading.timestamp).getTime(),
            lightLux: toNumber(reading.light_lux),
        }))
        .filter((reading) => Number.isFinite(reading.timestampMs))
        .sort((left, right) => left.timestampMs - right.timestampMs);

    return chronologicalReadings.reduce((totalHours, reading, index) => {
        const nextReading = chronologicalReadings[index + 1];

        if (!nextReading || reading.lightLux < 100) {
            return totalHours;
        }

        const intervalHours = (nextReading.timestampMs - reading.timestampMs) / (1000 * 60 * 60);
        return intervalHours > 0 ? totalHours + intervalHours : totalHours;
    }, 0);
}

function mapWeeklyStats(readings: SensorReadingRow[]): WeeklyStat[] {
    const averageMoisture =
        readings.reduce((total, reading) => total + toNumber(reading.soil_moisture_percent), 0) /
        readings.length;
    const lightExposureHours = calculateLightExposureHours(readings);

    return [
        {
            key: "soil_moisture",
            label: "Avg. moisture",
            value: `${Math.round(averageMoisture)}%`,
            themeClass: "moisture",
        },
        {
            key: "light_exposure",
            label: "Light exposure",
            value: `${lightExposureHours.toFixed(1)} hrs`,
            themeClass: "lightExposure",
        },
        {
            key: "growth",
            label: "Growth",
            value: "Baseline",
            themeClass: "growth",
        },
    ];
}

async function loadCoreDashboardContext(): Promise<CoreDashboardContext> {
    const { supabase, device, plantId } = await loadActiveDeviceDataset();

    const [
        plantResult,
        factsResult,
        tagsResult,
        readingsResult,
        healthResult,
        thresholdsResult,
        guidelinesResult,
        activityResult,
    ] = await Promise.all([
        supabase
            .from("plants")
            .select("id, name, species, description, image_path")
            .eq("id", plantId)
            .maybeSingle(),
        supabase
            .from("plant_facts")
            .select("label, value")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
        supabase
            .from("plant_tags")
            .select("label, value, icon_path")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
        supabase
            .from("sensor_readings")
            .select(
                "id, plant_id, device_id, timestamp, soil_moisture_raw, soil_moisture_percent, temperature_c, humidity_percent, light_lux, sensor_status, battery_or_power_status, notes",
            )
            .eq("plant_id", plantId)
            .eq("device_id", device.device_id)
            .order("timestamp", { ascending: false })
            .limit(24),
        supabase
            .from("plant_health_snapshots")
            .select("plant_status, plant_hp_percent, mood_emoji, mood_label, mood_description, generated_at")
            .eq("plant_id", plantId)
            .order("generated_at", { ascending: false })
            .limit(7),
        supabase
            .from("metric_thresholds")
            .select("metric_key, display_title, unit, optimal_min, optimal_max, display_range")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
        supabase
            .from("care_guidelines")
            .select("title, body")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
        supabase
            .from("activity_events")
            .select("title, description, icon_path, icon_background_color, occurred_at")
            .eq("plant_id", plantId)
            .order("occurred_at", { ascending: false })
            .limit(20),
    ]);

    return {
        supabase,
        device,
        plantId,
        data: {
            plant: requireResult(plantResult as SupabaseResult<PlantRow>, "plant profile"),
            facts: requireRows(factsResult as SupabaseResult<PlantFactRow[]>, "plant profile facts"),
            tags: requireRows(tagsResult as SupabaseResult<PlantTagRow[]>, "plant tags"),
            readings: requireRows(readingsResult as SupabaseResult<SensorReadingRow[]>, "sensor readings"),
            healthSnapshots: requireRows(healthResult as SupabaseResult<HealthSnapshotRow[]>, "health snapshots"),
            thresholds: requireRows(thresholdsResult as SupabaseResult<MetricThresholdRow[]>, "metric thresholds"),
            careGuidelines: requireRows(guidelinesResult as SupabaseResult<CareGuidelineRow[]>, "care guidelines"),
            activityEvents: requireRows(activityResult as SupabaseResult<ActivityEventRow[]>, "activity events"),
        },
    };
}

async function loadDashboardDataset(): Promise<DashboardDataset> {
    const { supabase, plantId, data } = await loadCoreDashboardContext();

    const [adviceResult, reportResult] = await Promise.all([
        supabase
            .from("care_advice")
            .select("title, body, action_label, image_path")
            .eq("plant_id", plantId)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase
            .from("ai_reports")
            .select("plant_message, condition_summary, near_future_prediction, generated_at")
            .eq("plant_id", plantId)
            .order("generated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);

    return {
        ...data,
        careAdvice: requireResult(adviceResult as SupabaseResult<CareAdviceRow>, "active care advice"),
        aiReport: requireResult(reportResult as SupabaseResult<AiReportRow>, "AI report placeholder"),
    };
}

async function loadActiveDeviceDataset(): Promise<ActiveDeviceDataset> {
    const supabase = getSupabaseServerClient();
    const deviceId = getDefaultDeviceId();

    const deviceResult = (await supabase
        .from("devices")
        .select("plant_id, device_id, is_active")
        .eq("device_id", deviceId)
        .maybeSingle()) as SupabaseResult<DeviceRow>;
    const device = requireResult(deviceResult, `device ${deviceId}`);

    if (!device.is_active) {
        throw new Error(`Konoha device ${device.device_id} is inactive.`);
    }

    const plantId = device.plant_id;
    return { supabase, device, plantId };
}

async function loadSensorMetricsDataset(): Promise<SensorMetricsDataset> {
    const { supabase, device, plantId } = await loadActiveDeviceDataset();
    const [
        readingsResult,
        thresholdsResult,
    ] = await Promise.all([
        supabase
            .from("sensor_readings")
            .select(
                "id, plant_id, device_id, timestamp, soil_moisture_raw, soil_moisture_percent, temperature_c, humidity_percent, light_lux, sensor_status, battery_or_power_status, notes",
            )
            .eq("plant_id", plantId)
            .eq("device_id", device.device_id)
            .order("timestamp", { ascending: false })
            .limit(24),
        supabase
            .from("metric_thresholds")
            .select("metric_key, display_title, unit, optimal_min, optimal_max, display_range")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
    ]);

    return {
        readings: requireRows(readingsResult as SupabaseResult<SensorReadingRow[]>, "sensor readings"),
        thresholds: requireRows(thresholdsResult as SupabaseResult<MetricThresholdRow[]>, "metric thresholds"),
    };
}

async function loadPlantInfoDataset(): Promise<PlantInfoDataset> {
    const { supabase, plantId } = await loadActiveDeviceDataset();
    const [
        plantResult,
        factsResult,
        thresholdsResult,
        guidelinesResult,
    ] = await Promise.all([
        supabase
            .from("plants")
            .select("id, name, species, description, image_path")
            .eq("id", plantId)
            .maybeSingle(),
        supabase
            .from("plant_facts")
            .select("label, value")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
        supabase
            .from("metric_thresholds")
            .select("metric_key, display_title, unit, optimal_min, optimal_max, display_range")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
        supabase
            .from("care_guidelines")
            .select("title, body")
            .eq("plant_id", plantId)
            .order("sort_order", { ascending: true }),
    ]);

    return {
        plant: requireResult(plantResult as SupabaseResult<PlantRow>, "plant profile"),
        facts: requireRows(factsResult as SupabaseResult<PlantFactRow[]>, "plant profile facts"),
        thresholds: requireRows(thresholdsResult as SupabaseResult<MetricThresholdRow[]>, "metric thresholds"),
        careGuidelines: requireRows(guidelinesResult as SupabaseResult<CareGuidelineRow[]>, "care guidelines"),
    };
}

export async function getSupabaseDashboardData(): Promise<DashboardData> {
    const data = await loadDashboardDataset();
    const latestReading = data.readings[0];
    const latestHealth = data.healthSnapshots[0];

    return {
        plant: mapPlantProfile(data.plant, data.facts),
        plantTags: mapPlantTags(data.tags),
        plant_status: latestHealth.plant_status,
        plant_hp_percent: latestHealth.plant_hp_percent,
        latest_reading: mapReading(latestReading),
        ai_report: mapAiReport(data.aiReport),
        last_updated_label: formatTimestampLabel(latestReading.timestamp),
        mood: mapMood(latestHealth),
        sensorMetrics: mapSensorMetrics(data.readings, data.thresholds),
        recentActivity: data.activityEvents.slice(0, 4).map(mapActivityItem),
        careAdvice: mapCareAdvice(data.careAdvice),
    };
}

export async function getSupabaseSensorMetrics(): Promise<SensorMetricSummary[]> {
    const data = await loadSensorMetricsDataset();
    return mapSensorMetrics(data.readings, data.thresholds);
}

export async function getSupabasePlantInfoData(): Promise<PlantInfoData> {
    const data = await loadPlantInfoDataset();

    return {
        plant: mapPlantProfile(data.plant, data.facts),
        optimalConditions: mapOptimalConditions(data.thresholds),
        careGuidelines: mapCareGuidelines(data.careGuidelines),
    };
}

export async function getSupabaseTimelineData(): Promise<TimelineData> {
    const { data } = await loadCoreDashboardContext();

    return {
        healthHistory: mapHealthHistory(data.readings, data.healthSnapshots),
        weeklyStats: mapWeeklyStats(data.readings),
        eventLogs: data.activityEvents.map(mapActivityItem),
    };
}
