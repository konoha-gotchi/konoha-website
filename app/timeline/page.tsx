import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"

import { mockTimelineData } from "../data/mock_data"
import AreaChartGraph from "../sensors/components/area_chart"
import TimelineItem from "./components/timeline_item"

export default function Timeline(){
    const timelineData = mockTimelineData;

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
                                <AreaChartGraph
                                    data={timelineData.healthHistory}
                                    xAxisLabel="Day"
                                    yAxisLabel="Health (%)"
                                    domain={[0, 100]}
                                    strokeColor="#10b981"
                                    fillColor="rgba(16, 185, 129, 0.1)"
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
                                {timelineData.weeklyStats.map((stat) => (
                                    <div className={`${styles.statItem} ${styles[stat.themeClass]}`} key={stat.key}>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                        <span className={styles.statValue}>{stat.value}</span>
                                    </div>
                                ))}
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
                            {timelineData.eventLogs.map((item) => (
                                <TimelineItem 
                                    key={`${item.title}-${item.timestampLabel}`}
                                    title={item.title}
                                    description={item.description ?? ""}
                                    timestampLabel={item.timestampLabel}
                                    iconPath={item.iconPath ?? "/icon/info.png"}
                                    iconBackgroundColor={item.iconBackgroundColor ?? "#E3F2FD"}
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
