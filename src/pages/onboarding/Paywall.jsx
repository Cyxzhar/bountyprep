import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X, Check, Shield, Bot, Flame, BarChart3, Award,
    MessageCircle, Rocket, Clock, Crown, Sparkles
} from 'lucide-react';
import PageTransition, { SLIDE_UP } from '../../components/PageTransition';
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

const testimonials = [
    { quote: 'Landed cybersecurity role at Google in 4 months', author: 'Sarah T.', role: 'Security Engineer' },
    { quote: 'Made $2,400 my first month bug hunting', author: 'Mike L.', role: 'Bug Hunter' },
];

export default function Paywall() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('annual');

    return (
        <PageTransition pageName="onboarding-paywall" direction={SLIDE_UP} duration={450}>
            <div className="paywall-screen">
                <div className="paywall-bg"></div>

                {/* Close Button */}
                <button className="close-btn" onClick={() => navigate('/auth/signup')}>
                    <X size={20} />
                </button>

                <div className="paywall-content">
                    {/* Header */}
                    <div className="paywall-header">
                        <div className="crown-badge">
                            <Crown size={20} />
                        </div>
                        <h1 className="paywall-title">
                            Become a <span className="text-gradient">Top 1%</span><br />
                            Security Professional
                        </h1>
                    </div>

                    {/* Outcomes */}
                    <div className="outcomes">
                        <div className="outcome">
                            <Check size={18} />
                            <span>Land $100K+ Security Jobs</span>
                        </div>
                        <div className="outcome">
                            <Check size={18} />
                            <span>Earn $500-5K Bug Bounties</span>
                        </div>
                        <div className="outcome">
                            <Check size={18} />
                            <span>Master OWASP Top 10</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="features-grid">
                        {features.map(({ icon: Icon, text }, idx) => (
                            <div key={idx} className="feature-item">
                                <Icon size={18} />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonials */}
                    <div className="testimonials">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="testimonial">
                                <p className="testimonial-quote">"{t.quote}"</p>
                                <div className="testimonial-author">
                                    <span className="author-name">{t.author}</span>
                                    <span className="author-role">{t.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className="pricing-cards">
                        <div
                            className={`pricing-card ${selectedPlan === 'annual' ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan('annual')}
                        >
                            <div className="popular-tag">
                                <Sparkles size={12} />
                                BEST VALUE
                            </div>
                            <div className="plan-name">Annual</div>
                            <div className="plan-price">
                                <span className="price">$99</span>
                                <span className="period">/year</span>
                            </div>
                            <div className="plan-savings">$8.25/mo • Save 45%</div>
                        </div>

                        <div
                            className={`pricing-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan('monthly')}
                        >
                            <div className="plan-name">Monthly</div>
                            <div className="plan-price">
                                <span className="price">$14.99</span>
                                <span className="period">/mo</span>
                            </div>
                            <div className="plan-savings">Cancel anytime</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="paywall-footer">
                    <button className="btn btn-primary btn-full" onClick={() => navigate('/auth/signup')}>
                        Start 7-Day Free Trial
                    </button>
                    <p className="trial-note">No payment required • Cancel anytime</p>
                    <div className="footer-links">
                        <span>Restore Purchase</span>
                        <span>•</span>
                        <span>Terms</span>
                        <span>•</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
