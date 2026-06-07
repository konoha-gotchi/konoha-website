import styles from "./navbar.module.css"

export default function Navbar() {
  return (
   <>
    <nav className={styles.navbar}>
        <section className={styles.navbarLogo}>
            <img src={"./icon/logo.png"} alt={"logo"}></img>
            <h3>Konoha Gotchi</h3>
        </section>
        <section className={styles.navbarList}>
            <ul>
                <li>Dashboard
                    <div></div>
                </li>
                <li>Sensors</li>
                <li>Timeline</li>
                <li>Plant info</li>
            </ul>
        </section>
        <section className={styles.navbarProfile}>
            <img className={styles.notification} src="./icon/notification.png" alt="notification" />
            <div className={styles.profile}> 
                <img src="./icon/mockplant.jpeg" alt="profile" />
            </div>
        </section>
    </nav>
   </>
  );
}