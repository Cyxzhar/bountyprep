import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, Clock, ChevronRight, Play, CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react'; // Added useState, useEffect
import { courses } from '../data/courses';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext'; // Added useAuth
import { getAllCoursesProgress } from '../utils/firestore'; // Added import
import './Courses.css';

export default function Courses() {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get user
    const [allProgress, setAllProgress] = useState({}); // Store progress map

    // Fetch real progress
    useEffect(() => {
        async function loadProgress() {
            if (currentUser) {
                const data = await getAllCoursesProgress(currentUser.uid);
                setAllProgress(data || {});
            }
        }
        loadProgress();
    }, [currentUser]);

    const getProgress = (courseId) => {
        const courseData = courses.find(c => c.id === courseId);
        const userCourseData = allProgress[courseId];

        if (!courseData || !userCourseData?.completedLessons) return 0;

        // Calculate total lessons in course
        let totalLessons = 0;
        courseData.modules.forEach(m => {
            totalLessons += m.lessons.length;
        });

        if (totalLessons === 0) return 0;

        const completedCount = userCourseData.completedLessons.length;
        return Math.min(100, Math.round((completedCount / totalLessons) * 100));
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
                    {/* Placeholder for total user XP if we want to fetch it later */}
                    <div className="stat-card">
                        <Trophy size={20} className="text-purple" />
                        <div className="stat-info">
                            <span className="stat-value">Start</span>
                            <span className="stat-label">Your Journey</span>
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
            <BottomNav />
        </div>
    );
}
