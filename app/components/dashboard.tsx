"use client"
import { useState } from "react";
import styles from "./dashboard.module.css";

interface plantTag {
    health: string;
    moise: string;
    light: string;
}

interface sensorsPercentage {
    moise: number;
    light: number;
    temperature: number;
    humidity: number;
}

export default function DashboardGrid() {
    const [plantName] = useState("Kono-Chan")
    const [descript] = useState("I'm feeling good today!")
    const [plantTag] = useState<plantTag>({ health: "Good", moise: "Succulent", light: "Full sun" })
    const [sensorsPercentage] = useState<sensorsPercentage>({ moise: 34, light: 820, temperature: 22, humidity: 48 })
    const [min] = useState(3);

    const percentage = 85;
    const strokeDasharray = 251.3;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <section className={styles.dashboardGrid}>

            {/* Header Section */}
            <div className={`${styles.headerCell} ${styles.card}`}>
                <section className={styles.profile}>
                    <img src="./icon/mockplant.jpeg" alt="plant-img" />
                </section>
                
                <section className={styles.info}>
                    <h3>{plantName}</h3>
                    <p><i>{`"${descript}"`}</i></p>

                    <div className={styles.infoTag}>
                        <div>
                            <img src="./icon/protect.png" alt="tag-icon" />
                            <p>Health: {plantTag.health}</p>
                        </div>
                        <div>
                            <img src="./icon/leaves.png" alt="tag-icon" />
                            <p>Moisture: {plantTag.moise}</p>
                        </div>
                        <div>
                            <img src="./icon/sun.png" alt="tag-icon" />
                            <p>Light: {plantTag.light}</p>
                        </div>
                    </div>

                    <div className={styles.lastUpdate}>
                        <img src="./icon/refresh.png" alt="refresh-img" />
                        <p>Last updated {min} min ago</p>
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
                            <span className={styles.percentage}>{`${percentage}%`}</span>
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
                        <p className={styles.emoji}>🤩</p>
                        <div className={styles.moodInfo}>
                            <h3>Happy</h3>
                            <p><i>Thriving and content</i></p>
                        </div>
                    </section>

                    <section className={styles.subGridMidLeft}>
                        <div className={styles.sensorItem}>
                            <p className={styles.sensorLabel}>Soil moisture</p>
                            <h6 className={styles.sensorValue}>{sensorsPercentage.moise}%</h6>
                            <p className={`${styles.statusText} ${styles.colorLow}`}>Low</p>
                        </div>
                        <div className={styles.sensorItem}>
                            <p className={styles.sensorLabel}>Light level</p>
                            <h6 className={styles.sensorValue}>{sensorsPercentage.light} lux</h6>
                            <p className={`${styles.statusText} ${styles.colorGood}`}>Good</p>
                        </div>
                        <div className={styles.sensorItem}>
                            <p className={styles.sensorLabel}>Temperature</p>
                            <h6 className={styles.sensorValue}>{sensorsPercentage.temperature}°C</h6>
                            <p className={`${styles.statusText} ${styles.colorNormal}`}>Normal</p>
                        </div>
                        <div className={styles.sensorItem}>
                            <p className={styles.sensorLabel}>Air humidity</p>
                            <h6 className={styles.sensorValue}>{sensorsPercentage.humidity}%</h6>
                            <p className={`${styles.statusText} ${styles.colorLow}`}>Low</p>
                        </div>
                    </section>
                </div>

                {/* Recent Activity Card */}
                <div className={`${styles.midRight} ${styles.card}`}>
                    <h3 className={styles.cardTitle}>Recent activity</h3>
                    
                    <div className={styles.logList}>
                        <section className={styles.logItem}>
                            <div className={styles.dot}></div>
                            <p className={styles.logText}>Moisture sensor reading logged</p>
                            <p className={styles.logTime}>3 min ago</p>
                        </section>

                        <section className={styles.logItem}>
                            <div className={styles.dot}></div>
                            <p className={styles.logText}>Light exposure peak recorded</p>
                            <p className={styles.logTime}>1 hr ago</p>
                        </section>

                        <section className={styles.logItem}>
                            <div className={styles.dot}></div>
                            <p className={styles.logText}>Watered by user</p>
                            <p className={styles.logTime}>2 days ago</p>
                        </section>

                        <section className={styles.logItem}>
                            <div className={styles.dot}></div>
                            <p className={styles.logText}>Health state updated to "good"</p>
                            <p className={styles.logTime}>3 days ago</p>
                        </section>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Care Advice */}
            <div className={`${styles.bottom} ${styles.card}`}>
                <img src="./icon/water.jpeg" alt="water-img" />
                <section className={styles.careAdvice}>
                    <h6>Care advice</h6>
                    <p>Soil moisture is slightly low. Please water Kono-Chan within today to keep her happy and healthy.</p>
                    <button className={styles.markBtn}>
                        Mark as Watered
                    </button>
                </section>
            </div>

        </section>
    );
}
