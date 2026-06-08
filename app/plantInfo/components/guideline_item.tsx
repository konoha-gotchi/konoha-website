import React from 'react';
import styles from '../page.module.css';

interface GuidelineItemProps {
    title: string;
    text: string;
}

const GuidelineItem: React.FC<GuidelineItemProps> = ({ title, text }) => {
    return (
        <div className={styles.guidelineItem}>
            <div className={styles.bullet}></div>
            <div className={styles.guidelineText}>
                <strong>{title}</strong>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default GuidelineItem;
