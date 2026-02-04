import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bug, Zap } from 'lucide-react';
import './Splash.css';

export default function Splash() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 4;
            });
        }, 80);

        const timer = setTimeout(() => {
            navigate('/onboarding/welcome', { replace: true });
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [navigate]);

    return (
        <div className="splash-screen">
            {/* Background Effects */}
            <div className="splash-bg-grid"></div>
            <div className="splash-glow"></div>

            <div className="splash-content">
                {/* Logo */}
                <div className="splash-logo animate-float">
                    <div className="logo-icon-wrapper">
                        <Shield className="logo-shield" size={64} strokeWidth={1.5} />
                        <Bug className="logo-bug" size={28} />
                    </div>
                </div>

                {/* Brand */}
                <h1 className="splash-brand">
                    <span className="brand-text">Bounty</span>
                    <span className="brand-accent">Prep</span>
                </h1>

                <p className="splash-tagline">Master Bug Bounty Hunting</p>

                {/* Loading */}
                <div className="splash-loader">
                    <div className="loader-bar">
                        <div className="loader-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="loader-text">
                        <Zap size={14} />
                        <span>Initializing...</span>
                    </div>
                </div>
            </div>

            {/* Version */}
            <div className="splash-version">v1.0.0</div>
        </div>
    );
}
