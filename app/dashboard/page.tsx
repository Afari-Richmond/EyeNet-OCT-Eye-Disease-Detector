"use client"
import { useState, useEffect } from "react";
const [currentTime, setCurrentTime] = useState(new Date());

useEffect( () => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
}, []);
    




export default function Dashboard() {
    return (
        <div>
            Hello World
        </div>
    )
}