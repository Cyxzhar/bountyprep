import { useNavigate } from 'react-router-dom';
import {
    Settings, CreditCard, Bell, Moon, Globe, Clock,
    HelpCircle, Star, Share2, Info, FileText, ChevronRight,
    LogOut, Crown, User, Shield, Bug
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { FirstVisitTransition } from '../components/PageTransition';
import './Profile.css';

const menuSections = [
    {
        title: 'Account',
        items: [
            { icon: Settings, label: 'Account Settings' },
            { icon: CreditCard, label: 'Subscription', badge: 'Premium' },
            { icon: Bell, label: 'Notifications' },
        ]
    },
    {
        title: 'Preferences',
        items: [
            { icon: Moon, label: 'Dark Mode', toggle: true, enabled: true },
            { icon: Globe, label: 'Language', value: 'English' },
            { icon: Clock, label: 'Learning Reminders' },
        ]
    },
    {
        title: 'Support',
        items: [
            { icon: HelpCircle, label: 'Help & Support' },
            { icon: Star, label: 'Rate App' },
            { icon: Share2, label: 'Share with Friends' },
        ]
    },
    {
        title: 'Legal',
        items: [
            { icon: Info, label: 'About BountyPrep' },
            { icon: FileText, label: 'Privacy Policy' },
            { icon: FileText, label: 'Terms of Service' },
        ]
    }
];

export default function Profile() {
    const navigate = useNavigate();

    return (
        <div className="profile-screen">
            <div className="screen-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <div className="avatar-ring">
                            <div className="avatar-inner">
                                <User size={32} />
                            </div>
                        </div>
                        <div className="premium-crown">
                            <Crown size={16} />
                        </div>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">Alex Hunter</h1>
                        <p className="profile-email">alex.hunter@example.com</p>
                        <span className="profile-badge">
                            <Crown size={12} />
                            Premium Member
                        </span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="profile-stats">
                    <div className="ps-card">
                        <span className="ps-value">48</span>
                        <span className="ps-label">Challenges</span>
                    </div>
                    <div className="ps-card">
                        <span className="ps-value">85%</span>
                        <span className="ps-label">Accuracy</span>
                    </div>
                    <div className="ps-card">
                        <span className="ps-value">#1.2K</span>
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
                                        <button key={iIdx} className="menu-item">
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
                                                <span className="menu-badge">{item.badge}</span>
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
                    onClick={() => navigate('/')}
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
                    <span className="app-name">BountyPrep v1.0.0</span>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
