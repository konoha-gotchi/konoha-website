import type {
    ActivityItem,
    AiReport,
    DashboardData,
    PlantInfoData,
    PlantProfile,
    SensorMetricSummary,
    SensorReading,
    TimelineData,
} from "../types/plant";

export const plantProfile: PlantProfile = {
    name: "Kono-Chan",
    species: "Monstera deliciosa (Swiss Cheese Plant)",
    description:
        "Kono-Chan is a vibrant Monstera deliciosa, known for its iconic heart-shaped leaves with natural holes (fenestrations). Native to tropical rainforests, this plant is a fast grower and acts as a natural air purifier.",
    imagePath: "/icon/mockplant.jpeg",
    facts: [
        { label: "Age", value: "1.5 Years" },
        { label: "Origin", value: "Central America" },
        { label: "Type", value: "Tropical Perennial" },
    ],
};

export const latestSensorReading: SensorReading = {
    device_id: "konoha-esp32-01",
    timestamp: "2026-06-13T02:02:00+09:00",
    soil_moisture_raw: 2150,
    soil_moisture_percent: 34,
    temperature_c: 22,
    humidity_percent: 48,
    light_lux: 820,
    sensor_status: "ok",
    battery_or_power_status: "usb_power",
    notes: "Local mock reading for dashboard development.",
};

export const mockAiReport: AiReport = {
    plant_message: "I'm feeling good today!",
    condition_summary: "Soil moisture is slightly low, while light and temperature are stable.",
    near_future_prediction: "If moisture keeps dropping, Kono-Chan may need water within today.",
    generated_at: "2026-06-13T02:02:00+09:00",
};

export const sensorMetrics: SensorMetricSummary[] = [
    {
        key: "soil_moisture",
        label: "Soil moisture",
        value: latestSensorReading.soil_moisture_percent,
        unit: "%",
        level: "Low",
        change_percent_from_previous: -20,
        iconPath: "/icon/water-droplet.png",
        accentColor: "#8eb5f5",
        chartTitle: "Soil Moisture History",
        chartDescription: "last 6 hours",
        yAxisLabel: "Moisture (%)",
        chartDomain: [0, 100],
        strokeColor: "#8eb5f5",
        fillColor: "#8eb5f5",
        history: [
            { x: "06:00", y: 30 },
            { x: "09:00", y: 45 },
            { x: "12:00", y: 35 },
            { x: "15:00", y: 50 },
            { x: "18:00", y: 40 },
            { x: "21:00", y: 34 },
        ],
    },
    {
        key: "light",
        label: "Light level",
        value: latestSensorReading.light_lux,
        unit: "lux",
        level: "Good",
        change_percent_from_previous: 15,
        iconPath: "/icon/sun.png",
        accentColor: "#f5e38e",
        chartTitle: "Light Level History",
        chartDescription: "last 6 hours",
        yAxisLabel: "Light (lux)",
        chartDomain: [0, 3000],
        strokeColor: "#efd035",
        fillColor: "#f5e38e",
        history: [
            { x: "06:00", y: 100 },
            { x: "09:00", y: 400 },
            { x: "12:00", y: 800 },
            { x: "15:00", y: 600 },
            { x: "18:00", y: 200 },
            { x: "21:00", y: 50 },
        ],
    },
    {
        key: "temperature",
        label: "Temperature",
        value: latestSensorReading.temperature_c,
        unit: "°C",
        level: "Normal",
        change_percent_from_previous: 0,
        iconPath: "/icon/thermometer.png",
        accentColor: "#ff8e8e",
        chartTitle: "Temperature History",
        chartDescription: "last 6 hours",
        yAxisLabel: "Temperature (°C)",
        chartDomain: [0, 100],
        strokeColor: "#f36464",
        fillColor: "#ff8e8e",
        history: [
            { x: "06:00", y: 22 },
            { x: "09:00", y: 26 },
            { x: "12:00", y: 31 },
            { x: "15:00", y: 33 },
            { x: "18:00", y: 28 },
            { x: "21:00", y: 24 },
        ],
    },
    {
        key: "humidity",
        label: "Air humidity",
        value: latestSensorReading.humidity_percent,
        unit: "%",
        level: "Low",
        change_percent_from_previous: 0,
        iconPath: "/icon/leaves.png",
        accentColor: "#8ef5a5",
        chartTitle: "Air Humidity",
        chartDescription: "last 6 hours",
        yAxisLabel: "Humidity (%)",
        chartDomain: [0, 100],
        strokeColor: "#39f060",
        fillColor: "#8ef5a5",
        history: [
            { x: "06:00", y: 80 },
            { x: "09:00", y: 70 },
            { x: "12:00", y: 55 },
            { x: "15:00", y: 50 },
            { x: "18:00", y: 65 },
            { x: "21:00", y: 75 },
        ],
    },
];

const recentActivity: ActivityItem[] = [
    {
        title: "Moisture sensor reading logged",
        timestampLabel: "3 min ago",
    },
    {
        title: "Light level peak recorded",
        timestampLabel: "1 hr ago",
    },
    {
        title: "Watered by user",
        timestampLabel: "2 days ago",
    },
    {
        title: "Plant status updated to Good",
        timestampLabel: "3 days ago",
    },
];

export const mockDashboardData: DashboardData = {
    plant: plantProfile,
    plantTags: [
        { label: "Health", value: "Good", iconPath: "/icon/protect.png" },
        { label: "Moisture", value: "Succulent", iconPath: "/icon/leaves.png" },
        { label: "Light", value: "Full sun", iconPath: "/icon/sun.png" },
    ],
    plant_status: "Good",
    plant_hp_percent: 85,
    latest_reading: latestSensorReading,
    ai_report: mockAiReport,
    last_updated_label: "3 min ago",
    mood: {
        emoji: "🤩",
        label: "Happy",
        description: "Thriving and content",
    },
    sensorMetrics,
    recentActivity,
    careAdvice: {
        title: "Care advice",
        body: "Soil moisture is slightly low. Please water Kono-Chan within today to keep her happy and healthy.",
        actionLabel: "Mark as Watered",
        imagePath: "/icon/water.jpeg",
    },
};

export const mockPlantInfoData: PlantInfoData = {
    plant: plantProfile,
    optimalConditions: [
        {
            key: "soil_moisture",
            title: "Soil moisture",
            iconPath: "/icon/water-droplet.png",
            range: "40% - 60%",
            label: "Ideal Range",
            themeClass: "moistureCard",
        },
        {
            key: "light",
            title: "Light level",
            iconPath: "/icon/sun.png",
            range: "500 - 1500 lux",
            label: "Intensity",
            themeClass: "lightCard",
        },
        {
            key: "temperature",
            title: "Temperature",
            iconPath: "/icon/thermometer.png",
            range: "18°C - 28°C",
            label: "Day/Night",
            themeClass: "tempCard",
        },
        {
            key: "humidity",
            title: "Air humidity",
            iconPath: "/icon/leaves.png",
            range: "60% - 80%",
            label: "Relative",
            themeClass: "humidityCard",
        },
    ],
    careGuidelines: [
        {
            title: "Watering Routine",
            body: "Water Kono-Chan when the top 2-3 inches of soil feel dry. Monstera prefers slightly dry soil between waterings to prevent root rot.",
        },
        {
            title: "Light Requirements",
            body: "Bright, indirect light is best. Avoid direct afternoon sun as it can burn the leaves. If leaves start turning yellow, she might need more light.",
        },
        {
            title: "Cleaning & Grooming",
            body: "Wipe the large leaves with a damp cloth every 2 weeks to remove dust, which helps the plant photosynthesize more efficiently.",
        },
        {
            title: "Feeding",
            body: "Apply a balanced liquid fertilizer once a month during the growing season (Spring and Summer).",
        },
    ],
};

export const mockTimelineData: TimelineData = {
    healthHistory: [
        { x: "Mon", y: 45 },
        { x: "Tue", y: 42 },
        { x: "Wed", y: 55 },
        { x: "Thu", y: 65 },
        { x: "Fri", y: 78 },
        { x: "Sat", y: 80 },
        { x: "Sun", y: 75 },
    ],
    weeklyStats: [
        {
            key: "soil_moisture",
            label: "Avg. moisture",
            value: "64%",
            themeClass: "moisture",
        },
        {
            key: "light_exposure",
            label: "Light exposure",
            value: "52.4 hrs",
            themeClass: "lightExposure",
        },
        {
            key: "growth",
            label: "Growth",
            value: "+1.2 cm",
            themeClass: "growth",
        },
    ],
    eventLogs: [
        {
            title: "Critical: Low Soil Moisture",
            description: "Soil moisture dropped to 15% (Threshold: 25%). Emergency watering triggered.",
            timestampLabel: "10 min ago",
            iconPath: "/icon/water-droplet.png",
            iconBackgroundColor: "#FFEBEE",
        },
        {
            title: "Temperature Anomaly",
            description: "Unexpected temperature spike detected (38°C). Environment cooling initiated.",
            timestampLabel: "2 hr ago",
            iconPath: "/icon/thermometer.png",
            iconBackgroundColor: "#FFF3E0",
        },
        {
            title: "Growth Milestone Reached",
            description: "Height increase of 0.5cm detected since last scan. Overall health is improving.",
            timestampLabel: "5 hr ago",
            iconPath: "/icon/leaves.png",
            iconBackgroundColor: "#E8F5E9",
        },
        {
            title: "Sensor Calibration Success",
            description: "Moisture sensor #KH-01 successfully calibrated to new soil density.",
            timestampLabel: "1 day ago",
            iconPath: "/icon/sensor.png",
            iconBackgroundColor: "#E3F2FD",
        },
        {
            title: "Plant Status: Stable",
            description: "Weekly AI analysis complete. Plant shows high adaptation to current light levels.",
            timestampLabel: "2 days ago",
            iconPath: "/icon/protect.png",
            iconBackgroundColor: "#F3E5F5",
        },
    ],
};
