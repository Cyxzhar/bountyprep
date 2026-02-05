import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal as TerminalIcon, ShieldAlert, Command } from 'lucide-react';
import './Tools.css';

export default function Terminal({ onCommand, initialHistory = [] }) {
    const [history, setHistory] = useState(initialHistory);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('~');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            if (!cmd) return;

            // Add command to history
            const newHistory = [...history, { type: 'command', content: cmd, cwd }];
            setHistory(newHistory);
            setInput('');

            // Process command
            if (cmd === 'clear') {
                setHistory([]);
                return;
            }

            if (onCommand) {
                // Simulate network/proc delay
                setTimeout(() => {
                    try {
                        const result = onCommand(cmd);
                        setHistory(prev => [...prev, { type: 'output', content: result }]);
                    } catch (err) {
                        setHistory(prev => [...prev, { type: 'error', content: err.message }]);
                    }
                }, 150); // slight typing/processing delay
            }
        }
    };

    return (
        <div className="tool-terminal" onClick={handleContainerClick}>
            <div className="terminal-header">
                <div className="terminal-title">
                    <TerminalIcon size={14} />
                    <span>root@kali: {cwd}</span>
                </div>
            </div>

            <div className="terminal-viewport">
                <div className="terminal-content">
                    {history.map((line, i) => (
                        <div key={i} className={`term-line ${line.type}`}>
                            {line.type === 'command' && (
                                <span className="prompt">
                                    <span className="user">root@kali</span>
                                    <span className="sep">:</span>
                                    <span className="path">{line.cwd}</span>
                                    <span className="symbol">#</span>
                                </span>
                            )}
                            <span className="content">{line.content}</span>
                        </div>
                    ))}

                    <div className="term-input-line">
                        <span className="prompt">
                            <span className="user">root@kali</span>
                            <span className="sep">:</span>
                            <span className="path">{cwd}</span>
                            <span className="symbol">#</span>
                        </span>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck="false"
                            autoComplete="off"
                            autoFocus
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}
