import type { SensorMetricLevel } from "@/app/types/plant";
import styles from "./sensor_card.module.css"
import ProgressBar from "./progress_bar";

interface SensorCardProps{
    level: SensorMetricLevel;
    iconPath: string;
    label: string;
    value: number;
    unit: string;
    accentColor: string;
    changePercentFromPrevious: number;
}

export default function SensorCard({
    level,
    iconPath,
    label,
    value,
    unit,
    accentColor,
    changePercentFromPrevious,
}: SensorCardProps){
    const trend = changePercentFromPrevious === 0
        ? "stable"
        : changePercentFromPrevious > 0
            ? "increase"
            : "decrease";

    const changeLabel = changePercentFromPrevious === 0
        ? "Stable today"
        : `${changePercentFromPrevious > 0 ? "+" : "-"}${Math.abs(changePercentFromPrevious)}% from yesterday`;

    return (
        <>
            <div className = {styles.mainCard}>
                <div className = {styles.title}>
                    <div className={styles.imgContainer} style={{backgroundColor : accentColor}}>
                        <img src= {iconPath} alt="" />
                    </div>
                    <div className={`${styles.status} ${level === "Good" ? styles.good : level === "Low" ? styles.low : styles.normal}  `}>
                        <p >{level}</p>
                    </div>
                </div>
                <p className={styles.titleText}>{label}</p>
                <div className={styles.valueContainer}>
                    <p className={styles.value1}>{value}</p>
                    <p className={styles.value2}>{unit}</p>
                </div>
                <p className={`${styles.description} ${styles[trend]}`}>
                   {changeLabel}
                </p>
                <ProgressBar value={Math.abs(changePercentFromPrevious)} trend={trend}></ProgressBar>
            </div>  
        </>
    )
}
