import React from 'react';
import { NAV_ITEMS } from '../constants';
import type { View } from '../types';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
    const handleNavigation = (view: View) => {
        setActiveView(view);
        setIsOpen(false); // Close sidebar after navigation on mobile
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-20 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>

            <aside className={`w-64 bg-brand-secondary flex-shrink-0 p-4 flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center space-x-2 p-4 mb-6">
                    <svg className="w-8 h-8 text-brand-accent" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <h1 className="text-2xl font-bold text-white">BRAND</h1>
                </div>
                <nav className="flex-1">
                    <ul>
                        {NAV_ITEMS.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id.toLowerCase()}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation(item.id);
                                    }}
                                    className={`flex items-center p-3 my-1 rounded-lg transition-all duration-200 active:scale-95 ${
                                        activeView === item.id
                                            ? 'bg-brand-accent text-white shadow-md'
                                            : 'text-brand-text-secondary hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto p-4 text-center text-brand-text-secondary text-xs">
                    <p>&copy; 2024 BRAND Inc.</p>
                    <p>Centralized Admin Panel</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;