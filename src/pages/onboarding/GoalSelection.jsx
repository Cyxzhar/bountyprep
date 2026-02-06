import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, Briefcase, Target, Wrench, ChevronRight } from 'lucide-react';
import PageTransition, { SLIDE_LEFT, SLIDE_RIGHT } from '../../components/PageTransition/PageTransition';
import OnboardingProgress from '../../components/OnboardingProgress/OnboardingProgress';
import OnboardingIllustration from './OnboardingIllustration';
import './Onboarding.css';

const goals = [
    { id: 'bounty', title: 'Land my first bug bounty', desc: 'Earn $500+ from vulnerability reports', icon: DollarSign },
    { id: 'hired', title: 'Get hired in cybersecurity', desc: 'Break into the security industry', icon: Briefcase },
    { id: 'interview', title: 'Ace security interviews', desc: 'Prepare for technical interviews', icon: Target },
    { id: 'skills', title: 'Build practical skills', desc: 'Learn real-world security testing', icon: Wrench },
];

export default function GoalSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);

    // Use SLIDE_RIGHT if coming from a future step (back navigation)
    const direction = location.state?.direction === 'back' ? SLIDE_RIGHT : SLIDE_LEFT;

    return (
        <PageTransition pageName="onboarding-goal" direction={direction}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                {/* Left Panel Illustration (Desktop Only) */}
                <OnboardingIllustration step="goal" />

                <div className="onboarding-content">
                    {/* Progress */}
                    <OnboardingProgress currentStep={1} />

                    <h2 className="onboarding-question-title">What's your primary goal?</h2>
                    <p className="onboarding-question-subtitle">We'll personalize your learning path</p>

                    <div className="onboarding-options-grid">
                        {goals.map((goal) => {
                            const Icon = goal.icon;
                            return (
                                <div
                                    key={goal.id}
                                    className={`onboarding-option-card ${selected === goal.id ? 'selected' : ''}`}
                                    onClick={() => setSelected(goal.id)}
                                >
                                    <div className="onboarding-option-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="onboarding-option-content">
                                        <div className="onboarding-option-title">{goal.title}</div>
                                        <div className="onboarding-option-desc">{goal.desc}</div>
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
                        onClick={() => navigate('/onboarding/experience')}
                    >
                        Continue
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
