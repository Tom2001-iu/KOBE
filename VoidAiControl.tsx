import React, { useState, useEffect } from 'react';
import { MOCK_AI_TIERS } from '../constants';
import ConfirmationModal from './shared/ConfirmationModal';

const CheckIcon = () => <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;


const generateApiKey = () => `vd_sk_${[...Array(20)].map(() => Math.random().toString(36)[2]).join('')}`;

const VoidAiControl: React.FC = () => {
    const [liveMetrics, setLiveMetrics] = useState({ activeUsers: 15234, requestsPerMin: 8560 });
    const [currentPlan, setCurrentPlan] = useState('Pro');
    const [planToSelect, setPlanToSelect] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState(generateApiKey());
    const [showRegenConfirm, setShowRegenConfirm] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLiveMetrics(prev => ({
                activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
                requestsPerMin: Math.max(5000, prev.requestsPerMin + Math.floor(Math.random() * 100 - 50))
            }));
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);
    
    const handleSelectPlan = () => {
        if (!planToSelect) return;
        setCurrentPlan(planToSelect);
        setPlanToSelect(null);
    };

    const handleRegenerateKey = () => {
        setApiKey(generateApiKey());
        setShowRegenConfirm(false);
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <ConfirmationModal 
                isOpen={!!planToSelect}
                onClose={() => setPlanToSelect(null)}
                onConfirm={handleSelectPlan}
                title={`Change to ${planToSelect} Plan`}
                message={`Are you sure you want to switch to the ${planToSelect} subscription plan?`}
                confirmButtonText="Confirm Change"
                confirmButtonClass="bg-brand-accent hover:bg-brand-accent-hover"
            />
            <ConfirmationModal
                isOpen={showRegenConfirm}
                onClose={() => setShowRegenConfirm(false)}
                onConfirm={handleRegenerateKey}
                title="Regenerate API Key"
                message="Are you sure? Your old API key will be immediately invalidated. This action cannot be undone."
                confirmButtonText="Yes, Regenerate"
            />
            <h2 className="text-2xl font-bold">VÓID AI Subscription Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {MOCK_AI_TIERS.map((tier, index) => (
                    <div key={tier.name} className={`bg-brand-secondary rounded-lg shadow-lg p-6 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up ${currentPlan === tier.name ? 'ring-2 ring-brand-accent' : ''}`} style={{ animationDelay: `${100 * (index + 1)}ms` }}>
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
                        <button 
                            onClick={() => tier.name !== currentPlan && setPlanToSelect(tier.name)}
                            disabled={currentPlan === tier.name}
                            className={`mt-8 w-full py-2 px-4 rounded-lg font-bold transition-all duration-200 active:scale-95 ${tier.name === currentPlan ? 'bg-brand-accent text-white cursor-default' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            {tier.name === currentPlan ? 'Current Plan' : 'Select Plan'}
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
                    <div className="flex items-center space-x-4">
                        <div>
                            <p className="text-brand-text-secondary text-sm">Your API Key:</p>
                            <p className="font-mono text-white break-all">{apiKey}</p>
                        </div>
                        <button onClick={copyApiKey} className="p-2 text-gray-400 hover:text-white transition-colors duration-200" aria-label="Copy API Key">
                            {copied ? <CheckIcon/> : <CopyIcon />}
                        </button>
                    </div>
                    <button onClick={() => setShowRegenConfirm(true)} className="bg-red-800/80 hover:bg-red-800/100 text-red-200 font-semibold py-2 px-4 rounded-lg text-sm flex-shrink-0 active:scale-95 transition-all duration-200">
                        Revoke & Regenerate
                    </button>
                </div>
             </div>
        </div>
    );
};

export default VoidAiControl;
