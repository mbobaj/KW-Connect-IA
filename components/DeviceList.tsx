import React from 'react';
import type { Device } from '../types';

interface DeviceListProps {
    devices: Device[];
    onToggle: (id: string) => void;
}

const ICONS: { [key: string]: React.ReactElement } = {
    refrigerator: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18h12V3H5zm2 13h2M7 9h2" />,
    ac: <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7M5 9l7-7 7 7" />,
    'washing-machine': <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm9 5a4 4 0 100 8 4 4 0 000-8z" />,
    tv: <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10h16V7H4zM8 19h8" />,
    lightbulb: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 00-7 7c0 3.03 2.5 5.75 5 6.7V17h4v-1.25c2.5-.95 5-3.67 5-6.7a7 7 0 00-7-7zm-1 18h2" />,
    computer: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13V5a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    charger: <path strokeLinecap="round" strokeLinejoin="round" d="M11 7L6 12h3v5l5-5h-3V7z" />,
    unknown: <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

const DeviceList: React.FC<DeviceListProps> = ({ devices, onToggle }) => {

    const getStatusPill = (status: 'on' | 'off' | 'standby') => {
        switch(status) {
            case 'on':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">Encendido</span>;
            case 'off':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">Apagado</span>;
            case 'standby':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">En Espera</span>;
            default:
                return null;
        }
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary">
                <thead className="bg-primary">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Dispositivo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Consumo Actual (W)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Estado
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Control</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-primary">
                    {devices.map((device) => (
                        <tr key={device.deviceId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary rounded-lg mr-4 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            {ICONS[device.icon] || ICONS.unknown}
                                        </svg>
                                    </div>
                                    <span>{device.deviceName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{device.currentWattage}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusPill(device.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onToggle(device.deviceId)}
                                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent ${
                                        device.status === 'on' ? 'bg-accent' : 'bg-primary'
                                    }`}
                                    aria-pressed={device.status === 'on'}
                                    aria-label={`Controlar ${device.deviceName}`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`inline-block w-5 h-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${
                                            device.status === 'on' ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeviceList;