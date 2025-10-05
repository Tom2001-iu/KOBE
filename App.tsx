import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import GlobalAnalytics from './components/GlobalAnalytics';
import BeokControl from './components/BeokControl';
import WordsControl from './components/WordsControl';
import VoidAiControl from './components/VoidAiControl';
import EscanControl from './components/EscanControl';
import EbokControl from './components/EbokControl';
import CommandPalette from './components/shared/CommandPalette';
import type { View } from './types';
import { VIEWS } from './constants';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>(VIEWS.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    const CurrentView = useMemo(() => {
        const viewMap: Record<View, React.ComponentType<any>> = {
            [VIEWS.DASHBOARD]: Dashboard,
            [VIEWS.GLOBAL_ANALYTICS]: GlobalAnalytics,
            [VIEWS.BEOK]: BeokControl,
            [VIEWS.WORDS]: WordsControl,
            [VIEWS.VOID_AI]: VoidAiControl,
            [VIEWS.ESCAN]: EscanControl,
            [VIEWS.EBOK]: EbokControl,
        };
        return viewMap[activeView] || Dashboard;
    }, [activeView]);

    // Global keyboard listener for Command Palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(isOpen => !isOpen);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-screen bg-brand-dark font-sans">
            <CommandPalette 
                isOpen={isCommandPaletteOpen}
                setIsOpen={setIsCommandPaletteOpen}
                setActiveView={setActiveView}
            />
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    viewTitle={activeView} 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    openCommandPalette={() => setIsCommandPaletteOpen(true)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-dark p-4 md:p-8">
                    <div className="animate-fade-in-up">
                       <CurrentView key={activeView} setActiveView={setActiveView} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
