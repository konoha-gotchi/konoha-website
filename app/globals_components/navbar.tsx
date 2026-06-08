"use client"
import styles from "./navbar.module.css"
import { useRouter } from 'next/navigation'
interface Props{
    focus : "dashboard" | "sensor" | "timeline" | "plantInfo"
}


export default function Navbar({focus} : Props) {

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
    <nav className={styles.navbar}>
        <section className={styles.navbarLogo}>
            <img src={"/icon/app.png"} alt={"logo"}></img>
            <h3>Konoha Gotchi</h3>
        </section>
        <section className={styles.navbarList}>
            <ul>
                <li className={focus == "dashboard" ? styles.focus : ""} onClick={ () => hanelclick("dashboard")}>
                    <img src="/icon/dashboard.png" alt="dashboard-icon-img" />
                    <p>Dashboard</p>
                </li>
                <li className={focus == "sensor" ? styles.focus : ""} onClick={ () => hanelclick("sensors")}>
                    <img src="/icon/sensor.png" alt="dashboard-icon-img" />
                    <p>Sensors</p>
                </li>
                <li className={focus == "timeline" ? styles.focus : ""} onClick={ () => hanelclick("timeline")}>
                    <img src="/icon/clock.png" alt="dashboard-icon-img" />
                    <p>Timeline</p>
                </li>
                <li className={focus == "plantInfo" ? styles.focus : ""} onClick={ () => hanelclick("plantInfo")}>
                    <img src="/icon/info.png" alt="dashboard-icon-img" />
                    <p>Plant info</p>
                </li>
            </ul>
        </section>
        <section className={styles.navbarProfile}>
            <img className={styles.notification} src="/icon/notification.png" alt="notification" />
            <div className={styles.profile}> 
                <img src="/icon/mockplant.jpeg" alt="profile" />
            </div>
        </section>
    </nav>
   </>
  );
}