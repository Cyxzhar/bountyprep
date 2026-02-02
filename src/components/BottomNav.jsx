import { NavLink } from 'react-router-dom';
import { Home, Target, MessageSquare, TrendingUp, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/challenges', icon: Target, label: 'Challenges' },
    { to: '/interview', icon: MessageSquare, label: 'Interview' },
    { to: '/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Icon className="nav-icon" size={22} strokeWidth={2} />
                    <span className="nav-label">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
