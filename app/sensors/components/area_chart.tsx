"use client"
import styles from "./line_chart.module.css"
import { useEffect, useRef, useState } from "react";
import { AreaChart, Area , XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

interface DataItem{
    x : string,
    y : number
}
interface LineChartProps {
  data?: DataItem[];
  labelX? : string;
  labelY? : string;
  domain?: [number, number];
  strokColor? : string;
  fillColor? : string;
}


 const mockData : DataItem[]= [
  {
    x: 'Page A',
    y: 600,
  },
  {
    x: 'Page b',
    y: 400,
  },
  {
    x: 'Page c',
    y: 450,
  },
  {
    x: 'Page d',
    y: 444,
  },
  {
    x: 'Page e',
    y: 200,
  },
  {
    x: 'Page f',
    y: 90,
  },
];
export default function LineChartGraph( { data = mockData ,labelX = "Label-X", labelY = "Label-Y"
    , domain = [0,100], strokColor = "#FFB433", fillColor ="#FCCD2A" }: LineChartProps,  ){

    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setMounted(true);
        const element = containerRef.current;
        if (!element) {
            return;
        }

        const updateSize = () => {
            const rect = element.getBoundingClientRect();
            setSize({
                width: Math.max(1, Math.floor(rect.width)),
                height: Math.max(1, Math.floor(rect.height)),
            });
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    if (!mounted) {
        return <div ref={containerRef} className={styles.chart} aria-hidden="true" />;
    }

    return(
        <div ref={containerRef} className={styles.chart}>
            {size.width > 0 && size.height > 0 ? (
                <AreaChart
                    width={size.width}
                    height={size.height}
                    data={data}
                    margin={{
                        right : 30,
                        bottom : 30,
                        top : 30,
                        left : 30
                    }}
                >
                    <CartesianGrid stroke="#DADADA" strokeDasharray="0" />
                    <XAxis dataKey="x" tick={{ fill: '#8a8885', fontSize: 13, fontFamily: 'sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                        label={{  
                        value: labelX,
                        position: 'insideBottom',
                        className: 'x-axis-label',
                        offset : -20
                        }}
                    > </XAxis>
                    <YAxis 
                        domain={domain} 
                        tick={{ fill: '#8a8885', fontSize: 13, fontFamily: 'sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                        dx={-5}
                        label={{  
                        value: labelY,
                        angle: -90, 
                        position: 'insideLeft',
                        className: 'y-axis-label',
                        offset: 1,
                        style: { textAnchor: 'middle' }
                        }}
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="y" stroke={strokColor} fill={fillColor} 
                        strokeWidth={3} dot = {true} dy={10}
                    />
                </AreaChart>
            ) : null}
        </div>
    )
}
