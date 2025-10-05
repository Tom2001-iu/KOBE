import React from 'react';
import type { Action, View } from '../types';

interface QuickActionsProps {
    actions: Action[];
    setActiveView?: (view: View) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, setActiveView }) => {
    
    const handleActionClick = (view: View) => {
        if(setActiveView) {
            setActiveView(view);
        }
    }

    return (
        <div className="bg-brand-secondary p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map(action => (
                    <button 
                        key={action.id} 
                        onClick={() => handleActionClick(action.view)}
                        className="bg-brand-accent hover:bg-brand-accent-hover p-3 rounded-lg text-white font-semibold transition-all duration-200 active:scale-95 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent"
                    >
                        {action.label} <span className="block text-xs opacity-75">({action.subsidiary})</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;