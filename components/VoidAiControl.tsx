import React, { useState, useEffect } from 'react';
import { MOCK_AI_TIERS } from '../constants';

const CheckIcon = () => <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;

const VoidAiControl: React.FC = () => {
    const [liveMetrics, setLiveMetrics] = useState({ activeUsers: 15234, requestsPerMin: 8560 });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLiveMetrics(prev => ({
                activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
                requestsPerMin: Math.max(5000, prev.requestsPerMin + Math.floor(Math.random() * 100 - 50))
            }));
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">VÓID AI Subscription Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {MOCK_AI_TIERS.map((tier, index) => (
                    <div key={tier.name} className="bg-brand-secondary rounded-lg shadow-lg p-6 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: `${100 * (index + 1)}ms` }}>
                        <h3 className="text-xl font-bold text-brand-accent">{tier.name}</h3>
                        <p className="text-3xl font-bold my-4">{tier.price}</p>
                        <p className="text-brand-text-secondary text-sm mb-6">{tier.users}</p>
                        <ul className="space-y-3 flex-1">
                            {tier.features.map(feature => (
                                <li key={feature} className="flex items-start">
                                    <CheckIcon />
                                    <span className="ml-2 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`mt-8 w-full py-2 px-4 rounded-lg font-bold transition-colors duration-200 ${tier.name === 'Pro' ? 'bg-brand-accent text-white hover:bg-brand-accent-hover' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {tier.name === 'Pro' ? 'Current Plan' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>

             <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Live Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-brand-dark p-4 rounded-lg">
                        <p className="text-sm text-brand-text-secondary">Active Users Now</p>
                        <p className="text-3xl font-bold text-brand-accent">{liveMetrics.activeUsers.toLocaleString()}</p>
                    </div>
                    <div className="bg-brand-dark p-4 rounded-lg">
                        <p className="text-sm text-brand-text-secondary">API Requests/min</p>
                        <p className="text-3xl font-bold text-brand-accent">{liveMetrics.requestsPerMin.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            
             <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">API Access</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-brand-dark p-4 rounded-md space-y-4 sm:space-y-0">
                    <div>
                        <p className="text-brand-text-secondary">Your API Key:</p>
                        <p className="font-mono text-white break-all">vd_sk_********************abcd</p>
                    </div>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm flex-shrink-0">
                        Revoke & Regenerate
                    </button>
                </div>
             </div>
        </div>
    );
};

export default VoidAiControl;