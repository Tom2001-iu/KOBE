import React from 'react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
        >
            <div 
                className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="profile-modal-title" className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-brand-text-secondary mb-6">
                    This is a placeholder for the {title.toLowerCase()} screen. In a real application, this would contain user settings, profile information, or other relevant controls.
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
