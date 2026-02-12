import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';

const MODULES = [
    { tag: "WEB EXPLOIT", title: "SQLi Mastery", accent: "#ff5555" },
    { tag: "RECON", title: "XSS Exploitation", accent: "#f1fa8c" },
    { tag: "CLOUD", title: "Cloud Security", accent: "#8be9fd" },
    { tag: "NETWORK", title: "Network Penetration", accent: "#bd93f9" },
    { tag: "MOBILE", title: "Android Hacking", accent: "#50fa7b" }
];

const LandingCurriculum = ({ onAction }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);
    const progressRef = useRef(null);
    const total = MODULES.length;

    const CYCLE_MS = 4000; // 4 seconds per card
    const TICK_MS = 40;    // Progress bar update interval

    const advance = useCallback(() => {
        setActiveIndex(prev => (prev + 1) % total);
        setProgress(0);
    }, [total]);

    // Auto-rotation with progress bar
    useEffect(() => {
        if (isPaused) return;

        progressRef.current = setInterval(() => {
            setProgress(prev => {
                const next = prev + (TICK_MS / CYCLE_MS) * 100;
                if (next >= 100) {
                    advance();
                    return 0;
                }
                return next;
            });
        }, TICK_MS);

        return () => clearInterval(progressRef.current);
    }, [isPaused, advance]);

    const goTo = (index) => {
        setActiveIndex(index);
        setProgress(0);
    };

    // Position mapping: calculate offset from active
    const getPosition = (index) => {
        const diff = index - activeIndex;
        if (diff === 0) return 'center';
        if (diff === 1 || diff === -(total - 1)) return 'right-1';
        if (diff === 2 || diff === -(total - 2)) return 'right-2';
        if (diff === -1 || diff === (total - 1)) return 'left-1';
        if (diff === -2 || diff === (total - 2)) return 'left-2';
        return 'hidden';
    };

    return (
        <section id="curriculum" className="landing-curriculum">
            <div className="landing-container">
                <div className="curriculum-layout">
                    <div className="curriculum-info animate-fade-in-up">
                        <h2 className="text-display">Real-World <br /><span className="text-gradient">Scenarios</span></h2>
                        <p>We don't teach theory in a vacuum. Every module is based on actual findings from live bug bounty programs.</p>

                        <ul className="curriculum-list">
                            <li><CheckCircle size={18} /> Advanced SQL Injection Chaining</li>
                            <li><CheckCircle size={18} /> SSRF & Cloud Metadata Exfiltration</li>
                            <li><CheckCircle size={18} /> DOM-based XSS & CSP Bypasses</li>
                            <li><CheckCircle size={18} /> IDOR to Account Takeover (ATO)</li>
                            <li><CheckCircle size={18} /> GraphQL Introspection & Injection</li>
                        </ul>

                        <button className="landing-curriculum-btn mt-lg" onClick={onAction}>
                            Start Hacking
                        </button>
                    </div>

                    <div
                        className="curriculum-visual animate-fade-in-up"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="module-carousel">
                            {MODULES.map((mod, i) => {
                                const position = getPosition(i);
                                const isActive = i === activeIndex;

                                return (
                                    <div
                                        key={i}
                                        className={`module-card ${position} ${isActive ? 'active' : ''}`}
                                        onClick={() => !isActive && goTo(i)}
                                        style={{ '--accent': mod.accent }}
                                    >
                                        {/* Animated border glow for active card */}
                                        {isActive && <div className="card-border-glow" />}

                                        <span className="module-tag">{mod.tag}</span>
                                        <span className="module-title">{mod.title}</span>

                                        {/* Progress bar on active card */}
                                        {isActive && (
                                            <div className="card-progress-track">
                                                <div
                                                    className="card-progress-fill"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dot indicators */}
                        <div className="carousel-dots">
                            {MODULES.map((_, i) => (
                                <button
                                    key={i}
                                    className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to module ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingCurriculum;
