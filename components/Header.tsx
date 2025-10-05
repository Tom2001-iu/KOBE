
import React, { useState, useEffect, useRef } from 'react';
import { globalSearch } from '../services/api';
import type { SearchResult, View } from '../types';

// Icons for the search results
const ShirtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99 .84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const PenSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>;
// FIX: Add NavigationIcon to be used in RESULT_ICONS
const NavigationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

const RESULT_ICONS: Record<SearchResult['type'], React.ReactNode> = {
    // FIX: Add missing 'Navigation' property to satisfy the Record type.
    'Navigation': <NavigationIcon />,
    'Product': <ShirtIcon />,
    'Blog Post': <PenSquareIcon />,
    'Course': <BookOpenIcon />,
    'Ebook': <LibraryIcon />,
};

// Existing Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const XIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

interface HeaderProps {
    viewTitle: string;
    toggleSidebar: () => void;
    setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ viewTitle, toggleSidebar, setActiveView }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        setIsSearchLoading(true);
        const timerId = setTimeout(() => {
            globalSearch(searchQuery).then(results => {
                setSearchResults(results);
                setIsSearchLoading(false);
            });
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
                if (window.innerWidth < 768) { // md breakpoint
                    // Do not close mobile search if it was just opened
                    if(isMobileSearchOpen) setIsMobileSearchOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef, searchRef, isMobileSearchOpen]);

    const handleResultClick = (result: SearchResult) => {
        setActiveView(result.view);
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
    };
    
    const handleSearchIconClick = () => {
        setIsMobileSearchOpen(true);
        // Use a timeout to focus after the element is rendered and visible
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    const showDropdown = isSearchFocused && (searchQuery.length > 0);

    return (
        <header className="bg-brand-secondary shadow-md p-4 flex justify-between items-center flex-shrink-0 z-20 relative"> {/* Increased z-index for search dropdown */}
            <div className="flex items-center">
                <button 
                    onClick={toggleSidebar} 
                    className="md:hidden p-1 mr-3 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Open navigation menu"
                >
                    <MenuIcon />
                </button>
                <div className={`flex items-center transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-white capitalize">{viewTitle}</h2>
                </div>
            </div>

            {/* Search Bar Container */}
            <div 
                ref={searchRef} 
                className={`
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 md:w-auto md:static md:top-auto md:left-auto md:transform-none
                    flex items-center justify-center transition-all duration-300
                    ${isMobileSearchOpen ? 'w-[calc(100%-2rem)] opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}
                `}
            >
                {/* Search input and dropdown */}
                <div className="relative w-full md:w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="bg-brand-dark border border-gray-700 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all duration-300"
                    />
                    {showDropdown && (
                        <div className="absolute mt-2 w-full md:w-96 rounded-md shadow-lg bg-brand-secondary ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in max-h-96 overflow-y-auto left-0 md:left-auto md:right-0">
                            <ul role="listbox">
                                {isSearchLoading ? (
                                    <li className="px-4 py-3 text-sm text-brand-text-secondary flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Searching...
                                    </li>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(result => (
                                        <li key={result.id + result.type} 
                                            onClick={() => handleResultClick(result)}
                                            className="group cursor-pointer px-4 py-3 text-sm text-brand-text-secondary hover:bg-brand-accent/20 hover:text-white" 
                                            role="option"
                                            aria-selected="false"
                                        >
                                            <div className="flex items-center">
                                                <div className="mr-3 text-brand-accent group-hover:text-white flex-shrink-0">
                                                    {RESULT_ICONS[result.type]}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-white group-hover:text-white truncate">{result.title}</p>
                                                    <p className="text-xs">{result.type} in {result.subsidiary}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-sm text-brand-text-secondary">No results found for "{searchQuery}".</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                 {isMobileSearchOpen && (
                    <button 
                        onClick={() => setIsMobileSearchOpen(false)} 
                        className="p-1 ml-2 text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Close search"
                    >
                        <XIcon className="w-6 h-6"/>
                    </button>
                 )}
            </div>

            {/* Right side icons */}
            <div className={`flex items-center space-x-2 md:space-x-4 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={handleSearchIconClick} className="p-2 text-gray-400 hover:text-white transition-colors duration-200 md:hidden" aria-label="Search">
                    <SearchIcon className="w-6 h-6"/>
                </button>

                <button className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200" aria-label="Notifications">
                    <BellIcon />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-brand-secondary"></span>
                </button>

                <div className="relative" ref={profileRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent rounded-full" aria-haspopup="true" aria-expanded={isProfileOpen}>
                        <img src="https://picsum.photos/seed/user/40" alt="User" className="w-10 h-10 rounded-full" />
                    </button>
                    {isProfileOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-brand-secondary ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                            <div className="px-4 py-2 border-b border-gray-700">
                                <p className="font-semibold text-sm text-white">Admin User</p>
                                <p className="text-xs text-brand-text-secondary">Administrator</p>
                            </div>
                            <a href="#" className="block px-4 py-2 text-sm text-brand-text-secondary hover:bg-gray-700 hover:text-white" role="menuitem">Your Profile</a>
                            <a href="#" className="block px-4 py-2 text-sm text-brand-text-secondary hover:bg-gray-700 hover:text-white" role="menuitem">Settings</a>
                            <a href="#" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-white" role="menuitem">Sign out</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
