import { useNavigate } from 'react-router-dom';
import './OnboardingProgress.css';

const ONBOARDING_STEPS = [
    { id: 1, path: '/onboarding/goal', label: 'Goal' },
    { id: 2, path: '/onboarding/experience', label: 'Experience' },
    { id: 3, path: '/onboarding/commitment', label: 'Commitment' },
    { id: 4, path: '/onboarding/analysis', label: 'Analysis' }
];

export default function OnboardingProgress({ currentStep }) {
    const navigate = useNavigate();

    const handleStepClick = (step) => {
        // Only allow clicking on previous steps or current step
        if (step.id < currentStep) {
            navigate(step.path, { state: { direction: 'back' } });
        }
    };

    return (
        <div className="progress-steps">
            {ONBOARDING_STEPS.map((step, index) => (
                <div key={step.id} className="step-wrapper">
                    {index > 0 && (
                        <div className={`step-line ${step.id <= currentStep ? 'completed' : ''}`}></div>
                    )}
                    <div
                        className={`step ${step.id <= currentStep ? 'clickable' : ''}`}
                        onClick={() => handleStepClick(step)}
                        title={step.id <= currentStep ? `Go back to ${step.label}` : step.label}
                    >
                        <div className={`step-dot ${step.id === currentStep ? 'active' : step.id < currentStep ? 'completed' : ''}`}>
                            {step.id < currentStep && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
