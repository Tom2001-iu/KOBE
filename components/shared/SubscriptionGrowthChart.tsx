
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TIER_COLORS = {
    Free: '#a0aec0',
    Pro: '#8884d8',
    Business: '#82ca9d',
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-secondary/80 backdrop-blur-sm p-4 border border-gray-700 rounded-lg shadow-lg">
                <p className="font-bold text-brand-text">{label}</p>
                {payload.map((pld: any) => (
                    <div key={pld.dataKey} style={{ color: pld.color }} className="flex justify-between">
                        <span className="mr-4">{pld.dataKey}:</span>
                        <span>{pld.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const SubscriptionGrowthChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={data}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                <Area type="monotone" dataKey="Free" stackId="1" stroke={TIER_COLORS.Free} fill={TIER_COLORS.Free} />
                <Area type="monotone" dataKey="Pro" stackId="1" stroke={TIER_COLORS.Pro} fill={TIER_COLORS.Pro} />
                <Area type="monotone" dataKey="Business" stackId="1" stroke={TIER_COLORS.Business} fill={TIER_COLORS.Business} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SubscriptionGrowthChart;
