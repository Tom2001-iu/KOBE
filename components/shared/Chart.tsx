
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const SUBSIDIARY_COLORS = {
    BEOK: '#8884d8',
    WORDS: '#82ca9d',
    VOID_AI: '#ffc658',
    ESCAN: '#ff8042',
    EBOK: '#00C49F',
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-secondary/80 backdrop-blur-sm p-4 border border-gray-700 rounded-lg shadow-lg">
                <p className="font-bold text-brand-text">{label}</p>
                {payload.map((pld: any) => (
                    <div key={pld.dataKey} style={{ color: pld.color }} className="flex justify-between">
                        <span className="mr-4">{pld.dataKey}:</span>
                        <span>${pld.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};


const RevenueChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    {Object.entries(SUBSIDIARY_COLORS).map(([key, color]) => (
                        <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <Tooltip content={<CustomTooltip />} />
                
                {Object.entries(SUBSIDIARY_COLORS).map(([key, color]) => (
                     <Area key={key} type="monotone" dataKey={key} stroke={color} fillOpacity={1} fill={`url(#color${key})`} />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;
