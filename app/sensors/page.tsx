import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"

import LineChartGraph from "./components/area_chart"
import ProgressBar from "./components/progress_bar"
export default function SensorsPage(){
    return (
    <>
        <Navbar></Navbar>
        <main className = {styles.main}>
            <div className = {styles.lineChartContainer}>

            </div>
        </main>
        <FooterNav></FooterNav>
    </>
    )
}