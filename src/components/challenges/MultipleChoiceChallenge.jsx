import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, XCircle, Lightbulb, Award, Zap, ChevronRight, BookOpen, HelpCircle, GraduationCap, ExternalLink } from 'lucide-react';
import { calculateQuestionXp } from '../../utils/xp';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { saveChallengeProgress } from '../../utils/firestore';
import './ChallengeComponents.css';

export default function MultipleChoiceChallenge({ challenge, savedProgress, onComplete }) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { playSFX } = useSound();
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [usedHint, setUsedHint] = useState(false);
    const [sessionXp, setSessionXp] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const question = challenge.questions[currentQ];

    // Load saved progress
    useEffect(() => {
        if (savedProgress && !savedProgress.completed) {
            if (typeof savedProgress.currentQuestion === 'number') {
                const nextQ = Math.min(savedProgress.currentQuestion, challenge.questions.length - 1);
                setCurrentQ(nextQ);
            }
        }
    }, [savedProgress, challenge.questions.length]);

    const handleSubmit = async () => {
        if (selected === null) return;

        const isCorrect = selected === question.correctAnswer;
        setResult(isCorrect);
        setShowResult(true);

        if (isCorrect) {
            playSFX('success');
        } else {
            playSFX('error');
        }

        // Calculate XP
        const isReplay = savedProgress?.completed || (savedProgress?.currentQuestion !== undefined && currentQ < savedProgress.currentQuestion);

        let calculatedXp = calculateQuestionXp(
            challenge.xpReward,
            challenge.questions.length,
            isCorrect,
            usedHint
        );

        if (isReplay) {
            calculatedXp = 0;
        }

        const xpEarned = calculatedXp;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setSessionXp(prev => prev + xpEarned);
        }

        // Save progress
        if (currentUser?.uid) {
            try {
                await saveChallengeProgress(currentUser.uid, challenge.id, {
                    currentQuestion: currentQ,
                    lastAnswer: selected,
                    lastAnswerCorrect: isCorrect,
                    xpEarned: sessionXp + xpEarned,
                });
            } catch (error) {
                console.error('Failed to save progress:', error);
            }
        }
    };

    const handleShowHint = () => {
        playSFX('click');
        setShowHint(true);
        setUsedHint(true);
    };

    const handleNext = async () => {
        playSFX('click');
        if (currentQ < challenge.questions.length - 1) {
            setCurrentQ(prev => prev + 1);
            setSelected(null);
            setShowHint(false);
            setShowResult(false);
            setResult(null);
            setUsedHint(false);
        } else {
            // Challenge complete
            const accuracy = Math.round((correctAnswers / challenge.questions.length) * 100);
            onComplete({
                success: true,
                xpEarned: sessionXp,
                correctAnswers,
                totalQuestions: challenge.questions.length,
                accuracy,
                hintsUsed: usedHint ? 1 : 0
            });
        }
    };

    return (
        <div className="multiple-choice-challenge">
            {/* Progress */}
            <div className="question-progress">
                <span>Question {currentQ + 1} of {challenge.questions.length}</span>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQ + 1) / challenge.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Session XP indicator */}
            {sessionXp > 0 && (
                <div className="session-xp">
                    <Award size={14} />
                    <span>+{sessionXp} XP this session</span>
                </div>
            )}

            {/* Scenario */}
            <div className="scenario-card">
                <h2 className="scenario-title">{challenge.title}</h2>
                {question.scenario && (
                    <p className="scenario-text">{question.scenario}</p>
                )}

                {question.codeBlock && (
                    <div className="code-block">
                        <div className="code-header">
                            <span>{question.codeLanguage || 'code'}</span>
                            <button className="copy-btn" onClick={() => {
                                navigator.clipboard.writeText(question.codeBlock);
                                playSFX('click');
                            }}>
                                <Copy size={14} />
                            </button>
                        </div>
                        <pre><code>{question.codeBlock}</code></pre>
                    </div>
                )}
            </div>

            {/* Question */}
            <div className="question-section">
                <h3 className="question-text">{question.question}</h3>

                <div className="options-list">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            className={`option-btn ${selected === idx ? 'selected' : ''} ${showResult && idx === question.correctAnswer ? 'correct' : ''
                                } ${showResult && selected === idx && selected !== question.correctAnswer ? 'incorrect' : ''}`}
                            onClick={() => { if (!showResult) { playSFX('click'); setSelected(idx); } }}
                            disabled={showResult}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option}</span>
                            {showResult && idx === question.correctAnswer && <CheckCircle size={20} />}
                            {showResult && selected === idx && selected !== question.correctAnswer && <XCircle size={20} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hint */}
            {!showResult && (
                <button
                    className={`hint-btn ${usedHint ? 'used' : ''}`}
                    onClick={handleShowHint}
                    disabled={showHint}
                >
                    <Lightbulb size={18} />
                    {showHint ? 'Hint Used (-50% XP)' : 'Show Hint (-50% XP)'}
                </button>
            )}

            {showHint && !showResult && (
                <div className="hint-box">
                    <p>{question.hint}</p>
                </div>
            )}

            {/* Result */}
            {showResult && (
                <div className={`result-box ${result ? 'success' : 'error'}`}>
                    <div className="result-header">
                        {result ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span>{result ? 'Correct!' : 'Incorrect'}</span>
                    </div>
                    <p className="result-explanation">{question.explanation}</p>
                    {result && (
                        <div className="xp-earned">
                            <Award size={18} />
                            <span>
                                {savedProgress?.completed || (savedProgress?.currentQuestion !== undefined && currentQ < savedProgress.currentQuestion)
                                    ? '+0 XP (Replay)'
                                    : `+${calculateQuestionXp(challenge.xpReward, challenge.questions.length, true, usedHint)} XP earned`
                                }
                                {usedHint && !savedProgress?.completed && ' (hint penalty applied)'}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Resources */}
            {challenge.resources && showResult && (
                <div className="challenge-section">
                    <div className="resources-section">
                        <div className="section-header">
                            <BookOpen size={18} />
                            <h4>Learning Resources</h4>
                        </div>

                        {challenge.resources.internal?.length > 0 && (
                            <div className="resource-group">
                                <h5>
                                    <GraduationCap size={14} />
                                    Internal Courses
                                </h5>
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
                                            <GraduationCap size={18} className="resource-icon" />
                                            <div className="resource-content">
                                                <div className="resource-title">{resource.title}</div>
                                            </div>
                                            <ChevronRight size={16} className="resource-icon" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {challenge.resources.external?.length > 0 && (
                            <div className="resource-group">
                                <h5>
                                    <ExternalLink size={14} />
                                    External Resources
                                </h5>
                                <div className="resource-links">
                                    {challenge.resources.external.map((resource, idx) => (
                                        <a
                                            key={idx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resource-link external"
                                        >
                                            <ExternalLink size={18} className="resource-icon" />
                                            <div className="resource-content">
                                                <div className="resource-title">{resource.title}</div>
                                            </div>
                                            <ChevronRight size={16} className="resource-icon" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Buttons */}
            <div className="detail-footer">
                {!showResult ? (
                    <button
                        className="btn btn-primary btn-full"
                        disabled={selected === null}
                        onClick={handleSubmit}
                    >
                        Submit Answer
                        <Zap size={20} />
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-full"
                        onClick={handleNext}
                    >
                        {currentQ < challenge.questions.length - 1 ? 'Next Question' : 'Complete Challenge'}
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
