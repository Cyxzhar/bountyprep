import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const LandingPricing = ({ onOpenWaitlist, isJoined }) => {
    return (
        <section className="landing-pricing">
            <div className="container">
                <div className="pricing-card animate-fade-in-up">
                    <div className="pricing-header">
                        <h2 className="text-display">Join the Elite</h2>
                        <p>Get full access to all labs and courses.</p>
                    </div>
                    <div className="price-tag">
                        <span className="currency">$</span>
                        <span className="amount">1</span>
                        <span className="period">/month</span>
                    </div>
                    <div className="coming-soon-badge">COMING SOON</div>
                    <ul className="pricing-features">
                        <li><CheckCircle size={16} /> Unlimited Lab Runtime</li>
                        <li><CheckCircle size={16} /> AI Hacker Coach (Coming Soon)</li>
                        <li><CheckCircle size={16} /> Advanced Exploit Payloads</li>
                        <li><CheckCircle size={16} /> Priority Lab Support</li>
                    </ul>
                    <button
                        className="btn-primary btn-lg"
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
