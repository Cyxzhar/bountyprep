import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, Clock, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCoursesProgress } from '../../utils/firestore';
import { useCourses } from '../../hooks/useContent';
import { getIcon } from '../../utils/icons';
import './Courses.css';

export default function Courses() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { courses, loading: coursesLoading } = useCourses();
    const [allProgress, setAllProgress] = useState({});

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

    if (coursesLoading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[50vh]">
                <div className="text-neon animate-pulse">Loading Courses...</div>
            </div>
        );
    }

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
                    // Use getIcon helper with iconName from Firestore
                    const Icon = getIcon(course.iconName);

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
                                        <span>{course.modules?.length || 0} Modules</span>
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
