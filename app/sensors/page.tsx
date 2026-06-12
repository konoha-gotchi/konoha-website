import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"

import { sensorMetrics } from "../data/mock_data"
import AreaChartGraph from "./components/area_chart"
import SensorCard from "./components/sensor_card"

import Title from "./components/title"

export default function SensorsPage(){
    return (
    <>
        <Navbar focus={"sensors"}></Navbar>
        <main className = {styles.main}>
            <section className = {styles.mainContainer}>
                <Title></Title>
                
                {/* Cards Section */}
                <div className = {styles.sensorsContainer}>
                    {sensorMetrics.map((metric) => (
                        <SensorCard
                            key={metric.key}
                            changePercentFromPrevious={metric.change_percent_from_previous}
                            level={metric.level}
                            value={metric.value}
                            unit={metric.unit}
                            accentColor={metric.accentColor}
                            label={metric.label}
                            iconPath={metric.iconPath}
                        />
                    ))}
                </div>

                {/* Graphs Grid Section */}
                <div className={styles.chartsGrid}>
                    {sensorMetrics.map((metric) => (
                        <div className={styles.chartCard} key={`${metric.key}-chart`}>
                            <div className={styles.chartHeader}>
                                <h3>{metric.chartTitle}</h3>
                                <p>{metric.chartDescription}</p>
                            </div>
                            <div className={styles.chartWrapper}>
                                <AreaChartGraph
                                    data={metric.history}
                                    xAxisLabel="Time"
                                    yAxisLabel={metric.yAxisLabel}
                                    domain={metric.chartDomain}
                                    strokeColor={metric.strokeColor}
                                    fillColor={metric.fillColor}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
        <FooterNav focus={"sensors"}></FooterNav>
    </>
    )
}
