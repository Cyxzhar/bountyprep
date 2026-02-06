import React from 'react';
import { Layers, FlaskConical, Crown } from 'lucide-react';

const LandingFeatures = () => {
    return (
        <section id="features" className="landing-features">
            <div className="landing-container">
                <div className="section-header animate-fade-in-up">
                    <h2 className="text-gradient">The Bugora Edge</h2>
                    <p className="subtitle">Everything you need to go from amateur to elite bug hunter.</p>
                </div>
                <div className="feature-grid">
                    <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="feature-card-glow"></div>
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon-glow"></div>
                            <div className="feature-icon"><Layers /></div>
                        </div>
                        <h3>Immersive Curriculum</h3>
                        <p>Structured paths covering OWASP Top 10, Cloud Security, and advanced exploitation.</p>
                    </div>
                    <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="feature-card-glow"></div>
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon-glow"></div>
                            <div className="feature-icon"><FlaskConical /></div>
                        </div>
                        <h3>On-Demand Labs</h3>
                        <p>Launch interactive targets in seconds. Practice recon, exploitation, and reporting.</p>
                    </div>
                    <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="feature-card-glow"></div>
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon-glow"></div>
                            <div className="feature-icon"><Crown /></div>
                        </div>
                        <h3>Gamified Rewards</h3>
                        <p>Earn XP, unlock badges, and climb the leaderboard as you find more bugs.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;
