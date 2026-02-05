import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock, Trophy, ChevronLeft, PlayCircle, Lock, CheckCircle,
    BookOpen, Zap, Target
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { courses } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { getCourseProgress } from '../utils/firestore';
import './CourseDetail.css';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Find course or fallback to first one data doesn't match
    const course = courses.find(c => c.id === id);

    if (!course) {
        return (
            <div className="page-container center-content">
                <h2>Course not found</h2>
                <button className="primary-btn" onClick={() => navigate('/courses')}>
                    Back to Courses
                </button>
            </div>
        );
    }

    const [courseProgress, setCourseProgress] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            if (currentUser && id) {
                const data = await getCourseProgress(currentUser.uid, id);
                if (data) setCourseProgress(data);
            }
        };
        fetchProgress();
    }, [currentUser, id]);

    // Determine lesson status based on progress
    const getLessonStatus = (lessonId) => {
        if (!courseProgress) return 'available'; // Default to unlocked for now, or 'locked' if strict

        // Check if completed
        if (courseProgress.completedLessons?.includes(lessonId)) {
            return 'completed';
        }

        // Logic for locking/unlocking next lessons could go here
        // For now, keep everything available or check if previous was completed
        return 'available';
    };

    const handleBack = () => navigate('/courses');

    // Calculate progress state
    // Flatten lessons list to check total progress
    const allLessons = course.modules.flatMap(m => m.lessons);
    const hasProgress = courseProgress?.completedLessons?.length > 0;
    const isCompleted = allLessons.length > 0 &&
        allLessons.every(l => courseProgress?.completedLessons?.includes(l.id));

    const handleStartCourse = () => {
        // Find the first uncompleted lesson
        let targetLessonId = null;

        if (hasProgress && !isCompleted) {
            const completed = new Set(courseProgress.completedLessons);
            const firstUnfinished = allLessons.find(l => !completed.has(l.id));
            if (firstUnfinished) {
                targetLessonId = firstUnfinished.id;
            }
        }

        // Fallback to absolute first lesson if no progress or everything completed (restart/review)
        if (!targetLessonId && allLessons.length > 0) {
            targetLessonId = allLessons[0].id;
        }

        if (targetLessonId) {
            navigate(`/course/${course.id}/lesson/${targetLessonId}`);
        }
    };

    return (
        <div className="page-container course-detail-page">
            <header className="course-header-nav">
                <button className="icon-btn" onClick={handleBack}>
                    <ChevronLeft size={24} />
                </button>
                <span className="header-title">Course Details</span>
            </header>

            <div className="course-hero">
                <div className="course-hero-content">
                    <div className="hero-badges">
                        <span className="badge badge-info">{course.level}</span>
                        <span className="badge badge-warning">{course.duration}</span>
                        {isCompleted && (
                            <span className="badge badge-success">
                                <CheckCircle size={12} /> Completed
                            </span>
                        )}
                    </div>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>

                    <div className="hero-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '24px' }}>
                        <button className="primary-btn start-course-btn" onClick={handleStartCourse}>
                            {isCompleted ? 'Review Course' : (hasProgress ? 'Resume Learning' : 'Start Learning')}
                            {isCompleted ? <BookOpen size={20} /> : <PlayCircle size={20} />}
                        </button>

                        {isCompleted && (
                            <div className="completion-message">
                                <Trophy size={16} />
                                <span>100% Complete!</span>
                            </div>
                        )}
                    </div>

                    {/* Confetti Animation Layer */}
                    {isCompleted && (
                        <div className="confetti-container">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="confetti"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                                        animationDelay: `${Math.random() * 5}s`,
                                        '--drift': `${Math.random() * 200 - 100}px`
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="course-hero-stats">
                    <div className="hero-stat">
                        <Trophy size={24} className="text-yellow" />
                        <div className="stat-text">
                            <span className="value">{course.xp}</span>
                            <span className="label">Total XP</span>
                        </div>
                    </div>
                    <div className="hero-stat">
                        <BookOpen size={24} className="text-neon" />
                        <div className="stat-text">
                            <span className="value">{course.modules.length}</span>
                            <span className="label">Modules</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modules-list">
                <h2 className="section-title">Syllabus</h2>
                {course.modules.map((module, index) => (
                    <div key={module.id} className="module-group">
                        <div className="module-header">
                            <span className="module-number">Module {index + 1}</span>
                            <div className="module-title-row">
                                <h3>{module.title}</h3>
                                <span className="module-duration">{module.duration}</span>
                            </div>
                        </div>

                        <div className="lessons-list">
                            {module.lessons.map(lesson => {
                                const status = getLessonStatus(lesson.id);
                                const Icon = status === 'locked' ? Lock :
                                    status === 'completed' ? CheckCircle : PlayCircle;
                                const isLocked = status === 'locked';

                                return (
                                    <div
                                        key={lesson.id}
                                        className={`lesson-item ${status}`}
                                        onClick={() => !isLocked && navigate(`/course/${course.id}/lesson/${lesson.id}`)}
                                    >
                                        <div className="lesson-icon">
                                            <Icon size={isLocked ? 16 : 20} strokeWidth={isLocked ? 2 : 2.5} />
                                        </div>
                                        <div className="lesson-info">
                                            <span className="lesson-title">{lesson.title}</span>
                                            <div className="lesson-meta">
                                                <span className="lesson-type">{lesson.type}</span>
                                                <span className="dot">•</span>
                                                <span className="lesson-time">{lesson.duration}</span>
                                            </div>
                                        </div>
                                        {status === 'completed' && <span className="xp-badge">+{lesson.xp} XP</span>}
                                        {isLocked && <Lock size={14} className="text-muted" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
