import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const LandingCurriculum = ({ onAction }) => {
    const [activeModule, setActiveModule] = useState(0);

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
                    <div className="curriculum-visual animate-fade-in-up">
                        <div className="module-stack">
                            {[0, 1, 2, 3, 4].map((i) => {
                                // Calculate dynamic position class based on rotation
                                const total = 5;
                                const pos = (i - activeModule + total) % total;
                                const posClass = `p${pos + 1}`; // p1 through p5

                                const moduleData = [
                                    { tag: "WEB EXPLOIT", title: "SQLi Mastery" },
                                    { tag: "RECON", title: "XSS Exploitation" },
                                    { tag: "CLOUD", title: "Cloud Security" },
                                    { tag: "NETWORK", title: "Network Penetration" },
                                    { tag: "MOBILE", title: "Android Hacking" }
                                ];

                                return (
                                    <div
                                        key={i}
                                        className={`module-item ${posClass}`}
                                        onClick={() => setActiveModule((activeModule + 1) % total)}
                                    >
                                        <span className="module-tag">{moduleData[i].tag}</span>
                                        {moduleData[i].title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingCurriculum;
