import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Device } from '../types';

interface ApplianceBreakdownChartProps {
    data: Device[];
}

const COLORS = ['#4299E1', '#F6AD55', '#48BB78', '#ED8936', '#9F7AEA', '#ED64A6'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-variant p-3 rounded-lg border border-outline shadow-xl">
                <p className="label text-text-primary font-bold">{`${payload[0].name}: ${payload[0].value} W`}</p>
                <p className="text-text-secondary">{`(${(payload[0].payload.percent * 100).toFixed(1)}%)`}</p>
            </div>
        );
    }
    return null;
};

const ApplianceBreakdownChart: React.FC<ApplianceBreakdownChartProps> = ({ data }) => {
    
    const chartData = useMemo(() => {
        const activeDevices = data.filter(device => device.status === 'on' && device.currentWattage > 0);
        const totalConsumption = activeDevices.reduce((acc, curr) => acc + curr.currentWattage, 0);
        
        if (totalConsumption === 0) {
            return []; // Return an empty array if no consumption
        }
        
        return activeDevices.map(device => ({
            name: device.deviceName,
            value: device.currentWattage,
            percent: device.currentWattage / totalConsumption
        }));
    }, [data]);

    // If there's no data, render the centered message.
    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-text-secondary">No hay dispositivos encendidos</p>
            </div>
        );
    }
    
    // Otherwise, render the chart.
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />}/>
                <Legend iconType="circle" wrapperStyle={{fontSize: "12px", bottom: -10}}/>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ApplianceBreakdownChart;