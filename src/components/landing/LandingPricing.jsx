import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const LandingPricing = ({ onOpenWaitlist, isJoined }) => {
    return (
        <section className="landing-pricing">
            <div className="landing-container">
                <div className="landing-pricing-card animate-fade-in-up">
                    <div className="landing-pricing-header">
                        <h2 className="text-display">Join the Elite</h2>
                        <p>Get full access to all labs and courses.</p>
                    </div>
                    <div className="landing-price-tag">
                        <span className="landing-price-currency">$</span>
                        <span className="landing-price-amount">1</span>
                        <span className="landing-price-period">/month</span>
                    </div>
                    <div className="landing-coming-soon-badge">COMING SOON</div>
                    <ul className="landing-pricing-features">
                        <li><CheckCircle size={16} /> Unlimited Lab Runtime</li>
                        <li><CheckCircle size={16} /> AI Hacker Coach (Coming Soon)</li>
                        <li><CheckCircle size={16} /> Advanced Exploit Payloads</li>
                        <li><CheckCircle size={16} /> Priority Lab Support</li>
                    </ul>
                    <button
                        className="landing-btn-primary landing-btn-lg landing-btn-full"
                        onClick={onOpenWaitlist}
                        disabled={isJoined}
                    >
                        {isJoined ? "ON WAITLIST" : "JOIN WAITLIST"} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LandingPricing;
