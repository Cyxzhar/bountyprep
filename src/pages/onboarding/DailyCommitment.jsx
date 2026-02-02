import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Flame, ChevronRight } from 'lucide-react';
import PageTransition, { SLIDE_LEFT } from '../../components/PageTransition';
import './Onboarding.css';

const commitments = [
    { id: '5', title: '5 minutes', desc: 'Quick daily practice', icon: Zap },
    { id: '10', title: '10 minutes', desc: 'Balanced learning', icon: Star, recommended: true },
    { id: '15', title: '15+ minutes', desc: 'Intensive training', icon: Flame },
];

export default function DailyCommitment() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('10');

    return (
        <PageTransition pageName="onboarding-commitment" direction={SLIDE_LEFT}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                <div className="onboarding-content">
                    <div className="progress-steps">
                        <div className="step"><div className="step-dot completed"></div></div>
                        <div className="step-line completed"></div>
                        <div className="step"><div className="step-dot completed"></div></div>
                        <div className="step-line completed"></div>
                        <div className="step"><div className="step-dot active"></div></div>
                        <div className="step-line"></div>
                        <div className="step"><div className="step-dot"></div></div>
                    </div>

                    <h2 className="question-title">How much time can you commit?</h2>
                    <p className="question-subtitle">Consistency is key to mastery</p>

                    <div className="options-grid">
                        {commitments.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className={`option-card ${selected === item.id ? 'selected' : ''} ${item.recommended ? 'recommended' : ''}`}
                                    onClick={() => setSelected(item.id)}
                                >
                                    <div className="option-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="option-content">
                                        <div className="option-title">{item.title}</div>
                                        <div className="option-desc">{item.desc}</div>
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
