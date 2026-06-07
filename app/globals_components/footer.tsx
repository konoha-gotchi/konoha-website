import styles from "./footer.module.css"

export default function FooterNav(){
    return (
        <>
            <footer className = {styles.footer}>
                <ul>
                    <li>
                        <img src="./icon/dashboard.png" alt="dashboard-icon" />
                        <p>Dashboard</p>
                    </li>
                    <li>
                        <img src="./icon/sensor.png" alt="sensor-icon" />
                        <p>Sensors</p></li>
                    <li>
                        <img src="./icon/clock.png" alt="timeline-icon" />
                        <p>Timeline</p></li>
                    <li>
                        <img src="./icon/sensor.png" alt="info-icon" />
                        <p>Plant info</p>
                    </li>
                </ul>
            </footer>
        </>
    )
}