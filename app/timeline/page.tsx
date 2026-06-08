"use client"

import React from 'react';
import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"

// Use existing graph component
import LineChartGraph from "../sensors/components/area_chart"
import TimelineItem from "./components/timeline_item"

export default function Timeline(){
    
    // Plant Health History mock data
    const healthHistoryData = [
        { x: 'Mon', y: 45 },
        { x: 'Tue', y: 42 },
        { x: 'Wed', y: 55 },
        { x: 'Thu', y: 65 },
        { x: 'Fri', y: 78 },
        { x: 'Sat', y: 80 },
        { x: 'Sun', y: 75 },
    ];

    // Event logs mock data for tracking anomalies and changes
    const eventLogs = [
        {
            title: "Critical: Low Soil Moisture",
            description: "Soil moisture dropped to 15% (Threshold: 25%). Emergency watering triggered.",
            timestamp: "10 min ago",
            iconUrl: "/icon/water-droplet.png",
            iconBgColor: "#FFEBEE" // Critical alert color
        },
        {
            title: "Temperature Anomaly",
            description: "Unexpected temperature spike detected (38°C). Environment cooling initiated.",
            timestamp: "2 hr ago",
            iconUrl: "/icon/thermometer.png",
            iconBgColor: "#FFF3E0" // Warning color
        },
        {
            title: "Growth Milestone Reached",
            description: "Height increase of 0.5cm detected since last scan. Overall health is improving.",
            timestamp: "5 hr ago",
            iconUrl: "/icon/leaves.png",
            iconBgColor: "#E8F5E9" // Positive color
        },
        {
            title: "Sensor Calibration Success",
            description: "Moisture sensor #KH-01 successfully calibrated to new soil density.",
            timestamp: "1 day ago",
            iconUrl: "/icon/sensor.png",
            iconBgColor: "#E3F2FD" // Info color
        },
        {
            title: "Health Status: Stable",
            description: "Weekly AI analysis complete. Plant shows high adaptation to current light levels.",
            timestamp: "2 days ago",
            iconUrl: "/icon/protect.png",
            iconBgColor: "#F3E5F5" // Status update color
        }
    ];

    return (
        <>
            <Navbar focus="timeline"></Navbar>

            <main className={styles.main}>
                <div className={styles.container}>
                    
                    {/* Header Section */}
                    <header className={styles.header}>
                        <h1>Timeline</h1>
                        <p>Detailed event logs and historical health tracking.</p>
                    </header>

                    {/* Top Section: Health History & Weekly Stats */}
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
                                    strokColor="#10b981" // Dark green
                                    fillColor="rgba(16, 185, 129, 0.1)" // Light green background
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

                    {/* Bottom Section: Event Logs */}
                    <section className={styles.activityCard}>
                        <div className={styles.feedHeader}>
                            <h2>Event logs</h2>
                            {/* Filter Icon Placeholder */}
                            <div className={styles.filterIcon}>
                                <div style={{width: '20px', height: '2px', background: '#333', marginBottom: '4px'}}></div>
                                <div style={{width: '14px', height: '2px', background: '#333', marginBottom: '4px', marginLeft: '3px'}}></div>
                                <div style={{width: '8px', height: '2px', background: '#333', marginLeft: '6px'}}></div>
                            </div>
                        </div>

                        <div className={styles.feedList}>
                            {eventLogs.map((item, index) => (
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

                        <button className={styles.loadMoreBtn}>
                            Load Older Logs
                        </button>
                    </section>

                </div>
            </main>

            <FooterNav focus="timeline"></FooterNav>
        </>
    )
}
