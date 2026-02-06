import React from 'react';
import { BookOpen, Flag, Users, Terminal as TerminalIcon, Shield, Zap } from 'lucide-react';

const WhyBugora = () => {
    return (
        <section className="why-bugora-section py-xl">
            <div className="landing-container">
                <div className="section-header text-center mb-xl">
                    <span className="badge badge-primary">THE BUGORA STANDARD</span>
                    <h2 className="text-display">Stop Playing <span className="text-gradient">Capture The Flag</span></h2>
                    <p className="max-w-md mx-auto">Real hackers don't look for flags. They look for business impact. See why professionals switch to Bugora.</p>
                </div>

                <div className="bugora-comparison-grid animate-fade-in-up">
                    {/* Column 1: The Old Way */}
                    <div className="comparison-col old-way">
                        <div className="col-header">
                            <h3 className="text-muted">Traditional Platforms</h3>
                        </div>
                        <div className="comparison-card dimmed">
                            <div className="icon-box"><BookOpen size={24} /></div>
                            <h4>Theory Heavy</h4>
                            <p>Endless video lectures and multiple choice questions that don't build muscle memory.</p>
                        </div>
                        <div className="comparison-card dimmed">
                            <div className="icon-box"><Flag size={24} /></div>
                            <h4>CTF Style</h4>
                            <p>Unrealistic "riddle" challenges that have zero relevance to modern application security.</p>
                        </div>
                        <div className="comparison-card dimmed">
                            <div className="icon-box"><Users size={24} /></div>
                            <h4>Shared Instances</h4>
                            <p>Laggy, shared VPNs where other users delete your files or crash the box.</p>
                        </div>
                    </div>

                    {/* Middle: VS Divider */}
                    <div className="comparison-vs">MVP</div>

                    {/* Column 2: The Bugora Way */}
                    <div className="comparison-col bugora-way">
                        <div className="col-header">
                            <h3 className="text-neon">The Bugora Way</h3>
                        </div>
                        <div className="comparison-card glow-active">
                            <div className="icon-box active"><TerminalIcon size={24} /></div>
                            <h4>100% Simulation</h4>
                            <p>No videos. You learn by compromising simulated corporate networks with real tools.</p>
                        </div>
                        <div className="comparison-card glow-active">
                            <div className="icon-box active"><Shield size={24} /></div>
                            <h4>Real Vulnerabilities</h4>
                            <p>Replicating actual CVEs and findings from public bug bounty disclosures.</p>
                        </div>
                        <div className="comparison-card glow-active">
                            <div className="icon-box active"><Zap size={24} /></div>
                            <h4>Dedicated Pods</h4>
                            <p>Your own private Docker container that spins up in seconds. Fast, secure, and isolated.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyBugora;
