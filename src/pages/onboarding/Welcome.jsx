import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bug, ChevronRight, Calculator, Terminal, Award, Zap, Bot, Target, LockOpen } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import PageTransition, { FADE } from '../../components/PageTransition/PageTransition';
import OnboardingIllustration from './OnboardingIllustration';
import Logo from '../../components/Logo/Logo';
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
                <button className="onboarding-skip-btn" onClick={handleSkip}>
                    Skip
                    <ChevronRight size={16} />
                </button>

                {/* Left Panel Illustration (Desktop Only) */}
                <OnboardingIllustration step="welcome" />

                <div className="onboarding-content">
                    {/* Hero Section */}
                    <div className="onboarding-welcome-hero">
                        <div className="onboarding-hero-illustration">
                            <div className="onboarding-hero-glow"></div>
                            <div className="onboarding-hero-icon-main">
                                <Logo style={{ width: '100px', height: '100px' }} />
                            </div>
                            <div className="onboarding-hero-particles">
                                <span style={{ top: '10%', left: '20%', animationDelay: '0s' }}></span>
                                <span style={{ top: '30%', right: '15%', animationDelay: '0.5s' }}></span>
                                <span style={{ bottom: '20%', left: '25%', animationDelay: '1s' }}></span>
                                <span style={{ bottom: '30%', right: '20%', animationDelay: '1.5s' }}></span>
                            </div>
                        </div>

                        <h1 className="onboarding-welcome-title">
                            Master Bug Bounties in 10 Minutes Daily
                        </h1>

                        <p className="onboarding-welcome-subtitle">
                            Join thousands of security professionals landing their dream jobs and earning bounties.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="onboarding-welcome-stats">
                        <div className="onboarding-stat-item">
                            <Target size={18} />
                            <span className="onboarding-stat-value">50+</span>
                            <span className="onboarding-stat-label">Labs</span>
                        </div>
                        <div className="onboarding-stat-divider"></div>
                        <div className="onboarding-stat-item">
                            <Bot size={18} />
                            <span className="onboarding-stat-value">AI</span>
                            <span className="onboarding-stat-label">Coach</span>
                        </div>
                        <div className="onboarding-stat-divider"></div>
                        <div className="onboarding-stat-item">
                            <Award size={18} />
                            <span className="onboarding-stat-value">Pro</span>
                            <span className="onboarding-stat-label">Certs</span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="onboarding-trust-badges">
                        <div className="onboarding-trust-badge">
                            <LockOpen size={14} /> Beginner Friendly
                        </div>
                        <div className="onboarding-trust-badge">
                            <Terminal size={14} /> Hands-on Practice
                        </div>
                        <div className="onboarding-trust-badge">
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
                </div>
            </div>
        </PageTransition>
    );
}
