
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-secondary/80 backdrop-blur-sm p-4 border border-gray-700 rounded-lg shadow-lg">
                <p className="font-bold text-brand-text">{label}</p>
                <div style={{ color: '#4F46E5' }} className="flex justify-between">
                    <span className="mr-4">Users:</span>
                    <span>{payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

const UserGrowthChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorUserGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, stroke: '#4F46E5', strokeWidth: 2, fill: '#fff' }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default UserGrowthChart;
