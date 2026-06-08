"use client"
import styles from "./line_chart.module.css"
import { AreaChart, Area , XAxis, YAxis, CartesianGrid, Tooltip, Legend ,ResponsiveContainer} from 'recharts';

interface DataItem{
    x : string,
    y : number
}
interface LineChartProps {
  data?: DataItem[];
  labelX? : string;
  labelY? : string;
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
export default function LineChartGraph( { data = mockData ,labelX = "Label-X", labelY = "Label-Y" }: LineChartProps,  ){


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
                        value: labelX,
                        position: 'insideBottom',
                        className: 'x-axis-label',
                        offset : -20
                        }}
                    > </XAxis>
                    <YAxis 
                        domain={[0, 800]} 
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
                    <Area type="monotone" dataKey="y" stroke="#FFB433" fill="#FCCD2A" 
                        strokeWidth={3} dot = {true} dy={10}
                    />
                </AreaChart>
            </ResponsiveContainer>  
        </>
    )
}