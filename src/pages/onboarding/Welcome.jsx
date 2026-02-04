import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bug, ChevronRight, Calculator, Terminal, Award, Zap, Bot, Target, LockOpen } from 'lucide-react';
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
                                <img src="/logo.svg" alt="Bugora" style={{ width: '100px', height: '100px' }} />
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
                            <Target size={18} />
                            <span className="stat-value">50+</span>
                            <span className="stat-label">Labs</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <Bot size={18} />
                            <span className="stat-value">AI</span>
                            <span className="stat-label">Coach</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <Award size={18} />
                            <span className="stat-value">Pro</span>
                            <span className="stat-label">Certs</span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges">
                        <div className="trust-badge">
                            <LockOpen size={14} /> Beginner Friendly
                        </div>
                        <div className="trust-badge">
                            <Terminal size={14} /> Hands-on Practice
                        </div>
                        <div className="trust-badge">
                            <Award size={14} /> Industry Standard
                        </div>
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
