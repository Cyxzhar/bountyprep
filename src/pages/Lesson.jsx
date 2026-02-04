import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText,
    AlertCircle, RotateCcw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSound } from '../context/SoundContext';
import { saveLessonProgress, getCourseProgress } from '../utils/firestore';
import { courses } from '../data/courses';
import './Lesson.css';

export default function Lesson() {
    const { id, lessonId } = useParams();
    const navigate = useNavigate();

    const { currentUser, refreshUser } = useAuth();
    const { success, error: showError } = useToast();
    const { playSFX } = useSound();
    const [courseProgress, setCourseProgress] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch progress to check completion status
    useEffect(() => {
        const fetchProgress = async () => {
            if (currentUser && id) {
                const data = await getCourseProgress(currentUser.uid, id);
                if (data) {
                    setCourseProgress(data);
                    setIsCompleted(data.completedLessons?.includes(lessonId));
                }
            }
        };
        fetchProgress();
    }, [currentUser, id, lessonId]);

    const [scrollProgress, setScrollProgress] = useState(0);

    // Scroll Progress Listener
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Find course and lesson
    const course = courses.find(c => c.id === id);
    let currentModule = null;
    let lesson = null;
    let nextLessonId = null;
    let prevLessonId = null;
    let nextLessonTitle = null;

    if (course) {
        // Flatten lessons to find current, prev, next
        const allLessons = course.modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === lessonId);

        if (currentIndex !== -1) {
            lesson = allLessons[currentIndex];
            currentModule = course.modules.find(m => m.lessons.some(l => l.id === lessonId));

            if (currentIndex > 0) prevLessonId = allLessons[currentIndex - 1].id;
            if (currentIndex < allLessons.length - 1) {
                nextLessonId = allLessons[currentIndex + 1].id;
                nextLessonTitle = allLessons[currentIndex + 1].title;
            }
        }
    }

    if (!lesson) {
        return (
            <div className="page-container center-content">
                <h2>Lesson not found</h2>
                <button className="primary-btn" onClick={() => navigate(`/course/${id}`)}>
                    Back to Course
                </button>
            </div>
        );
    }

    const handleComplete = async () => {
        playSFX('click'); // Sound effect
        if (!currentUser) return;

        // If already completed, just navigate
        if (isCompleted) {
            if (nextLessonId) {
                navigate(`/course/${id}/lesson/${nextLessonId}`);
            } else {
                navigate(`/course/${id}`);
            }
            return;
        }

        setSaving(true);
        try {
            const { success: saveSuccess, xpAwarded } = await saveLessonProgress(currentUser.uid, id, lessonId, lesson.xp || 50);

            if (saveSuccess) {
                playSFX('success'); // Success sound
                if (xpAwarded > 0) {
                    success(`Lesson Completed! +${xpAwarded} XP`);
                    refreshUser();
                } else {
                    success('Lesson Completed!');
                }

                if (nextLessonId) {
                    navigate(`/course/${id}/lesson/${nextLessonId}`);
                } else {
                    success('Course Completed! 🎉');
                    navigate(`/course/${id}`);
                }
            } else {
                showError('Failed to save progress');
            }
        } catch (error) {
            console.error(error);
            showError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-container lesson-page">
            {/* Sticky Progress Bar */}
            <div className="scroll-progress-container">
                <div
                    className="scroll-progress-bar"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Modern Header / Hero */}
            <header className="lesson-hero">
                <div className="hero-top-nav">
                    <button className="icon-btn-back" onClick={() => { playSFX('click'); navigate(`/course/${id}`); }}>
                        <ChevronLeft size={20} /> Back to Course
                    </button>
                    <div className="lesson-meta-badge">
                        <span className="xp-badge">+{lesson.xp || 50} XP</span>
                        <span className="time-badge">{lesson.duration || '5 min'} read</span>
                    </div>
                </div>

                <div className="hero-content">
                    <div className="module-tag">{currentModule?.title || 'Course Module'}</div>
                    <h1 className="hero-title">{lesson.title}</h1>
                </div>
            </header>

            <div className="lesson-layout-modern">
                <main className="lesson-content-modern">

                    {/* Video Player */}
                    {lesson.videoUrl && (
                        <div className="video-section">
                            <div className="video-container">
                                <iframe
                                    src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                                    title={lesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <div className="markdown-modern">
                        <ReactMarkdown
                            components={{
                                code: ({ inline, children }) => (
                                    inline
                                        ? <code className="inline-code">{children}</code>
                                        : <pre className="code-block"><code>{children}</code></pre>
                                ),
                                blockquote: ({ children }) => {
                                    const text = children?.[1]?.props?.children?.[0] || '';
                                    if (typeof text === 'string' && text.includes('[!IMPORTANT]')) {
                                        return <div className="callout callout-important">{children}</div>
                                    }
                                    if (typeof text === 'string' && text.includes('[!TIP]')) {
                                        return <div className="callout callout-tip">{children}</div>
                                    }
                                    return <blockquote className="modern-blockquote">{children}</blockquote>
                                },
                                // H2 becomes a Section Card
                                h2: ({ children }) => <div className="section-header"><h2>{children}</h2></div>
                            }}
                        >
                            {lesson.content}
                        </ReactMarkdown>
                    </div>

                    {/* Enhanced Footer Navigation */}
                    <div className="lesson-footer">
                        <div className="footer-actions">
                            <button
                                className="nav-btn-secondary"
                                disabled={!prevLessonId}
                                onClick={() => {
                                    if (prevLessonId) {
                                        playSFX('click');
                                        navigate(`/course/${id}/lesson/${prevLessonId}`);
                                    }
                                }}
                            >
                                <ChevronLeft size={16} /> Previous Lesson
                            </button>

                            <button className="complete-btn-primary" onClick={handleComplete} disabled={saving}>
                                <div className="btn-content">
                                    <span className="btn-label">
                                        {saving ? 'Saving...' : (isCompleted ? 'Next Lesson' : 'Mark Complete')}
                                    </span>
                                    {nextLessonTitle && <span className="btn-subtext">Up Next: {nextLessonTitle}</span>}
                                </div>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </main >

                {/* Desktop Sidebar (Optional TOC) */}
                <aside className="lesson-sidebar-desktop">
                    <div className="sidebar-sticky">
                        <h3>In this Module</h3>
                        <div className="sidebar-list">
                            {currentModule?.lessons.map(l => (
                                <div
                                    key={l.id}
                                    className={`sidebar-item ${l.id === lessonId ? 'active' : ''} ${courseProgress?.completedLessons?.includes(l.id) ? 'completed' : ''}`}
                                    onClick={() => navigate(`/course/${id}/lesson/${l.id}`)}
                                >
                                    <div className="status-indicator">
                                        {l.id === lessonId ? <div className="pulsing-dot" /> :
                                            (courseProgress?.completedLessons?.includes(l.id) ? <CheckCircle size={14} /> : <div className="empty-dot" />)
                                        }
                                    </div>
                                    <span className="item-title">{l.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div >
        </div >
    );
}
