import styles from "./sensorsCard.module.css"
import ProgressBar from "./progress_bar";

interface Props{
    level : "Low" | "Normal" |"Good";
    iconUrl : string;
    title : string;
    value : number;
    unit : string;
    color : string;
    diffValue : number;
}

export default function SensorsCard({level,iconUrl,title,value,unit, color , diffValue} : Props){
    

    return (
        <>
            <div className = {styles.mainCard}>
                <div className = {styles.title}>
                    <div className={styles.imgContainer} style={{backgroundColor : color}}>
                        <img src= {iconUrl} alt="sensors-data-icon" />
                    </div>
                    <div className={`${styles.status} ${level == "Good" ? styles.good : level == "Low" ? styles.low : styles.normal}  `}>
                        <p >{level}</p>
                    </div>
                </div>
                <p className={styles.titleText}>{title}</p>
                <div className={styles.valueContainer}>
                    <p className={styles.value1}>{value}</p>
                    <p className={styles.value2}>{unit}</p>
                </div>
                <p className={`${styles.description} ${diffValue == 0 ? styles.stable: diffValue > 0 ? styles.increase : styles.decrease  }`}>
                   {diffValue == 0 ? "Stable today" : `${diffValue > 0 ? "+" : "-"} ${Math.abs(diffValue)} recent change`}
                </p>
                <ProgressBar value={Math.abs(diffValue)} color={diffValue == 0 ? "gray" : diffValue > 0 ? "green": "orange"}></ProgressBar>
            </div>  
        </>
    )
}
