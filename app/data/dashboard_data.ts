import "server-only";

import type {
    DashboardData,
    PlantInfoData,
    SensorMetricSummary,
    TimelineData,
} from "../types/plant";
import {
    getMissingSupabaseEnvMessage,
    hasSupabaseServerEnv,
    isMockFallbackEnabled,
} from "../lib/supabase/server";
import {
    mockDashboardData,
    mockPlantInfoData,
    mockTimelineData,
    sensorMetrics,
} from "./mock_data";
import {
    getSupabaseDashboardData,
    getSupabasePlantInfoData,
    getSupabaseSensorMetrics,
    getSupabaseTimelineData,
} from "./supabase_dashboard_data";

function shouldUseMockFallback() {
    if (hasSupabaseServerEnv()) {
        return false;
    }

    if (isMockFallbackEnabled()) {
        return true;
    }

    throw new Error(getMissingSupabaseEnvMessage());
}

export async function getDashboardData(): Promise<DashboardData> {
    return shouldUseMockFallback() ? mockDashboardData : getSupabaseDashboardData();
}

export async function getSensorMetrics(): Promise<SensorMetricSummary[]> {
    return shouldUseMockFallback() ? sensorMetrics : getSupabaseSensorMetrics();
}

export async function getPlantInfoData(): Promise<PlantInfoData> {
    return shouldUseMockFallback() ? mockPlantInfoData : getSupabasePlantInfoData();
}

export async function getTimelineData(): Promise<TimelineData> {
    return shouldUseMockFallback() ? mockTimelineData : getSupabaseTimelineData();
}
