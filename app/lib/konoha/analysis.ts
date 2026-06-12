import type { PlantReading } from "./types";

export type StatusLevel = "good" | "watch" | "need_water" | "too_wet" | "temperature_warning" | "offline";

export const PLANT_THRESHOLDS = {
  soilNeedWaterBelow: 25,
  soilWatchBelow: 40,
  soilGoodMax: 75,
  soilTooWetAbove: 80,
  temperatureLowC: 10,
  temperatureHighC: 32,
  humidityLowBelow: 35,
  humidityHighAbove: 80,
  lightLowLux: 120,
  freshMinutes: 20,
};

export interface PlantAnalysis {
  statusLevel: StatusLevel;
  statusLabel: string;
  moodLabel: string;
  moodDetail: string;
  moodEmoji: string;
  summary: string;
  plantMessage: string;
  healthScore: number;
  isFresh: boolean;
  analysis: Record<string, string>;
  prediction: Record<string, string>;
}

function readingAgeMinutes(reading: PlantReading | null): number | null {
  if (!reading) {
    return null;
  }
  const age = (Date.now() - new Date(reading.created_at).getTime()) / 60000;
  return Number.isFinite(age) ? age : null;
}

function soilStatus(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  if (value < PLANT_THRESHOLDS.soilNeedWaterBelow) {
    return "need_water";
  }
  if (value < PLANT_THRESHOLDS.soilWatchBelow) {
    return "watch";
  }
  if (value > PLANT_THRESHOLDS.soilTooWetAbove) {
    return "too_wet";
  }
  return "good";
}

function temperatureStatus(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  if (value < PLANT_THRESHOLDS.temperatureLowC) {
    return "too_cold";
  }
  if (value > PLANT_THRESHOLDS.temperatureHighC) {
    return "too_hot";
  }
  return "comfortable";
}

function humidityStatus(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  if (value < PLANT_THRESHOLDS.humidityLowBelow) {
    return "low";
  }
  if (value > PLANT_THRESHOLDS.humidityHighAbove) {
    return "high";
  }
  return "normal";
}

function lightStatus(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  if (value < PLANT_THRESHOLDS.lightLowLux) {
    return "low";
  }
  return "good";
}

function trendFor(readings: PlantReading[], key: keyof PlantReading): number | null {
  const points = readings
    .filter((reading) => typeof reading[key] === "number")
    .slice(-12);

  if (points.length < 2) {
    return null;
  }

  const first = points[0][key] as number;
  const last = points[points.length - 1][key] as number;
  return Math.round((last - first) * 10) / 10;
}

export function analyzePlant(latest: PlantReading | null, readings: PlantReading[]): PlantAnalysis {
  if (!latest) {
    return {
      statusLevel: "offline",
      statusLabel: "Waiting",
      moodLabel: "Waiting",
      moodDetail: "No sensor reading yet",
      moodEmoji: "🌱",
      summary: "No live plant readings are available yet.",
      plantMessage: "I am waiting for my first sensor reading. Please connect my ESP32 friend.",
      healthScore: 30,
      isFresh: false,
      analysis: {
        soil: "unknown",
        temperature: "unknown",
        humidity: "unknown",
        light: "unknown",
      },
      prediction: {
        risk: "not enough data",
        confidence: "low",
      },
    };
  }

  const soil = soilStatus(latest.soil_moisture_percent);
  const temperature = temperatureStatus(latest.temperature_c);
  const humidity = humidityStatus(latest.humidity_percent);
  const light = lightStatus(latest.light_lux);
  const ageMinutes = readingAgeMinutes(latest);
  const isFresh = ageMinutes !== null && ageMinutes <= PLANT_THRESHOLDS.freshMinutes;
  const soilTrend = trendFor(readings, "soil_moisture_percent");

  let statusLevel: StatusLevel = "good";
  if (!isFresh) {
    statusLevel = "watch";
  }
  if (soil === "need_water") {
    statusLevel = "need_water";
  } else if (soil === "too_wet") {
    statusLevel = "too_wet";
  } else if (temperature === "too_cold" || temperature === "too_hot") {
    statusLevel = "temperature_warning";
  } else if (soil === "watch" || light === "low" || humidity === "low" || humidity === "high") {
    statusLevel = "watch";
  }

  let healthScore = 88;
  if (!isFresh) healthScore -= 12;
  if (soil === "watch") healthScore -= 12;
  if (soil === "need_water") healthScore -= 35;
  if (soil === "too_wet") healthScore -= 25;
  if (temperature !== "comfortable" && temperature !== "unknown") healthScore -= 15;
  if (humidity !== "normal" && humidity !== "unknown") healthScore -= 8;
  if (light === "low") healthScore -= 8;
  healthScore = Math.min(100, Math.max(5, healthScore));

  const predictionRisk =
    soilTrend !== null && soilTrend < -8
      ? "soil moisture is dropping quickly"
      : soil === "watch"
        ? "soil may become dry within several hours"
        : soil === "need_water"
          ? "plant is already below the watering threshold"
          : "no immediate risk detected";

  const statusLabel =
    statusLevel === "need_water"
      ? "Needs water"
      : statusLevel === "too_wet"
        ? "Too wet"
        : statusLevel === "temperature_warning"
          ? "Temp warning"
          : statusLevel === "watch"
            ? "Watch"
            : "Good";

  const moodLabel = statusLevel === "good" ? "Happy" : statusLevel === "watch" ? "Careful" : "Concerned";
  const moodDetail =
    statusLevel === "good"
      ? "Comfortable and stable"
      : statusLevel === "watch"
        ? "Needs a little attention"
        : "Please check me soon";
  const moodEmoji = statusLevel === "good" ? "😊" : statusLevel === "watch" ? "🙂" : "😟";

  const summary = `Soil is ${soil.replace("_", " ")}, temperature is ${temperature.replace("_", " ")}, humidity is ${humidity}, and light is ${light}.`;

  return {
    statusLevel,
    statusLabel,
    moodLabel,
    moodDetail,
    moodEmoji,
    summary,
    plantMessage:
      statusLevel === "good"
        ? "I feel comfortable right now. Please keep checking my soil and sunlight through the day."
        : "I can still manage, but one of my readings needs attention. Please check my latest sensor values.",
    healthScore,
    isFresh,
    analysis: {
      soil,
      temperature,
      humidity,
      light,
      freshness: isFresh ? "fresh" : "stale",
      soil_trend: soilTrend === null ? "unknown" : `${soilTrend > 0 ? "+" : ""}${soilTrend}% over recent readings`,
    },
    prediction: {
      risk: predictionRisk,
      confidence: readings.length >= 6 ? "medium" : "low",
    },
  };
}
