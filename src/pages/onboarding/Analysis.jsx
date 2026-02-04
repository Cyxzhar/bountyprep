import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu, Check, Circle, BookOpen, Target, Trophy, ChevronRight } from 'lucide-react';
import PageTransition, { SLIDE_UP, FADE, SLIDE_LEFT, SLIDE_RIGHT } from '../../components/PageTransition';
import OnboardingProgress from '../../components/OnboardingProgress';
import './Onboarding.css';

const loadingSteps = [
    'Analyzing your profile...',
    'Calculating optimal path...',
    'Creating personalized plan...'
];

export default function Analysis() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const direction = location.state?.direction === 'back' ? SLIDE_RIGHT : SLIDE_LEFT;

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => Math.min(prev + 1, loadingSteps.length - 1));
        }, 900);

        const timer = setTimeout(() => {
            setLoading(false);
            clearInterval(stepInterval);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearInterval(stepInterval);
        };
    }, []);

    if (loading) {
        return (
            <div className="analysis-screen">
                <div className="onboarding-bg-grid"></div>

                <div className="analysis-spinner">
                    <div className="spinner-ring"></div>
                    <Cpu className="spinner-icon" size={32} />
                </div>

                <div className="loading-steps">
                    {loadingSteps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`loading-step ${idx < currentStep ? 'done' : idx === currentStep ? 'active' : ''}`}
                        >
                            {idx < currentStep ? <Check size={18} /> : <Circle size={18} />}
                            <span>{step}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <PageTransition pageName="onboarding-analysis" direction={direction} duration={400}>
            <div className="onboarding-screen">
                <div className="onboarding-bg-grid"></div>

                <div className="onboarding-content">
                    <OnboardingProgress currentStep={4} />


                    <h2 className="question-title">Your Personalized Plan</h2>

                    <div className="results-card">
                        <div className="results-number">87</div>
                        <div className="results-label">Days</div>
                        <p className="results-subtitle">Until your first $500 bounty</p>
                    </div>

                    <div className="results-stats">
                        <div className="result-stat">
                            <BookOpen size={16} />
                            <span>48 Challenges</span>
                        </div>
                        <div className="result-stat">
                            <Target size={16} />
                            <span>12 Skills</span>
                        </div>
                        <div className="result-stat">
                            <Trophy size={16} />
                            <span>Top 15%</span>
                        </div>
                    </div>

                    <p className="footer-text">
                        Join 3,247 users who started this month
                    </p>
                </div>

                <div className="onboarding-footer">
                    <button
                        className="btn btn-primary btn-full"
                        onClick={() => navigate('/onboarding/paywall')}
                    >
                        Unlock Full Access
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
