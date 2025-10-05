
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const SUBSIDIARY_COLORS: Record<string, string> = {
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
                <div style={{ color: payload[0].payload.fill }} className="flex justify-between">
                    <span className="mr-4">{payload[0].name}:</span>
                    <span>{payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

const SubsidiaryBarChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                <Bar dataKey="value" name="Active Users">
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={SUBSIDIARY_COLORS[entry.name]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SubsidiaryBarChart;
