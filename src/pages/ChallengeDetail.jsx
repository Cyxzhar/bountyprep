import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAchievement } from '../context/AchievementContext';
import { useSound } from '../context/SoundContext';
import { challenges } from '../data/challenges';
import { updateStreak, getChallengeProgress, updateUserStats, saveChallengeProgress, markChallengeCompleted } from '../utils/firestore';
import { calculateQuestionXp, checkLevelUp } from '../utils/xp';
import { ArrowLeft, Clock, Star, Copy, CheckCircle, XCircle, Lightbulb, Award, Zap, ChevronRight, Volume2, VolumeX, Music } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import './ChallengeDetail.css';

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, refreshUser } = useAuth();
    const { success, error: showError, info } = useToast();
    const { playBGM, stopBGM, playSFX, isMuted, toggleMute } = useSound();
    const { unlockMultiple } = useAchievement();
    const challenge = challenges.find(c => c.id === id) || challenges[0];

    const { elapsedTime, formattedTime, start, stop } = useTimer();

    // Track if we've shown the toast already
    const hasShownToastRef = useRef(false);
    const audioStartedRef = useRef(false);

    useEffect(() => {
        start();

        // Play challenge music once (will play the full track)
        playBGM('challenge', {
            loop: false,  // Play once completely
            volume: 0.3
        });

        // Show toast only once
        if (!hasShownToastRef.current && !isMuted) {
            setTimeout(() => info('Challenge music playing', Music), 100);
            hasShownToastRef.current = true;
        }

        audioStartedRef.current = true;

        return () => {
            stop();
            stopBGM(true); // Stop immediately on unmount (navigation away)
        };
    }, []); // Empty deps to run only once on mount

    // Handle audio control button - toggleMute now handles pause/resume automatically
    const handleAudioToggle = () => {
        const willBeMuted = !isMuted;
        toggleMute(); // This now pauses when muting, resumes when unmuting

        if (willBeMuted) {
            info('Sound muted', VolumeX);
        } else {
            info('Sound enabled - resuming playback', Volume2);
        }
    };

    // ... (rest of imports and state)
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [usedHint, setUsedHint] = useState(false);
    const [savedProgress, setSavedProgress] = useState(null);

    // Track session stats
    const [sessionXp, setSessionXp] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [previousUserXp, setPreviousUserXp] = useState(currentUser?.xp || 0);

    const question = challenge.questions[currentQ];

    // Load progress and update streak
    useEffect(() => {
        if (!currentUser?.uid) return;

        async function initChallenge() {
            try {
                // 1. Update streak
                updateStreak(currentUser.uid).then(result => {
                    if (result.achievements?.length > 0) {
                        unlockMultiple(result.achievements);
                    }
                }).catch(console.error);

                // 2. Load progress
                const progress = await getChallengeProgress(currentUser.uid, challenge.id);
                if (progress) {
                    setSavedProgress(progress);
                    // Resume from last unanswered question if not completed
                    // If completed, let them start over (replay mode)
                    if (!progress.completed && typeof progress.currentQuestion === 'number') {
                        // Usually 'currentQuestion' is the index of the one they are ON.
                        // But if they finished it, let's verify range.
                        const nextQ = Math.min(progress.currentQuestion, challenge.questions.length - 1);
                        setCurrentQ(nextQ);
                    }
                }
            } catch (err) {
                console.error("Failed to load challenge:", err);
            }
        }

        initChallenge();
    }, [currentUser?.uid, challenge.id, challenge.questions.length, unlockMultiple]);

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

        // Calculate XP logic
        // 1. If challenge already completed: 0 XP
        // 2. If currentQ < savedProgress.currentQuestion: 0 XP (Replay of specific question)
        const isReplay = savedProgress?.completed || (savedProgress?.currentQuestion !== undefined && currentQ < savedProgress.currentQuestion);

        // Base calculation
        let calculatedXp = calculateQuestionXp(
            challenge.xpReward,
            challenge.questions.length,
            isCorrect,
            usedHint
        );

        // Apply replay logic
        if (isReplay) {
            calculatedXp = 0;
        }

        const xpEarned = calculatedXp;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setSessionXp(prev => prev + xpEarned);
        }

        // Save progress to Firestore
        if (currentUser?.uid) {
            try {
                // Returns achievements if any unlocked
                const newAchievements = await updateUserStats(currentUser.uid, xpEarned, isCorrect);

                if (newAchievements?.length > 0) {
                    unlockMultiple(newAchievements);
                }

                await saveChallengeProgress(currentUser.uid, challenge.id, {
                    currentQuestion: currentQ,
                    lastAnswer: selected,
                    lastAnswerCorrect: isCorrect,
                    xpEarned: sessionXp + xpEarned,
                });

                // Refresh user data immediately so stats update in real-time
                await refreshUser();

                // Check for level up
                const newTotalXp = previousUserXp + sessionXp + xpEarned;
                const levelUpResult = checkLevelUp(previousUserXp, newTotalXp);

                if (levelUpResult.leveledUp) {
                    success(
                        `🎉 Level Up! You're now Level ${levelUpResult.newLevel}: ${levelUpResult.newTitle}!`
                    );
                }
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
            // Challenge complete!
            stop();
            if (currentUser?.uid) {
                try {
                    const accuracy = Math.round((correctAnswers / challenge.questions.length) * 100);
                    const newAchievements = await markChallengeCompleted(currentUser.uid, challenge.id, {
                        totalXpEarned: sessionXp,
                        correctAnswers,
                        totalQuestions: challenge.questions.length,
                        accuracy,
                    });

                    if (newAchievements?.length > 0) {
                        unlockMultiple(newAchievements);
                    }

                    success(
                        `🏆 Challenge Complete! +${sessionXp} XP (${accuracy}% accuracy)`
                    );

                    // Refresh user data so stats update immediately
                    await refreshUser();
                } catch (error) {
                    console.error('Failed to mark challenge complete:', error);
                }
            }
            navigate('/challenges');
        }
    };

    return (
        <div className="detail-screen">
            {/* Header */}
            <header className="detail-header">
                <button className="back-btn" onClick={() => {
                    stopBGM(true); // Stop immediately when clicking back
                    playSFX('click');
                    navigate('/challenges');
                }}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-info">
                    <span className="badge badge-info">{challenge.type}</span>
                    <span className={`badge ${challenge.difficulty === 'easy' ? 'badge-success' :
                        challenge.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'
                        }`}>
                        {challenge.difficulty}
                    </span>
                </div>
                <div className="header-controls">
                    <button
                        className="audio-control-btn"
                        onClick={handleAudioToggle}
                        title={isMuted ? 'Unmute & Play Music' : 'Mute Music'}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <div className="header-time">
                        <Clock size={16} />
                        <span className="mono-font">{formattedTime}</span>
                        <span className="text-muted"> / {challenge.estimatedTime}m</span>
                    </div>
                </div>
            </header>

            <div className="detail-content">
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
                        <Star size={14} />
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
                                <button className="copy-btn">
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
            </div>

            {/* Footer */}
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
