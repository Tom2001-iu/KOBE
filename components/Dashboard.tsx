
import React, { useState, useEffect, ReactNode } from 'react';
import Card from './shared/Card';
import RevenueChart from './shared/Chart';
import RecentNotifications from './RecentNotifications';
import QuickActions from './QuickActions';
import SubsidiaryBarChart from './shared/SubsidiaryBarChart';
import UserGrowthChart from './shared/UserGrowthChart';
// FIX: Import INITIAL_USER_GROWTH from constants file as it is used by multiple components.
import { CHART_DATA, MOCK_QUICK_ACTIONS, VIEWS, INITIAL_USER_GROWTH } from '../constants';
import type { Notification, View } from '../types';

// Main Metric Icons
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;

// Consolidated Analytics Icons
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>;
const PercentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;

const formatNumber = (num: number, isCurrency = false) => {
    const prefix = isCurrency ? '$' : '';
    if (num >= 1000000) return `${prefix}${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(1)}K`;
    return `${prefix}${num.toLocaleString(undefined, { maximumFractionDigits: isCurrency ? 2 : 0 })}`;
};

const createRandomNotification = (): Notification => {
    const subsidiaries: { name: View; icon: ReactNode; color: string; message: string }[] = [
        { name: VIEWS.BEOK, icon: <>📦</>, color: 'bg-blue-500/20 text-blue-400', message: `New order for $${(Math.random() * 500 + 50).toFixed(2)}.` },
        { name: VIEWS.WORDS, icon: <>✍️</>, color: 'bg-yellow-500/20 text-yellow-400', message: 'New blog post published.' },
        { name: VIEWS.VOID_AI, icon: <>📈</>, color: 'bg-green-500/20 text-green-400', message: `Subscriptions up ${(Math.random() * 5).toFixed(1)}% this hour.` },
        { name: VIEWS.ESCAN, icon: <>🎓</>, color: 'bg-pink-500/20 text-pink-400', message: 'New course enrollment.' },
        { name: VIEWS.EBOK, icon: <>💾</>, color: 'bg-teal-500/20 text-teal-400', message: `Processed ${Math.floor(Math.random() * 100 + 20)} new sales.` },
    ];
    const sub = subsidiaries[Math.floor(Math.random() * subsidiaries.length)];
    return {
        id: `notif-${Date.now()}`,
        icon: sub.icon,
        iconBgColor: sub.color,
        text: <>{sub.message} on <span className="text-brand-accent">{sub.name}</span></>,
        timestamp: 'Just now'
    };
};

const INITIAL_SUBSIDIARY_PERFORMANCE = [
    { name: 'BEOK', value: 4500 },
    { name: 'WORDS', value: 8900 },
    { name: 'VOID_AI', value: 7200 },
    { name: 'ESCAN', value: 6500 },
    { name: 'EBOK', value: 5100 },
];

interface DashboardProps {
    setActiveView?: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const [metrics, setMetrics] = useState({ revenue: 1205102, users: 245301, subscriptions: 45219, activity: 88.3 });
    const [chartData, setChartData] = useState(CHART_DATA);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [consolidatedKpis, setConsolidatedKpis] = useState({ userGrowth: 7.8, conversionRate: 4.2, avgOrderValue: 102.50 });
    const [subsidiaryPerformance, setSubsidiaryPerformance] = useState(INITIAL_SUBSIDIARY_PERFORMANCE);
    const [userGrowth, setUserGrowth] = useState(INITIAL_USER_GROWTH);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Simulate metrics update
            setMetrics(prev => ({
                revenue: prev.revenue + Math.random() * 500,
                users: prev.users + Math.floor(Math.random() * 10),
                subscriptions: prev.subscriptions + Math.floor(Math.random() * 5),
                activity: Math.min(99.9, Math.max(80, prev.activity + (Math.random() - 0.5) * 0.2))
            }));

            // Simulate revenue chart data update
            setChartData(prevData => {
                const newData = [...prevData];
                const lastPoint = { ...newData[newData.length - 1] };
                Object.keys(lastPoint).forEach(key => {
                    if (key !== 'name' && key !== 'amt') {
                        lastPoint[key as keyof typeof lastPoint] = Math.max(1000, (lastPoint[key as keyof typeof lastPoint] as number) + (Math.random() - 0.5) * 200);
                    }
                });
                newData[newData.length - 1] = lastPoint;
                return newData;
            });
            
            // Simulate notifications
            if (Math.random() > 0.6) {
                setNotifications(prev => [createRandomNotification(), ...prev].slice(0, 4));
            }

            // Simulate consolidated KPIs update
            setConsolidatedKpis(prev => ({
                userGrowth: Math.max(5, prev.userGrowth + (Math.random() - 0.45) * 0.1),
                conversionRate: Math.max(2, prev.conversionRate + (Math.random() - 0.5) * 0.05),
                avgOrderValue: Math.max(80, prev.avgOrderValue + (Math.random() - 0.5) * 1.5)
            }));

            // Simulate subsidiary performance chart update
            setSubsidiaryPerformance(prevData =>
                prevData.map(item => ({
                    ...item,
                    value: Math.max(2000, item.value + Math.floor(Math.random() * 200 - 100))
                }))
            );

            // Simulate user growth chart update
            setUserGrowth(prevData => {
                const newData = [...prevData];
                const lastPoint = { ...newData[newData.length - 1] };
                lastPoint.users = lastPoint.users + Math.floor(Math.random() * 500);
                newData[newData.length - 1] = lastPoint;
                return newData;
            });

        }, 2500);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <Card 
                        title="Total Revenue" 
                        value={formatNumber(metrics.revenue, true)} 
                        change="+12.5%" 
                        changeType="increase" 
                        icon={<DollarSignIcon />}
                    />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <Card 
                        title="Total Users" 
                        value={formatNumber(metrics.users)} 
                        change="+8.2%" 
                        changeType="increase" 
                        icon={<UsersIcon />}
                    />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <Card 
                        title="Active Subscriptions" 
                        value={formatNumber(metrics.subscriptions)} 
                        change="+2.1%" 
                        changeType="increase" 
                        icon={<CreditCardIcon />}
                    />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <Card 
                        title="User Activity" 
                        value={`${metrics.activity.toFixed(1)}%`} 
                        change="-1.5%" 
                        changeType="decrease" 
                        icon={<ActivityIcon />}
                    />
                </div>
            </div>
            
            <div className="bg-brand-secondary p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <h3 className="text-xl font-bold mb-4">Subsidiary Revenue Overview</h3>
                <RevenueChart data={chartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                     <RecentNotifications notifications={notifications} />
                 </div>
                 <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                     <QuickActions actions={MOCK_QUICK_ACTIONS} setActiveView={setActiveView} />
                 </div>
            </div>

            <div className="bg-brand-secondary p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <h3 className="text-xl font-bold mb-4">Consolidated Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card 
                        title="Total User Growth" 
                        value={`${consolidatedKpis.userGrowth.toFixed(1)}%`}
                        change="+0.2% this week"
                        changeType="increase"
                        icon={<ArrowUpRightIcon />}
                    />
                    <Card 
                        title="Subscription Conversion" 
                        value={`${consolidatedKpis.conversionRate.toFixed(2)}%`}
                        change="-0.05% this week"
                        changeType="decrease"
                        icon={<PercentIcon />}
                    />
                    <Card 
                        title="Avg. Order Value (BEOK)" 
                        value={`$${consolidatedKpis.avgOrderValue.toFixed(2)}`}
                        change="+$1.50 this week"
                        changeType="increase"
                        icon={<ShoppingCartIcon />}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Monthly Active Users by Subsidiary</h4>
                        <SubsidiaryBarChart data={subsidiaryPerformance} />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Overall User Growth</h4>
                        <UserGrowthChart data={userGrowth} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;