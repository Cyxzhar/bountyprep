import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAchievement } from '../../context/AchievementContext';
import { useSound } from '../../context/SoundContext';
import { challenges } from '../../data/challenges';
import { updateStreak, getChallengeProgress, updateUserStats, saveChallengeProgress, markChallengeCompleted } from '../../utils/firestore';
import { checkLevelUp } from '../../utils/xp';
import { ArrowLeft, Clock, Volume2, VolumeX } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';

// Import challenge type components
import CodingChallenge from '../../components/challenges/CodingChallenge';
import LabChallenge from '../../components/challenges/LabChallenge';
import PracticalChallenge from '../../components/challenges/PracticalChallenge';
import CompletionModal from '../../components/CompletionModal/CompletionModal';

// Import original multiple choice component logic (embedded)
import MultipleChoiceChallenge from '../../components/challenges/MultipleChoiceChallenge';

import './ChallengeDetail.css';

export default function ChallengeDetailNew() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, refreshUser } = useAuth();
    const { success, error: showError, info } = useToast();
    const { playBGM, stopBGM, playSFX } = useSound();
    const { unlockMultiple } = useAchievement();
    const challenge = challenges.find(c => c.id === id) || challenges[0];

    const { elapsedTime, formattedTime, start, stop } = useTimer();
    const hasShownToastRef = useRef(false);
    const [localMuted, setLocalMuted] = useState(false);
    const [savedProgress, setSavedProgress] = useState(null);
    const [previousUserXp, setPreviousUserXp] = useState(currentUser?.xp || 0);
    const [challengeCompleted, setChallengeCompleted] = useState(false);

    // Initial setup
    useEffect(() => {
        start();

        if (!localMuted) {
            playBGM('challenge', { loop: false, volume: 0.3 });
        }

        return () => stopBGM(true);
    }, []);

    // Toggle audio
    const handleAudioToggle = () => {
        const newMutedState = !localMuted;
        setLocalMuted(newMutedState);

        if (newMutedState) {
            stopBGM();
            info('Challenge audio muted', VolumeX);
        } else {
            playBGM('challenge', { loop: false, volume: 0.3 });
            info('Challenge audio playing', Volume2);
        }
    };

    // Load progress and update streak
    useEffect(() => {
        if (!currentUser?.uid) return;

        async function initChallenge() {
            try {
                // Update streak
                updateStreak(currentUser.uid).then(result => {
                    if (result.achievements?.length > 0) {
                        unlockMultiple(result.achievements);
                    }
                }).catch(console.error);

                // Load progress
                const progress = await getChallengeProgress(currentUser.uid, challenge.id);
                if (progress) {
                    setSavedProgress(progress);
                    // Do NOT auto-set challengeCompleted(true) here, 
                    // or replaying the challenge will instantly confirm it.
                }
            } catch (err) {
                console.error("Failed to load challenge:", err);
            }
        }

        initChallenge();
        setPreviousUserXp(currentUser?.xp || 0);
    }, [currentUser?.uid, challenge.id]);

    // Handle challenge completion
    const handleChallengeComplete = async (completionData) => {
        if (!currentUser?.uid) return;

        stop();
        setChallengeCompleted(true);

        try {
            const { xpEarned, hintsUsed, ...otherData } = completionData;

            // Update user stats
            const newAchievements = await updateUserStats(currentUser.uid, xpEarned, true);

            if (newAchievements?.length > 0) {
                unlockMultiple(newAchievements);
            }

            // Mark challenge as completed
            const completionAchievements = await markChallengeCompleted(
                currentUser.uid,
                challenge.id,
                {
                    totalXpEarned: xpEarned,
                    hintsUsed,
                    timeSpent: elapsedTime,
                    ...otherData
                }
            );

            if (completionAchievements?.length > 0) {
                unlockMultiple(completionAchievements);
            }

            // Check for level up
            const newTotalXp = previousUserXp + xpEarned;
            const levelUpResult = checkLevelUp(previousUserXp, newTotalXp);

            if (levelUpResult.leveledUp) {
                success(
                    `🎉 Level Up! You're now Level ${levelUpResult.newLevel}: ${levelUpResult.newTitle}!`
                );
            } else {
                success(`🏆 Challenge Complete! +${xpEarned} XP earned`);
            }

            // Refresh user data
            await refreshUser();

            // Navigate back after delay
            setTimeout(() => {
                navigate('/challenges');
            }, 3000);
        } catch (error) {
            console.error('Failed to complete challenge:', error);
            showError('Failed to save challenge completion');
        }
    };

    // Render appropriate challenge component based on type
    const renderChallengeComponent = () => {
        const challengeType = challenge.challengeType || 'multiple_choice';

        switch (challengeType) {
            case 'coding':
                return (
                    <CodingChallenge
                        challenge={challenge}
                        onComplete={handleChallengeComplete}
                    />
                );

            case 'lab':
                return (
                    <LabChallenge
                        challenge={challenge}
                        onComplete={handleChallengeComplete}
                    />
                );

            case 'practical':
                return (
                    <PracticalChallenge
                        challenge={challenge}
                        onComplete={handleChallengeComplete}
                    />
                );

            case 'multiple_choice':
            default:
                return (
                    <MultipleChoiceChallenge
                        challenge={challenge}
                        savedProgress={savedProgress}
                        onComplete={handleChallengeComplete}
                    />
                );
        }
    };

    return (
        <div className="detail-screen">
            {/* Header */}
            <header className="detail-header">
                <button className="back-btn" onClick={() => {
                    stopBGM(true);
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
                    {localStorage.getItem('sound_muted') !== 'true' && (
                        <button className="icon-btn" onClick={handleAudioToggle} title={localMuted ? 'Unmute' : 'Mute'}>
                            {localMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    )}
                    <div className="header-time">
                        <Clock size={16} />
                        <span className="mono-font">{formattedTime}</span>
                        <span className="text-muted"> / {challenge.estimatedTime}m</span>
                    </div>
                </div>
            </header>

            <div className="detail-content">
                {/* Render appropriate challenge type */}
                {renderChallengeComponent()}

                {/* Completion overlay */}
                {challengeCompleted && (
                    <CompletionModal
                        xpEarned={challenge.xpReward}
                        onBack={() => navigate('/challenges')}
                        onReplay={() => window.location.reload()}
                    />
                )}
            </div>
        </div>
    );
}
