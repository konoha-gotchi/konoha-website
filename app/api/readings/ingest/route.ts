import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/app/lib/supabase/server";
import type { SensorReading, SensorStatus } from "@/app/types/plant";

export const runtime = "nodejs";

const sensorStatuses = new Set<SensorStatus>(["ok", "warning", "error", "offline"]);
const isoTimestampPattern =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|([+-])(\d{2}):(\d{2}))$/;

interface IngestPayload extends SensorReading {
    battery_or_power_status?: string;
    notes?: string;
}

function jsonResponse(body: unknown, status: number) {
    return NextResponse.json(body, { status });
}

function getBearerToken(authorizationHeader: string | null) {
    const prefix = "Bearer ";

    if (!authorizationHeader?.startsWith(prefix)) {
        return null;
    }

    return authorizationHeader.slice(prefix.length).trim();
}

function constantTimeEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    const maxLength = Math.max(leftBuffer.length, rightBuffer.length);
    const leftPadded = Buffer.alloc(maxLength);
    const rightPadded = Buffer.alloc(maxLength);

    leftBuffer.copy(leftPadded);
    rightBuffer.copy(rightPadded);

    return timingSafeEqual(leftPadded, rightPadded) && leftBuffer.length === rightBuffer.length;
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidTimestamp(value: string) {
    const match = isoTimestampPattern.exec(value);

    if (!match) {
        return false;
    }

    const [
        ,
        yearValue,
        monthValue,
        dayValue,
        hourValue,
        minuteValue,
        secondValue,
        offsetSign,
        offsetHourValue,
        offsetMinuteValue,
    ] = match;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const hour = Number(hourValue);
    const minute = Number(minuteValue);
    const second = Number(secondValue);

    if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) {
        return false;
    }

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    if (day < 1 || day > daysInMonth) {
        return false;
    }

    if (offsetSign) {
        const offsetHour = Number(offsetHourValue);
        const offsetMinute = Number(offsetMinuteValue);

        if (offsetHour > 23 || offsetMinute > 59) {
            return false;
        }
    }

    return !Number.isNaN(Date.parse(value));
}

function validatePayload(value: unknown): { payload: IngestPayload } | { error: string } {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return { error: "Request body must be a JSON object." };
    }

    const payload = value as Record<string, unknown>;
    const deviceId = payload.device_id;
    const timestamp = payload.timestamp;
    const soilMoistureRaw = payload.soil_moisture_raw;
    const soilMoisturePercent = payload.soil_moisture_percent;
    const temperatureC = payload.temperature_c;
    const humidityPercent = payload.humidity_percent;
    const lightLux = payload.light_lux;
    const sensorStatus = payload.sensor_status;
    const batteryOrPowerStatus = payload.battery_or_power_status;
    const notes = payload.notes;

    if (!isString(deviceId)) {
        return { error: "device_id is required." };
    }

    if (!isString(timestamp) || !isValidTimestamp(timestamp)) {
        return { error: "timestamp must be a valid ISO timestamp." };
    }

    if (!Number.isInteger(soilMoistureRaw)) {
        return { error: "soil_moisture_raw must be an integer." };
    }

    if (!isFiniteNumber(soilMoisturePercent) || soilMoisturePercent < 0 || soilMoisturePercent > 100) {
        return { error: "soil_moisture_percent must be between 0 and 100." };
    }

    if (!isFiniteNumber(temperatureC)) {
        return { error: "temperature_c must be a number." };
    }

    if (!isFiniteNumber(humidityPercent) || humidityPercent < 0 || humidityPercent > 100) {
        return { error: "humidity_percent must be between 0 and 100." };
    }

    if (!isFiniteNumber(lightLux) || lightLux < 0) {
        return { error: "light_lux must be greater than or equal to 0." };
    }

    if (!isString(sensorStatus) || !sensorStatuses.has(sensorStatus as SensorStatus)) {
        return { error: "sensor_status must be ok, warning, error, or offline." };
    }

    if (batteryOrPowerStatus !== undefined && typeof batteryOrPowerStatus !== "string") {
        return { error: "battery_or_power_status must be a string when provided." };
    }

    if (notes !== undefined && typeof notes !== "string") {
        return { error: "notes must be a string when provided." };
    }

    return {
        payload: {
            device_id: deviceId,
            timestamp,
            soil_moisture_raw: soilMoistureRaw as number,
            soil_moisture_percent: soilMoisturePercent,
            temperature_c: temperatureC,
            humidity_percent: humidityPercent,
            light_lux: lightLux,
            sensor_status: sensorStatus as SensorStatus,
            battery_or_power_status: batteryOrPowerStatus,
            notes,
        },
    };
}

function isDuplicateInsert(error: { code?: string } | null) {
    return error?.code === "23505";
}

export async function POST(request: Request) {
    const expectedToken = process.env.KONOHA_INGESTION_TOKEN;
    const suppliedToken = getBearerToken(request.headers.get("authorization"));

    if (!expectedToken || !suppliedToken || !constantTimeEqual(suppliedToken, expectedToken)) {
        return jsonResponse({ error: "Unauthorized." }, 401);
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: "Request body must be valid JSON." }, 400);
    }

    const validation = validatePayload(body);

    if ("error" in validation) {
        return jsonResponse({ error: validation.error }, 400);
    }

    const { payload } = validation;
    let supabase: ReturnType<typeof getSupabaseServerClient>;

    try {
        supabase = getSupabaseServerClient();
    } catch {
        console.error("Konoha ingestion Supabase server environment is not configured");

        return jsonResponse({ error: "Server ingestion is not configured." }, 500);
    }

    const deviceResult = await supabase
        .from("devices")
        .select("plant_id, is_active")
        .eq("device_id", payload.device_id)
        .maybeSingle();

    if (deviceResult.error) {
        console.error("Konoha ingestion device lookup failed", {
            code: deviceResult.error.code,
            device_id: payload.device_id,
        });

        return jsonResponse({ error: "Unable to verify device." }, 500);
    }

    if (!deviceResult.data) {
        return jsonResponse({ error: "Unknown device_id." }, 404);
    }

    if (!deviceResult.data.is_active) {
        return jsonResponse({ error: "Device is inactive." }, 409);
    }

    const insertResult = await supabase
        .from("sensor_readings")
        .insert({
            plant_id: deviceResult.data.plant_id,
            device_id: payload.device_id,
            timestamp: payload.timestamp,
            soil_moisture_raw: payload.soil_moisture_raw,
            soil_moisture_percent: payload.soil_moisture_percent,
            temperature_c: payload.temperature_c,
            humidity_percent: payload.humidity_percent,
            light_lux: payload.light_lux,
            sensor_status: payload.sensor_status,
            battery_or_power_status: payload.battery_or_power_status ?? null,
            notes: payload.notes ?? null,
        })
        .select("id")
        .single();

    if (isDuplicateInsert(insertResult.error)) {
        return jsonResponse({ status: "duplicate", device_id: payload.device_id, timestamp: payload.timestamp }, 200);
    }

    if (insertResult.error) {
        console.error("Konoha ingestion insert failed", {
            code: insertResult.error.code,
            device_id: payload.device_id,
        });

        return jsonResponse({ error: "Unable to store reading." }, 500);
    }

    return jsonResponse({ status: "inserted", reading_id: insertResult.data.id }, 201);
}
