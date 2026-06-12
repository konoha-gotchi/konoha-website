import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"
import { mockPlantInfoData } from "../data/mock_data";


import ConditionCard from './components/condition_card';
import GuidelineItem from './components/guideline_item';

/**
 * Plant Info Page
 * Displays detailed plant information, optimal conditions, and care guidelines.
 */
export default function PlantInfo() {
    const plantInfoData = mockPlantInfoData;

    return (
        <>
            <Navbar focus="plantInfo"></Navbar>

            <main className={styles.main}>
                <div className={styles.container}>
                    
                    {/* Header */}
                    <header className={styles.header}>
                        <h1>Plant Profile</h1>
                        <p>Comprehensive information and care guide for your companion.</p>
                    </header>

                    {/* Section 1: Plant Identity (Dynamic Metadata) */}
                    <section className={`${styles.card} ${styles.identityCard}`}>
                        <div className={styles.imageSection}>
                            <img src={plantInfoData.plant.imagePath} alt={plantInfoData.plant.name} />
                        </div>
                        <div className={styles.infoSection}>
                            <div className={styles.plantName}>
                                <h2>{plantInfoData.plant.name}</h2>
                                <span className={styles.species}>{plantInfoData.plant.species}</span>
                            </div>
                            <p className={styles.description}>{plantInfoData.plant.description}</p>
                            
                            <div className={styles.metaInfo}>
                                {plantInfoData.plant.facts.map((item) => (
                                    <div key={item.label} className={styles.metaItem}>
                                        <span className={styles.metaLabel}>{item.label}</span>
                                        <span className={styles.metaValue}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Optimal Conditions (Looping Components) */}
                    <section>
                        <h2 className={styles.sectionTitle}>Optimal Conditions</h2>
                        <div className={styles.conditionsGrid}>
                            {plantInfoData.optimalConditions.map((condition) => {
                                const { key, ...conditionProps } = condition;

                                return (
                                    <ConditionCard
                                        key={key}
                                        {...conditionProps}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 3: Detailed Care Guidelines (Looping Components) */}
                    <section className={styles.card}>
                        <h2 className={styles.sectionTitle}>Care Guidelines</h2>
                        <div className={styles.guidelinesList}>
                            {plantInfoData.careGuidelines.map((guideline) => (
                                <GuidelineItem 
                                    key={guideline.title}
                                    title={guideline.title}
                                    text={guideline.body}
                                />
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <FooterNav focus="plantInfo"></FooterNav>
        </>
    )
}
