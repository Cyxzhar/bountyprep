import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, BookOpen, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';
import PageTransition, { SLIDE_LEFT, SLIDE_RIGHT } from '../../components/PageTransition/PageTransition';
import OnboardingProgress from '../../components/OnboardingProgress/OnboardingProgress';
import OnboardingIllustration from './OnboardingIllustration';
import './Onboarding.css';

const levels = [
    { id: 'beginner', title: 'Beginner', desc: 'Just starting with cybersecurity', icon: Sprout },
    { id: 'intermediate', title: 'Intermediate', desc: 'Know basics, built some projects', icon: BookOpen },
    { id: 'advanced', title: 'Advanced', desc: 'Done bug bounty or security work', icon: Rocket },
];

export default function ExperienceLevel() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);

    const direction = location.state?.direction === 'back' ? SLIDE_RIGHT : SLIDE_LEFT;

    const handleBack = () => {
        navigate('/onboarding/goal', { state: { direction: 'back' } });
    };

    return (
        <PageTransition pageName="onboarding-experience" direction={direction}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                {/* Back Button */}
                <button className="onboarding-back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} />
                    Back
                </button>

                {/* Left Panel Illustration (Desktop Only) */}
                <OnboardingIllustration step="experience" />

                <div className="onboarding-content">
                    <OnboardingProgress currentStep={2} />

                    <h2 className="onboarding-question-title">What's your experience level?</h2>
                    <p className="onboarding-question-subtitle">This helps us tailor content difficulty</p>

                    <div className="onboarding-options-grid">
                        {levels.map((level) => {
                            const Icon = level.icon;
                            return (
                                <div
                                    key={level.id}
                                    className={`onboarding-option-card ${selected === level.id ? 'selected' : ''}`}
                                    onClick={() => setSelected(level.id)}
                                >
                                    <div className="onboarding-option-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="onboarding-option-content">
                                        <div className="onboarding-option-title">{level.title}</div>
                                        <div className="onboarding-option-desc">{level.desc}</div>
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
                        disabled={!selected}
                        onClick={() => navigate('/onboarding/commitment')}
                    >
                        Continue
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
