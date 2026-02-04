import { useState, useEffect, useRef } from 'react';
import {
    Sprout, BookOpen, Rocket, ChevronRight, Bot,
    Mic, Send, X, Timer, AlertCircle, Loader2, History
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import BottomNav from '../components/BottomNav';
import { useToast } from '../context/ToastContext';
import { generateInterviewResponse } from '../lib/perplexity';
import { getRemainingQuota, useQuota, getQuotaResetTime } from '../utils/interviewQuota';
import { saveInterviewSession, getLastInterviewSession } from '../utils/firestore';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext'; // Import sound
import './Interview.css';

// Helper to sanitize corrupt message history
const getSafeMessageContent = (content) => {
    let text = '';
    if (typeof content === 'string') {
        text = content;
    } else if (typeof content === 'object' && content !== null) {
        if (content.content && typeof content.content === 'string') {
            text = content.content;
        } else {
            text = JSON.stringify(content);
        }
    } else {
        text = String(content || '');
    }

    // Remove citations like [1], [1][2], [1, 2]
    return text.replace(/\[\d+(?:,\s*\d+)*\]/g, '');
};

const TypingEffect = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        // Faster typing for better UX
        const interval = setInterval(() => {
            const safeText = String(text || '');
            setDisplayedText(safeText.slice(0, index + 1));
            index++;
            if (index >= safeText.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 15);

        return () => clearInterval(interval);
    }, [text, onComplete]);

    return (
        <ReactMarkdown
            components={{
                code: ({ inline, children }) => (
                    inline
                        ? <code className="inline-code">{children}</code>
                        : <pre className="code-block"><code>{children}</code></pre>
                ),
                p: ({ children }) => <p className="md-paragraph">{children}</p>,
                ul: ({ children }) => <ul className="md-list">{children}</ul>,
                li: ({ children }) => <li className="md-list-item">{children}</li>,
                strong: ({ children }) => <strong className="md-bold">{children}</strong>,
            }}
        >
            {displayedText}
        </ReactMarkdown>
    );
};

const INITIAL_MESSAGE = {
    role: 'assistant',
    content: "Hello! I'm your AI security interviewer. I'm here to help you practice for your next big role. What topic would you like to focus on today? (e.g., XSS, SQL Injection, Incident Response)"
};

const difficulties = [
    { id: 'easy', title: 'Junior', desc: 'Fundamentals & Basic Concepts', icon: Sprout },
    { id: 'mid', title: 'Mid-Level', desc: 'Real-world Scenarios', icon: BookOpen },
    { id: 'senior', title: 'Senior', desc: 'Architecture & Strategy', icon: Rocket }
];
// End of configuration

export default function Interview() {
    const { currentUser } = useAuth();
    const isPremium = currentUser?.isPremium || false;

    const [started, setStarted] = useState(false);
    const [difficulty, setDifficulty] = useState('mid');
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quota, setQuota] = useState(getRemainingQuota(isPremium));
    const [elapsedTime, setElapsedTime] = useState(0);
    // ... (previous state)
    const [savedSession, setSavedSession] = useState(null);
    const [sessionHistory, setSessionHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const { playSFX } = useSound(); // Use sound hook

    // Timer effect
    useEffect(() => {
        let interval;
        if (started) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started]);

    // ... (quota effect)

    // Load available history
    useEffect(() => {
        if (currentUser?.uid) {
            import('../utils/firestore').then(({ getUserInterviewSessions }) => {
                getUserInterviewSessions(currentUser.uid).then(sessions => {
                    setSessionHistory(sessions);
                    if (sessions.length > 0) {
                        setSavedSession(sessions[0]); // Last session
                    }
                });
            });
        }
    }, [currentUser?.uid, started]); // Reload history when returning to menu

    // ... (Timer, Auto-scroll effects)

    // Save session logic with ID
    useEffect(() => {
        if (started && currentUser?.uid && messages.length > 1 && sessionId) {
            const timeout = setTimeout(() => {
                saveInterviewSession(currentUser.uid, messages, elapsedTime, sessionId);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [messages, elapsedTime, started, currentUser?.uid, sessionId]);

    const handleStartNew = () => {
        const newId = Date.now().toString();
        setSessionId(newId);
        setMessages([INITIAL_MESSAGE]);
        setElapsedTime(0);
        setStarted(true);
    };

    const handleResumeSession = (session) => {
        if (session) {
            setSessionId(session.id);
            setMessages(session.messages);
            setElapsedTime(session.elapsedTime || 0);
            setStarted(true);
            setShowHistory(false);
            success('Resumed previous session');
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Check quota (unless premium)
        const quotaResult = useQuota(isPremium);
        if (!quotaResult.success) {
            setQuota(0);
            error('Daily interview quota reached. Upgrade to Premium for unlimited practice.');
            return;
        }

        setQuota(quotaResult.remaining);

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Get AI response
            const response = await generateInterviewResponse(newMessages, difficulty);

            if (response) {
                const aiMsg = { role: 'assistant', content: response };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                error('Failed to get response from AI coach.');
            }
        } catch (err) {
            console.error('Interview error:', err);
            error('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEndSession = () => {
        setStarted(false);
        setMessages([INITIAL_MESSAGE]);
        setElapsedTime(0);
        setSessionId(null);
        success('Interview session ended.');
    };

    // UI Helpers
    const formatDate = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!started) {
        return (
            <div className="interview-screen">
                <div className="screen-content">
                    <div className="interview-intro">
                        {/* ... (Intro UI) ... */}
                        <div className="intro-icon">
                            <Bot size={48} />
                        </div>
                        <h1 className="intro-title">AI Interview Coach</h1>
                        <p className="intro-subtitle">Practice FAANG-level security interview questions with real-time AI feedback</p>
                    </div>

                    <div className="difficulty-section">
                        {/* ... (Difficulty UI) ... */}
                        <h3 className="section-label">Select Difficulty</h3>
                        <div className="difficulty-grid">
                            {difficulties.map(d => {
                                const Icon = d.icon;
                                return (
                                    <button
                                        key={d.id}
                                        className={`diff-card ${difficulty === d.id ? 'selected' : ''}`}
                                        onClick={() => setDifficulty(d.id)}
                                    >
                                        <div className="diff-icon">
                                            <Icon size={24} />
                                        </div>
                                        <div className="diff-content">
                                            <span className="diff-title">{d.title}</span>
                                            <span className="diff-desc">{d.desc}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="topics-section">
                        {/* ... (Topics UI) ... */}
                        <div className="topics-section">
                            <h3 className="section-label">Topics Covered</h3>
                            <div className="topics-grid">
                                <span className="topic-chip">Web Security</span>
                                <span className="topic-chip">Network Attacks</span>
                                <span className="topic-chip">Cryptography</span>
                                <span className="topic-chip">Incident Response</span>
                                <span className="topic-chip">Secure Coding</span>
                                <span className="topic-chip">Threat Modeling</span>
                            </div>
                        </div>
                    </div>

                    {/* Quota Display */}
                    <div className="quota-info">
                        <AlertCircle size={16} />
                        <span>{quota} free messages remaining today</span>
                    </div>

                    <div className="cta-section">
                        <button
                            className="btn btn-primary btn-full"
                            onClick={handleStartNew}
                            disabled={quota === 0}
                        >
                            Start New Session
                            <ChevronRight size={20} />
                        </button>

                        {(savedSession || sessionHistory.length > 0) && (
                            <button
                                className="btn btn-secondary btn-full resume-btn"
                                onClick={() => setShowHistory(true)}
                                style={{ marginTop: '12px' }}
                            >
                                <History size={18} />
                                View History & Resume
                            </button>
                        )}
                    </div>
                </div>
                <BottomNav />

                {/* History Modal */}
                {showHistory && (
                    <div className="modal-overlay" onClick={() => setShowHistory(false)}>
                        <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>History</h3>
                                <button className="close-btn" onClick={() => setShowHistory(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="history-list">
                                {sessionHistory.length === 0 ? (
                                    <p className="text-muted">No history found.</p>
                                ) : (
                                    sessionHistory.map(session => (
                                        <button
                                            key={session.id}
                                            className="history-item"
                                            onClick={() => handleResumeSession(session)}
                                        >
                                            <div className="history-info">
                                                <span className="history-date">{formatDate(session.updatedAt)}</span>
                                                <span className="history-topic">{session.topic || 'General Practice'}</span>
                                            </div>
                                            <ChevronRight size={16} className="text-muted" />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="interview-screen chat-mode">
            {/* Chat Header */}
            <header className="chat-header">
                <button className="back-btn" onClick={handleEndSession}>
                    <X size={20} />
                </button>
                <div className="chat-info">
                    <span className="chat-title">Mock Interview</span>
                    <span className="chat-level">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level</span>
                </div>
                <div className="chat-timer">
                    <Timer size={16} />
                    <span>{formatTime(elapsedTime)}</span>
                </div>
            </header>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg, idx) => {
                    const isLastAI = msg.role === 'assistant' && idx === messages.length - 1;
                    const showTyping = isLastAI && idx > 0; // Don't animate initial greeting
                    const safeContent = getSafeMessageContent(msg.content);

                    return (
                        <div key={idx} className={`message ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                            {msg.role === 'assistant' && (
                                <div className="message-avatar">
                                    <Bot size={20} />
                                </div>
                            )}
                            <div className="message-bubble">
                                {msg.role === 'assistant' ? (
                                    showTyping ? (
                                        <TypingEffect text={safeContent} />
                                    ) : (
                                        <ReactMarkdown
                                            components={{
                                                code: ({ inline, children }) => (
                                                    inline
                                                        ? <code className="inline-code">{children}</code>
                                                        : <pre className="code-block"><code>{children}</code></pre>
                                                ),
                                                p: ({ children }) => <p className="md-paragraph">{children}</p>,
                                                ul: ({ children }) => <ul className="md-list">{children}</ul>,
                                                li: ({ children }) => <li className="md-list-item">{children}</li>,
                                                strong: ({ children }) => <strong className="md-bold">{children}</strong>,
                                            }}
                                        >
                                            {safeContent}
                                        </ReactMarkdown>
                                    )
                                ) : (
                                    <p>{safeContent}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="message ai">
                        <div className="message-avatar">
                            <Bot size={20} />
                        </div>
                        <div className="message-bubble typing">
                            <Loader2 size={18} className="spin" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quota Banner */}
            {quota <= 2 && quota > 0 && (
                <div className="quota-banner">
                    <AlertCircle size={14} />
                    <span>{quota} message{quota !== 1 ? 's' : ''} left today</span>
                </div>
            )}

            {/* Input Area */}
            <div className="chat-input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={quota === 0 ? "Daily limit reached" : "Type your answer..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading || quota === 0}
                    />
                </div>
                <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || quota === 0}
                >
                    {isLoading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
                </button>
            </div>
        </div>
    );
}
