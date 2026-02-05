import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import './MainLayout.css';

export default function MainLayout({ children }) {
    const location = useLocation();

    // Pages that should not show navigation
    const noNavPages = ['/onboarding', '/auth', '/splash'];

    // Check if current path should hide navigation
    const showNav = location.pathname === '/'
        ? false  // Hide nav on landing page
        : !noNavPages.some(path => location.pathname.startsWith(path));

    if (!showNav) {
        return children;
    }

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                {children}
            </div>
            <BottomNav />
        </div>
    );
}
