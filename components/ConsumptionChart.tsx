import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ConsumptionDataPoint } from '../types';

interface ConsumptionChartProps {
    data: ConsumptionDataPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-variant p-3 rounded-lg border border-outline shadow-xl">
                <p className="label text-text-secondary">{`${payload[0].payload.date} ${label}`}</p>
                <p className="intro text-text-primary font-bold">{`Consumo: ${payload[0].value} kWh`}</p>
            </div>
        );
    }
    return null;
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                    dataKey="time" 
                    stroke="#4A5568" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(tick, index) => index % 3 === 0 ? tick : ''}
                    interval="preserveStartEnd"
                />
                <YAxis 
                    stroke="#4A5568" 
                    tick={{ fontSize: 12 }} 
                    unit=" kWh"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "14px"}}/>
                <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    name="Consumo"
                    stroke="#4299E1" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#4299E1', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ConsumptionChart;