import React from 'react';
import styles from './timeline_item.module.css';

interface TimelineItemProps {
    title: string;
    description: string;
    timestampLabel: string;
    iconPath: string;
    iconBackgroundColor: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
    title, 
    description, 
    timestampLabel,
    iconPath,
    iconBackgroundColor
}) => {
    return (
        <div className={styles.itemContainer}>
            <div className={styles.iconWrapper} style={{ backgroundColor: iconBackgroundColor }}>
                <img src={iconPath} alt={title} />
            </div>

            <div className={styles.contentBody}>
                <div className={styles.textGroup}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>
                <span className={styles.timestamp}>{timestampLabel}</span>
            </div>
        </div>
    );
};

export default TimelineItem;
