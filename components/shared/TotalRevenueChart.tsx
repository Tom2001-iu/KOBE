
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-secondary/80 backdrop-blur-sm p-4 border border-gray-700 rounded-lg shadow-lg">
                <p className="font-bold text-brand-text">{label}</p>
                <div style={{ color: '#34D399' }} className="flex justify-between">
                    <span className="mr-4">Total Revenue:</span>
                    <span>${payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

const TotalRevenueChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#34D399" 
                    strokeWidth={3} 
                    dot={{ r: 5, strokeWidth: 2, fill: '#111827' }} 
                    activeDot={{ r: 8, stroke: '#34D399', strokeWidth: 2, fill: '#111827' }} 
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TotalRevenueChart;
