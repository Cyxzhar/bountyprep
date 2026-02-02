import {
    Flame, Target, Trophy, ChevronRight, Calendar,
    CheckCircle, Zap, Award, Lock, Syringe, Link, IdCard, RefreshCw, Upload
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { FirstVisitTransition } from '../components/PageTransition';
import { skillModules, achievements } from '../data/challenges';
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
    const level = 12;
    const currentXP = 1240;
    const nextLevelXP = 2000;
    const xpPercent = (currentXP / nextLevelXP) * 100;

    // Generate heatmap data
    const heatmapData = Array(91).fill(0).map(() => Math.floor(Math.random() * 4));

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
                                strokeDasharray={`${xpPercent * 3.39} 339`}
                            />
                        </svg>
                        <div className="level-content">
                            <span className="level-number">{level}</span>
                            <span className="level-label">LEVEL</span>
                        </div>
                    </div>
                    <div className="level-info">
                        <h2 className="level-title">Security Analyst</h2>
                        <div className="xp-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${xpPercent}%` }}></div>
                            </div>
                            <span className="xp-text">{currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
                        </div>
                        <div className="level-stats">
                            <div className="mini-stat">
                                <Flame size={16} />
                                <span>12 day streak</span>
                            </div>
                            <div className="mini-stat">
                                <Trophy size={16} />
                                <span>#1,247 rank</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="qs-card">
                        <CheckCircle size={20} />
                        <span className="qs-value">24</span>
                        <span className="qs-label">Completed</span>
                    </div>
                    <div className="qs-card">
                        <Target size={20} />
                        <span className="qs-value">85%</span>
                        <span className="qs-label">Accuracy</span>
                    </div>
                    <div className="qs-card">
                        <Zap size={20} />
                        <span className="qs-value">48h</span>
                        <span className="qs-label">Study Time</span>
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
                            {heatmapData.map((level, i) => (
                                <div
                                    key={i}
                                    className={`heat-cell level-${level}`}
                                    title={`${level} challenges`}
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
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Achievements</h3>
                        <span className="section-meta">4 / 12 unlocked</span>
                    </div>
                    <div className="achievements-grid">
                        {achievements.map(a => (
                            <div key={a.id} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}>
                                {!a.unlocked && <Lock className="lock-icon" size={14} />}
                                <span className="ach-icon">{a.icon}</span>
                                <span className="ach-name">{a.name}</span>
                                <span className={`ach-rarity rarity-${a.rarity}`}>{a.rarity}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <BottomNav />
        </div>
    );
}
