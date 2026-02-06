import { Lock, HelpCircle } from 'lucide-react';
import { getAchievementById } from '../../data/achievements';
import './AchievementCard.css';

export default function AchievementCard({ achievementId, unlockedAt }) {
    // Get full achievement data
    const achievement = getAchievementById(achievementId);

    // If definition missing (removed/changed), show fallback or null
    if (!achievement) return null;

    const isUnlocked = !!unlockedAt;

    return (
        <div className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
            <div className={`achievement-icon ${isUnlocked ? 'glow' : ''}`}>
                {isUnlocked ? achievement.icon : <Lock size={20} />}
            </div>

            <div className="achievement-info">
                <h4 className="achievement-title">{achievement.title}</h4>
                <p className="achievement-desc">{achievement.description}</p>
                {isUnlocked && (
                    <span className="achievement-date">
                        Unlocked {new Date(unlockedAt.seconds * 1000).toLocaleDateString()}
                    </span>
                )}
            </div>

            {!isUnlocked && (
                <div className="achievement-progress">
                    <div className="xp-reward">+{achievement.xpReward} XP</div>
                </div>
            )}
        </div>
    );
}
