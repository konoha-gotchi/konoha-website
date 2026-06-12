import GenerateReportButton from "./generate-report-button";
import styles from "./dashboard.module.css";
import { analyzePlant } from "../lib/konoha/analysis";
import { getDashboardData } from "../lib/konoha/data";
import { formatMetric, relativeTime } from "../lib/konoha/format";
import type { PlantAiReport, PlantReading } from "../lib/konoha/types";

function statusClass(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("good") || normalized.includes("normal") || normalized.includes("comfortable")) {
    return styles.colorGood;
  }
  if (normalized.includes("watch")) {
    return styles.colorNormal;
  }
  return styles.colorLow;
}

function buildActivity(readings: PlantReading[], report: PlantAiReport | null) {
  const activity = [];

  if (report) {
    activity.push({
      text: `Plant message generated: ${report.status_level}`,
      time: relativeTime(report.created_at),
    });
  }

  for (const reading of readings.slice(-3).reverse()) {
    activity.push({
      text: `Sensor reading logged (${formatMetric(reading.soil_moisture_percent, 1)}% soil)`,
      time: relativeTime(reading.created_at),
    });
  }

  if (activity.length === 0) {
    activity.push({
      text: "Waiting for the first sensor reading",
      time: "not yet",
    });
  }

  return activity.slice(0, 4);
}

export default async function DashboardGrid() {
  const plantName = "Kono-Chan";
  const data = await getDashboardData();
  const latest = data.latestReading;
  const analysis = analyzePlant(latest, data.readings);
  const activity = buildActivity(data.readings, data.latestReport);
  const plantMessage = data.latestReport?.plant_message ?? analysis.plantMessage;

  const strokeDasharray = 251.3;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * analysis.healthScore) / 100;

  const sensors = [
    {
      label: "Soil moisture",
      value: `${formatMetric(latest?.soil_moisture_percent, 1)}%`,
      status: analysis.analysis.soil ?? "unknown",
    },
    {
      label: "Light level",
      value: `${formatMetric(latest?.light_lux, 0)} lux`,
      status: analysis.analysis.light ?? "unknown",
    },
    {
      label: "Temperature",
      value: `${formatMetric(latest?.temperature_c, 1)}°C`,
      status: analysis.analysis.temperature ?? "unknown",
    },
    {
      label: "Air humidity",
      value: `${formatMetric(latest?.humidity_percent, 1)}%`,
      status: analysis.analysis.humidity ?? "unknown",
    },
  ];

  return (
    <section className={styles.dashboardGrid}>
      <div className={`${styles.headerCell} ${styles.card}`}>
        <section className={styles.profile}>
          <img src="/icon/mockplant.jpeg" alt="plant" />
        </section>

        <section className={styles.info}>
          <h3>{plantName}</h3>
          <p>
            <i>{`"${plantMessage}"`}</i>
          </p>

          <div className={styles.infoTag}>
            <div>
              <img src="/icon/protect.png" alt="" />
              <p>Health: {analysis.statusLabel}</p>
            </div>
            <div>
              <img src="/icon/leaves.png" alt="" />
              <p>Moisture: {analysis.analysis.soil?.replace("_", " ") ?? "unknown"}</p>
            </div>
            <div>
              <img src="/icon/sun.png" alt="" />
              <p>Light: {analysis.analysis.light ?? "unknown"}</p>
            </div>
          </div>

          <div className={styles.lastUpdate}>
            <img src="/icon/refresh.png" alt="" />
            <p>Last updated {relativeTime(latest?.created_at)}</p>
          </div>
        </section>

        <section className={styles.health}>
          <div className={styles.progressContainer}>
            <svg className={styles.progressSvg} viewBox="0 0 100 100">
              <circle className={`${styles.circleProgress} ${styles.bgCircle}`} cx="50" cy="50" r="40" />
              <circle
                className={`${styles.circleProgress} ${styles.fgCircle}`}
                cx="50"
                cy="50"
                r="40"
                style={{ strokeDasharray, strokeDashoffset }}
              />
            </svg>

            <div className={styles.progressText}>
              <span className={styles.percentage}>{`${analysis.healthScore}%`}</span>
              <span className={styles.label}>Plant HP</span>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.midGrid}>
        <div className={`${styles.midLeft} ${styles.card}`}>
          <h3 className={styles.cardTitle}>Mood & Sensors</h3>

          <section className={styles.moodSection}>
            <p className={styles.emoji}>{analysis.moodEmoji}</p>
            <div className={styles.moodInfo}>
              <h3>{analysis.moodLabel}</h3>
              <p>
                <i>{analysis.moodDetail}</i>
              </p>
            </div>
          </section>

          <section className={styles.subGridMidLeft}>
            {sensors.map((sensor) => (
              <div className={styles.sensorItem} key={sensor.label}>
                <p className={styles.sensorLabel}>{sensor.label}</p>
                <h6 className={styles.sensorValue}>{sensor.value}</h6>
                <p className={`${styles.statusText} ${statusClass(sensor.status)}`}>
                  {sensor.status.replace("_", " ")}
                </p>
              </div>
            ))}
          </section>
        </div>

        <div className={`${styles.midRight} ${styles.card}`}>
          <h3 className={styles.cardTitle}>Recent activity</h3>

          <div className={styles.logList}>
            {activity.map((item) => (
              <section className={styles.logItem} key={`${item.text}-${item.time}`}>
                <div className={styles.dot}></div>
                <p className={styles.logText}>{item.text}</p>
                <p className={styles.logTime}>{item.time}</p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.bottom} ${styles.card}`}>
        <img src="/icon/water.jpeg" alt="watering can" />
        <section className={styles.careAdvice}>
          <h6>Care advice</h6>
          <p>{data.latestReport?.summary ?? analysis.summary}</p>
          <GenerateReportButton buttonClassName={styles.markBtn} statusClassName={styles.actionStatus} />
        </section>
      </div>

      <div className={styles.debugPanel}>
        <span>{data.usingMockData ? "Mock data" : "Supabase live"}</span>
        <span>Fresh: {analysis.isFresh ? "yes" : "no"}</span>
        <span>Sensor: {latest?.sensor_status ?? "unknown"}</span>
        {data.dataError ? <span>{data.dataError}</span> : null}
      </div>
    </section>
  );
}
