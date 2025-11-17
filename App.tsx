import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import KpiCard from './components/KpiCard';
import ConsumptionChart from './components/ConsumptionChart';
import ApplianceBreakdownChart from './components/ApplianceBreakdownChart';
import DeviceList from './components/DeviceList';
import type { Device, ConsumptionDataPoint } from './types';

// Mock Data Generation based on the provided JSON structure
const generateMockDeviceData = (): Device[] => {
    const devices = [
        { name: 'Refrigerador', baseWattage: 150, onChance: 0.95, icon: 'refrigerator' },
        { name: 'Aire Acondicionado', baseWattage: 1500, onChance: 0.2, icon: 'ac' },
        { name: 'Lavadora', baseWattage: 500, onChance: 0.05, icon: 'washing-machine' },
        { name: 'Televisor Living', baseWattage: 150, onChance: 0.4, icon: 'tv' },
        { name: 'Luces Cocina', baseWattage: 60, onChance: 0.5, icon: 'lightbulb' },
        { name: 'Computador Oficina', baseWattage: 300, onChance: 0.6, icon: 'computer' },
        { name: 'Cargador Celular', baseWattage: 10, onChance: 0.8, icon: 'charger' },
    ];
    
    // Simple UUID generator for deviceId
    const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    return devices.map(d => {
        const isOn = Math.random() < d.onChance;
        const isStandby = !isOn && Math.random() < 0.5;
        const status = isOn ? 'on' : (isStandby ? 'standby' : 'off');
        
        let currentWattage = 0;
        if (status === 'on') {
            currentWattage = d.baseWattage + (Math.random() * d.baseWattage * 0.2 - d.baseWattage * 0.1); // +/- 10% variance
        } else if (status === 'standby') {
            currentWattage = d.baseWattage * 0.05; // 5% for standby
        }
        
        const hourlyHistoryKWh = Array.from({ length: 24 }, (_, hour) => {
             // Simulate hourly usage patterns (e.g. higher usage in the evening)
             const peakHours = hour > 18 || hour < 8;
             if (Math.random() < d.onChance * (peakHours ? 1.5 : 0.5)) {
                 const randomUsage = d.baseWattage + (Math.random() * d.baseWattage * 0.5 - d.baseWattage * 0.25);
                 return parseFloat((randomUsage / 1000).toFixed(3)); // convert W to kWh
             }
             return 0;
        });

        const todayKWh = hourlyHistoryKWh.reduce((a, b) => a + b, 0);

        return {
            deviceId: uuid(),
            deviceName: d.name,
            status,
            currentWattage: parseFloat(currentWattage.toFixed(2)),
            todayKWh: parseFloat(todayKWh.toFixed(2)),
            hourlyHistoryKWh,
            icon: d.icon,
        };
    });
};

const CLP_PER_KWH = 150; // Average price in Chilean Pesos

export default function App() {
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        setDevices(generateMockDeviceData());
    }, []);

    const aggregatedConsumptionData = useMemo<ConsumptionDataPoint[]>(() => {
        if (devices.length === 0) return [];
        
        const hourlyTotals = new Array(24).fill(0);
        
        devices.forEach(device => {
            const history = device.hourlyHistoryKWh.concat(new Array(24).fill(0)).slice(0, 24);
            history.forEach((kwh, hour) => {
                hourlyTotals[hour] += kwh;
            });
        });

        const now = new Date();
        return hourlyTotals.map((totalKwh, hour) => ({
            time: `${String(hour).padStart(2, '0')}:00`,
            date: now.toLocaleDateString('es-CL'),
            consumption: parseFloat(totalKwh.toFixed(2)),
        }));
    }, [devices]);
    
    const kpiData = useMemo(() => {
        if (devices.length === 0 || aggregatedConsumptionData.length === 0) return {
            currentConsumption: 0,
            estimatedCost: 0,
            todayTotalConsumption: 0,
            peakConsumption: { time: 'N/A', value: 0 },
        };

        const currentConsumptionW = devices
            .filter(d => d.status === 'on')
            .reduce((acc, d) => acc + d.currentWattage, 0);

        const todayTotalConsumption = devices.reduce((acc, d) => acc + d.todayKWh, 0);

        const peak = aggregatedConsumptionData.reduce(
            (max, item) => (item.consumption > max.consumption ? item : max),
            aggregatedConsumptionData[0]
        );

        return {
            currentConsumption: parseFloat((currentConsumptionW / 1000).toFixed(2)), // in kWh
            estimatedCost: Math.round(todayTotalConsumption * 30 * CLP_PER_KWH),
            todayTotalConsumption: parseFloat(todayTotalConsumption.toFixed(2)),
            peakConsumption: { time: peak.time, value: peak.consumption },
        };
    }, [devices, aggregatedConsumptionData]);
    
    const toggleDeviceStatus = (deviceId: string) => {
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.deviceId === deviceId 
            ? {...device, status: device.status === 'on' ? 'off' : 'on'}
            : device
        )
      );
    };

    return (
        <div className="min-h-screen bg-background font-sans p-4 sm:p-6 lg:p-8">
            <Header />
            <main className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <KpiCard title="Consumo Actual" value={kpiData.currentConsumption} unit="kWh" icon="bolt" />
                    <KpiCard title="Costo Mensual Estimado" value={kpiData.estimatedCost.toLocaleString('es-CL')} unit="CLP" icon="money" />
                    <KpiCard title="Consumo Total Hoy" value={kpiData.todayTotalConsumption} unit="kWh" icon="chart" />
                    <KpiCard title="Peak de Consumo (Hoy)" value={kpiData.peakConsumption.value} unit="kWh" subtext={kpiData.peakConsumption.time} icon="peak" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-text-primary mb-4">Historial de Consumo (Últimas 24 Horas)</h2>
                        <div className="h-96">
                           <ConsumptionChart data={aggregatedConsumptionData} />
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-text-primary mb-4">Consumo Actual por Dispositivo</h2>
                        <div className="h-80">
                            <ApplianceBreakdownChart data={devices} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-card p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Control de Dispositivos</h2>
                    <DeviceList devices={devices} onToggle={toggleDeviceStatus} />
                </div>
            </main>
        </div>
    );
}