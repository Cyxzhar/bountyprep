import { useNavigate } from 'react-router-dom';
import {
    Check, X, Zap, Crown, Shield, Rocket, Star,
    MessageSquare, ChevronRight, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Upgrade.css';

export default function Upgrade() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const isPremium = currentUser?.isPremium;

    const handleUpgrade = () => {
        // TODO: Integrate Gumroad/Stripe here
        window.open('https://gumroad.com/l/bountyprep-pro', '_blank');
    };

    return (
        <div className="page-container upgrade-page">
            <header className="page-header-nav">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <div className="header-badge">
                    <Crown size={14} className="text-yellow" />
                    <span>Go Pro</span>
                </div>
            </header>

            {/* Hero Section */}
            <div className="upgrade-hero">
                <h1>Unlock Your Full Potential</h1>
                <p>Join the top 1% of bug bounty hunters with unlimited access to advanced training and AI mentorship.</p>
            </div>

            {/* Pricing Cards */}
            <div className="pricing-container">
                {/* Free Tier */}
                <div className="pricing-card free-tier">
                    <div className="card-header">
                        <h3>Starter</h3>
                        <div className="price">
                            <span className="amount">$0</span>
                            <span className="period">/forever</span>
                        </div>
                        <p>Perfect for learning the basics</p>
                    </div>

                    <div className="features-list">
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>Basic Challenges (SQLi, XSS)</span>
                        </div>
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>5 AI Coach Messages / day</span>
                        </div>
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>Community Support</span>
                        </div>
                        <div className="feature-item disabled">
                            <X size={18} />
                            <span>Advanced Vulnerabilities</span>
                        </div>
                        <div className="feature-item disabled">
                            <X size={18} />
                            <span>Private Interview Scenarios</span>
                        </div>
                    </div>

                    <button className="btn btn-secondary btn-full" disabled>
                        Current Plan
                    </button>
                </div>

                {/* Premium Tier */}
                <div className="pricing-card premium-tier card-glow">
                    <div className="popular-tag">MOST POPULAR</div>
                    <div className="card-header">
                        <div className="header-title-row">
                            <h3>Bounty Hunter Pro</h3>
                            <Crown size={24} className="text-yellow" />
                        </div>
                        <div className="price">
                            <span className="amount">$9.99</span>
                            <span className="period">/month</span>
                        </div>
                        <p>Everything you need to master hacking</p>
                    </div>

                    <div className="features-list">
                        <div className="feature-item highlight">
                            <Check size={18} className="check-icon" />
                            <span><strong>All 100+ Challenges</strong></span>
                        </div>
                        <div className="feature-item highlight">
                            <Check size={18} className="check-icon" />
                            <span><strong>50 AI Coach Messages / day</strong></span>
                        </div>
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>Advanced Scenarios (IDOR, SSRF)</span>
                        </div>
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>Priority Support</span>
                        </div>
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>Verified "Pro" Badge</span>
                        </div>
                        <div className="feature-item">
                            <Check size={18} className="check-icon" />
                            <span>Certificate of Completion</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-full upgrade-btn"
                        onClick={handleUpgrade}
                        disabled={isPremium}
                    >
                        {isPremium ? 'Plan Active' : 'Upgrade Now'}
                        {!isPremium && <Zap size={18} />}
                    </button>
                    <div className="guarantee-text">
                        <Shield size={14} /> 7-day money-back guarantee
                    </div>
                </div>
            </div>

            {/* Feature Deep Dive */}
            <section className="feature-deep-dive">
                <h2>Why Go Pro?</h2>
                <div className="grid-3 features-grid">
                    <div className="feature-box">
                        <div className="icon-box">
                            <MessageSquare className="text-neon" />
                        </div>
                        <h3>AI Mentorship</h3>
                        <p>Get stuck? Ask our AI coach for unlimited hints, code explanations, and attack strategies.</p>
                    </div>
                    <div className="feature-box">
                        <div className="icon-box">
                            <Rocket className="text-purple" />
                        </div>
                        <h3>Real-World Labs</h3>
                        <p>Practice on realistic targets that mimic actual bug bounty programs like Uber, Google, and Meta.</p>
                    </div>
                    <div className="feature-box">
                        <div className="icon-box">
                            <Star className="text-yellow" />
                        </div>
                        <h3>Career Growth</h3>
                        <p>Earn certificates and build a portfolio that helps you land your first security job.</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>Can I cancel anytime?</h4>
                        <p>Yes, you can cancel your subscription instantly from your settings page. No questions asked.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Do you offer student discounts?</h4>
                        <p>Yes! Contact support with your .edu email for 50% off.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Is the AI coach really useful?</h4>
                        <p>Our AI is fine-tuned on thousands of bug reports and CTF writeups to give you expert-level guidance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
