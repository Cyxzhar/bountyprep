import React, { useCallback } from 'react';
import { Layers, FlaskConical, Crown } from 'lucide-react';

const LandingFeatures = () => {
    // Mouse-tracking spotlight effect
    const handleMouseMove = useCallback((e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    }, []);

    const handleMouseEnter = useCallback((e) => {
        const before = e.currentTarget.querySelector('.feature-card-glow');
        // Show the radial gradient spotlight
        e.currentTarget.style.setProperty('--spotlight-opacity', '1');
    }, []);

    const features = [
        {
            icon: <Layers />,
            title: 'Immersive Curriculum',
            desc: 'Structured paths covering OWASP Top 10, Cloud Security, and advanced exploitation.',
            delay: '0.1s'
        },
        {
            icon: <FlaskConical />,
            title: 'On-Demand Labs',
            desc: 'Launch interactive targets in seconds. Practice recon, exploitation, and reporting.',
            delay: '0.2s'
        },
        {
            icon: <Crown />,
            title: 'Gamified Rewards',
            desc: 'Earn XP, unlock badges, and climb the leaderboard as you find more bugs.',
            delay: '0.3s'
        }
    ];

    return (
        <section id="features" className="landing-features">
            <div className="landing-container">
                <div className="section-header animate-fade-in-up">
                    <h2 className="text-gradient">The Bugora Edge</h2>
                    <p className="subtitle">Everything you need to go from amateur to elite bug hunter.</p>
                </div>
                <div className="feature-grid">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="feature-card animate-fade-in-up"
                            style={{ animationDelay: f.delay }}
                            onMouseMove={handleMouseMove}
                        >
                            <div className="feature-card-glow"></div>
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon-glow"></div>
                                <div className="feature-icon">{f.icon}</div>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;
