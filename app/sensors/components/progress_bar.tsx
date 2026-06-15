'use client';

import styles from "./progress_bar.module.css"

interface ProgressBarProps {
  value: number; 
  trend: "increase" | "decrease" | "stable";
}


export default function ProgressBar({ value = 0, trend = "stable" }: ProgressBarProps) {
  const validatedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${styles[trend]}`}
          style={{ width: `${validatedValue}%` }} 
        />
      </div>
    </div>
  );
}
