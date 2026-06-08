"use client"
import styles from "./title.module.css"
import { useState, useEffect } from "react"
export default function Title(){
    
    const [updateTime, setUpdateTime] = useState("3 min")

    return (
        <>
            <section className = {styles.title}>
                <div>
                    <h1>Sensors</h1>
                    <p>Live reading : Updated {updateTime} ago</p>
                </div>
            </section>
        </>
    )
}