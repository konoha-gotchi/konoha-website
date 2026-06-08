"use client"

import React from 'react';
import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"

// เรียกใช้กราฟที่มีอยู่ตามคำสั่ง
import LineChartGraph from "../sensors/components/area_chart"
import TimelineItem from "./components/timeline_item"

export default function Timeline(){
    
    // ข้อมูลกราฟสีเขียว (Plant Health History)
    const healthHistoryData = [
        { x: 'Mon', y: 45 },
        { x: 'Tue', y: 42 },
        { x: 'Wed', y: 55 },
        { x: 'Thu', y: 65 },
        { x: 'Fri', y: 78 },
        { x: 'Sat', y: 80 },
        { x: 'Sun', y: 75 },
    ];

    // ข้อมูล Activity Feed ตาม Template เป๊ะๆ
    const activityFeed = [
        {
            title: "Moisture sensor reading logged",
            description: "Sensor #KH-01 recorded a level of 62%, well within optimal parameters.",
            timestamp: "3 min ago",
            iconUrl: "/icon/sensor.png",
            iconBgColor: "#4CAF50" // Green
        },
        {
            title: "Light exposure peak recorded",
            description: "Peak photosynthesis window reached. UV index was at moderate levels (3.4).",
            timestamp: "1 hr ago",
            iconUrl: "/icon/sun.png",
            iconBgColor: "#81D4FA" // Light Blue
        },
        {
            title: "Watered by user",
            description: "Manual watering event triggered via mobile app. 250ml added.",
            timestamp: "2 days ago",
            iconUrl: "/icon/water-droplet.png",
            iconBgColor: "#EF9A9A" // Red/Pink
        },
        {
            title: "Health state updated to \"good\"",
            description: "AI analysis confirmed successful adaptation to new soil nutrients.",
            timestamp: "3 days ago",
            iconUrl: "/icon/leaves.png",
            iconBgColor: "#C8E6C9" // Pale Green
        }
    ];

    return (
        <>
            <Navbar focus="timeline"></Navbar>

            <main className={styles.main}>
                <div className={styles.container}>
                    
                    {/* Header: Timeline & Subtitle */}
                    <header className={styles.header}>
                        <h1>Timeline</h1>
                        <p>Health history and activity log for your digital companion.</p>
                    </header>

                    {/* Top Grid: Plant Health History (Graph) & Weekly Stats */}
                    <div className={styles.topGrid}>
                        
                        {/* 1. Plant Health History Card */}
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2>Plant Health History</h2>
                                <div className={styles.toggleGroup}>
                                    <button className={`${styles.toggleBtn} ${styles.active}`}>7D</button>
                                </div>
                            </div>
                            <div className={styles.chartWrapper}>
                                <LineChartGraph 
                                    data={healthHistoryData} 
                                    labelX="Day" 
                                    labelY="Health (%)" 
                                    domain={[0, 100]}
                                    strokColor="#10b981" // เขียวเข้ม
                                    fillColor="rgba(16, 185, 129, 0.1)" // เขียวจางๆ
                                />
                            </div>
                        </section>

                        {/* 2. Weekly Stats Card */}
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2>
                                    <img src="/icon/dashboard.png" width="20" style={{opacity: 0.7}} alt="" />
                                    Weekly Stats
                                </h2>
                            </div>
                            <div className={styles.statsList}>
                                <div className={`${styles.statItem} ${styles.moisture}`}>
                                    <span className={styles.statLabel}>Avg. Moisture</span>
                                    <span className={styles.statValue}>64%</span>
                                </div>
                                <div className={`${styles.statItem} ${styles.sunlight}`}>
                                    <span className={styles.statLabel}>Sunlight</span>
                                    <span className={styles.statValue}>52.4 hrs</span>
                                </div>
                                <div className={`${styles.statItem} ${styles.growth}`}>
                                    <span className={styles.statLabel}>Growth</span>
                                    <span className={styles.statValue}>+1.2 cm</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Bottom Section: Activity Feed Card */}
                    <section className={styles.activityCard}>
                        <div className={styles.feedHeader}>
                            <h2>Activity Feed</h2>
                            {/* Filter Icon Placeholder */}
                            <div className={styles.filterIcon}>
                                <div style={{width: '20px', height: '2px', background: '#333', marginBottom: '4px'}}></div>
                                <div style={{width: '14px', height: '2px', background: '#333', marginBottom: '4px', marginLeft: '3px'}}></div>
                                <div style={{width: '8px', height: '2px', background: '#333', marginLeft: '6px'}}></div>
                            </div>
                        </div>

                        <div className={styles.feedList}>
                            {activityFeed.map((item, index) => (
                                <TimelineItem 
                                    key={index}
                                    title={item.title}
                                    description={item.description}
                                    timestamp={item.timestamp}
                                    iconUrl={item.iconUrl}
                                    iconBgColor={item.iconBgColor}
                                />
                            ))}
                        </div>

                        {/* Button as per Template */}
                        <button className={styles.loadMoreBtn}>
                            Load Older Events
                        </button>
                    </section>

                </div>
            </main>

            <FooterNav focus="timeline"></FooterNav>
        </>
    )
}
