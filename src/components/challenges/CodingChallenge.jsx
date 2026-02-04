import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Play, CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react';
import { validatePythonCode, validateJavaScriptCode } from '../../utils/challengeValidation';
import './ChallengeComponents.css';

export default function CodingChallenge({ challenge, onComplete }) {
    const navigate = useNavigate();
    const [code, setCode] = useState(challenge.starterCode || '');
    const [validationResult, setValidationResult] = useState(null);
    const [showHints, setShowHints] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);

    const handleRunCode = () => {
        let result;

        if (challenge.language === 'javascript') {
            result = validateJavaScriptCode(code, challenge.validation.testCases);
        } else if (challenge.language === 'python') {
            result = validatePythonCode(code, challenge.validation.testCases);
        } else {
            result = {
                success: false,
                feedback: 'Language not supported for client-side validation'
            };
        }

        setValidationResult(result);

        if (result.success) {
            // Calculate XP with hint penalty
            const hintPenalty = hintsUsed * 0.15;
            const xpMultiplier = Math.max(1 - hintPenalty, 0.5);
            const xpEarned = Math.round(challenge.xpReward * xpMultiplier);

            onComplete({
                success: true,
                xpEarned,
                hintsUsed
            });
        }
    };

    const handleShowHints = () => {
        setShowHints(true);
        setHintsUsed(prev => prev + 1);
    };

    return (
        <div className="coding-challenge">
            {/* Header */}
            <div className="challenge-section">
                <div className="section-header">
                    <Code size={20} />
                    <h3>Coding Challenge</h3>
                    <span className="badge badge-info">{challenge.language}</span>
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

            {/* Code Editor */}
            <div className="challenge-section">
                <div className="code-editor-wrapper">
                    <div className="code-editor-header">
                        <span className="code-editor-label">
                            {challenge.language} Editor
                        </span>
                        <span className="code-editor-hint">Write your solution below</span>
                    </div>
                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="// Write your code here..."
                        spellCheck="false"
                    />
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleRunCode}
                >
                    <Play size={18} />
                    Run & Validate Code
                </button>
            </div>

            {/* Validation Results */}
            {validationResult && (
                <div className={`validation-result ${validationResult.success ? 'success' : 'error'}`}>
                    <div className="validation-header">
                        {validationResult.success ? (
                            <CheckCircle size={24} />
                        ) : (
                            <XCircle size={24} />
                        )}
                        <h4>{validationResult.success ? 'All Tests Passed!' : 'Tests Failed'}</h4>
                    </div>
                    <p className="validation-feedback">{validationResult.feedback}</p>

                    {validationResult.results && validationResult.results.length > 0 && (
                        <div className="test-results">
                            <h5>Test Cases:</h5>
                            {validationResult.results.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`test-case ${result.passed ? 'passed' : 'failed'}`}
                                >
                                    <div className="test-case-header">
                                        {result.passed ? (
                                            <CheckCircle size={16} />
                                        ) : (
                                            <XCircle size={16} />
                                        )}
                                        <span>{result.description}</span>
                                    </div>
                                    {!result.passed && (
                                        <div className="test-case-details">
                                            {result.input && (
                                                <div className="test-detail">
                                                    <span className="test-label">Input:</span>
                                                    <code>{JSON.stringify(result.input)}</code>
                                                </div>
                                            )}
                                            {result.expected && (
                                                <div className="test-detail">
                                                    <span className="test-label">Expected:</span>
                                                    <code>{JSON.stringify(result.expected)}</code>
                                                </div>
                                            )}
                                            {result.actual !== undefined && (
                                                <div className="test-detail">
                                                    <span className="test-label">Got:</span>
                                                    <code>{JSON.stringify(result.actual)}</code>
                                                </div>
                                            )}
                                            {result.issues && result.issues.length > 0 && (
                                                <div className="test-issues">
                                                    {result.issues.map((issue, i) => (
                                                        <div key={i} className="issue">{issue}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Hints */}
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
                            <span>Hints ({hintsUsed} used)</span>
                        </div>
                        <ul className="hints-list">
                            {challenge.hints.map((hint, idx) => (
                                <li key={idx}>{hint}</li>
                            ))}
                        </ul>
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
