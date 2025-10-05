
import React from 'react';
import type { Notification } from '../types';

interface RecentNotificationsProps {
    notifications: Notification[];
}

const RecentNotifications: React.FC<RecentNotificationsProps> = ({ notifications }) => {
    return (
        <div className="bg-brand-secondary p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-xl font-bold mb-4">Recent Notifications</h3>
            {notifications.length > 0 ? (
                <ul className="space-y-4">
                    {notifications.map((notification, index) => (
                        <li 
                            key={notification.id} 
                            className="flex items-start space-x-3 text-sm animate-fade-in" 
                        >
                            <span className={`w-8 h-8 rounded-full ${notification.iconBgColor} flex items-center justify-center flex-shrink-0`}>
                                {notification.icon}
                            </span>
                            <div>
                                <p className="font-semibold">{notification.text}</p>
                                <p className="text-xs text-brand-text-secondary">{notification.timestamp}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-48 text-brand-text-secondary">
                    <p>No new notifications.</p>
                </div>
            )}
        </div>
    );
};

export default RecentNotifications;
