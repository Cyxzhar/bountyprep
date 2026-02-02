import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, BookOpen, Rocket, ChevronRight } from 'lucide-react';
import PageTransition, { SLIDE_LEFT } from '../../components/PageTransition';
import './Onboarding.css';

const levels = [
    { id: 'beginner', title: 'Beginner', desc: 'Just starting with cybersecurity', icon: Sprout },
    { id: 'intermediate', title: 'Intermediate', desc: 'Know basics, built some projects', icon: BookOpen },
    { id: 'advanced', title: 'Advanced', desc: 'Done bug bounty or security work', icon: Rocket },
];

export default function ExperienceLevel() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    return (
        <PageTransition pageName="onboarding-experience" direction={SLIDE_LEFT}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                <div className="onboarding-content">
                    <div className="progress-steps">
                        <div className="step"><div className="step-dot completed"></div></div>
                        <div className="step-line completed"></div>
                        <div className="step"><div className="step-dot active"></div></div>
                        <div className="step-line"></div>
                        <div className="step"><div className="step-dot"></div></div>
                        <div className="step-line"></div>
                        <div className="step"><div className="step-dot"></div></div>
                    </div>

                    <h2 className="question-title">What's your experience level?</h2>
                    <p className="question-subtitle">This helps us tailor content difficulty</p>

                    <div className="options-grid">
                        {levels.map((level) => {
                            const Icon = level.icon;
                            return (
                                <div
                                    key={level.id}
                                    className={`option-card ${selected === level.id ? 'selected' : ''}`}
                                    onClick={() => setSelected(level.id)}
                                >
                                    <div className="option-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="option-content">
                                        <div className="option-title">{level.title}</div>
                                        <div className="option-desc">{level.desc}</div>
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
