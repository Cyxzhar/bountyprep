import { useMemo } from 'react';
import {
    Flame, Target, Trophy, ChevronRight, Calendar,
    CheckCircle, Zap, Award, Lock, Syringe, Link, IdCard, RefreshCw, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import { FirstVisitTransition } from '../components/PageTransition';
import { skillModules } from '../data/challenges';
import { achievements } from '../data/achievements';
import AchievementCard from '../components/AchievementCard';
import { calculateLevel, getLevelProgress, getLevelTitle, getXpToNextLevel, formatXp } from '../utils/xp';
import './Progress.css';

// Map icon names to components
const iconComponents = {
    Lock,
    Syringe,
    Link,
    IdCard,
    RefreshCw,
    Upload
};

export default function Progress() {
    const { currentUser } = useAuth();

    // Real user stats from Firestore
    const xp = currentUser?.xp || 0;
    const level = calculateLevel(xp);
    const levelProgress = getLevelProgress(xp);
    const title = getLevelTitle(level);
    const xpToNext = getXpToNextLevel(xp);
    const streak = currentUser?.streak || 0;
    const totalCompleted = currentUser?.totalCompleted || 0;
    const totalQuestions = currentUser?.totalQuestionsAnswered || 0;
    const correctAnswers = currentUser?.totalCorrectAnswers || 0;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Generate real heatmap data from user activity
    const heatmapData = useMemo(() => {
        const data = [];
        const activity = currentUser?.activity || {};
        const now = new Date();

        // Last 90 days
        for (let i = 90; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = activity[dateStr] || 0;

            // Map count to level (0-3)
            // 0: none, 1: low, 2: med, 3: high
            let level = 0;
            if (count > 0) {
                if (count <= 2) level = 1;
                else if (count <= 5) level = 2;
                else level = 3;
            }

            data.push({
                date: dateStr,
                count,
                level
            });
        }
        return data;
    }, [currentUser?.activity]);

    return (
        <div className="progress-screen">
            <div className="screen-content">
                {/* Level Card */}
                <div className="level-card">
                    <div className="level-ring">
                        <svg viewBox="0 0 120 120">
                            <circle className="ring-bg" cx="60" cy="60" r="54" />
                            <circle
                                className="ring-fill"
                                cx="60" cy="60" r="54"
                                strokeDasharray={`${levelProgress * 3.39} 339`}
                            />
                        </svg>
                        <div className="level-content">
                            <span className="level-number">{level}</span>
                            <span className="level-label">LEVEL</span>
                        </div>
                    </div>
                    <div className="level-info">
                        <h2 className="level-title">{title}</h2>
                        <div className="xp-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
                            </div>
                            <span className="xp-text">{formatXp(xp)} XP • {formatXp(xpToNext)} to next</span>
                        </div>
                        <div className="level-stats">
                            <div className="mini-stat">
                                <Flame size={16} />
                                <span>{streak} day streak</span>
                            </div>
                            <div className="mini-stat">
                                <Trophy size={16} />
                                <span>#{Math.max(1, 10000 - totalCompleted * 100)} rank</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="qs-card">
                        <CheckCircle size={20} />
                        <span className="qs-value">{totalCompleted}</span>
                        <span className="qs-label">Completed</span>
                    </div>
                    <div className="qs-card">
                        <Target size={20} />
                        <span className="qs-value">{accuracy}%</span>
                        <span className="qs-label">Accuracy</span>
                    </div>
                    <div className="qs-card">
                        <Zap size={20} />
                        <span className="qs-value">{totalQuestions}</span>
                        <span className="qs-label">Questions</span>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Activity</h3>
                        <span className="section-meta">Last 90 days</span>
                    </div>
                    <div className="heatmap-container">
                        <div className="heatmap-grid">
                            {heatmapData.map((day, i) => (
                                <div
                                    key={i}
                                    className={`heat-cell level-${day.level}`}
                                    title={`${day.date}: ${day.count} activities`}
                                />
                            ))}
                        </div>
                        <div className="heatmap-legend">
                            <span>Less</span>
                            <div className="legend-cells">
                                {[0, 1, 2, 3].map(l => (
                                    <div key={l} className={`heat-cell level-${l}`} />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </section>

                {/* Skills Progress */}
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Skills</h3>
                        <button className="btn-ghost">See All</button>
                    </div>
                    <div className="skills-list">
                        {skillModules.map(skill => {
                            const IconComponent = iconComponents[skill.iconName] || Lock;
                            return (
                                <div key={skill.id} className="skill-row">
                                    <div className="skill-icon-wrapper">
                                        <IconComponent size={20} />
                                    </div>
                                    <div className="skill-info">
                                        <div className="skill-header">
                                            <span className="skill-name">{skill.name}</span>
                                            <span className="skill-level">Lvl {Math.floor(skill.progress / 25) + 1}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${skill.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <span className="skill-percent">{skill.progress}%</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Achievements */}
                {/* Achievements */}
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Achievements</h3>
                        <span className="section-meta">
                            {achievements.filter(a => (currentUser?.achievements || []).includes(a.id)).length} / {achievements.length} unlocked
                        </span>
                    </div>
                    <div className="achievements-grid">
                        {achievements.map(achievement => {
                            // Firestore saves timestamp objects, need to verify structure if unlocked
                            // Currently we only store ID list in `achievements` array
                            // To store dates, we'd need a map or subcollection. 
                            // For MVP simplicity: Checks if ID in array.
                            const isUnlocked = (currentUser?.achievements || []).includes(achievement.id);

                            // Mock unlockedAt date for now since we just store IDs array
                            // In a full implementation, we'd store { id: 'x', unlockedAt: Timestamp } in a subcollection
                            const unlockedAt = isUnlocked ? { seconds: Date.now() / 1000 } : null;

                            return (
                                <AchievementCard
                                    key={achievement.id}
                                    achievementId={achievement.id}
                                    unlockedAt={unlockedAt}
                                />
                            );
                        })}
                    </div>
                </section>
            </div>

            <BottomNav />
        </div>
    );
}
