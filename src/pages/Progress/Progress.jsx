import { useMemo, useState, useEffect } from 'react';
import {
    Flame, Target, Trophy, ChevronRight, Calendar,
    CheckCircle, Zap, Award, Lock, Syringe, Link, IdCard, RefreshCw, Upload,
    ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FirstVisitTransition } from '../../components/PageTransition/PageTransition';
import { SKILL_CATEGORIES } from '../../config/skills';
import { useChallenges, useAchievements } from '../../hooks/useContent';
import AchievementCard from '../../components/AchievementCard/AchievementCard';
import { calculateLevel, getLevelProgress, getLevelTitle, getXpToNextLevel, formatXp } from '../../utils/xp';
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
    const { challenges } = useChallenges();
    const { achievements } = useAchievements();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [completedChallengeIds, setCompletedChallengeIds] = useState(new Set());

    // Fetch user's completed challenges to calculate skill progress
    useEffect(() => {
        async function fetchCompleted() {
            if (!currentUser?.uid) return;
            try {
                const userChallengesRef = collection(db, 'users', currentUser.uid, 'challenges');
                const snap = await getDocs(userChallengesRef);
                const completed = new Set();
                snap.docs.forEach(doc => {
                    if (doc.data().completed) {
                        completed.add(doc.id);
                    }
                });
                setCompletedChallengeIds(completed);
            } catch (err) {
                console.error("Error fetching completed challenges:", err);
            }
        }
        fetchCompleted();
    }, [currentUser?.uid]);

    // Calculate dynamic skill progress
    const skillModules = useMemo(() => {
        return SKILL_CATEGORIES.map(category => {
            // Find challenges matching this category
            const relevantChallenges = challenges.filter(c => {
                const type = (c.type || '').toLowerCase();
                const title = (c.title || '').toLowerCase();
                return category.matchType.some(term =>
                    type.includes(term.toLowerCase()) || title.includes(term.toLowerCase())
                );
            });

            const total = relevantChallenges.length;
            const completedCount = relevantChallenges.filter(c => completedChallengeIds.has(c.id)).length;
            const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            return {
                ...category,
                progress,
                completed: completedCount,
                total
            };
        });
    }, [challenges, completedChallengeIds]);

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

    // Generate real heatmap data from user activity for the SPECIFIC year
    const heatmapData = useMemo(() => {
        const data = [];
        const activity = currentUser?.activity || {};

        // Start from Jan 1st of selected year
        const startDate = new Date(selectedYear, 0, 1);
        // End at Dec 31st of selected year
        const endDate = new Date(selectedYear, 11, 31);

        // Adjust start date to the beginning of the week (Sunday = 0)
        const startDay = startDate.getDay();
        const adjustedStart = new Date(startDate);
        adjustedStart.setDate(startDate.getDate() - startDay);

        // Adjust end date to the end of the week (Saturday = 6)
        const endDay = endDate.getDay();
        const adjustedEnd = new Date(endDate);
        adjustedEnd.setDate(endDate.getDate() + (6 - endDay));

        // Loop through every day from adjustedStart to adjustedEnd
        let cur = new Date(adjustedStart);
        while (cur <= adjustedEnd) {
            const dateStr = cur.toISOString().split('T')[0];
            const isOutsideYear = cur.getFullYear() !== selectedYear;
            const count = isOutsideYear ? 0 : (activity[dateStr] || 0);

            // Map count to level (0-3)
            let level = 0;
            if (count > 0) {
                if (count <= 2) level = 1;
                else if (count <= 5) level = 2;
                else level = 3;
            }

            data.push({
                date: dateStr,
                count,
                level,
                isOutsideYear, // Mark days that are purely for grid filler
                month: cur.getMonth()
            });

            cur.setDate(cur.getDate() + 1);
        }
        return data;
    }, [currentUser?.activity, selectedYear]);

    // Calculate which columns should have month labels
    const monthLabels = useMemo(() => {
        const labels = [];
        let currentMonth = -1;

        // Every 7 days is a new column
        for (let i = 0; i < heatmapData.length; i += 7) {
            const day = heatmapData[i];
            // Only show labels for the selected year and when month changes
            if (!day.isOutsideYear && day.month !== currentMonth) {
                currentMonth = day.month;
                labels.push({
                    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][currentMonth],
                    index: i / 7
                });
            }
        }
        return labels;
    }, [heatmapData]);

    // Available years for switching (e.g., current and last)
    const availableYears = [currentYear, currentYear - 1];

    return (
        <div className="progress-screen">
            <div className="screen-content">
                {/* Level Card */}
                <div className="progress-level-card">
                    <div className="progress-level-ring">
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
                    <div className="progress-level-info">
                        <h2 className="progress-level-title">{title}</h2>
                        <div className="progress-xp-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
                            </div>
                            <span className="progress-xp-text">{formatXp(xp)} XP • {formatXp(xpToNext)} to next</span>
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
                        <div className="year-selector">
                            {availableYears.map(year => (
                                <button
                                    key={year}
                                    className={`year-btn ${selectedYear === year ? 'active' : ''}`}
                                    onClick={() => setSelectedYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="heatmap-container">
                        <div className="heatmap-wrapper">
                            <div className="day-labels">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>
                            <div className="heatmap-content">
                                <div className="heatmap-scroll-area" key={selectedYear}>
                                    <div className="month-labels-full">
                                        {monthLabels.map((m, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    left: `calc(${m.index} * (15px + 5px))`
                                                }}
                                            >
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="heatmap-grid-full">
                                        {heatmapData.map((day, i) => (
                                            <div
                                                key={i}
                                                className={`heat-cell level-${day.level} ${day.isOutsideYear ? 'is-filler' : ''}`}
                                                title={day.isOutsideYear ? '' : `${day.date}: ${day.count} activities`}
                                                style={{ '--delay': `${i * 0.0015}s` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
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
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Achievements</h3>
                        <span className="section-meta">
                            {achievements.filter(a => (currentUser?.achievements || []).includes(a.id)).length} / {achievements.length} unlocked
                        </span>
                    </div>
                    <div className="achievements-grid">
                        {achievements.map(achievement => {
                            const isUnlocked = (currentUser?.achievements || []).includes(achievement.id);
                            const unlockedAt = isUnlocked ? { seconds: Date.now() / 1000 } : null;

                            return (
                                <AchievementCard
                                    key={achievement.id}
                                    achievement={achievement}
                                    unlockedAt={unlockedAt}
                                />
                            );
                        })}
                    </div>
                </section>
            </div>

        </div>
    );
}
