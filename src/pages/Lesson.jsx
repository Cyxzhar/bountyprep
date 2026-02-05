import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText,
    AlertCircle, RotateCcw, Copy, Check, ExternalLink, Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAchievement } from '../context/AchievementContext';
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
    const { unlockMultiple } = useAchievement();

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
    let allLessonsInModule = [];
    let currentLessonIndex = -1;

    if (course) {
        // Flatten lessons to find current, prev, next
        const allLessons = course.modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === lessonId);

        if (currentIndex !== -1) {
            lesson = allLessons[currentIndex];
            currentModule = course.modules.find(m => m.lessons.some(l => l.id === lessonId));

            if (currentModule) {
                allLessonsInModule = currentModule.lessons;
                currentLessonIndex = allLessonsInModule.findIndex(l => l.id === lessonId);
            }

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

    const [isCopied, setIsCopied] = useState(null);

    const handleCopy = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                setIsCopied(text);
                setTimeout(() => setIsCopied(null), 2000);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch (err) {
            console.warn('Clipboard API failed, using fallback', err);
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setIsCopied(text);
                setTimeout(() => setIsCopied(null), 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };

    const handleComplete = async () => {
        // Play click sound immediately
        playSFX('click');

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

        if (saving) return;

        setSaving(true);
        // Play success sound
        playSFX('success');

        try {
            const { success: saved, xpAwarded, achievements } = await saveLessonProgress(currentUser.uid, id, lesson.id, lesson.xp || 50);

            if (saved) {
                setIsCompleted(true);
                setCourseProgress(prev => ({
                    ...prev,
                    completedLessons: [...(prev?.completedLessons || []), lesson.id]
                }));

                if (xpAwarded > 0) {
                    success(`Lesson Completed! +${xpAwarded} XP`);
                }

                // Trigger achievement unlocks if any
                if (achievements && achievements.length > 0) {
                    unlockMultiple(achievements);
                }

                // Refresh user profile to update Level/XP in UI
                await refreshUser();

                // Show "Next Lesson" button state immediately
            } else {
                showError('Failed to save progress');
            }
        } catch (err) {
            console.error(err);
            showError('Failed to save progress');
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
                                code: ({ node, children, className, ...props }) => {
                                    const codeText = String(children).replace(/\n$/, '');
                                    const match = /language-(\w+)/.exec(className || '');

                                    // In react-markdown v10, block code has a language class
                                    // and is typically NOT inline if it has multiple lines or a language
                                    const isInline = !match;

                                    if (isInline) {
                                        return <code className="inline-code">{children}</code>
                                    }

                                    const isThisCopied = isCopied === codeText;

                                    return (
                                        <div className="code-block-container">
                                            <div className="code-block-header">
                                                <span className="code-lang">{match ? match[1] : 'code'}</span>
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => handleCopy(codeText)}
                                                >
                                                    {isThisCopied ? <Check size={14} /> : <Copy size={14} />}
                                                    {isThisCopied ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={match ? match[1] : 'text'}
                                                PreTag="div"
                                                className="syntax-highlighter-custom"
                                                customStyle={{
                                                    margin: 0,
                                                    padding: '24px',
                                                    background: 'transparent',
                                                    fontSize: 'inherit',
                                                    lineHeight: 'inherit'
                                                }}
                                            >
                                                {codeText}
                                            </SyntaxHighlighter>
                                        </div>
                                    );
                                },
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
                                h2: ({ children }) => <div className="section-header"><h2>{children}</h2></div>,
                                // Fix hydration error: Ensure paragraphs are divs so they can contain block elements if needed
                                p: ({ children }) => <div className="md-paragraph">{children}</div>
                            }}
                        >
                            {lesson.content}
                        </ReactMarkdown>
                    </div>

                    {/* Lab Integration CTA */}
                    {lesson.relatedChallengeId && (
                        <div className="lab-cta-card">
                            <div className="lab-cta-icon">
                                <Target size={32} />
                            </div>
                            <div className="lab-cta-info">
                                <h3>Ready for Hands-on Practice?</h3>
                                <p>Test what you've learned in the interactive lab environment.</p>
                                <button
                                    className="lab-action-btn"
                                    onClick={() => {
                                        playSFX('click');
                                        navigate(`/challenge/${lesson.relatedChallengeId}`);
                                    }}
                                >
                                    <ExternalLink size={18} /> Launch Lab Challenge
                                </button>
                            </div>
                        </div>
                    )}

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

                            <button
                                className="complete-btn-primary"
                                onClick={handleComplete}
                                disabled={saving || (!isCompleted && scrollProgress < 95)}
                            >
                                <div className="btn-content">
                                    <span className="btn-label">
                                        {saving ? 'Saving...' : (isCompleted ? 'Next Lesson' : (scrollProgress < 95 ? 'Read to Complete' : 'Mark Complete'))}
                                    </span>
                                    {nextLessonTitle && <span className="btn-subtext">Up Next: {nextLessonTitle}</span>}
                                </div>
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Pagination / Jump */}
                        <div className="module-pagination">
                            <div className="pagination-info">
                                <span>{currentModule?.title}</span>
                                <span className="pagination-count">Lesson {currentLessonIndex + 1} of {allLessonsInModule.length}</span>
                            </div>
                            <div className="pagination-dots">
                                {allLessonsInModule.map((l, idx) => (
                                    <div
                                        key={l.id}
                                        className={`pagination-dot ${l.id === lessonId ? 'active' : ''} ${courseProgress?.completedLessons?.includes(l.id) ? 'completed' : ''}`}
                                        onClick={() => navigate(`/course/${id}/lesson/${l.id}`)}
                                        title={l.title}
                                    />
                                ))}
                            </div>
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
