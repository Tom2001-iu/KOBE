import React, { useState } from 'react';
import type { Notification } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../constants';

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    
    const handleClearAll = () => {
        setNotifications([]);
    };

    return (
        <div 
            className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-brand-secondary ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-panel-title"
        >
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                 <h3 id="notification-panel-title" className="text-lg font-bold text-white">Notifications</h3>
                 {notifications.length > 0 && (
                    <button onClick={handleClearAll} className="text-xs font-semibold text-brand-accent hover:underline">
                        Clear All
                    </button>
                 )}
            </div>
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-700/50">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                         <li key={notification.id} className="p-4 hover:bg-gray-700/50">
                            <div className="flex items-start space-x-3 text-sm">
                                <span className={`w-8 h-8 rounded-full ${notification.iconBgColor} flex items-center justify-center flex-shrink-0`}>
                                    {notification.icon}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium text-brand-text">{notification.text}</p>
                                    <p className="text-xs text-brand-text-secondary mt-1">{notification.timestamp}</p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                     <li className="p-4 text-center text-sm text-brand-text-secondary">
                        You're all caught up!
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NotificationPanel;
