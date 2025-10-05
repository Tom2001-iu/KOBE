
import React from 'react';

interface CardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
    icon: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, change, changeType, icon, className = '' }) => {
    const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';

    return (
        <div className={`bg-brand-secondary p-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300 ${className}`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
                    <p className="text-3xl font-bold text-brand-text mt-1">{value}</p>
                </div>
                <div className="bg-brand-accent/20 text-brand-accent p-3 rounded-full">
                    {icon}
                </div>
            </div>
            {change && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`${changeColor} font-semibold`}>{change}</span>
                    <span className="text-brand-text-secondary ml-1">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default Card;
