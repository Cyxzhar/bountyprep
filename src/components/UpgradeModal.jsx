import { X, Crown, Zap, Shield, Bot, Check, ExternalLink } from 'lucide-react';
import './UpgradeModal.css';

const PREMIUM_FEATURES = [
    { icon: Shield, text: 'All 50+ Security Challenges' },
    { icon: Bot, text: '50 Daily AI Interview Sessions' },
    { icon: Zap, text: 'Advanced Exploit Techniques' },
    { icon: Check, text: 'Priority Support' },
];

export default function UpgradeModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleUpgrade = () => {
        // TODO: Replace with actual Gumroad link
        window.open('https://gumroad.com/bountyprep', '_blank');
    };

    return (
        <div className="upgrade-modal-overlay" onClick={onClose}>
            <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="modal-header">
                    <div className="crown-icon">
                        <Crown size={32} />
                    </div>
                    <h2>Unlock Premium</h2>
                    <p>Take your security skills to the next level</p>
                </div>

                <div className="features-list">
                    {PREMIUM_FEATURES.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} className="feature-item">
                                <div className="feature-icon">
                                    <Icon size={18} />
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="pricing-section">
                    <div className="price">
                        <span className="currency">$</span>
                        <span className="amount">10</span>
                        <span className="period">/year</span>
                    </div>
                    <p className="price-note">Less than $1/month for premium access</p>
                </div>

                <button className="upgrade-cta" onClick={handleUpgrade}>
                    <Crown size={18} />
                    Upgrade Now
                    <ExternalLink size={14} />
                </button>

                <p className="guarantee">30-day money-back guarantee</p>
            </div>
        </div>
    );
}
