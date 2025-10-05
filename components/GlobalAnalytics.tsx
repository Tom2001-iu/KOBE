
import React, { useMemo } from 'react';
import Card from './shared/Card';
import TotalRevenueChart from './shared/TotalRevenueChart';
import SubscriptionGrowthChart from './shared/SubscriptionGrowthChart';
import UserGrowthChart from './shared/UserGrowthChart';
import { CHART_DATA, SUBSCRIPTION_GROWTH_DATA, INITIAL_USER_GROWTH } from '../constants';

const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;

const formatNumber = (num: number, isCurrency = false) => {
    const prefix = isCurrency ? '$' : '';
    if (num >= 1000000) return `${prefix}${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(1)}K`;
    return `${prefix}${num.toLocaleString(undefined, { maximumFractionDigits: isCurrency ? 2 : 0 })}`;
};


const GlobalAnalytics: React.FC = () => {
    const { totalRevenue, totalUsers, totalSubscriptions, topPerformer, totalRevenueData } = useMemo(() => {
        const subsidiaries = ['BEOK', 'WORDS', 'VOID_AI', 'ESCAN', 'EBOK'];
        
        const calculatedTotalRevenueData = CHART_DATA.map(month => ({
            name: month.name,
            revenue: subsidiaries.reduce((acc, sub) => acc + (month[sub as keyof typeof month] as number), 0),
        }));
        
        const lastMonthRevenue = calculatedTotalRevenueData[calculatedTotalRevenueData.length - 1].revenue;
        const yearToDateRevenue = lastMonthRevenue * CHART_DATA.length; 

        const lastMonthData = CHART_DATA[CHART_DATA.length - 1];
        const lastMonthRevenueBySub = subsidiaries.map(sub => ({ name: sub, revenue: (lastMonthData[sub as keyof typeof lastMonthData] as number) }));
        const calculatedTopPerformer = lastMonthRevenueBySub.sort((a, b) => b.revenue - a.revenue)[0];
        
        const lastSubscriptionData = SUBSCRIPTION_GROWTH_DATA[SUBSCRIPTION_GROWTH_DATA.length - 1];
        const calculatedTotalSubscriptions = lastSubscriptionData.Free + lastSubscriptionData.Pro + lastSubscriptionData.Business;

        const calculatedTotalUsers = INITIAL_USER_GROWTH[INITIAL_USER_GROWTH.length - 1].users;

        return {
            totalRevenue: yearToDateRevenue,
            totalUsers: calculatedTotalUsers,
            totalSubscriptions: calculatedTotalSubscriptions,
            topPerformer: calculatedTopPerformer,
            totalRevenueData: calculatedTotalRevenueData,
        };
    }, []);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Global Analytics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                     <Card 
                        title="Total Estimated Revenue (YTD)" 
                        value={formatNumber(totalRevenue, true)} 
                        change="+10.8%" 
                        changeType="increase" 
                        icon={<DollarSignIcon />}
                    />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <Card 
                        title="Total Users" 
                        value={formatNumber(totalUsers)} 
                        change="+8.2%" 
                        changeType="increase" 
                        icon={<UsersIcon />}
                    />
                </div>
                 <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <Card 
                        title="Total Subscriptions" 
                        value={formatNumber(totalSubscriptions)} 
                        change="+15.3%" 
                        changeType="increase" 
                        icon={<CreditCardIcon />}
                    />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <Card 
                        title="Top Performer (Monthly)" 
                        value={topPerformer.name}
                        change={`$${formatNumber(topPerformer.revenue)}`}
                        changeType="increase"
                        icon={<TrophyIcon />}
                    />
                </div>
            </div>

            <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <h3 className="text-xl font-bold mb-4">Overall Revenue Trend</h3>
                <TotalRevenueChart data={totalRevenueData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <h3 className="text-xl font-bold mb-4">Subscription Growth by Tier</h3>
                    <SubscriptionGrowthChart data={SUBSCRIPTION_GROWTH_DATA} />
                </div>
                 <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                    <h3 className="text-xl font-bold mb-4">Overall User Growth</h3>
                    <UserGrowthChart data={INITIAL_USER_GROWTH} />
                </div>
            </div>
        </div>
    );
};

export default GlobalAnalytics;
