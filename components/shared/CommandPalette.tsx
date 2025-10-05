
import React, { useState, useEffect, useRef } from 'react';
import { globalSearch } from '../../services/api';
import type { SearchResult, View } from '../../types';

interface CommandPaletteProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setActiveView: (view: View) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, setActiveView }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus input when modal opens
            inputRef.current?.focus();
            // Fetch initial results (navigation)
            handleSearch('');
        } else {
            // Reset state when closed
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSearch = (searchQuery: string) => {
        setIsLoading(true);
        globalSearch(searchQuery).then(res => {
            setResults(res);
            setSelectedIndex(0);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            handleSearch(query);
        }, 200); // Debounce search

        return () => clearTimeout(timerId);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                setIsOpen(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);
    
    const handleSelect = (result: SearchResult) => {
        setActiveView(result.view);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const groupedResults = results.reduce((acc, result) => {
        const key = result.type;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(result);
        return acc;
    }, {} as Record<SearchResult['type'], SearchResult[]>);

    const flatResults = Object.values(groupedResults).flat();

    return (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 animate-fade-in pt-20" onClick={() => setIsOpen(false)}>
            <div 
                className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-2xl animate-scale-in flex flex-col overflow-hidden ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for pages, products, posts..."
                        className="w-full bg-brand-secondary py-4 pl-12 pr-4 text-lg text-brand-text placeholder-brand-text-secondary focus:outline-none"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="border-t border-gray-700/50">
                    <ul className="max-h-[60vh] overflow-y-auto p-2">
                        {isLoading && query ? (
                             <li className="px-4 py-3 text-sm text-brand-text-secondary flex items-center justify-center">Loading...</li>
                        ) : flatResults.length > 0 ? (
                            // FIX: Replaced Object.entries with Object.keys to avoid issues with older TS environments where Object.entries might not be correctly typed.
                            Object.keys(groupedResults).map((groupName) => {
                                const groupResults = groupedResults[groupName as SearchResult['type']];
                                return (
                                <div key={groupName} className="mb-2">
                                    <h3 className="px-3 py-1 text-xs font-semibold text-brand-text-secondary uppercase">{groupName}</h3>
                                    {groupResults.map(result => {
                                        const currentIndex = flatResults.indexOf(result);
                                        const isSelected = currentIndex === selectedIndex;
                                        return (
                                        <li 
                                            key={result.id + result.type}
                                            onClick={() => handleSelect(result)}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={`flex items-center space-x-4 p-3 rounded-md cursor-pointer ${isSelected ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-gray-700/50'}`}
                                        >
                                            <span className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-brand-accent'}`}>{result.icon}</span>
                                            <div>
                                                <p className={`font-medium ${isSelected ? 'text-white' : 'text-brand-text'}`}>{result.title}</p>
                                                {result.subsidiary && <p className="text-xs">{result.subsidiary}</p>}
                                            </div>
                                        </li>
                                    )})}
                                </div>
                            )})
                        ) : (
                             <li className="px-4 py-3 text-sm text-brand-text-secondary text-center">No results found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
