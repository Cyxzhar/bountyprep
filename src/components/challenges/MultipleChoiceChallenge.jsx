import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, XCircle, Lightbulb, Award, Zap, ChevronRight, BookOpen, HelpCircle, GraduationCap, ExternalLink, ArrowLeft, SkipForward } from 'lucide-react';
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
    const [answers, setAnswers] = useState({}); // { [questionIdx]: optionIdx }
    const [history, setHistory] = useState({}); // { [questionIdx]: { correct: boolean, usedHint: booleanResult } }
    const [currentSelected, setCurrentSelected] = useState(null); // Current selection for currentQ
    const [showHint, setShowHint] = useState(false);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [usedHint, setUsedHint] = useState(false);
    const [sessionXp, setSessionXp] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    const question = challenge.questions[currentQ];

    // Load saved progress or existing state when changing question
    useEffect(() => {
        // Restore state for this question if it exists in history/answers
        if (answers[currentQ] !== undefined) {
            setCurrentSelected(answers[currentQ]);
        } else {
            setCurrentSelected(null);
        }

        if (history[currentQ]) {
            setResult(history[currentQ].correct);
            setShowResult(true);
            setUsedHint(history[currentQ].usedHint);
        } else {
            setShowResult(false);
            setResult(null);
            setUsedHint(false); // Reset hint for fresh question
            setShowHint(false);
        }
    }, [currentQ, answers, history]);

    // Initial load from saved progress
    useEffect(() => {
        if (savedProgress && !savedProgress.completed) {
            if (typeof savedProgress.currentQuestion === 'number') {
                const nextQ = Math.min(savedProgress.currentQuestion, challenge.questions.length - 1);
                setCurrentQ(nextQ);
            }
        }
    }, [savedProgress, challenge.questions.length]);

    const handleSubmit = async () => {
        if (currentSelected === null) return;

        const isCorrect = currentSelected === question.correctAnswer;
        setResult(isCorrect);
        setShowResult(true);

        // Update local history
        setHistory(prev => ({
            ...prev,
            [currentQ]: { correct: isCorrect, usedHint }
        }));

        // Update answers
        setAnswers(prev => ({
            ...prev,
            [currentQ]: currentSelected
        }));

        if (isCorrect) {
            playSFX('success');
            // increment correct count if not already answered correctly in this session
            // (simple approximation)
            setCorrectAnswersCount(prev => prev + 1);
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

        if (isReplay || history[currentQ]) { // Also check local history to prevent double dipping
            calculatedXp = 0;
        }

        const xpEarned = calculatedXp;

        if (isCorrect) {
            setSessionXp(prev => prev + xpEarned);
        }

        // Save progress
        if (currentUser?.uid) {
            try {
                await saveChallengeProgress(currentUser.uid, challenge.id, {
                    currentQuestion: currentQ,
                    lastAnswer: currentSelected,
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

    const handlePrevious = () => {
        if (currentQ > 0) {
            playSFX('click');
            setCurrentQ(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        if (currentQ < challenge.questions.length - 1) {
            playSFX('click');
            setCurrentQ(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        playSFX('click');
        if (currentQ < challenge.questions.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            // Challenge complete
            // Recalculate strictly based on current session history + answers
            const totalCorrect = Object.values(history).filter(h => h.correct).length;

            const accuracy = Math.round((totalCorrect / challenge.questions.length) * 100);

            onComplete({
                success: true,
                xpEarned: sessionXp,
                correctAnswers: totalCorrect,
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
                            className={`option-btn ${currentSelected === idx ? 'selected' : ''} ${showResult && idx === question.correctAnswer ? 'correct' : ''
                                } ${showResult && currentSelected === idx && currentSelected !== question.correctAnswer ? 'incorrect' : ''}`}
                            onClick={() => { if (!showResult) { playSFX('click'); setCurrentSelected(idx); } }}
                            disabled={showResult}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option}</span>
                            {showResult && idx === question.correctAnswer && <CheckCircle size={20} />}
                            {showResult && currentSelected === idx && currentSelected !== question.correctAnswer && <XCircle size={20} />}
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
            <div className="detail-footer multip-choice-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                    className="btn btn-outline"
                    onClick={handlePrevious}
                    disabled={currentQ === 0}
                    style={{ justifySelf: 'start' }}
                >
                    <ArrowLeft size={16} /> Previous
                </button>

                {!showResult ? (
                    <div style={{ display: 'flex', gap: '1rem', justifySelf: 'end' }}>
                        <button
                            className="btn btn-ghost" // Assuming you have a ghost variant, or use simple styling
                            onClick={handleSkip}
                            disabled={currentQ === challenge.questions.length - 1}
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Skip
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={currentSelected === null}
                            onClick={handleSubmit}
                        >
                            Submit
                            <Zap size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        style={{ justifySelf: 'end' }}
                    >
                        {currentQ < challenge.questions.length - 1 ? 'Next' : 'Complete'}
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
