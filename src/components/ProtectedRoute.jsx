import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F', color: '#9FEF00' }}>
                <Loader2 size={40} className="spin" />
            </div>
        );
    }

    if (!currentUser) {
        // Redirect to login but save the attempted location
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
}
