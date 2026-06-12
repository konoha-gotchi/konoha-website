import { mockDashboardData } from "../data/mock_data";
import styles from "./dashboard.module.css";
import type { SensorMetricLevel, SensorMetricSummary } from "../types/plant";

const statusClassByLevel: Record<SensorMetricLevel, string> = {
    Low: styles.colorLow,
    Normal: styles.colorNormal,
    Good: styles.colorGood,
};

const formatMetricValue = (metric: SensorMetricSummary) => {
    const separator = metric.unit === "lux" ? " " : "";
    return `${metric.value}${separator}${metric.unit}`;
};

export default function DashboardGrid() {
    const dashboardData = mockDashboardData;
    const displayedMetrics = dashboardData.sensorMetrics.slice(0, 4);

    const strokeDasharray = 251.3;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * dashboardData.plant_hp_percent) / 100;

    return (
        <section className={styles.dashboardGrid}>

            {/* Header Section */}
            <div className={`${styles.headerCell} ${styles.card}`}>
                <section className={styles.profile}>
                    <img src={dashboardData.plant.imagePath} alt={dashboardData.plant.name} />
                </section>
                
                <section className={styles.info}>
                    <h3>{dashboardData.plant.name}</h3>
                    <p><i>{`"${dashboardData.ai_report.plant_message}"`}</i></p>

                    <div className={styles.infoTag}>
                        {dashboardData.plantTags.map((tag) => (
                            <div key={tag.label}>
                                <img src={tag.iconPath} alt="" />
                                <p>{tag.label}: {tag.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.lastUpdate}>
                        <img src="/icon/refresh.png" alt="" />
                        <p>Last updated {dashboardData.last_updated_label}</p>
                    </div>
                </section>
                
                <section className={styles.health}>
                    <div className={styles.progressContainer}>
                        <svg className={styles.progressSvg} viewBox="0 0 100 100">
                            <circle className={`${styles.circleProgress} ${styles.bgCircle}`} cx="50" cy="50" r="40"></circle>
                            <circle className={`${styles.circleProgress} ${styles.fgCircle}`} cx="50" cy="50" r="40"
                                style={{ strokeDasharray: strokeDasharray, strokeDashoffset: strokeDashoffset }}
                            ></circle>
                        </svg>
                        
                        <div className={styles.progressText}>
                            <span className={styles.percentage}>{`${dashboardData.plant_hp_percent}%`}</span>
                            <span className={styles.label}>Plant HP</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Middle Section: Mood & Sensors, Recent Activity */}
            <div className={styles.midGrid}>
                
                {/* Mood & Sensors Card */}
                <div className={`${styles.midLeft} ${styles.card}`}>
                    <h3 className={styles.cardTitle}>Mood & Sensors</h3>

                    <section className={styles.moodSection}>
                        <p className={styles.emoji}>{dashboardData.mood.emoji}</p>
                        <div className={styles.moodInfo}>
                            <h3>{dashboardData.mood.label}</h3>
                            <p><i>{dashboardData.mood.description}</i></p>
                        </div>
                    </section>

                    <section className={styles.subGridMidLeft}>
                        {displayedMetrics.map((metric) => (
                            <div className={styles.sensorItem} key={metric.key}>
                                <p className={styles.sensorLabel}>{metric.label}</p>
                                <h6 className={styles.sensorValue}>{formatMetricValue(metric)}</h6>
                                <p className={`${styles.statusText} ${statusClassByLevel[metric.level]}`}>{metric.level}</p>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Recent Activity Card */}
                <div className={`${styles.midRight} ${styles.card}`}>
                    <h3 className={styles.cardTitle}>Recent activity</h3>
                    
                    <div className={styles.logList}>
                        {dashboardData.recentActivity.map((activity) => (
                            <section className={styles.logItem} key={`${activity.title}-${activity.timestampLabel}`}>
                                <div className={styles.dot}></div>
                                <p className={styles.logText}>{activity.title}</p>
                                <p className={styles.logTime}>{activity.timestampLabel}</p>
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Care Advice */}
            <div className={`${styles.bottom} ${styles.card}`}>
                <img src={dashboardData.careAdvice.imagePath} alt="" />
                <section className={styles.careAdvice}>
                    <h6>{dashboardData.careAdvice.title}</h6>
                    <p>{dashboardData.careAdvice.body}</p>
                    <button className={styles.markBtn}>
                        {dashboardData.careAdvice.actionLabel}
                    </button>
                </section>
            </div>

        </section>
    );
}
