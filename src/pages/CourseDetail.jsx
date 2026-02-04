import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock, Trophy, ChevronLeft, PlayCircle, Lock, CheckCircle,
    BookOpen, Zap, Target
} from 'lucide-react';
import { courses } from '../data/courses';
import { useAuth } from '../context/AuthContext';
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

    // Mock progress - connect to real Firestore later
    const getLessonStatus = (lessonId) => {
        // 'locked', 'available', 'completed'
        return 'available';
    };

    const handleBack = () => navigate('/courses');

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
                    </div>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>

                    <button className="primary-btn start-course-btn">
                        Start Learning <PlayCircle size={20} />
                    </button>
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
