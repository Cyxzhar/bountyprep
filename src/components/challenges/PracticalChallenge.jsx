import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle, XCircle, Lightbulb, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';
import { validatePracticalStep } from '../../utils/challengeValidation';
import './ChallengeComponents.css';

export default function PracticalChallenge({ challenge, onComplete }) {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stepAnswers, setStepAnswers] = useState({});
    const [stepResults, setStepResults] = useState({});
    const [showHints, setShowHints] = useState({});
    const [hintsUsed, setHintsUsed] = useState(0);

    const currentStep = challenge.steps[currentStepIndex];
    const isLastStep = currentStepIndex === challenge.steps.length - 1;
    const allStepsCompleted = challenge.steps.every((step, idx) => stepResults[idx]?.success);

    const handleAnswerChange = (value) => {
        setStepAnswers(prev => ({
            ...prev,
            [currentStepIndex]: value
        }));
    };

    const handleSubmitStep = () => {
        const answer = stepAnswers[currentStepIndex];
        const result = validatePracticalStep(
            currentStep.id,
            answer,
            currentStep
        );

        setStepResults(prev => ({
            ...prev,
            [currentStepIndex]: result
        }));

        // If correct and not last step, auto-advance after showing result
        if (result.success && !isLastStep) {
            setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 1500);
        }

        // If last step and correct, complete challenge
        if (result.success && isLastStep) {
            const hintPenalty = hintsUsed * 0.15;
            const xpMultiplier = Math.max(1 - hintPenalty, 0.5);
            const xpEarned = Math.round(challenge.xpReward * xpMultiplier);

            setTimeout(() => {
                onComplete({
                    success: true,
                    xpEarned,
                    hintsUsed,
                    stepsCompleted: challenge.steps.length
                });
            }, 2000);
        }
    };

    const handleShowHints = (stepIndex) => {
        setShowHints(prev => ({
            ...prev,
            [stepIndex]: true
        }));
        setHintsUsed(prev => prev + 1);
    };

    const handleNavigateStep = (index) => {
        // Can only navigate to current or completed steps
        if (index <= currentStepIndex || stepResults[index - 1]?.success) {
            setCurrentStepIndex(index);
        }
    };

    const renderStepInput = () => {
        const answer = stepAnswers[currentStepIndex] || '';

        switch (currentStep.type) {
            case 'multiple_choice':
                return (
                    <div className="options-list">
                        {currentStep.validation.options.map((option, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${answer === idx.toString() ? 'selected' : ''}`}
                                onClick={() => handleAnswerChange(idx.toString())}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="option-text">{option}</span>
                            </button>
                        ))}
                    </div>
                );

            case 'payload':
            case 'command':
                return (
                    <div className="code-input-wrapper">
                        <textarea
                            className="code-input"
                            value={answer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder={`Enter your ${currentStep.type} here...`}
                            rows={4}
                        />
                    </div>
                );

            case 'text':
            case 'regex':
            default:
                return (
                    <div className="input-group">
                        <input
                            type="text"
                            className="input"
                            value={answer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder="Enter your answer..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmitStep()}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="practical-challenge">
            {/* Header */}
            <div className="challenge-section">
                <div className="section-header">
                    <Target size={20} />
                    <h3>Practical Challenge</h3>
                    <span className="badge badge-warning">
                        Step {currentStepIndex + 1} of {challenge.steps.length}
                    </span>
                </div>

                <div className="objective-card">
                    <h4>Objective</h4>
                    <p>{challenge.objective}</p>
                </div>

                {challenge.scenario && (
                    <div className="scenario-text">
                        <p>{challenge.scenario}</p>
                    </div>
                )}
            </div>

            {/* Progress Tracker */}
            <div className="challenge-section">
                <div className="steps-progress">
                    {challenge.steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`progress-step ${idx === currentStepIndex ? 'active' : ''} ${stepResults[idx]?.success ? 'completed' : ''
                                } ${idx > currentStepIndex && !stepResults[idx - 1]?.success ? 'locked' : ''}`}
                            onClick={() => handleNavigateStep(idx)}
                        >
                            <div className="progress-step-number">
                                {stepResults[idx]?.success ? (
                                    <CheckCircle size={16} />
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>
                            <span className="progress-step-title">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Step */}
            <div className="challenge-section">
                <div className="step-card">
                    <div className="step-card-header">
                        <h3>{currentStep.title}</h3>
                        <span className="step-type badge badge-info">{currentStep.type}</span>
                    </div>

                    <p className="step-description">{currentStep.description}</p>

                    {/* Step Input */}
                    <div className="step-input-section">
                        {renderStepInput()}
                    </div>

                    {/* Submit Button */}
                    <button
                        className="btn btn-primary btn-full"
                        onClick={handleSubmitStep}
                        disabled={!stepAnswers[currentStepIndex]}
                    >
                        {isLastStep ? 'Complete Challenge' : 'Submit & Continue'}
                        {!isLastStep && <ChevronRight size={18} />}
                    </button>

                    {/* Step Result */}
                    {stepResults[currentStepIndex] && (
                        <div
                            className={`step-result ${stepResults[currentStepIndex].success ? 'success' : 'error'
                                }`}
                        >
                            <div className="step-result-header">
                                {stepResults[currentStepIndex].success ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <XCircle size={20} />
                                )}
                                <span>{stepResults[currentStepIndex].feedback}</span>
                            </div>
                            {stepResults[currentStepIndex].issues && (
                                <ul className="step-issues">
                                    {stepResults[currentStepIndex].issues.map((issue, idx) => (
                                        <li key={idx}>
                                            <AlertCircle size={14} />
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Step Hints */}
                    {currentStep.hints && currentStep.hints.length > 0 && (
                        <div className="step-hints-section">
                            {!showHints[currentStepIndex] ? (
                                <button
                                    className="hint-btn"
                                    onClick={() => handleShowHints(currentStepIndex)}
                                >
                                    <Lightbulb size={18} />
                                    Show Hints for this Step (-15% XP)
                                </button>
                            ) : (
                                <div className="hints-box">
                                    <div className="hints-header">
                                        <Lightbulb size={18} />
                                        <span>Hints</span>
                                    </div>
                                    <ul className="hints-list">
                                        {currentStep.hints.map((hint, idx) => (
                                            <li key={idx}>{hint}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            {challenge.steps.length > 1 && (
                <div className="challenge-section">
                    <div className="step-navigation">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentStepIndex === 0}
                        >
                            Previous Step
                        </button>
                        <span className="step-counter">
                            {currentStepIndex + 1} / {challenge.steps.length}
                        </span>
                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                setCurrentStepIndex(prev => Math.min(challenge.steps.length - 1, prev + 1))
                            }
                            disabled={
                                currentStepIndex === challenge.steps.length - 1 ||
                                !stepResults[currentStepIndex]?.success
                            }
                        >
                            Next Step
                        </button>
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {allStepsCompleted && (
                <div className="challenge-section">
                    <div className="completion-banner">
                        <CheckCircle size={32} />
                        <div>
                            <h4>All Steps Completed!</h4>
                            <p>Great work! You've successfully completed all challenge steps.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Resources */}
            {challenge.resources && (
                <div className="challenge-section">
                    <div className="resources-section">
                        <div className="section-header">
                            <BookOpen size={18} />
                            <h4>Learning Resources</h4>
                        </div>

                        {challenge.resources.internal?.length > 0 && (
                            <div className="resource-group">
                                <h5>Internal Courses</h5>
                                <div className="resource-links">
                                    {challenge.resources.internal.map((resource, idx) => (
                                        <a
                                            key={idx}
                                            href={resource.path}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(resource.path);
                                            }}
                                            className="resource-link internal"
                                        >
                                            {resource.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {challenge.resources.external?.length > 0 && (
                            <div className="resource-group">
                                <h5>External Resources</h5>
                                <div className="resource-links">
                                    {challenge.resources.external.map((resource, idx) => (
                                        <a
                                            key={idx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resource-link external"
                                        >
                                            {resource.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
