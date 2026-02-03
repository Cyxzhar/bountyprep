import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, Clock, ChevronRight, Play, CheckCircle
} from 'lucide-react';
import { courses } from '../data/courses';
import './Courses.css';

export default function Courses() {
    const navigate = useNavigate();

    // TODO: Connect to real user progress from Firestore
    // For now using mock progress
    const getProgress = (courseId) => {
        return Math.floor(Math.random() * 30); // Random 0-30%
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-content">
                    <h1>Learning Paths</h1>
                    <p>Structured courses to take you from beginner to bug bounty pro</p>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <BookOpen size={20} className="text-neon" />
                        <div className="stat-info">
                            <span className="stat-value">{courses.length}</span>
                            <span className="stat-label">Courses</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Trophy size={20} className="text-purple" />
                        <div className="stat-info">
                            <span className="stat-value">500+</span>
                            <span className="stat-label">Total XP</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="courses-grid">
                {courses.map(course => {
                    const progress = getProgress(course.id);
                    const isStarted = progress > 0;
                    const Icon = course.icon;

                    return (
                        <div
                            key={course.id}
                            className="course-card card-glow"
                            onClick={() => navigate(`/course/${course.id}`)}
                        >
                            <div className="course-icon-wrapper">
                                <Icon size={32} />
                            </div>

                            <div className="course-content">
                                <div className="course-badges">
                                    <span className="badge badge-info">{course.level}</span>
                                    <span className="badge badge-warning">{course.duration}</span>
                                </div>

                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-desc">{course.description}</p>

                                <div className="course-meta">
                                    <div className="meta-item">
                                        <Trophy size={14} className="text-yellow" />
                                        <span>{course.xp} XP</span>
                                    </div>
                                    <div className="meta-item">
                                        <BookOpen size={14} className="text-neon" />
                                        <span>{course.modules.length} Modules</span>
                                    </div>
                                </div>

                                <div className="course-progress-section">
                                    <div className="progress-label">
                                        <span>{isStarted ? `${progress}% Complete` : 'Not Started'}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <button className="start-btn">
                                    {isStarted ? 'Continue Learning' : 'Start Course'}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Coming Soon Card */}
                <div className="course-card coming-soon-card">
                    <div className="course-icon-wrapper locked">
                        <Clock size={32} />
                    </div>
                    <div className="course-content">
                        <div className="course-badges">
                            <span className="badge badge-muted">Coming Soon</span>
                        </div>
                        <h3 className="course-title">Advanced Recon</h3>
                        <p className="course-desc">Deep dive into subdomain enumeration and asset discovery.</p>
                        <button className="start-btn disabled" disabled>
                            Available Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
