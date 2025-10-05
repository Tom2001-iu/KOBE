import React, { useState, useEffect, useRef } from 'react';
import type { View } from '../types';
import NotificationPanel from './shared/NotificationPanel';
import ProfileModal from './shared/ProfileModal';

// Existing Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

interface HeaderProps {
    viewTitle: string;
    toggleSidebar: () => void;
    openCommandPalette: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewTitle, toggleSidebar, openCommandPalette }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [profileModal, setProfileModal] = useState<{isOpen: boolean, title: string}>({isOpen: false, title: ''});
    const [hasUnread, setHasUnread] = useState(true);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileMenuClick = (action: 'profile' | 'settings' | 'signout') => {
        setIsProfileOpen(false);
        if (action === 'profile') {
            setProfileModal({isOpen: true, title: 'Your Profile'});
        } else if (action === 'settings') {
            setProfileModal({isOpen: true, title: 'Settings'});
        } else if (action === 'signout') {
            if (window.confirm('Are you sure you want to sign out?')) {
                // Sign out logic here
                console.log('User signed out.');
            }
        }
    };

    return (
        <header className="bg-brand-secondary shadow-md p-4 flex justify-between items-center flex-shrink-0 z-10 relative">
             <ProfileModal 
                isOpen={profileModal.isOpen} 
                onClose={() => setProfileModal({isOpen: false, title: ''})}
                title={profileModal.title}
             />
            <div className="flex items-center">
                <button 
                    onClick={toggleSidebar} 
                    className="md:hidden p-1 mr-3 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Open navigation menu"
                >
                    <MenuIcon />
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-white capitalize">{viewTitle}</h2>
            </div>

            {/* Search Bar Trigger */}
             <div className="flex-1 flex justify-center px-4">
                <button 
                    onClick={openCommandPalette}
                    className="w-full max-w-lg bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 text-left text-brand-text-secondary flex items-center justify-between hover:border-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                    <div className="flex items-center">
                        <SearchIcon className="w-5 h-5 mr-3" />
                        Search...
                    </div>
                    <kbd className="hidden md:inline-block px-2 py-1 text-xs font-sans font-semibold text-gray-400 bg-gray-900 border border-gray-700 rounded-md">⌘K</kbd>
                </button>
            </div>

            {/* Right side icons */}
            <div className={`flex items-center space-x-2 md:space-x-4`}>
                <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={() => { setIsNotificationsOpen(prev => !prev); setHasUnread(false); }}
                        className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200" aria-label="Notifications"
                    >
                        <BellIcon />
                        {hasUnread && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-brand-secondary"></span>}
                    </button>
                    {isNotificationsOpen && <NotificationPanel onClose={() => setIsNotificationsOpen(false)} />}
                </div>

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
                            <button onClick={() => handleProfileMenuClick('profile')} className="block w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-gray-700 hover:text-white" role="menuitem">Your Profile</button>
                            <button onClick={() => handleProfileMenuClick('settings')} className="block w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-gray-700 hover:text-white" role="menuitem">Settings</button>
                            <button onClick={() => handleProfileMenuClick('signout')} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-white" role="menuitem">Sign out</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
