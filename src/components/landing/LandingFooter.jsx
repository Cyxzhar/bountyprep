import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Heart } from 'lucide-react';

const LandingFooter = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="hacker-footer-simple">
            <div className="footer-grid-overlay"></div>
            <div className="container footer-container-simple">

                {/* Brand & Status */}
                <div className="footer-brand-simple">
                    <div className="brand-logo-simple">
                        <img src="/logo.svg" alt="Bugora" className="footer-logo-img" />
                        <span className="brand-text">Bug<span className="brand-accent">ora</span></span>
                    </div>
                    <p className="footer-tagline">
                        An interactive cybersecurity playground for researchers to practice hands-on labs.
                    </p>
                    <div className="status-badge-simple">
                        <span className="status-dot pulse"></span>
                        <span className="status-text">SYSTEM ONLINE · {time} UTC</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-simple">
                    <div className="copyright">
                        © 2026 Bugora.
                    </div>
                    <div className="made-with">
                        Crafted with <Heart size={14} className="heart-icon-simple" /> by <span className="text-white fw-bold ml-1">Binod Acharya</span>
                    </div>
                    <div className="footer-version">v1.1.0 (Modular Refactor)</div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
