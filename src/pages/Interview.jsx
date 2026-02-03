import { useState, useEffect, useRef } from 'react';
import {
    Sprout, BookOpen, Rocket, ChevronRight, Bot,
    Mic, Send, X, Timer, Volume2, AlertCircle, Loader2
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useToast } from '../context/ToastContext';
import { generateInterviewResponse } from '../lib/perplexity';
import { getRemainingQuota, useQuota, getQuotaResetTime } from '../utils/interviewQuota';
import './Interview.css';

const difficulties = [
    { id: 'junior', title: 'Junior Level', desc: '0-2 years experience', icon: Sprout },
    { id: 'mid', title: 'Mid Level', desc: '2-5 years experience', icon: BookOpen },
    { id: 'senior', title: 'Senior Level', desc: '5+ years experience', icon: Rocket }
];

const INITIAL_MESSAGE = {
    role: 'assistant',
    content: "Hello! I'm your AI interview coach. Let's practice some FAANG-level security questions. Ready to begin?"
};

export default function Interview() {
    const [started, setStarted] = useState(false);
    const [difficulty, setDifficulty] = useState('mid');
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quota, setQuota] = useState(getRemainingQuota());
    const [elapsedTime, setElapsedTime] = useState(0);
    const messagesEndRef = useRef(null);
    const { success, error, info } = useToast();

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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Check quota
        const quotaResult = useQuota();
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
                            Begin Interview Session
                            <ChevronRight size={20} />
                        </button>
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
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                        {msg.role === 'assistant' && (
                            <div className="message-avatar">
                                <Bot size={20} />
                            </div>
                        )}
                        <div className="message-bubble">
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}

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
