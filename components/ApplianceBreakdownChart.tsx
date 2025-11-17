import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Device } from '../types';

interface ApplianceBreakdownChartProps {
    data: Device[];
}

const COLORS = ['#4fd1c5', '#63b3ed', '#f6ad55', '#fc8181', '#b794f4', '#d69e2e', '#4299e1'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-primary p-3 rounded-lg border border-gray-600 shadow-xl">
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
            return [{ name: 'Sin consumo', value: 1, percent: 1 }];
        }
        
        return activeDevices.map(device => ({
            name: device.deviceName,
            value: device.currentWattage,
            percent: device.currentWattage / totalConsumption
        }));
    }, [data]);

    const isNoConsumption = chartData.length === 1 && chartData[0].name === 'Sin consumo';
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            {isNoConsumption ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-text-secondary">No hay dispositivos encendidos</p>
                </div>
            ) : (
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
            )}
        </ResponsiveContainer>
    );
};

export default ApplianceBreakdownChart;