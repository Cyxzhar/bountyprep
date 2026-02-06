import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings, CreditCard, Bell, Moon, Globe, Clock,
    HelpCircle, Star, Share2, Info, FileText, ChevronRight,
    LogOut, Crown, User, Shield, Bug, ExternalLink, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getSettings, updateSetting, shareApp } from '../../utils/settings';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser, logout, refreshUser } = useAuth();
    const { success, error, info } = useToast();

    const [settings, setSettings] = useState(getSettings());
    const [notificationPermission, setNotificationPermission] = useState('default');

    const isPremium = currentUser?.isPremium || false;

    // Check notification permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const handleToggle = async (key) => {
        if (key === 'notifications') {
            // Handle browser notification permission
            if (!('Notification' in window)) {
                error('Notifications not supported in this browser');
                return;
            }

            if (Notification.permission === 'denied') {
                error('Notifications blocked. Enable in browser settings.');
                return;
            }

            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                setNotificationPermission(permission);
                if (permission === 'granted') {
                    const updated = updateSetting('notifications', true);
                    setSettings(updated);
                    success('Notifications enabled!');
                    // Show test notification
                    new Notification('Bugora', {
                        body: 'Notifications are now enabled!',
                        icon: '/icons/icon-192x192.png'
                    });
                } else {
                    error('Notification permission denied');
                }
                return;
            }

            // Toggle if already granted
            const newValue = !settings[key];
            const updated = updateSetting(key, newValue);
            setSettings(updated);
            success(newValue ? 'Notifications enabled' : 'Notifications disabled');
        } else if (key === 'darkMode') {
            const newValue = !settings[key];
            const updated = updateSetting(key, newValue);
            setSettings(updated);
            info(newValue ? 'Dark mode enabled' : 'Light mode coming soon!');
        } else if (key === 'learningReminders') {
            const newValue = !settings[key];
            const updated = updateSetting(key, newValue);
            setSettings(updated);

            if (newValue) {
                // Schedule reminder notification (if notifications enabled)
                if (Notification.permission === 'granted' && settings.notifications) {
                    success('Daily reminders enabled at 9 AM');
                } else {
                    success('Reminders enabled (enable notifications to receive them)');
                }
            } else {
                success('Reminders disabled');
            }
        }
    };

    const handleShare = async () => {
        const result = await shareApp();
        if (result.success) {
            if (result.copied) {
                success('Link copied to clipboard!');
            }
        } else {
            error('Could not share');
        }
    };

    const handleRateApp = () => {
        // Placeholder for future app store link
        success('Rating feature coming to App Store soon!');
    };

    const handleExternalLink = (url, label) => {
        window.open(url, '_blank');
    };

    const handleLogout = async () => {
        try {
            await logout();
            success('Logged out successfully');
            navigate('/auth/login');
        } catch (err) {
            console.error('Logout failed', err);
            error('Failed to log out');
        }
    };



    const menuSections = [
        {
            title: 'Account',
            items: [
                {
                    icon: Settings,
                    label: 'Account Settings',
                    action: () => navigate('/settings')
                },
                {
                    icon: CreditCard,
                    label: 'Subscription',
                    badge: isPremium ? 'Premium' : 'Free',
                    action: () => !isPremium && navigate('/upgrade')
                },
                {
                    icon: Bell,
                    label: 'Push Notifications',
                    toggle: true,
                    enabled: settings.notifications && notificationPermission === 'granted',
                    action: () => handleToggle('notifications')
                },
            ]
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: Moon,
                    label: 'Dark Mode',
                    toggle: true,
                    enabled: settings.darkMode,
                    action: () => handleToggle('darkMode')
                },
                {
                    icon: Globe,
                    label: 'Language',
                    value: 'English',
                    action: () => info('More languages coming soon')
                },
                {
                    icon: Clock,
                    label: 'Daily Reminders',
                    toggle: true,
                    enabled: settings.learningReminders,
                    action: () => handleToggle('learningReminders')
                },
            ]
        },
        {
            title: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help & Support',
                    action: () => handleExternalLink('mailto:support@bugora.app', 'Email')
                },
                {
                    icon: Star,
                    label: 'Rate App',
                    action: handleRateApp
                },
                {
                    icon: Share2,
                    label: 'Share with Friends',
                    action: handleShare
                },
            ]
        },
        {
            title: 'Legal',
            items: [
                {
                    icon: Info,
                    label: 'About Bugora',
                    action: () => handleExternalLink('https://bugora.app', 'Website')
                },
                {
                    icon: FileText,
                    label: 'Privacy Policy',
                    action: () => handleExternalLink('https://bugora.app/privacy', 'Privacy')
                },
                {
                    icon: FileText,
                    label: 'Terms of Service',
                    action: () => handleExternalLink('https://bugora.app/terms', 'Terms')
                },
            ]
        }
    ];

    return (
        <div className="profile-screen">
            <div className="screen-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar" onClick={() => navigate('/settings')}>
                        <div className="avatar-ring">
                            <div className="avatar-inner">
                                {currentUser?.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                        </div>
                        <div className="avatar-edit-hint">
                            <Settings size={12} />
                        </div>
                        {isPremium && (
                            <div className="premium-crown">
                                <Crown size={16} />
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{currentUser?.displayName || 'Fellow Hunter'}</h1>
                        <p className="profile-email">{currentUser?.email || 'No Email'}</p>
                        {isPremium ? (
                            <span className="profile-badge premium">
                                <Crown size={12} />
                                Premium Member
                            </span>
                        ) : (
                            <button
                                className="profile-badge upgrade"
                                onClick={() => navigate('/upgrade')}
                            >
                                <Crown size={12} />
                                Upgrade to Premium
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="profile-stats">
                    <div className="ps-card">
                        <span className="ps-value">{currentUser?.totalCompleted || 0}</span>
                        <span className="ps-label">Challenges</span>
                    </div>
                    <div className="ps-card">
                        <span className="ps-value">
                            {currentUser?.totalQuestionsAnswered > 0
                                ? Math.round((currentUser.totalCorrectAnswers / currentUser.totalQuestionsAnswered) * 100)
                                : 0}%
                        </span>
                        <span className="ps-label">Accuracy</span>
                    </div>
                    <div className="ps-card">
                        <span className="ps-value">#{Math.max(1, 10000 - (currentUser?.totalCompleted || 0) * 10)}</span>
                        <span className="ps-label">Rank</span>
                    </div>
                </div>

                {/* Menu Sections */}
                <div className="menu-sections">
                    {menuSections.map((section, sIdx) => (
                        <div key={sIdx} className="menu-section">
                            <h3 className="menu-title">{section.title}</h3>
                            <div className="menu-list">
                                {section.items.map((item, iIdx) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={iIdx}
                                            className="menu-item"
                                            onClick={item.action}
                                        >
                                            <div className="menu-icon">
                                                <Icon size={20} />
                                            </div>
                                            <span className="menu-label">{item.label}</span>
                                            {item.toggle ? (
                                                <div className={`toggle ${item.enabled ? 'on' : ''}`}>
                                                    <div className="toggle-knob"></div>
                                                </div>
                                            ) : item.value ? (
                                                <span className="menu-value">{item.value}</span>
                                            ) : item.badge ? (
                                                <span className={`menu-badge ${item.badge === 'Free' ? 'free' : ''}`}>
                                                    {item.badge}
                                                </span>
                                            ) : (
                                                <ChevronRight size={18} className="menu-arrow" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logout */}
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    Log Out
                </button>



                {/* Footer */}
                <div className="profile-footer">
                    <div className="app-logo">
                        <Shield size={20} />
                        <Bug size={10} className="logo-bug" />
                    </div>
                    <span className="app-name">Bugora v1.0.0</span>
                </div>
            </div>

        </div>
    );
}
