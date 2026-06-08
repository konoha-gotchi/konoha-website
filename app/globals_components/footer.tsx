"use client"
import styles from "./footer.module.css"
import { useRouter } from 'next/navigation'
interface Props{
    focus : "dashboard" | "sensor" | "timeline" | "plantInfo"
}

export default function FooterNav({focus} : Props){
    const router = useRouter()

    const hanelclick = (value : string)=>{
        if(value == "dashboard"){
            router.push(`/`)
            return;
        }
        router.push(`/${value}`)
    }
    return (
        <>
            <footer className = {styles.footer}>
                <ul>
                    <li className={focus == "dashboard" ? styles.focus : ""} onClick={ () => hanelclick("dashboard")}>
                        <img src="/icon/dashboard.png" alt="dashboard-icon" />
                        <p>Dashboard</p>
                    </li>
                    <li className={focus == "sensor" ? styles.focus : ""} onClick={ () => hanelclick("sensors")}>
                        <img src="/icon/sensor.png" alt="sensor-icon" />
                        <p>Sensors</p></li>
                    <li className={focus == "timeline" ? styles.focus : ""} onClick={ () => hanelclick("timeline")}>
                        <img src="/icon/clock.png" alt="timeline-icon" />
                        <p>Timeline</p></li>
                    <li className={focus == "plantInfo" ? styles.focus : ""} onClick={ () => hanelclick("plantInfo")}>
                        <img src="/icon/sensor.png" alt="info-icon" />
                        <p>Plant info</p>
                    </li>
                </ul>
            </footer>
        </>
    )
}