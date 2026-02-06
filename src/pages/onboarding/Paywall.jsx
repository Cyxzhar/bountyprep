import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X, Check, Shield, Bot, Flame, BarChart3, Award,
    MessageCircle, Rocket, Clock, Crown, Sparkles
} from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import PageTransition, { SLIDE_UP } from '../../components/PageTransition/PageTransition';
import OnboardingIllustration from './OnboardingIllustration';
import './Paywall.css';

const features = [
    { icon: Shield, text: '200+ Vulnerability Scenarios' },
    { icon: Bot, text: 'AI Interview Coach' },
    { icon: Flame, text: 'Daily Streak Challenges' },
    { icon: BarChart3, text: 'Progress Analytics' },
    { icon: Award, text: 'Completion Certificates' },
    { icon: MessageCircle, text: 'Expert Community' },
    { icon: Rocket, text: 'Premium Job Board' },
    { icon: Clock, text: 'Lifetime Updates' },
];



import { useAuth } from '../../context/AuthContext';

export default function Paywall() {
    const navigate = useNavigate();
    const { stopBGM } = useSound();
    const { currentUser } = useAuth();
    const isOnWaitlist = currentUser?.onWaitlist || false;

    const handleNavigateToSignup = () => {
        stopBGM(); // Stop onboarding music
        navigate('/auth/signup');
    };

    return (
        <PageTransition pageName="onboarding-paywall" direction={SLIDE_UP} duration={450}>
            <div className="onboarding-screen paywall-screen">
                <div className="onboarding-bg-grid paywall-bg"></div>

                {/* Close Button */}
                <button className="paywall-close-btn onboarding-skip-btn" onClick={handleNavigateToSignup}>
                    <X size={20} />
                </button>

                {/* Left Panel Illustration (Desktop Only) */}
                <OnboardingIllustration step="paywall" />

                <div className="paywall-content onboarding-content">
                    {/* Header */}
                    <div className="paywall-header">
                        <div className="paywall-crown-badge">
                            <Crown size={20} />
                        </div>
                        <h1 className="paywall-title">
                            Become a <span className="text-gradient">Top 1%</span><br />
                            Security Professional
                        </h1>
                    </div>

                    {/* Outcomes */}
                    <div className="paywall-outcomes">
                        <div className="paywall-outcome">
                            <Check size={18} />
                            <span>Land $100K+ Security Jobs</span>
                        </div>
                        <div className="paywall-outcome">
                            <Check size={18} />
                            <span>Earn $500-5K Bug Bounties</span>
                        </div>
                        <div className="paywall-outcome">
                            <Check size={18} />
                            <span>Master OWASP Top 10</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="paywall-features-grid">
                        {features.map(({ icon: Icon, text }, idx) => (
                            <div key={idx} className="paywall-feature-item">
                                <Icon size={18} />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>



                    {/* Pricing */}
                    <div className="paywall-pricing-cards">
                        <div className="paywall-pricing-card selected waitlist-card">
                            <div className="paywall-popular-tag">EARLY BIRD</div>
                            <div className="paywall-plan-info">
                                <div className="paywall-plan-name">Bounty Hunter Pro</div>
                                <div className="paywall-plan-savings">COMING SOON</div>
                            </div>
                            <div className="paywall-plan-price">
                                <span className="price">$10</span>
                                <span className="period">/year</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="paywall-footer">
                    <button
                        className="btn btn-primary btn-full"
                        onClick={handleNavigateToSignup}
                        disabled={isOnWaitlist}
                    >
                        {isOnWaitlist ? 'Request Received' : 'Join Waitlist'}
                    </button>
                    <p className="trial-note">Spots opening soon • Verified Pro Badge included</p>
                    <div className="footer-links">
                        <span>Terms</span>
                        <span>•</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
