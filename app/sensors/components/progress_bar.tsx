'use client';

import styles from "./progress_bar.module.css"

interface ProgressBarProps {
  value: number; 
  color : "green" | "orange" | "gray"
}


export default function ProgressBar({ value = 0, color = "gray" }: ProgressBarProps) {
  const validatedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${color == "gray" ? styles.stable : color == "green" ? styles.increase : styles.decrease}`} 
          style={{ width: `${validatedValue}%` }} 
        />
      </div>
    </div>
  );
}
