"use client"

import React, { useState } from 'react';
import styles from "./page.module.css"
import Navbar from "../globals_components/navbar"
import FooterNav from "../globals_components/footer"


import ConditionCard from './components/condition_card';
import GuidelineItem from './components/guideline_item';

/**
 * Plant Info Page
 * Displays detailed plant information, optimal conditions, and care guidelines.
 */
export default function PlantInfo() {
    
    // Main plant data (mock for now, API ready)
    const [plantData] = useState({
        name: "Kono-Chan",
        species: "Monstera deliciosa (Swiss Cheese Plant)",
        description: "Kono-Chan is a vibrant Monstera deliciosa, known for its iconic heart-shaped leaves with natural holes (fenestrations). Native to tropical rainforests, this plant is a fast grower and acts as a natural air purifier.",
        meta: [
            { label: "Age", value: "1.5 Years" },
            { label: "Origin", value: "Central America" },
            { label: "Type", value: "Tropical Perennial" }
        ]
    });

    // Optimal conditions data
    const [optimalConditions] = useState([
        {
            title: "Soil Moisture",
            iconUrl: "/icon/water-droplet.png",
            range: "40% - 60%",
            label: "Ideal Range",
            themeClass: "moistureCard"
        },
        {
            title: "Sunlight",
            iconUrl: "/icon/sun.png",
            range: "500 - 1500 Lux",
            label: "Intensity",
            themeClass: "sunlightCard"
        },
        {
            title: "Temperature",
            iconUrl: "/icon/thermometer.png",
            range: "18°C - 28°C",
            label: "Day/Night",
            themeClass: "tempCard"
        },
        {
            title: "Air Humidity",
            iconUrl: "/icon/leaves.png",
            range: "60% - 80%",
            label: "Relative",
            themeClass: "humidityCard"
        }
    ]);

    // Care guidelines data
    const [careGuidelines] = useState([
        {
            title: "Watering Routine",
            text: "Water Kono-Chan when the top 2-3 inches of soil feel dry. Monstera prefers slightly dry soil between waterings to prevent root rot."
        },
        {
            title: "Light Requirements",
            text: "Bright, indirect light is best. Avoid direct afternoon sun as it can burn the leaves. If leaves start turning yellow, she might need more light."
        },
        {
            title: "Cleaning & Grooming",
            text: "Wipe the large leaves with a damp cloth every 2 weeks to remove dust, which helps the plant photosynthesize more efficiently."
        },
        {
            title: "Feeding",
            text: "Apply a balanced liquid fertilizer once a month during the growing season (Spring and Summer)."
        }
    ]);

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
                            <img src="/icon/mockplant.jpeg" alt={plantData.name} />
                        </div>
                        <div className={styles.infoSection}>
                            <div className={styles.plantName}>
                                <h2>{plantData.name}</h2>
                                <span className={styles.species}>{plantData.species}</span>
                            </div>
                            <p className={styles.description}>{plantData.description}</p>
                            
                            <div className={styles.metaInfo}>
                                {plantData.meta.map((item, index) => (
                                    <div key={index} className={styles.metaItem}>
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
                            {optimalConditions.map((condition, index) => (
                                <ConditionCard 
                                    key={index}
                                    {...condition}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Detailed Care Guidelines (Looping Components) */}
                    <section className={styles.card}>
                        <h2 className={styles.sectionTitle}>Care Guidelines</h2>
                        <div className={styles.guidelinesList}>
                            {careGuidelines.map((guideline, index) => (
                                <GuidelineItem 
                                    key={index}
                                    title={guideline.title}
                                    text={guideline.text}
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
