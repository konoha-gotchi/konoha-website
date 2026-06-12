"use client"
import styles from "./navbar.module.css"
import { useRouter } from 'next/navigation'
interface Props{
    focus : "dashboard" | "sensors" | "timeline" | "plantInfo"
}


export default function Navbar({focus} : Props) {

    const router = useRouter()

    const handleNavigation = (value : string)=>{
        if(value === "dashboard"){
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
                <li className={focus === "dashboard" ? styles.focus : ""} onClick={ () => handleNavigation("dashboard")}>
                    <img src="/icon/dashboard.png" alt="dashboard-icon-img" />
                    <p>Dashboard</p>
                </li>
                <li className={focus === "sensors" ? styles.focus : ""} onClick={ () => handleNavigation("sensors")}>
                    <img src="/icon/sensor.png" alt="dashboard-icon-img" />
                    <p>Sensors</p>
                </li>
                <li className={focus === "timeline" ? styles.focus : ""} onClick={ () => handleNavigation("timeline")}>
                    <img src="/icon/clock.png" alt="dashboard-icon-img" />
                    <p>Timeline</p>
                </li>
                <li className={focus === "plantInfo" ? styles.focus : ""} onClick={ () => handleNavigation("plantInfo")}>
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
