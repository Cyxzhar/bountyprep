import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const LandingHero = ({ onOpenWaitlist, isJoined, onExplore }) => {
    return (
        <header className="landing-hero">
            <div className="hero-background-wrapper">
                <img
                    src="/hero-concept.png"
                    alt="Cybersecurity Concept"
                    className="hero-bg-image"
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <div className="badge-promo animate-fade-in">
                        <span className="badge-icon"><Zap size={12} /></span>
                        v1.0 Official Launch
                    </div>
                    <h1 className="hero-title animate-fade-in-up">
                        Master the Art of <br />
                        <span className="text-gradient">Cyber Exploration</span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Bountypaper is the premium interactive playground where security researchers transform theory into critical findings through immersive labs.
                    </p>
                    <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            className="btn-hero-primary"
                            onClick={onOpenWaitlist}
                            disabled={isJoined}
                        >
                            {isJoined ? "ON WAITLIST" : "JOIN WAITLIST"} <ArrowRight size={18} />
                        </button>
                        <button className="btn-hero-secondary" onClick={onExplore}>
                            EXPLORE LABS
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandingHero;
