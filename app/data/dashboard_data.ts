import type {
    DashboardData,
    PlantInfoData,
    SensorMetricSummary,
    TimelineData,
} from "../types/plant";
import {
    mockDashboardData,
    mockPlantInfoData,
    mockTimelineData,
    sensorMetrics,
} from "./mock_data";

export async function getDashboardData(): Promise<DashboardData> {
    return mockDashboardData;
}

export async function getSensorMetrics(): Promise<SensorMetricSummary[]> {
    return sensorMetrics;
}

export async function getPlantInfoData(): Promise<PlantInfoData> {
    return mockPlantInfoData;
}

export async function getTimelineData(): Promise<TimelineData> {
    return mockTimelineData;
}
