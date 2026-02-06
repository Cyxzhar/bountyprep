import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Star, Flame, ChevronRight, ChevronLeft } from 'lucide-react';
import PageTransition, { SLIDE_LEFT, SLIDE_RIGHT } from '../../components/PageTransition/PageTransition';
import OnboardingProgress from '../../components/OnboardingProgress/OnboardingProgress';
import OnboardingIllustration from './OnboardingIllustration';
import './Onboarding.css';

const commitments = [
    { id: '5', title: '5 minutes', desc: 'Quick daily practice', icon: Zap },
    { id: '10', title: '10 minutes', desc: 'Balanced learning', icon: Star, recommended: true },
    { id: '15', title: '15+ minutes', desc: 'Intensive training', icon: Flame },
];

export default function DailyCommitment() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState('10');

    const direction = location.state?.direction === 'back' ? SLIDE_RIGHT : SLIDE_LEFT;

    const handleBack = () => {
        navigate('/onboarding/experience', { state: { direction: 'back' } });
    };

    return (
        <PageTransition pageName="onboarding-commitment" direction={direction}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                {/* Back Button */}
                <button className="onboarding-back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} />
                    Back
                </button>

                {/* Left Panel Illustration (Desktop Only) */}
                <OnboardingIllustration step="commitment" />

                <div className="onboarding-content">
                    <OnboardingProgress currentStep={3} />

                    <h2 className="onboarding-question-title">How much time can you commit?</h2>
                    <p className="onboarding-question-subtitle">Consistency is key to mastery</p>

                    <div className="onboarding-options-grid">
                        {commitments.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className={`onboarding-option-card ${selected === item.id ? 'selected' : ''} ${item.recommended ? 'onboarding-recommended' : ''}`}
                                    onClick={() => setSelected(item.id)}
                                >
                                    <div className="onboarding-option-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="onboarding-option-content">
                                        <div className="onboarding-option-title">{item.title}</div>
                                        <div className="onboarding-option-desc">{item.desc}</div>
                                    </div>
                                    <div className="onboarding-option-radio"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="onboarding-footer">
                    <button
                        className="btn btn-primary btn-full"
                        onClick={() => navigate('/onboarding/analysis')}
                    >
                        Continue
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
