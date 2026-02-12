import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../hooks/useContent';

const LandingCourseLibrary = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { courses, loading } = useCourses();

    // Use placeholder/skeleton if loading, or just show nothing/slice
    const displayCourses = courses.slice(0, 3);

    return (
        <section id="course-library" className="course-library-section py-xl">
            <div className="landing-container">
                <div className="section-header text-center mb-xl">
                    <span className="badge badge-primary">CURRICULUM</span>
                    <h2 className="text-display">The Hacker's <span className="text-gradient">Library</span></h2>
                    <p className="max-w-md mx-auto">Explore our high-fidelity labs and structured learning paths designed to take you from hobbyist to professional hunter.</p>
                </div>

                <div className="course-grid-landing">
                    {displayCourses.map((course) => {
                        // Icon handling: use local lookup or fallback
                        // Note: Firestore stores icon name string, not component
                        // We need a map or dynamic import. For now assume icons are not stored as components in DB
                        // But wait, the original code had `const Icon = course.icon`
                        // Local data `courses.js` had `icon: Shield` (component).
                        // Firestore data likely has `icon: "Shield"` (string).
                        // I need to map string to component.
                        // I'll import icons and map them.

                        return (
                            <div key={course.id} className="course-card-landing card-glow">
                                <div className="course-card-inner">
                                    <div className="course-card-header">
                                        <div className="course-icon-container">
                                            {/* Placeholder or mapped icon */}
                                            <Lock size={24} className="text-neon" />
                                        </div>
                                        <div className="course-badges">
                                            <span className="badge-mini">{course.level}</span>
                                        </div>
                                    </div>

                                    <h3 className="course-title-landing">{course.title}</h3>
                                    <p className="course-desc-landing">{course.description}</p>

                                    <div className="course-meta-landing">
                                        <div className="meta-item-landing">
                                            <Trophy size={14} className="text-yellow" />
                                            <span>{course.xp} XP</span>
                                        </div>
                                        <div className="meta-item-landing">
                                            <Clock size={14} className="text-neon" />
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="course-btn-landing"
                                        onClick={() => {
                                            if (currentUser) {
                                                navigate(`/course/${course.id}`);
                                            } else {
                                                navigate('/auth/signup');
                                            }
                                        }}
                                    >
                                        {currentUser ? "Resume Learning" : "Start Learning"}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Coming Soon Card */}
                    <div className="course-card-landing coming-soon-card-landing">
                        <div className="course-card-inner justify-center items-center text-center">
                            <div className="course-icon-container locked mb-4" style={{ margin: '0 auto 16px' }}>
                                <Lock size={24} />
                            </div>
                            <h3 className="course-title-landing text-muted">More Coming Soon</h3>
                            <p className="course-desc-landing text-sm">New labs added monthly.</p>
                            <div className="coming-soon-label">STAY TUNED</div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-xl" style={{ marginTop: '60px', textAlign: 'center' }}>
                    <button
                        className="btn-hero-secondary"
                        style={{ minWidth: '260px', margin: '0 auto' }}
                        onClick={() => {
                            if (currentUser) {
                                navigate('/challenges');
                            } else {
                                navigate('/auth/signup');
                            }
                        }}
                    >
                        {currentUser ? 'Explore Full Library' : 'Sign Up to View All Labs'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LandingCourseLibrary;
