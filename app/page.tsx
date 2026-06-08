import styles from "./page.module.css";

import Navbar from "./globals_components/navbar";
import DashboardGrid  from "./components/dashboard";
import FooterNav from "./globals_components/footer";
export default function Home() {
  return (
   <>
    <Navbar focus={"dashboard"}></Navbar>
    <main className = {styles.main}>
        <DashboardGrid></DashboardGrid>
    </main>
    <FooterNav focus={"dashboard"}></FooterNav>
   </>
  );
}
