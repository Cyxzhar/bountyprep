import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText,
    AlertCircle, RotateCcw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { courses } from '../data/courses';
import './Lesson.css';

export default function Lesson() {
    const { id, lessonId } = useParams();
    const navigate = useNavigate();

    // Find course and lesson
    const course = courses.find(c => c.id === id);
    let currentModule = null;
    let lesson = null;
    let nextLessonId = null;
    let prevLessonId = null;

    if (course) {
        // Flatten lessons to find current, prev, next
        const allLessons = course.modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === lessonId);

        if (currentIndex !== -1) {
            lesson = allLessons[currentIndex];
            currentModule = course.modules.find(m => m.lessons.some(l => l.id === lessonId));

            if (currentIndex > 0) prevLessonId = allLessons[currentIndex - 1].id;
            if (currentIndex < allLessons.length - 1) nextLessonId = allLessons[currentIndex + 1].id;
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

    const handleComplete = () => {
        // TODO: Save to Firestore
        if (nextLessonId) {
            navigate(`/course/${id}/lesson/${nextLessonId}`);
        } else {
            // Course Complete!
            navigate(`/course/${id}`);
        }
    };

    return (
        <div className="page-container lesson-page">
            <header className="lesson-header">
                <button className="icon-btn" onClick={() => navigate(`/course/${id}`)}>
                    <ChevronLeft size={24} />
                </button>
                <div className="lesson-header-text">
                    <span className="course-breadcrumb">{course.title} / {currentModule.title}</span>
                    <h1 className="lesson-header-title">{lesson.title}</h1>
                </div>
            </header>

            <div className="lesson-layout">
                <main className="lesson-content-wrapper">
                    <div className="lesson-content card-glow md-content">
                        <ReactMarkdown
                            components={{
                                code: ({ inline, children }) => (
                                    inline
                                        ? <code className="inline-code">{children}</code>
                                        : <pre className="code-block"><code>{children}</code></pre>
                                ),
                                blockquote: ({ children }) => {
                                    // Custom blockquote rendering for alerts
                                    const text = children?.[1]?.props?.children?.[0] || '';
                                    if (typeof text === 'string' && text.includes('[!IMPORTANT]')) {
                                        return <div className="alert-box alert-important">{children}</div>
                                    }
                                    if (typeof text === 'string' && text.includes('[!TIP]')) {
                                        return <div className="alert-box alert-tip">{children}</div>
                                    }
                                    return <blockquote>{children}</blockquote>
                                }
                            }}
                        >
                            {lesson.content}
                        </ReactMarkdown>
                    </div>

                    <div className="lesson-actions">
                        <button
                            className="nav-btn prev"
                            disabled={!prevLessonId}
                            onClick={() => prevLessonId && navigate(`/course/${id}/lesson/${prevLessonId}`)}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>

                        <button className="complete-btn" onClick={handleComplete}>
                            {nextLessonId ? 'Complete & Next' : 'Finish Course'}
                            {nextLessonId ? <ChevronRight size={18} /> : <CheckCircle size={18} />}
                        </button>
                    </div>
                </main>

                <aside className="lesson-sidebar">
                    <h3>Course Content</h3>
                    <div className="sidebar-modules">
                        {course.modules.map((module, mIdx) => (
                            <div key={module.id} className="sidebar-module">
                                <div className="sidebar-module-title">
                                    Module {mIdx + 1}: {module.title}
                                </div>
                                <div className="sidebar-lessons">
                                    {module.lessons.map(l => (
                                        <div
                                            key={l.id}
                                            className={`sidebar-lesson ${l.id === lessonId ? 'active' : ''}`}
                                            onClick={() => navigate(`/course/${id}/lesson/${l.id}`)}
                                        >
                                            {l.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                                            <span>{l.title}</span>
                                            {/* {l.completed && <CheckCircle size={12} className="text-neon" />} */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
