import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Briefcase, Target, Wrench, ChevronRight } from 'lucide-react';
import PageTransition, { SLIDE_LEFT } from '../../components/PageTransition';
import './Onboarding.css';

const goals = [
    { id: 'bounty', title: 'Land my first bug bounty', desc: 'Earn $500+ from vulnerability reports', icon: DollarSign },
    { id: 'hired', title: 'Get hired in cybersecurity', desc: 'Break into the security industry', icon: Briefcase },
    { id: 'interview', title: 'Ace security interviews', desc: 'Prepare for technical interviews', icon: Target },
    { id: 'skills', title: 'Build practical skills', desc: 'Learn real-world security testing', icon: Wrench },
];

export default function GoalSelection() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    return (
        <PageTransition pageName="onboarding-goal" direction={SLIDE_LEFT}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                <div className="onboarding-content">
                    {/* Progress */}
                    <div className="progress-steps">
                        <div className="step"><div className="step-dot active"></div></div>
                        <div className="step-line"></div>
                        <div className="step"><div className="step-dot"></div></div>
                        <div className="step-line"></div>
                        <div className="step"><div className="step-dot"></div></div>
                        <div className="step-line"></div>
                        <div className="step"><div className="step-dot"></div></div>
                    </div>

                    <h2 className="question-title">What's your primary goal?</h2>
                    <p className="question-subtitle">We'll personalize your learning path</p>

                    <div className="options-grid">
                        {goals.map((goal) => {
                            const Icon = goal.icon;
                            return (
                                <div
                                    key={goal.id}
                                    className={`option-card ${selected === goal.id ? 'selected' : ''}`}
                                    onClick={() => setSelected(goal.id)}
                                >
                                    <div className="option-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="option-content">
                                        <div className="option-title">{goal.title}</div>
                                        <div className="option-desc">{goal.desc}</div>
                                    </div>
                                    <div className="option-radio"></div>
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
