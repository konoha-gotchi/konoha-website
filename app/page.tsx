import styles from "./page.module.css";

import Navbar from "./globals_components/navbar";
import DashboardGrid  from "./components/dashboard";
import FooterNav from "./globals_components/footer";
import { getDashboardData } from "./data/dashboard_data";

export default async function Home() {
  const dashboardData = await getDashboardData();

  return (
   <>
    <Navbar focus={"dashboard"}></Navbar>
    <main className = {styles.main}>
        <DashboardGrid dashboardData={dashboardData}></DashboardGrid>
    </main>
    <FooterNav focus={"dashboard"}></FooterNav>
   </>
  );
}
