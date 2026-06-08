import React from 'react';
import styles from './timeline_item.module.css';

interface TimelineItemProps {
    title: string;
    description: string;
    timestamp: string; // e.g., "3 min ago"
    iconUrl: string;
    iconBgColor: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
    title, 
    description, 
    timestamp, 
    iconUrl, 
    iconBgColor 
}) => {
    return (
        <div className={styles.itemContainer}>
            {/* Circular icon as per template */}
            <div className={styles.iconWrapper} style={{ backgroundColor: iconBgColor }}>
                <img src={iconUrl} alt={title} />
            </div>

            <div className={styles.contentBody}>
                <div className={styles.textGroup}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>
                {/* Right-aligned timestamp */}
                <span className={styles.timestamp}>{timestamp}</span>
            </div>
        </div>
    );
};

export default TimelineItem;
