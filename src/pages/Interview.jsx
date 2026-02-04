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
import './Interview.css';

// ... (TypingEffect component remains unchanged) ...

const INITIAL_MESSAGE = {
    role: 'assistant',
    content: "Hello! I'm your AI security interviewer. I'm here to help you practice for your next big role. What topic would you like to focus on today? (e.g., XSS, SQL Injection, Incident Response)"
};

const difficulties = [
    { id: 'easy', title: 'Junior', desc: 'Fundamentals & Basic Concepts', icon: Sprout },
    { id: 'mid', title: 'Mid-Level', desc: 'Real-world Scenarios', icon: BookOpen },
    { id: 'senior', title: 'Senior', desc: 'Architecture & Strategy', icon: Rocket }
];

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
    const [savedSession, setSavedSession] = useState(null);
    const messagesEndRef = useRef(null);
    const { success, error, info } = useToast();

    // Update quota when premium status loads/changes
    useEffect(() => {
        setQuota(getRemainingQuota(isPremium));
    }, [isPremium]);

    // Check for saved session on mount
    useEffect(() => {
        if (currentUser?.uid) {
            getLastInterviewSession(currentUser.uid).then(session => {
                if (session && session.messages?.length > 1) {
                    setSavedSession(session);
                }
            });
        }
    }, [currentUser?.uid]);

    // Timer
    useEffect(() => {
        let interval;
        if (started) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, started]);

    // Save session on updates
    useEffect(() => {
        if (started && currentUser?.uid && messages.length > 1) {
            const timeout = setTimeout(() => {
                saveInterviewSession(currentUser.uid, messages, elapsedTime);
            }, 1000); // Debounce save
            return () => clearTimeout(timeout);
        }
    }, [messages, elapsedTime, started, currentUser?.uid]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResume = () => {
        if (savedSession) {
            setMessages(savedSession.messages);
            setElapsedTime(savedSession.elapsedTime || 0);
            setStarted(true);
            success('Resumed previous session');
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Check quota
        const quotaResult = useQuota(isPremium);
        if (!quotaResult.success) {
            error(`Daily limit reached! Resets in ${getQuotaResetTime()}`);
            return;
        }

        setQuota(quotaResult.remaining);
        if (quotaResult.remaining === 2) {
            info('2 messages remaining today');
        }

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Build API messages - skip the initial UI greeting (first message)
            // Perplexity requires: user -> assistant -> user -> assistant pattern
            const conversationMessages = messages.slice(1); // Skip INITIAL_MESSAGE

            // Only include actual conversation, not UI greeting
            const apiMessages = [...conversationMessages, userMessage]
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => ({
                    role: m.role,
                    content: m.content
                }));

            const aiResponse = await generateInterviewResponse(
                apiMessages,
                difficulty,
                'Application Security'
            );

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: aiResponse.content
            }]);

        } catch (err) {
            console.error('Interview error:', err);
            error('Failed to get AI response. Please try again.');
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
        setSavedSession(null); // Clear local Resume capability effectively for now
        // Optionally clear from DB: saveInterviewSession(currentUser.uid, [], 0);
        success('Interview session ended. Great practice!');
    };

    if (!started) {
        return (
            <div className="interview-screen">
                <div className="screen-content">
                    <div className="interview-intro">
                        <div className="intro-icon">
                            <Bot size={48} />
                        </div>
                        <h1 className="intro-title">AI Interview Coach</h1>
                        <p className="intro-subtitle">Practice FAANG-level security interview questions with real-time AI feedback</p>
                    </div>

                    <div className="difficulty-section">
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

                    {/* Quota Display */}
                    <div className="quota-info">
                        <AlertCircle size={16} />
                        <span>{quota} free messages remaining today</span>
                    </div>

                    <div className="cta-section">
                        <button
                            className="btn btn-primary btn-full"
                            onClick={() => setStarted(true)}
                            disabled={quota === 0}
                        >
                            Start New Session
                            <ChevronRight size={20} />
                        </button>

                        {savedSession && (
                            <button
                                className="btn btn-secondary btn-full resume-btn"
                                onClick={handleResume}
                                style={{ marginTop: '12px' }}
                            >
                                <History size={18} />
                                Resume Last Session
                            </button>
                        )}

                        <p className="cta-note">~15 min session • Personalized feedback</p>
                    </div>
                </div>
                <BottomNav />
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
                                        <TypingEffect text={msg.content} />
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
                                            {msg.content}
                                        </ReactMarkdown>
                                    )
                                ) : (
                                    <p>{msg.content}</p>
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
