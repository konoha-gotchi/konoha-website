import React from 'react';
import styles from '../page.module.css';

interface ConditionCardProps {
    title: string;
    iconUrl: string;
    range: string;
    label: string;
    themeClass: string; // e.g., moistureCard, sunlightCard
}

const ConditionCard: React.FC<ConditionCardProps> = ({ title, iconUrl, range, label, themeClass }) => {
    return (
        <div className={`${styles.conditionCard} ${styles[themeClass]}`}>
            <div className={styles.conditionHeader}>
                <div className={styles.iconBox}>
                    <img src={iconUrl} alt={title} />
                </div>
                <span className={styles.conditionTitle}>{title}</span>
            </div>
            <div className={styles.rangeBox}>
                <span className={styles.rangeLabel}>{label}</span>
                <span className={styles.rangeValue}>{range}</span>
            </div>
        </div>
    );
};

export default ConditionCard;
