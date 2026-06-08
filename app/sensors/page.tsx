import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"

import LineChartGraph from "./components/area_chart"
import SensorsCard from "./components/sensorsCard"

import Title from "./components/title"

export default function SensorsPage(){
    const mockMoistureData = [
        { x: '06:00', y: 30 }, { x: '09:00', y: 45 }, { x: '12:00', y: 35 },
        { x: '15:00', y: 50 }, { x: '18:00', y: 40 }, { x: '21:00', y: 34 }
    ];

    const mockTempData = [
        { x: '06:00', y: 22 }, { x: '09:00', y: 26 }, { x: '12:00', y: 31 },
        { x: '15:00', y: 33 }, { x: '18:00', y: 28 }, { x: '21:00', y: 24 }
    ];

    const mockLightData = [
        { x: '06:00', y: 100 }, { x: '09:00', y: 400 }, { x: '12:00', y: 800 },
        { x: '15:00', y: 600 }, { x: '18:00', y: 200 }, { x: '21:00', y: 50 }
    ];

    const mockHumidityData = [
        { x: '06:00', y: 80 }, { x: '09:00', y: 70 }, { x: '12:00', y: 55 },
        { x: '15:00', y: 50 }, { x: '18:00', y: 65 }, { x: '21:00', y: 75 }
    ];

    return (
    <>
        <Navbar focus={"sensor"}></Navbar>
        <main className = {styles.main}>
            <section className = {styles.mainContainer}>
                <Title></Title>
                
                {/* Cards Section */}
                <div className = {styles.sensorsContainer}>
                    <SensorsCard diffValue={-20} level={"Low"} value={34} unit={"%"} color={"#8eb5f5"}
                    title={"Soil moisture"} iconUrl={"/icon/water-droplet.png"} ></SensorsCard>
                    <SensorsCard diffValue={50} level={"Good"} value={28} unit={"°C"} color={"#ff8e8e"}
                    title={"Temperature"} iconUrl={"/icon/thermometer.png"} ></SensorsCard>
                    <SensorsCard diffValue={0} level={"Normal"} value={75} unit={"%"} color={"#8ef5a5"}
                    title={"Humidity"} iconUrl={"/icon/leaves.png"} ></SensorsCard>
                    <SensorsCard diffValue={15} level={"Good"} value={450} unit={"Lux"} color={"#f5e38e"}
                    title={"Sunlight"} iconUrl={"/icon/sun.png"} ></SensorsCard>
                </div>

                {/* Graphs Grid Section */}
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Soil Moisture History</h3>
                            <p>last 6 hours</p>
                        </div>
                        <div className={styles.chartWrapper}>
                            <LineChartGraph data={mockMoistureData} labelX="Time" labelY="Moisture (%)" domain={[0,100]}
                                strokColor="#8eb5f5" fillColor="#8eb5f5"
                            />
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Temperature History</h3>
                            <p>last 6 hours</p>
                        </div>
                        <div className={styles.chartWrapper}>
                            <LineChartGraph data={mockTempData} labelX="Time" labelY="Temp (°C)" domain={[0,100]}
                                strokColor="#f36464" fillColor="#ff8e8e"
                            />
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Sunlight Intensity</h3>
                            <p>last 6 hours</p>
                        </div>
                        <div className={styles.chartWrapper}>
                            <LineChartGraph data={mockLightData} labelX="Time" labelY="Light (Lux)" domain={[0,3000]}
                                strokColor="#efd035" fillColor="#f5e38e"
                            />
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Air Humidity</h3>
                            <p>last 6 hours</p>
                        </div>
                        <div className={styles.chartWrapper}>
                            <LineChartGraph data={mockHumidityData} labelX="Time" labelY="Humidity (%)" domain={[0,100]}
                                strokColor="#39f060" fillColor="#8ef5a5"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <FooterNav focus={"sensor"}></FooterNav>
    </>
    )
}