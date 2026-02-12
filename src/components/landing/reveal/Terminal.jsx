import React, { useRef, useEffect } from 'react';
import { cmdSets } from './revealAttacks';

const Terminal = ({ hackStep, terminalLogs, terminalTypedText, attackIndex, terminalStep, currentAttack }) => {
    const terminalBodyRef = useRef(null);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalBodyRef.current) {
            const el = terminalBodyRef.current;
            const scrollTimeout = setTimeout(() => {
                el.scrollBy({ top: 10, behavior: 'smooth' });
            }, 50);
            return () => clearTimeout(scrollTimeout);
        }
    }, [terminalLogs, terminalTypedText, hackStep]);

    return (
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
                    const commands = cmdSets[attackIndex] || cmdSets[0];
                    const activeDir = commands[terminalStep]?.dir || "~";

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
    );
};

export default Terminal;
