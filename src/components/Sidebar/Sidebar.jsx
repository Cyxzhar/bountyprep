import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    FlaskConical,
    Trophy,
    TrendingUp,
    User,
    Settings,
    BookOpen,
    MessageSquare,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const mainNav = [
        { path: '/home', icon: Home, label: 'Home' },
        { path: '/courses', icon: BookOpen, label: 'Learn' },
        { path: '/challenges', icon: Trophy, label: 'Challenges' },
        { path: '/progress', icon: TrendingUp, label: 'Progress' },
        { path: '/interview', icon: MessageSquare, label: 'AI Tutor' },
    ];

    const bottomNav = [
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => location.pathname === path;

    // Hide logout button on Profile and Settings pages on desktop
    const shouldShowLogout = !['/profile', '/settings'].includes(location.pathname);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <img src="/logo.svg" alt="Bugora" />
                </div>
                <span className="brand-name">Bug<span className="brand-accent">ora</span></span>
            </div>

            {/* User Card */}
            <div className="sidebar-user">
                <div className="user-avatar">
                    {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt={currentUser.displayName} />
                    ) : (
                        <div className="user-avatar-placeholder">
                            {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <div className="user-status" />
                </div>
                <div className="user-info">
                    <span className="user-name">{currentUser?.displayName || 'User'}</span>
                    <span className="user-level">
                        Level {currentUser?.level || 1} · {currentUser?.xp || 0} XP
                    </span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    {mainNav.map(({ path, icon: Icon, label }) => (
                        <button
                            key={path}
                            className={`nav-item ${isActive(path) ? 'active' : ''}`}
                            onClick={() => navigate(path)}
                        >
                            <Icon size={20} strokeWidth={2} />
                            <span className="nav-label">{label}</span>
                            {isActive(path) && <div className="nav-indicator" />}
                        </button>
                    ))}
                </div>

                <div className="nav-divider" />

                <div className="nav-section">
                    {bottomNav.map(({ path, icon: Icon, label }) => (
                        <button
                            key={path}
                            className={`nav-item ${isActive(path) ? 'active' : ''}`}
                            onClick={() => navigate(path)}
                        >
                            <Icon size={20} strokeWidth={2} />
                            <span className="nav-label">{label}</span>
                            {isActive(path) && <div className="nav-indicator" />}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Footer Actions */}
            <div className="sidebar-footer">
                <button
                    className="sidebar-theme-btn"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {shouldShowLogout && (
                    <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={20} strokeWidth={2} />
                    </button>
                )}
            </div>
        </aside>
    );
}
