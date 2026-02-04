import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bug, ChevronRight, Star, Users, Zap } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import PageTransition, { FADE } from '../../components/PageTransition';
import './Onboarding.css';

export default function Welcome() {
    const navigate = useNavigate();
    const { playBGM, stopBGM, retryPendingAudio, isPlaying } = useSound();

    // Try to play audio on mount
    useEffect(() => {
        playBGM('cyber', { loop: true, volume: 0.3 });
    }, []); // Run once on mount

    // Retry audio on first user interaction if autoplay was blocked
    useEffect(() => {
        const enableAudio = () => {
            if (!isPlaying) {
                retryPendingAudio();
            }
        };

        // Listen for any user interaction
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });

        return () => {
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
        };
    }, [isPlaying, retryPendingAudio]);

    const handleSkip = () => {
        stopBGM(); // Stop audio when skipping
        navigate('/auth/signup');
    };

    const handleContinue = () => {
        // Don't stop audio, let it continue to next page
        navigate('/onboarding/goal');
    };

    return (
        <PageTransition pageName="onboarding-welcome" direction={FADE} duration={500}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                {/* Skip Button */}
                <button className="skip-btn" onClick={handleSkip}>
                    Skip
                    <ChevronRight size={16} />
                </button>

                <div className="onboarding-content">
                    {/* Hero Section */}
                    <div className="welcome-hero">
                        <div className="hero-illustration">
                            <div className="hero-glow"></div>
                            <div className="hero-icon-main">
                                <Shield size={80} strokeWidth={1.5} />
                                <Bug className="hero-bug" size={32} />
                            </div>
                            <div className="hero-particles">
                                <span style={{ top: '10%', left: '20%', animationDelay: '0s' }}></span>
                                <span style={{ top: '30%', right: '15%', animationDelay: '0.5s' }}></span>
                                <span style={{ bottom: '20%', left: '25%', animationDelay: '1s' }}></span>
                                <span style={{ bottom: '30%', right: '20%', animationDelay: '1.5s' }}></span>
                            </div>
                        </div>

                        <h1 className="welcome-title">
                            Master Bug Bounties<br />
                            <span className="text-gradient">in 10 Minutes Daily</span>
                        </h1>

                        <p className="welcome-subtitle">
                            Join thousands of security professionals landing their dream jobs and earning bounties.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="welcome-stats">
                        <div className="stat-item">
                            <Users size={18} />
                            <span className="stat-value">10K+</span>
                            <span className="stat-label">Learners</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <Star size={18} />
                            <span className="stat-value">4.9</span>
                            <span className="stat-label">Rating</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <Zap size={18} />
                            <span className="stat-value">200+</span>
                            <span className="stat-label">Challenges</span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges">
                        <div className="trust-badge">🔒 Beginner Friendly</div>
                        <div className="trust-badge">🎯 Hands-on Practice</div>
                        <div className="trust-badge">🏆 Industry Recognized</div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="onboarding-footer">
                    <button className="btn btn-primary btn-full" onClick={handleContinue}>
                        Start Your Journey
                        <ChevronRight size={20} />
                    </button>
                    <p className="footer-text">Free to start • No credit card required</p>
                </div>
            </div>
        </PageTransition>
    );
}
