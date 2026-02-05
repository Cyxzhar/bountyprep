import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import './MainLayout.css';

export default function MainLayout({ children }) {
    const location = useLocation();

    // Pages that should not show navigation
    const noNavPages = [
        '/onboarding',
        '/auth',
        '/splash',
        '/',
        '/course/', // Course detail preview (public)
    ];

    const showNav = !noNavPages.some(path => location.pathname.startsWith(path));

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
