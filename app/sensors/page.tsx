import styles from "./page.module.css";
import Navbar from "../globals_components/navbar";
import FooterNav from "../globals_components/footer";

import LineChartGraph from "./components/area_chart";
import SensorsCard from "./components/sensorsCard";

import Title from "./components/title";
import { analyzePlant } from "../lib/konoha/analysis";
import { getDashboardData, toChartData } from "../lib/konoha/data";

export const dynamic = "force-dynamic";

function cardLevel(status: string | undefined): "Low" | "Normal" | "Good" {
  if (!status || status === "unknown") {
    return "Normal";
  }
  if (["good", "normal", "comfortable"].includes(status)) {
    return "Good";
  }
  if (status === "watch") {
    return "Normal";
  }
  return "Low";
}

function valueOrZero(value: number | null | undefined): number {
  return value === null || value === undefined ? 0 : Math.round(value);
}

function diffFor(values: { y: number }[]): number {
  if (values.length < 2) {
    return 0;
  }
  return Math.round(values[values.length - 1].y - values[0].y);
}

export default async function SensorsPage() {
  const data = await getDashboardData();
  const latest = data.latestReading;
  const analysis = analyzePlant(latest, data.readings);

  const moistureData = toChartData(data.readings, "soil_moisture_percent");
  const tempData = toChartData(data.readings, "temperature_c");
  const lightData = toChartData(data.readings, "light_lux");
  const humidityData = toChartData(data.readings, "humidity_percent");

  return (
    <>
      <Navbar focus={"sensor"}></Navbar>
      <main className={styles.main}>
        <section className={styles.mainContainer}>
          <Title></Title>

          <div className={styles.sensorsContainer}>
            <SensorsCard
              diffValue={diffFor(moistureData)}
              level={cardLevel(analysis.analysis.soil)}
              value={valueOrZero(latest?.soil_moisture_percent)}
              unit={"%"}
              color={"#8eb5f5"}
              title={"Soil moisture"}
              iconUrl={"/icon/water-droplet.png"}
            ></SensorsCard>
            <SensorsCard
              diffValue={diffFor(tempData)}
              level={cardLevel(analysis.analysis.temperature)}
              value={valueOrZero(latest?.temperature_c)}
              unit={"°C"}
              color={"#ff8e8e"}
              title={"Temperature"}
              iconUrl={"/icon/thermometer.png"}
            ></SensorsCard>
            <SensorsCard
              diffValue={diffFor(humidityData)}
              level={cardLevel(analysis.analysis.humidity)}
              value={valueOrZero(latest?.humidity_percent)}
              unit={"%"}
              color={"#8ef5a5"}
              title={"Humidity"}
              iconUrl={"/icon/leaves.png"}
            ></SensorsCard>
            <SensorsCard
              diffValue={diffFor(lightData)}
              level={cardLevel(analysis.analysis.light)}
              value={valueOrZero(latest?.light_lux)}
              unit={"Lux"}
              color={"#f5e38e"}
              title={"Sunlight"}
              iconUrl={"/icon/sun.png"}
            ></SensorsCard>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>Soil Moisture History</h3>
                <p>recent readings</p>
              </div>
              <div className={styles.chartWrapper}>
                <LineChartGraph
                  data={moistureData}
                  labelX="Time"
                  labelY="Moisture (%)"
                  domain={[0, 100]}
                  strokColor="#8eb5f5"
                  fillColor="#8eb5f5"
                />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>Temperature History</h3>
                <p>recent readings</p>
              </div>
              <div className={styles.chartWrapper}>
                <LineChartGraph
                  data={tempData}
                  labelX="Time"
                  labelY="Temp (°C)"
                  domain={[0, 50]}
                  strokColor="#f36464"
                  fillColor="#ff8e8e"
                />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>Sunlight Intensity</h3>
                <p>recent readings</p>
              </div>
              <div className={styles.chartWrapper}>
                <LineChartGraph
                  data={lightData}
                  labelX="Time"
                  labelY="Light (Lux)"
                  domain={[0, 3000]}
                  strokColor="#efd035"
                  fillColor="#f5e38e"
                />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>Air Humidity</h3>
                <p>recent readings</p>
              </div>
              <div className={styles.chartWrapper}>
                <LineChartGraph
                  data={humidityData}
                  labelX="Time"
                  labelY="Humidity (%)"
                  domain={[0, 100]}
                  strokColor="#39f060"
                  fillColor="#8ef5a5"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterNav focus={"sensor"}></FooterNav>
    </>
  );
}
