import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Terminal, Lightbulb, BookOpen, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { validateFlag } from '../../utils/challengeValidation';
import './ChallengeComponents.css';

export default function LabChallenge({ challenge, onComplete }) {
    const navigate = useNavigate();
    const [flagInput, setFlagInput] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);

    const handleSubmitFlag = () => {
        const result = validateFlag(
            flagInput,
            challenge.flag.value,
            challenge.flag.format
        );

        setValidationResult(result);

        if (result.success) {
            // Calculate XP with hint penalty
            const hintPenalty = hintsUsed * 0.15;
            const xpMultiplier = Math.max(1 - hintPenalty, 0.5);
            const xpEarned = Math.round(challenge.xpReward * xpMultiplier);

            onComplete({
                success: true,
                xpEarned,
                hintsUsed,
                flagCaptured: result.flagValue
            });
        }
    };

    const handleShowHints = () => {
        setShowHints(true);
        setHintsUsed(prev => prev + 1);
    };

    return (
        <div className="lab-challenge">
            {/* Header */}
            <div className="challenge-section">
                <div className="section-header">
                    <Terminal size={20} />
                    <h3>Lab Challenge</h3>
                    <span className="badge badge-danger">Live Environment</span>
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

            {/* Lab Environment */}
            <div className="challenge-section">
                <div className="lab-environment">
                    <div className="lab-header">
                        <span>Lab Environment</span>
                        <span className="badge badge-success">Active</span>
                    </div>

                    {challenge.labEnvironment.type === 'simulation' && (
                        <div className="lab-simulation">
                            <div className="simulation-info">
                                <h5>Environment Details:</h5>
                                {challenge.labEnvironment.mockData && (
                                    <div className="mock-data">
                                        <pre>
                                            {JSON.stringify(challenge.labEnvironment.mockData, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {challenge.labEnvironment.tools && (
                                <div className="tools-available">
                                    <h5>Available Tools:</h5>
                                    <div className="tools-list">
                                        {challenge.labEnvironment.tools.map((tool, idx) => (
                                            <span key={idx} className="chip">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {challenge.labEnvironment.url && (
                        <div className="lab-iframe">
                            <iframe
                                src={challenge.labEnvironment.url}
                                title="Lab Environment"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Steps Guide */}
            {challenge.steps && challenge.steps.length > 0 && (
                <div className="challenge-section">
                    <div className="steps-guide">
                        <h4>Step-by-Step Guide</h4>
                        <div className="steps-list">
                            {challenge.steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className={`step-item ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''
                                        }`}
                                    onClick={() => setCurrentStep(idx)}
                                >
                                    <div className="step-number">
                                        {idx < currentStep ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <span>{idx + 1}</span>
                                        )}
                                    </div>
                                    <div className="step-content">
                                        <h5>{step.title}</h5>
                                        {idx === currentStep && (
                                            <div className="step-details">
                                                <p>{step.description}</p>
                                                {step.hints && step.hints.length > 0 && (
                                                    <div className="step-hints">
                                                        {step.hints.map((hint, hintIdx) => (
                                                            <div key={hintIdx} className="step-hint">
                                                                <Lightbulb size={14} />
                                                                <span>{hint}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {idx === currentStep && idx < challenge.steps.length - 1 && (
                                        <button
                                            className="btn-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentStep(prev => prev + 1);
                                            }}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Flag Submission */}
            <div className="challenge-section">
                <div className="flag-submission">
                    <div className="flag-header">
                        <Flag size={20} />
                        <h4>Submit Flag</h4>
                    </div>

                    <div className="flag-format">
                        <span>Expected Format:</span>
                        <code>{challenge.flag.format}</code>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter flag here..."
                            value={flagInput}
                            onChange={(e) => setFlagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmitFlag()}
                        />
                    </div>

                    <button
                        className="btn btn-primary btn-full"
                        onClick={handleSubmitFlag}
                        disabled={!flagInput.trim()}
                    >
                        <Flag size={18} />
                        Submit Flag
                    </button>
                </div>

                {/* Validation Result */}
                {validationResult && (
                    <div className={`validation-result ${validationResult.success ? 'success' : 'error'}`}>
                        <div className="validation-header">
                            {validationResult.success ? (
                                <CheckCircle size={24} />
                            ) : (
                                <XCircle size={24} />
                            )}
                            <h4>{validationResult.feedback}</h4>
                        </div>
                        {validationResult.hint && (
                            <p className="validation-hint">{validationResult.hint}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Global Hints */}
            <div className="challenge-section">
                {!showHints ? (
                    <button className="hint-btn" onClick={handleShowHints}>
                        <Lightbulb size={18} />
                        Show Hints (-15% XP per hint)
                    </button>
                ) : (
                    <div className="hints-box">
                        <div className="hints-header">
                            <Lightbulb size={18} />
                            <span>Progressive Hints ({hintsUsed} used)</span>
                        </div>
                        <ul className="hints-list">
                            {challenge.flag.hints.map((hint, idx) => (
                                <li key={idx} className={idx < hintsUsed ? 'revealed' : 'locked'}>
                                    {idx < hintsUsed ? hint : '🔒 Complete previous steps to unlock'}
                                </li>
                            ))}
                        </ul>
                        {hintsUsed < challenge.flag.hints.length && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setHintsUsed(prev => Math.min(prev + 1, challenge.flag.hints.length))}
                            >
                                Reveal Next Hint (-15% XP)
                            </button>
                        )}
                    </div>
                )}
            </div>

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
