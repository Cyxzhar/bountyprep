import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Flame, CheckCircle, Target, ChevronRight, Clock,
    Bot, Lock, Unlock, Syringe, Link, IdCard, RefreshCw, Upload, Star
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { FirstVisitTransition } from '../components/PageTransition';
import { challenges, skillModules } from '../data/challenges';
import { calculateLevel, getLevelProgress, getLevelTitle, formatXp } from '../utils/xp';
import './Home.css';

// Map icon names to components
const iconComponents = {
    Lock,
    Syringe,
    Link,
    IdCard,
    RefreshCw,
    Upload
};

export default function Home() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const todayChallenge = challenges[0];

    // Real user stats from Firestore (via AuthContext)
    const xp = currentUser?.xp || 0;
    const level = calculateLevel(xp);
    const levelProgress = getLevelProgress(xp);
    const title = getLevelTitle(level);
    const streak = currentUser?.streak || 0;
    const totalCompleted = currentUser?.totalCompleted || 0;

    const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Hacker";

    // Get current date
    const today = new Date();
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', dateOptions);

    return (
        <FirstVisitTransition pageName="home">
            <div className="home-screen">
                <div className="screen-content">
                    {/* Header */}
                    <header className="home-header">
                        <div className="header-content">
                            <p className="greeting-date">{dateString}</p>
                            <h1 className="greeting-text">Welcome back, <span className="text-gradient">{displayName}</span></h1>
                        </div>
                        <div className="streak-badge">
                            <Flame size={18} />
                            <span>{streak}</span>
                        </div>
                    </header>

                    {/* Level/XP Card */}
                    <section className="level-card">
                        <div className="level-info">
                            <div className="level-badge">
                                <Star size={16} />
                                <span>Level {level}</span>
                            </div>
                            <span className="level-title">{title}</span>
                        </div>
                        <div className="xp-progress">
                            <div className="xp-bar">
                                <div
                                    className="xp-fill"
                                    style={{ width: `${levelProgress}%` }}
                                ></div>
                            </div>
                            <span className="xp-text">{formatXp(xp)} XP</span>
                        </div>
                    </section>

                    {/* Today's Challenge */}
                    <section className="today-challenge card-glow" onClick={() => navigate(`/challenge/${todayChallenge.id}`)}>
                        <div className="challenge-glow"></div>
                        <div className="challenge-header">
                            <div className="challenge-badges">
                                <span className="badge badge-info">{todayChallenge.type}</span>
                                <span className="badge badge-warning">{todayChallenge.difficulty}</span>
                            </div>
                            <div className="challenge-time">
                                <Clock size={14} />
                                <span>{todayChallenge.estimatedTime} min</span>
                            </div>
                        </div>

                        <h2 className="challenge-title">{todayChallenge.title}</h2>
                        <p className="challenge-desc">{todayChallenge.description}</p>

                        <button className="btn btn-primary btn-full mt-md">
                            Start Challenge
                            <ChevronRight size={20} />
                        </button>
                    </section>

                    {/* Quick Stats */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <CheckCircle size={20} />
                            </div>
                            <span className="stat-value">{totalCompleted}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon fire">
                                <Flame size={20} />
                            </div>
                            <span className="stat-value">{streak}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Target size={20} />
                            </div>
                            <span className="stat-value">{level}</span>
                            <span className="stat-label">Level</span>
                        </div>
                    </section>

                    {/* Learning Path */}
                    <section className="learning-section">
                        <div className="section-header">
                            <h3 className="section-title">Your Learning Path</h3>
                            <button className="btn-ghost" onClick={() => navigate('/challenges')}>See All</button>
                        </div>

                        <div className="modules-scroll">
                            {skillModules.map((module) => {
                                const IconComponent = iconComponents[module.iconName] || Lock;
                                return (
                                    <div
                                        key={module.id}
                                        className="module-card"
                                        onClick={() => navigate(`/challenges?filter=${encodeURIComponent(module.name)}`)}
                                    >
                                        <div className="module-icon">
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="module-progress-ring">
                                            <svg viewBox="0 0 36 36">
                                                <circle className="ring-bg" cx="18" cy="18" r="16" />
                                                <circle
                                                    className="ring-fill"
                                                    cx="18" cy="18" r="16"
                                                    strokeDasharray={`${module.progress} 100`}
                                                />
                                            </svg>
                                            <span className="ring-percent">{module.progress}%</span>
                                        </div>
                                        <h4 className="module-name">{module.name}</h4>
                                        <p className="module-status">{module.completed}/{module.total} Complete</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* AI Interview Card */}
                    <section className="ai-card" onClick={() => navigate('/interview')}>
                        <div className="ai-icon-wrapper">
                            <Bot size={32} />
                        </div>
                        <div className="ai-content">
                            <h3>AI Interview Coach</h3>
                            <p>Practice FAANG security interviews</p>
                        </div>
                        <ChevronRight size={24} />
                    </section>

                    {/* Quick Challenges */}
                    <section className="quick-challenges">
                        <div className="section-header">
                            <h3 className="section-title">Quick Challenges</h3>
                            <button className="btn-ghost" onClick={() => navigate('/challenges')}>Browse All</button>
                        </div>

                        <div className="quick-list">
                            {challenges.slice(1, 4).map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="quick-item"
                                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                                >
                                    <div className="quick-icon">
                                        {challenge.isPremium ? <Lock size={18} /> : <Unlock size={18} />}
                                    </div>
                                    <div className="quick-info">
                                        <span className="quick-name">{challenge.title}</span>
                                        <span className="quick-meta">{challenge.type} • {challenge.estimatedTime}m</span>
                                    </div>
                                    <span className={`badge ${challenge.difficulty === 'easy' ? 'badge-success' :
                                        challenge.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'
                                        }`}>
                                        {challenge.difficulty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <BottomNav />
            </div>
        </FirstVisitTransition>
    );
}
