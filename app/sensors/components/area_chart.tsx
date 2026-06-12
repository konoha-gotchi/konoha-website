"use client"
import { AreaChart, Area , XAxis, YAxis, CartesianGrid, Tooltip ,ResponsiveContainer} from 'recharts';
import type { SensorHistoryPoint } from "@/app/types/plant";

interface AreaChartProps {
  data?: SensorHistoryPoint[];
  xAxisLabel? : string;
  yAxisLabel? : string;
  domain?: [number, number];
  strokeColor? : string;
  fillColor? : string;
}


 const defaultChartData : SensorHistoryPoint[]= [
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
export default function AreaChartGraph( { data = defaultChartData ,xAxisLabel = "Label-X", yAxisLabel = "Label-Y"
    , domain = [0,100], strokeColor = "#FFB433", fillColor ="#FCCD2A" }: AreaChartProps,  ){


    return(
        <>
          <ResponsiveContainer width={"100%"} height={"100%"}>
                <AreaChart
                    width={500}
                    height={400}
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
                        value: xAxisLabel,
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
                        value: yAxisLabel,
                        angle: -90, 
                        position: 'insideLeft',
                        className: 'y-axis-label',
                        offset: 1,
                        style: { textAnchor: 'middle' }
                        }}
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="y" stroke={strokeColor} fill={fillColor}
                        strokeWidth={3} dot = {true} dy={10}
                    />
                </AreaChart>
            </ResponsiveContainer>  
        </>
    )
}
