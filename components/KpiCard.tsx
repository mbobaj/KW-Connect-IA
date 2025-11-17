import React from 'react';

interface KpiCardProps {
    title: string;
    value: number | string;
    unit: string;
    subtext?: string;
    icon: 'bolt' | 'money' | 'chart' | 'peak';
}

// Fix: Replaced JSX.Element with React.ReactElement to fix "Cannot find namespace 'JSX'" error.
const ICONS: { [key: string]: React.ReactElement } = {
    bolt: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    peak: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit, subtext, icon }) => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-lg flex items-start space-x-4 transition-transform transform hover:scale-105 duration-300">
            <div className="p-3 bg-primary rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {ICONS[icon]}
                </svg>
            </div>
            <div>
                <p className="text-sm text-text-secondary font-medium">{title}</p>
                <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-text-primary">{value}</p>
                    <p className="text-lg text-text-secondary">{unit}</p>
                </div>
                {subtext && <p className="text-xs text-text-secondary mt-1">{subtext}</p>}
            </div>
        </div>
    );
};

export default KpiCard;